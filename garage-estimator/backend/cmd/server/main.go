// cmd/server/main.go

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"garage-estimator/pkg/handlers"
)

func main() {
	// Load environment variables in development

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Log configuration (with sensitive values masked)
	log.Println("=== Go Backend Starting ===")
	log.Printf("PORT: %s", port)
	log.Printf("SMTP_HOST: %s", maskEmpty(os.Getenv("SMTP_HOST")))
	log.Printf("SMTP_PORT: %s", maskEmpty(os.Getenv("SMTP_PORT")))
	log.Printf("SMTP_USER: %s", maskEmpty(os.Getenv("SMTP_USER")))
	log.Printf("SMTP_PASS: %s", maskSensitive(os.Getenv("SMTP_PASS")))
	log.Printf("MAIL_FROM: %s", maskEmpty(os.Getenv("MAIL_FROM")))
	log.Printf("MAIL_TO: %s", maskEmpty(os.Getenv("MAIL_TO")))
	log.Printf("RECAPTCHA_SECRET: %s", maskSensitive(os.Getenv("RECAPTCHA_SECRET")))
	log.Println("===========================")

	// Send system startup email
	handlers.SendSystemStartupEmail()

	// Routes
	http.HandleFunc("/api/hello", helloHandler)
	http.HandleFunc("/api/estimates", handlers.EstimateHandler)
	http.HandleFunc("/api/test-email", testEmailHandler)

	log.Printf("🚀 Garage Estimator API running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	response := map[string]string{
		"message": "Hello from Go API",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func testEmailHandler(w http.ResponseWriter, r *http.Request) {
	// Create a sample completed form
	sampleRequest := handlers.EstimateRequest{
		Name:     "John Smith",
		Email:    "john.smith@example.com",
		Phone:    "(555) 123-4567",
		Width:    24,
		Length:   32,
		Height:   10,
		Features: []string{
			"Attic Storage",
			"Finished Interior",
			"Premium Roof Design",
			"Custom Windows",
		},
		Message: "I'm looking for a premium garage with extra storage space. Please include detailed pricing breakdown.",
		GarageConfig: map[string]interface{}{
			"interiorFinish": "finished",
			"wallCeilingMaterial": "trusscore",
			"roofDesign": "dutchGable1",
			"atticStorage": "yes",
			"loftType": "attic",
			"wallHeight": "10",
		},
	}

	now := time.Now()
	sampleResponse := handlers.EstimateResponse{
		ID:        int(now.Unix()),
		Width:     sampleRequest.Width,
		Length:    sampleRequest.Length,
		Height:    sampleRequest.Height,
		Features:  sampleRequest.Features,
		TotalCost: 0, // No cost calculation needed
		CreatedAt: now.Format(time.RFC3339),
		UpdatedAt: now.Format(time.RFC3339),
	}

	// Send the sample email
	err := handlers.SendEstimateEmail(sampleRequest, sampleResponse)
	if err != nil {
		log.Printf("⚠️ Failed to send test email: %v", err)
		http.Error(w, "Failed to send test email", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"message": "Sample estimate email sent successfully",
		"estimate_id": fmt.Sprintf("%d", sampleResponse.ID),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func maskEmpty(value string) string {
	if value == "" {
		return "<not set>"
	}
	return value
}

func maskSensitive(value string) string {
	if value == "" {
		return "<not set>"
	}
	return "[REDACTED]"
}


