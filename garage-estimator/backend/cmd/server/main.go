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


	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	// Routes
	http.HandleFunc("/api/hello", helloHandler)
	http.HandleFunc("/api/quote", handlers.EstimateHandler)

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


