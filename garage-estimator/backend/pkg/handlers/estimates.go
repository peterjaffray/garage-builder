package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// EstimateRequest defines the structure of incoming data
type EstimateRequest struct {
	Name         string                 `json:"name"`
	Email        string                 `json:"email"`
	Phone        string                 `json:"phone,omitempty"`
	Width        int                    `json:"width"`
	Length       int                    `json:"length"`
	Height       int                    `json:"height"`
	Features     []string               `json:"features"`
	Message      string                 `json:"message,omitempty"`
	GarageConfig map[string]interface{} `json:"garageConfig,omitempty"`
}

// EstimateResponse returns the full estimate object
type EstimateResponse struct {
	ID         int      `json:"id"`
	Width      int      `json:"width"`
	Length     int      `json:"length"`
	Height     int      `json:"height"`
	Features   []string `json:"features"`
	TotalCost  int      `json:"total_cost"`
	CreatedAt  string   `json:"created_at"`
	UpdatedAt  string   `json:"updated_at"`
}

// SendEstimateEmail sends both HTML and text versions of the estimate email
func SendEstimateEmail(req EstimateRequest, resp EstimateResponse) error {
	// Create unique subject line with timestamp and ID
	uniqueSubject := fmt.Sprintf("🏠 Garage Estimate #%d - %s (%s)", 
		resp.ID, req.Name, time.Now().Format("Jan 2, 3:04 PM"))
	
	// Create HTML version
	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Garage Estimate Request</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
        .info-label { font-weight: bold; color: #555; font-size: 0.9em; }
        .info-value { font-size: 1.1em; margin-top: 5px; }
        .features-list { list-style: none; padding: 0; }
        .features-list li { background: white; margin: 5px 0; padding: 10px; border-radius: 5px; border-left: 3px solid #667eea; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 0.9em; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 New Garage Estimate Request</h1>
            <p>Submitted on %s</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>👤 Customer Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Name</div>
                        <div class="info-value">%s</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">%s</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value">%s</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>📐 Garage Specifications</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Dimensions</div>
                        <div class="info-value">%d' × %d' × %d'</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Wall Height</div>
                        <div class="info-value">%s</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Interior Finish</div>
                        <div class="info-value">%s</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Wall Material</div>
                        <div class="info-value">%s</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Roof Design</div>
                        <div class="info-value">%s</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Attic Storage</div>
                        <div class="info-value">%s</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Loft Type</div>
                        <div class="info-value">%s</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Build Request</div>
                        <div class="info-value">%s</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>✨ Features & Options</h3>
                <ul class="features-list">
                    %s
                </ul>
            </div>
            
            %s
            
            <div class="footer">
                <p>This estimate request was generated automatically by the Garage Estimator system.</p>
                <p>Please contact the customer to discuss details and provide a quote.</p>
            </div>
        </div>
    </div>
</body>
</html>`,
		time.Now().Format("January 2, 2006 at 3:04 PM MST"),
		req.Name,
		req.Email,
		req.Phone,
		req.Width,
		req.Length,
		req.Height,
		formatFormValue("wallHeight", getGarageConfigValue(req.GarageConfig, "wallHeight", "Not specified")),
		formatFormValue("interiorFinish", getGarageConfigValue(req.GarageConfig, "interiorFinish", "Not specified")),
		formatFormValue("wallCeilingMaterial", getGarageConfigValue(req.GarageConfig, "wallCeilingMaterial", "Not specified")),
		formatFormValue("roofDesign", getGarageConfigValue(req.GarageConfig, "roofDesign", "Not specified")),
		formatFormValue("atticStorage", getGarageConfigValue(req.GarageConfig, "atticStorage", "No")),
		formatFormValue("loftType", getGarageConfigValue(req.GarageConfig, "loftType", "Not specified")),
		formatFormValue("buildRequest", getGarageConfigValue(req.GarageConfig, "buildRequest", "No")),
		formatFeatures(req.Features),
		formatMessage(req.Message))

	// Create text version
	textBody := fmt.Sprintf(`NEW GARAGE ESTIMATE REQUEST
=====================================
Submitted: %s
Estimate ID: %d

CUSTOMER INFORMATION
-------------------
Name: %s
Email: %s
Phone: %s

GARAGE SPECIFICATIONS
---------------------
Dimensions: %d' × %d' × %d'
Wall Height: %s
Interior Finish: %s
Wall Material: %s
Roof Design: %s
Attic Storage: %s
Loft Type: %s
Build Request: %s

FEATURES & OPTIONS
------------------
%s

%s

---
This estimate request was generated automatically by the Garage Estimator system.
Please contact the customer to discuss details and provide a quote.`,
		time.Now().Format("January 2, 2006 at 3:04 PM MST"),
		resp.ID,
		req.Name,
		req.Email,
		req.Phone,
		req.Width,
		req.Length,
		req.Height,
		formatFormValue("wallHeight", getGarageConfigValue(req.GarageConfig, "wallHeight", "Not specified")),
		formatFormValue("interiorFinish", getGarageConfigValue(req.GarageConfig, "interiorFinish", "Not specified")),
		formatFormValue("wallCeilingMaterial", getGarageConfigValue(req.GarageConfig, "wallCeilingMaterial", "Not specified")),
		formatFormValue("roofDesign", getGarageConfigValue(req.GarageConfig, "roofDesign", "Not specified")),
		formatFormValue("atticStorage", getGarageConfigValue(req.GarageConfig, "atticStorage", "No")),
		formatFormValue("loftType", getGarageConfigValue(req.GarageConfig, "loftType", "Not specified")),
		formatFormValue("buildRequest", getGarageConfigValue(req.GarageConfig, "buildRequest", "No")),
		formatFeaturesText(req.Features),
		formatMessageText(req.Message))

	// Send HTML email
	if err := SendHTMLEmail(uniqueSubject, htmlBody); err != nil {
		return fmt.Errorf("failed to send HTML email: %v", err)
	}

	// Send text email
	if err := SendEmail(uniqueSubject, textBody); err != nil {
		return fmt.Errorf("failed to send text email: %v", err)
	}

	return nil
}

// Helper function to get garage config values
func getGarageConfigValue(config map[string]interface{}, key, defaultValue string) string {
	if value, ok := config[key].(string); ok {
		return value
	}
	return defaultValue
}

// Helper function to format form values into user-friendly labels
func formatFormValue(key, value string) string {
	switch key {
	case "interiorFinish":
		switch value {
		case "finished":
			return "Finished Interior"
		case "unfinished":
			return "Unfinished Interior"
		default:
			return value
		}
	case "wallCeilingMaterial":
		switch value {
		case "drywall":
			return "Drywall"
		case "trusscore":
			return "Trusscore"
		default:
			return value
		}
	case "atticStorage":
		switch value {
		case "yes":
			return "Yes"
		case "no":
			return "No"
		default:
			return value
		}
	case "loftType":
		switch value {
		case "loft":
			return "Loft"
		case "attic":
			return "Attic"
		default:
			return value
		}
	case "roofDesign":
		switch value {
		case "gable1":
			return "Gable Style 1"
		case "gable2":
			return "Gable Style 2"
		case "dutchGable1":
			return "Dutch Gable"
		case "dummyDutchGable1":
			return "Dummy Dutch Gable"
		case "cottage":
			return "Cottage Style"
		default:
			return value
		}
	case "buildRequest":
		switch value {
		case "yes":
			return "Yes"
		case "no":
			return "No"
		default:
			return value
		}
	case "wallHeight":
		return value + "'"
	default:
		return value
	}
}

// Helper function to format features list
func formatFeatures(features []string) string {
	if len(features) == 0 {
		return "<li>No additional features selected</li>"
	}
	
	var html string
	for _, feature := range features {
		html += fmt.Sprintf("<li>✅ %s</li>", feature)
	}
	return html
}

// Helper function to format currency
func formatCurrency(amount int) string {
	return fmt.Sprintf("%d", amount)
}

// Helper function to format message
func formatMessage(message string) string {
	if message == "" {
		return ""
	}
	return fmt.Sprintf(`
			<div class="highlight">
				<h3>💬 Customer Message</h3>
				<p>%s</p>
			</div>`, message)
}

// Helper function to format features list for text
func formatFeaturesText(features []string) string {
	if len(features) == 0 {
		return "No additional features selected"
	}
	
	var text string
	for i, feature := range features {
		if i > 0 {
			text += "\n"
		}
		text += fmt.Sprintf("• %s", feature)
	}
	return text
}

// Helper function to format message for text
func formatMessageText(message string) string {
	if message == "" {
		return ""
	}
	return fmt.Sprintf("CUSTOMER MESSAGE\n----------------\n%s", message)
}

// EstimateHandler receives and logs a basic quote request
func EstimateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req EstimateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	log.Printf("📩 New estimate request: %+v\n", req)

	now := time.Now()
	resp := EstimateResponse{
		ID:        int(now.Unix()), // Simple ID based on timestamp
		Width:     req.Width,
		Length:    req.Length,
		Height:    req.Height,
		Features:  req.Features,
		TotalCost: 0, // No cost calculation needed
		CreatedAt: now.Format(time.RFC3339),
		UpdatedAt: now.Format(time.RFC3339),
	}

	// Send styled email
	if err := SendEstimateEmail(req, resp); err != nil {
		log.Printf("⚠️ Failed to send estimate email: %v", err)
	} else {
		log.Printf("📧 Estimate email sent successfully")
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
