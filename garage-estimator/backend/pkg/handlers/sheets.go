package handlers

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

var (
	sheetsSvc     *sheets.Service
	sheetsSvcOnce sync.Once
	sheetsSvcErr  error
	mtLocation    *time.Location
	mtLocOnce     sync.Once
)

// SheetsConfig holds the target spreadsheet configuration.
type SheetsConfig struct {
	SpreadsheetID string
	Tab           string
	KeyFile       string
}

func getSheetsConfig() SheetsConfig {
	return SheetsConfig{
		SpreadsheetID: os.Getenv("SHEET_ID"),
		Tab:           os.Getenv("SHEET_TAB"),
		KeyFile:       os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"),
	}
}

func getSheetsService() (*sheets.Service, error) {
	sheetsSvcOnce.Do(func() {
		cfg := getSheetsConfig()
		ctx := context.Background()
		if cfg.KeyFile == "" {
			sheetsSvcErr = fmt.Errorf("GOOGLE_APPLICATION_CREDENTIALS not set")
			return
		}
		data, err := os.ReadFile(cfg.KeyFile)
		if err != nil {
			sheetsSvcErr = fmt.Errorf("reading service account key: %v", err)
			return
		}
		creds, err := google.CredentialsFromJSON(ctx, data, sheets.SpreadsheetsScope)
		if err != nil {
			sheetsSvcErr = fmt.Errorf("parsing service account key: %v", err)
			return
		}
		svc, err := sheets.NewService(ctx, option.WithCredentials(creds))
		if err != nil {
			sheetsSvcErr = fmt.Errorf("creating sheets client: %v", err)
			return
		}
		sheetsSvc = svc
	})
	return sheetsSvc, sheetsSvcErr
}

// mtNow returns the current time formatted as "2026-08-05 14:30" in
// America/Edmonton, matching the backfill's timestamp format. The container
// runs with no TZ set (UTC), so this always converts explicitly rather than
// relying on the local zone.
func mtNow() string {
	mtLocOnce.Do(func() {
		loc, err := time.LoadLocation("America/Edmonton")
		if err != nil {
			log.Printf("⚠️ Failed to load America/Edmonton location, falling back to UTC: %v", err)
			loc = time.UTC
		}
		mtLocation = loc
	})
	return time.Now().In(mtLocation).Format("2006-01-02 15:04")
}

// appendRow appends one row to the configured sheet tab. Non-fatal by
// design: callers log and swallow the error so a Sheets outage never
// blocks a lead email.
func appendRow(row []interface{}) error {
	cfg := getSheetsConfig()
	if cfg.SpreadsheetID == "" || cfg.Tab == "" {
		return fmt.Errorf("SHEET_ID or SHEET_TAB not set")
	}

	svc, err := getSheetsService()
	if err != nil {
		return fmt.Errorf("sheets service unavailable: %v", err)
	}

	rangeSpec := fmt.Sprintf("'%s'!A1", cfg.Tab)
	_, err = svc.Spreadsheets.Values.Append(cfg.SpreadsheetID, rangeSpec, &sheets.ValueRange{
		Values: [][]interface{}{row},
	}).ValueInputOption("USER_ENTERED").InsertDataOption("INSERT_ROWS").Context(context.Background()).Do()
	if err != nil {
		return fmt.Errorf("appending row: %v", err)
	}
	return nil
}

// AppendEstimatorLead logs one Garage Estimator submission to the sheet.
// Runs in a goroutine from EstimateHandler; failures are logged, never
// surfaced to the visitor or allowed to affect the email send.
func AppendEstimatorLead(req EstimateRequest) {
	clickID, platform := ResolveClickID(req.Attribution)
	row := []interface{}{
		mtNow(),
		"Garage Estimator",
		req.Name,
		req.Email,
		req.Phone,
		"",
		req.Message,
		garageDetailsString(req),
		req.Attribution["utm_source"],
		req.Attribution["utm_medium"],
		req.Attribution["utm_campaign"],
		req.Attribution["utm_term"],
		req.Attribution["utm_content"],
		clickID,
		platform,
		"",
	}
	if err := appendRow(row); err != nil {
		log.Printf("⚠️ Failed to append estimator lead to sheet: %v", err)
	}
}

// ContactFormLead is the payload posted by the WordPress mu-plugin for a
// Contact Us form submission.
type ContactFormLead struct {
	Name        string            `json:"name"`
	Email       string            `json:"email"`
	Phone       string            `json:"phone"`
	Subject     string            `json:"subject"`
	Message     string            `json:"message"`
	Attribution map[string]string `json:"attribution"`
}

// AppendContactFormLead logs one WordPress Contact Us submission to the sheet.
func AppendContactFormLead(lead ContactFormLead) error {
	clickID, platform := ResolveClickID(lead.Attribution)
	row := []interface{}{
		mtNow(),
		"Contact Form",
		lead.Name,
		lead.Email,
		lead.Phone,
		lead.Subject,
		lead.Message,
		"",
		lead.Attribution["utm_source"],
		lead.Attribution["utm_medium"],
		lead.Attribution["utm_campaign"],
		lead.Attribution["utm_term"],
		lead.Attribution["utm_content"],
		clickID,
		platform,
		"",
	}
	return appendRow(row)
}

// garageDetailsString mirrors the backfill's human-readable summary of the
// garage configuration, built from the same fields the email body uses.
func garageDetailsString(req EstimateRequest) string {
	var parts []string
	if req.Width > 0 && req.Length > 0 {
		parts = append(parts, fmt.Sprintf("%d'x%d' ft", req.Width, req.Length))
	}
	if wallHeight := getGarageConfigValue(req.GarageConfig, "wallHeight", ""); wallHeight != "" {
		parts = append(parts, fmt.Sprintf("%s' walls", wallHeight))
	}
	if roof := getGarageConfigValue(req.GarageConfig, "roofDesign", ""); roof != "" {
		parts = append(parts, "roof: "+formatFormValue("roofDesign", roof))
	}
	if attic := getGarageConfigValue(req.GarageConfig, "atticStorage", ""); attic != "" {
		s := "attic storage: " + formatFormValue("atticStorage", attic)
		if loft := getGarageConfigValue(req.GarageConfig, "loftType", ""); loft != "" {
			s += fmt.Sprintf(" (%s)", formatFormValue("loftType", loft))
		}
		parts = append(parts, s)
	}
	if interior := getGarageConfigValue(req.GarageConfig, "interiorFinish", ""); interior != "" {
		s := "interior: " + formatFormValue("interiorFinish", interior)
		if material := getGarageConfigValue(req.GarageConfig, "wallCeilingMaterial", ""); material != "" {
			s += fmt.Sprintf(" (%s)", formatFormValue("wallCeilingMaterial", material))
		}
		parts = append(parts, s)
	}
	if build := getGarageConfigValue(req.GarageConfig, "buildRequest", ""); build != "" {
		parts = append(parts, "build request: "+formatFormValue("buildRequest", build))
	}
	if len(req.Features) > 0 {
		parts = append(parts, "selected: "+strings.Join(req.Features, ", "))
	}
	return strings.Join(parts, "; ")
}
