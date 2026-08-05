package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

// IngestHandler receives WordPress Contact Us submissions from the
// choice-uft mu-plugin and appends them to the same lead sheet the
// estimator writes to. Reachable only over odin's loopback: the
// container's Docker port publishes to 127.0.0.1 only, and the public
// vhost's ^~ /gbd/ proxy block never forwards this path.
func IngestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	secret := os.Getenv("INGEST_SHARED_SECRET")
	if secret == "" || r.Header.Get("X-Ingest-Secret") != secret {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var lead ContactFormLead
	if err := json.NewDecoder(r.Body).Decode(&lead); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := AppendContactFormLead(lead); err != nil {
		log.Printf("⚠️ Failed to append contact form lead to sheet: %v", err)
		http.Error(w, "Failed to record lead", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
