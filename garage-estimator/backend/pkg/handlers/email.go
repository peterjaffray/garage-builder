package handlers

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strings"
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

// recipients splits a comma-separated MAIL_TO into trimmed addresses.
// smtp.SendMail treats each slice element as one RCPT TO; passing the raw
// comma-separated string as a single element produces one malformed
// recipient instead of several valid ones.
func (c EmailConfig) recipients() []string {
	var out []string
	for _, addr := range strings.Split(c.To, ",") {
		addr = strings.TrimSpace(addr)
		if addr != "" {
			out = append(out, addr)
		}
	}
	return out
}

// SendEmail sends a plain text email using the configured SMTP settings
func SendEmail(subject, body string) error {
	config := GetEmailConfig()
	
	// Check if email configuration is complete
	if config.Host == "" || config.Port == "" || config.Username == "" || 
	   config.Password == "" || config.From == "" || config.To == "" {
		return fmt.Errorf("incomplete email configuration")
	}

	to := config.recipients()
	toHeader := strings.Join(to, ", ")

	// Create message
	message := fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/plain; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", config.From, toHeader, subject, body)

	// Connect to SMTP server
	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)

	addr := fmt.Sprintf("%s:%s", config.Host, config.Port)

	// Log email attempt
	log.Printf("📧 Attempting to send email - From: %s, To: %s, Subject: %s", config.From, toHeader, subject)

	// Send email
	err := smtp.SendMail(addr, auth, config.From, to, []byte(message))
	if err != nil {
		log.Printf("❌ Failed to send email - From: %s, To: %s, Subject: %s, Error: %v", config.From, toHeader, subject, err)
		return fmt.Errorf("failed to send email: %v", err)
	}

	log.Printf("✅ Email sent successfully - From: %s, To: %s, Subject: %s", config.From, toHeader, subject)
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

	to := config.recipients()
	toHeader := strings.Join(to, ", ")

	// Create HTML message
	message := fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", config.From, toHeader, subject, htmlBody)

	// Connect to SMTP server
	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)

	addr := fmt.Sprintf("%s:%s", config.Host, config.Port)

	// Log email attempt
	log.Printf("📧 Attempting to send HTML email - From: %s, To: %s, Subject: %s", config.From, toHeader, subject)

	// Send email
	err := smtp.SendMail(addr, auth, config.From, to, []byte(message))
	if err != nil {
		log.Printf("❌ Failed to send HTML email - From: %s, To: %s, Subject: %s, Error: %v", config.From, toHeader, subject, err)
		return fmt.Errorf("failed to send HTML email: %v", err)
	}

	log.Printf("✅ HTML email sent successfully - From: %s, To: %s, Subject: %s", config.From, toHeader, subject)
	return nil
}

// SendMultipartEmail sends one email carrying both a plain-text and an HTML
// part (multipart/alternative), so a single lead produces a single message
// instead of two separate sends to the same recipients.
func SendMultipartEmail(subject, textBody, htmlBody string) error {
	config := GetEmailConfig()

	if config.Host == "" || config.Port == "" || config.Username == "" ||
		config.Password == "" || config.From == "" || config.To == "" {
		return fmt.Errorf("incomplete email configuration")
	}

	to := config.recipients()
	toHeader := strings.Join(to, ", ")

	const boundary = "cuft-estimate-boundary"
	message := fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"MIME-Version: 1.0\r\n"+
		"Content-Type: multipart/alternative; boundary=\"%s\"\r\n"+
		"\r\n"+
		"--%s\r\n"+
		"Content-Type: text/plain; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n"+
		"--%s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n"+
		"--%s--\r\n",
		config.From, toHeader, subject, boundary,
		boundary, textBody,
		boundary, htmlBody,
		boundary)

	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)
	addr := fmt.Sprintf("%s:%s", config.Host, config.Port)

	log.Printf("📧 Attempting to send email - From: %s, To: %s, Subject: %s", config.From, toHeader, subject)

	if err := smtp.SendMail(addr, auth, config.From, to, []byte(message)); err != nil {
		log.Printf("❌ Failed to send email - From: %s, To: %s, Subject: %s, Error: %v", config.From, toHeader, subject, err)
		return fmt.Errorf("failed to send email: %v", err)
	}

	log.Printf("✅ Email sent successfully - From: %s, To: %s, Subject: %s", config.From, toHeader, subject)
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
	}
} 