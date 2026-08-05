# Northland lead routing and sheet tracking

Date: 2026-08-05
Status: design approved, implementation pending
Repo: `~/dev/garage-builder` (deployed as `peterjaffray/garage-estimator` on odin)

## Problem

Three defects found 2026-08-05 while auditing where garage estimator leads go.

1. **Northland receives no estimator leads.** The live container runs with
   `MAIL_TO=peter@choice.marketing` as the sole recipient. `sales@nbsedm.com` appears
   nowhere in the container env or the repo. 19 real estimator leads between
   2026-07-13 and 2026-08-05 reached only Choice OMG.
2. **Every lead sends two emails.** `SendEstimateEmail` calls `SendHTMLEmail` and then
   `SendEmail`, so each submission produces one HTML message and one plain-text message
   to the same address.
3. **No lead is stored.** `EstimateHandler` logs and emails, with no database write.
   Docker logs are the only record and they die when the container is recreated.

The WordPress side is healthy by comparison: the Elementor "General Inquires Form" on
`/contact-us/` sends to `sales@nbsedm.com` with a bcc to `system@choice.hosting`.

## Design

### 1. Multi-recipient email

`GetEmailConfig` keeps returning a single `To` string. `SendEmail` and `SendHTMLEmail`
split it on commas into the `[]string` recipient list `smtp.SendMail` requires, and join
the trimmed addresses for the `To:` header. Passing `"a@x,b@y"` as one element produces a
single malformed `RCPT TO` that SES rejects, which is why the env var alone cannot fix this.

Deployed value becomes `MAIL_TO=peter@choice.marketing,sales@nbsedm.com`.

### 2. One email per lead

`SendEstimateEmail` sends a single `multipart/alternative` message carrying both the
plain-text and HTML parts, replacing the current two separate sends.

### 3. Attribution passthrough

`EstimateRequest` gains an `attribution` field: a flat string map keyed by whatever CUFT
itself uses, so the frontend forwards CUFT's data verbatim with no re-mapping. CUFT's own
key set (`class-cuft-utm-tracker.php`, `cuft-utm-tracker.js`): `utm_source`, `utm_medium`,
`utm_campaign`, `utm_term`, `utm_content`, plus click IDs `click_id`, `gclid`, `gbraid`,
`wbraid`, `fbclid`, `msclkid`, `ttclid`, `li_fat_id`, `twclid`, `snap_click_id`, `rdt_cid`,
`pclid`.

The estimator runs in an iframe on `/garage-inquiry-form/` at the same origin
(`northlandbuildingsupplies.ca`) through the vhost's `^~ /gbd/` proxy block. Same-origin
means the frontend reads `document.cookie` directly inside the iframe: `cuft_utm_data`
(last-touch, JSON `{utm:{...}, timestamp}`, 30-day window) is the primary source, with a
fallback to parsing `window.parent.location.search` for a visit CUFT has not yet written a
cookie for (e.g. the very first pageview). CUFT is active on the site (v3.25.0) and already
holds 389 click rows, overwhelmingly Google `gclid`.

The backend resolves a single Click ID + Platform for the sheet from the attribution map,
in priority order, mirroring CUFT's own `class-cuft-click-integration.php` mapping plus the
two Google Ads variants it does not classify: `gclid`/`gbraid`/`wbraid` -> `google`,
`fbclid` -> `facebook`, `msclkid` -> `microsoft`, `ttclid` -> `tiktok`, `li_fat_id` ->
`linkedin`, `twclid` -> `twitter`, `snap_click_id` -> `snapchat`, `rdt_cid` -> `reddit`,
`pclid` -> `pinterest`, falling back to the generic `click_id` with platform `unknown`.

Historical rows carry no attribution. CUFT only records a visit that arrived with a
tracking parameter, and the estimator never captured one, so those columns stay empty for
everything before this change rather than being inferred.

### 4. Sheet as the lead ledger

