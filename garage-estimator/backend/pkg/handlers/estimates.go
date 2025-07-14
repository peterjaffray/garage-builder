package handlers

import (
	"encoding/json"
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
	Material     string                 `json:"material"`
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
	Material   string   `json:"material"`
	Features   []string `json:"features"`
	TotalCost  int      `json:"total_cost"`
	CreatedAt  string   `json:"created_at"`
	UpdatedAt  string   `json:"updated_at"`
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

	// Calculate basic cost (mock calculation)
	sqft := req.Width * req.Length
	baseCost := sqft * 25 // $25 per sq ft base cost
	
	// Add material cost multiplier
	materialMultiplier := 1.0
	switch req.Material {
	case "premium":
		materialMultiplier = 1.5
	case "standard":
		materialMultiplier = 1.2
	case "basic":
		materialMultiplier = 1.0
	default:
		materialMultiplier = 1.0
	}
	
	// Add features cost
	featureCost := len(req.Features) * 500 // $500 per feature
	
	// Add additional costs based on garage configuration
	configCost := 0
	if config, ok := req.GarageConfig["roofDesign"].(string); ok {
		// Premium roof designs cost more
		if config == "dutchGable1" || config == "dummyDutchGable1" || config == "cottage" {
			configCost += 2000
		}
	}
	if config, ok := req.GarageConfig["atticStorage"].(string); ok && config == "yes" {
		configCost += 3000
	}
	if config, ok := req.GarageConfig["buildRequest"].(string); ok && config == "yes" {
		configCost += sqft * 15 // $15 per sqft for labor
	}
	
	totalCost := int(float64(baseCost) * materialMultiplier) + featureCost + configCost
	
	now := time.Now()
	resp := EstimateResponse{
		ID:        int(now.Unix()), // Simple ID based on timestamp
		Width:     req.Width,
		Length:    req.Length,
		Height:    req.Height,
		Material:  req.Material,
		Features:  req.Features,
		TotalCost: totalCost,
		CreatedAt: now.Format(time.RFC3339),
		UpdatedAt: now.Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
