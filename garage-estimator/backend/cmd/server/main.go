// cmd/server/main.go

package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

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

	// Routes
	http.HandleFunc("/api/hello", helloHandler)
	http.HandleFunc("/api/estimates", handlers.EstimateHandler)

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