Target: `[Northland Building Supplies] Leads`, tab `Forms Submitted`
(`13a8JXXH8842oPAmuVkLdoTFpYQvKM632nkJfE4FJxws`).

The Go container is the only process that writes to the sheet. Two feeds reach it:

- **Estimator leads** append directly, after the email send, in a goroutine whose failure
  is logged and swallowed. A Sheets outage must never break a lead email.
- **WordPress leads** arrive at a new `POST /ingest` endpoint from an mu-plugin hooked to
  `elementor_pro/forms/new_record`. The plugin calls the site's existing
  `CUFT_Form_Attribution::get_payload()` (already active, v3.25.0) for attribution rather
  than re-reading cookies in PHP, and posts the form fields plus that payload to
  `http://127.0.0.1:33775/ingest` over odin loopback with a shared secret in a header.
  Confirmed unreachable from the internet: the container's Docker port is already bound
  `127.0.0.1:33775->3000`, and the public `^~ /gbd/` proxy block only forwards that one
  prefix, so nginx never routes an external request to `/ingest`.

One credential in one place. Auth is a dedicated service account in the `choice-omg`
project, key mounted read-only into the container, sheet shared to the service account as
Editor.

### Columns

| # | Column | Estimator | Contact form |
|---|---|---|---|
| A | Timestamp (MT) | yes | yes |
| B | Source | `Garage Estimator` | `Contact Form` |
| C-E | Name, Email, Phone | yes | yes |
| F | Subject | blank | form subject |
| G | Message | customer message | form message |
| H | Garage Details | size, wall height, roof, attic, interior, build request | blank |
| I-M | utm_source .. utm_content | yes | yes |
| N | Click ID | yes | CUFT `cuft_click_id` |
| O | Platform | yes | yes |
| P | Status | manual | manual |

Timestamps are converted to America/Edmonton. Both sources record UTC natively: the
container has no TZ set, and the WordPress site runs at `gmt_offset=0`.

## Backfill (done 2026-08-05)

23 real leads imported, merged chronologically from both sources:

- 16 estimator submissions from container logs (2026-07-13 to 2026-08-05)
- 7 contact-form submissions from `DNsGWtW5_e_submissions` (2026-07-13 to 2026-07-28)

14 rows were excluded as internal or staff tests: 1 from `kierra@choice.marketing`,
8 from `mingyun@choice.marketing`, 1 Claude QA test, 3 from `justynne@nbsedm.com`,
and 1 empty payload. Repeat submissions from genuine prospects were kept in full
(Kamil Rus submitted four configurations in 90 seconds, Brad two).

The backfill ran through the `google-ads-budget-sync` OAuth token as a one-time
expedient. Ongoing writes use the dedicated service account instead.

## Testing

- Unit: `MAIL_TO` splitting across one address, two addresses, spaces around commas, and
  a trailing comma.
- Unit: click ID resolution priority for a map holding each of `gclid`, `gbraid`, `wbraid`,
  `fbclid`, `msclkid`, and the generic `click_id`, confirming each maps to the right
  platform and none are conflated (the three Google variants must all resolve to `google`
  while preserving their distinct raw values).
- Integration: `POST /ingest` rejects a missing or wrong secret, accepts a valid payload,
  and appends exactly one row.
- Manual/Playwright, against the live site: submit the estimator and the WP contact form
  once each per click ID variant (`gclid`, `gbraid`, `wbraid`) via URL query params,
  confirm every submission lands in the sheet with the correct UTM columns, the correct
  raw click ID value, and `Platform = google` for all three, and that both recipients
  receive exactly one email per estimator submission.

## Risks

- If the container is down, WordPress leads miss the sheet. The email path is unaffected
  and Elementor still stores the submission, so those rows can be replayed.
- Container logs remain the only estimator history until this ships. Recreating the
  container before deploy loses anything submitted since the backfill.
