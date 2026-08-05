package handlers

// clickIDPlatform maps a CUFT click-ID key to the ad platform it belongs to.
// Mirrors choice-uft's own class-cuft-click-integration.php mapping, extended
// with the two Google Ads variants that plugin does not classify (gbraid for
// iOS app-to-web journeys, wbraid for web-to-app).
var clickIDPlatform = []struct {
	key      string
	platform string
}{
	{"gclid", "google"},
	{"gbraid", "google"},
	{"wbraid", "google"},
	{"fbclid", "facebook"},
	{"msclkid", "microsoft"},
	{"ttclid", "tiktok"},
	{"li_fat_id", "linkedin"},
	{"twclid", "twitter"},
	{"snap_click_id", "snapchat"},
	{"rdt_cid", "reddit"},
	{"pclid", "pinterest"},
}

// ResolveClickID picks a single click ID and platform out of a CUFT
// attribution map for the sheet's Click ID / Platform columns. Specific
// platform keys win over the generic "click_id" fallback.
func ResolveClickID(attribution map[string]string) (clickID, platform string) {
	for _, p := range clickIDPlatform {
		if v := attribution[p.key]; v != "" {
			return v, p.platform
		}
	}
	if v := attribution["click_id"]; v != "" {
		return v, "unknown"
	}
	return "", ""
}
