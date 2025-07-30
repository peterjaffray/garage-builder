package handlers

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
	"time"
)

// EmailConfig holds email configuration
type EmailConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
	To       string
}

// GetEmailConfig returns email configuration from environment variables
func GetEmailConfig() EmailConfig {
	return EmailConfig{
		Host:     os.Getenv("SMTP_HOST"),
		Port:     os.Getenv("SMTP_PORT"),
		Username: os.Getenv("SMTP_USER"),
		Password: os.Getenv("SMTP_PASS"),
		From:     os.Getenv("MAIL_FROM"),
		To:       os.Getenv("MAIL_TO"),
	}
}

// SendEmail sends a plain text email using the configured SMTP settings
func SendEmail(subject, body string) error {
	config := GetEmailConfig()
	
	// Check if email configuration is complete
	if config.Host == "" || config.Port == "" || config.Username == "" || 
	   config.Password == "" || config.From == "" || config.To == "" {
		return fmt.Errorf("incomplete email configuration")
	}

	// Create message
	message := fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/plain; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", config.From, config.To, subject, body)

	// Connect to SMTP server
	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)
	
	addr := fmt.Sprintf("%s:%s", config.Host, config.Port)
	
	// Send email
	err := smtp.SendMail(addr, auth, config.From, []string{config.To}, []byte(message))
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}
	
	log.Printf("📧 Email sent successfully: %s", subject)
	return nil
}

// SendHTMLEmail sends an HTML email using the configured SMTP settings
func SendHTMLEmail(subject, htmlBody string) error {
	config := GetEmailConfig()
	
	// Check if email configuration is complete
	if config.Host == "" || config.Port == "" || config.Username == "" || 
	   config.Password == "" || config.From == "" || config.To == "" {
		return fmt.Errorf("incomplete email configuration")
	}

	// Create HTML message
	message := fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", config.From, config.To, subject, htmlBody)

	// Connect to SMTP server
	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)
	
	addr := fmt.Sprintf("%s:%s", config.Host, config.Port)
	
	// Send email
	err := smtp.SendMail(addr, auth, config.From, []string{config.To}, []byte(message))
	if err != nil {
		return fmt.Errorf("failed to send HTML email: %v", err)
	}
	
	log.Printf("📧 HTML email sent successfully: %s", subject)
	return nil
}

// SendSystemStartupEmail sends a notification when the system starts
func SendSystemStartupEmail() {
	subject := "🚀 Garage Estimator System Started"
	body := fmt.Sprintf(`Garage Estimator application has started successfully.

Startup Time: %s
Environment: Development
Status: Online

The system is ready to receive garage estimate requests.`, time.Now().Format("2006-01-02 15:04:05 MST"))

	err := SendEmail(subject, body)
	if err != nil {
		log.Printf("⚠️ Failed to send startup email: %v", err)
	} else {
		log.Printf("✅ System startup email sent successfully")
	}
} 