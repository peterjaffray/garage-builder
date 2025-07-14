# 🛠️ Garage Estimator Web App

This is a full-stack Dockerized application for Northland Building Supplies’ garage estimator. It uses a **Go API backend** and a **React + Vite + Tailwind CSS frontend**, deployed via Docker on a Plesk server with nginx reverse proxy at `/gbd/`.

---

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Go (`net/http`)
- **Package Manager**: pnpm (frontend)
- **Build**: Docker + Docker Compose
- **Tests**: Jest, Playwright, Go test
- **Deploy**: Plesk w/ nginx proxy (only ever performed by user)

---

## 🧰 Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Go](https://go.dev/doc/install) (optional for direct backend work)
- [Node.js + npm](https://nodejs.org/) (optional for frontend work)

---

## 🗂️ Project Structure

```
garage-estimator/
├── backend/
│   ├── cmd/server/         # Go entry point
│   ├── pkg/
│   │   └── handlers/       # API endpoints
│   ├── air.conf            # Hot reload config
│   ├── Dockerfile
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormSteps/  # Multi-step form components
│   │   │   └── MultiStepForm.tsx
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── .env
│   └── .env.example
├── tests/
│   └── e2e/                # Playwright tests
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 💻 Local Development

### Production Mode (Single Container)

```bash
# Copy and configure the environment file
cp .env.example .env
# Edit .env with your values

# Build and run the combined container
docker-compose up --build
```

- Application: [http://localhost:8080](http://localhost:8080)
- API endpoints: [http://localhost:8080/api/hello](http://localhost:8080/api/hello)

### Development Mode (Separate Containers with Hot Reload)

```bash
# Use the development compose file
docker-compose -f docker-compose.dev.yml up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000/api/hello](http://localhost:3000/api/hello)

### Local Development without Docker

#### Backend
```bash
cd backend
go mod download
air  # or: go run cmd/server/main.go
```

#### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```
    

---

### 🔁 Live Reloading

Both frontend and backend support hot reload via **volume mounting**:

- Frontend:
    
    - Uses `pnpm dev` with Vite
        
    - Mounts `frontend/` into container
        
- Backend:
    
    - Uses [`air`](https://github.com/cosmtrek/air) for Go file watching
        
    - Mounts `backend/` into container
        

---

## 🔐 Environment Variables

### Single Environment File: `.env`

```env
# Backend Configuration
PORT=3000
SMTP_HOST=smtp.mailprovider.com
SMTP_PORT=587
SMTP_USER=info@northlandbuildingsupplies.ca
SMTP_PASS=supersecretpassword
MAIL_FROM=info@northlandbuildingsupplies.ca
MAIL_TO=sales@northlandbuildingsupplies.ca
RECAPTCHA_SECRET=your_recaptcha_secret_here

# Frontend Configuration (used during build)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

> In production, secrets are entered via the **Plesk Docker container UI**.

---

## 📡 API Endpoints

### POST `/api/estimates`
Handles form submissions for garage estimates.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "projectTimeline": "string",
  "garageType": "string",
  "garageSize": "string",
  "foundationType": "string",
  "height": "string",
  "projectAddress": "string",
  "message": "string",
  "recaptchaToken": "string"
}
```

**Response:**
- `200 OK` - Estimate successfully processed and email sent
- `400 Bad Request` - Invalid request data
- `500 Internal Server Error` - Server error

### GET `/api/hello`
Health check endpoint.

**Response:**
```json
{
  "message": "Hello from Go backend!"
}
```

---

## 🧪 Local Testing

### Frontend

```bash
cd frontend
pnpm test       # Runs Jest tests
pnpm run test:e2e  # Runs E2E tests with Playwright
```

### Backend

```bash
cd backend
go test ./...
```

---

## 🧪 Example Test Structure

```
frontend/
├── src/
│   └── components/
│       └── EstimatorForm.tsx
├── __tests__/
│   └── EstimatorForm.test.tsx

tests/
└── e2e/
    └── form.spec.ts

backend/
└── pkg/handlers/
    └── hello_test.go
```

---

## 🔄 Git Workflow

### Branching Convention

- `main` – stable, deployable code
    
- `feature/*` – feature branches
    
- `bugfix/*` – patches and fixes
    

### Dev Flow

```bash
git checkout -b feature/new-form
# ...make changes...
git commit -am "feat: new garage form"
git push origin feature/new-form
```

- Open pull request to `main`
    
- Run all tests locally before merging
    

---

## 🐳 Deployment on Plesk

1. **Build & push**
    
```bash
# Build the combined image
docker build -t peterjaffray/garage-estimator:latest .

# Push to Docker Hub
docker push peterjaffray/garage-estimator:latest
```

2. **In Plesk:**
    
    - Use Docker extension to pull the image:
        - `peterjaffray/garage-estimator:latest`
        
    - Configure container:
        - Expose port 80 to desired external port (e.g. `32768`)
        
    - Set all env vars via UI (copy from .env.example)
        
    - Start container
        
3. **Reverse proxy already configured:**
    

```nginx
location /gbd/ {
    rewrite /gbd/(.*) /$1 break;
    proxy_pass http://0.0.0.0:32768;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

4. **Visit:**
    
    - [https://northlandbuildingsupplies.ca/gbd/](https://northlandbuildingsupplies.ca/gbd/)
        
## 🤖 AI Agent Notes

- Maintain modular file structure for token-efficiency
    
- Use docstrings (`Go`) and JSDoc (`React`) for context
    
- Always update `.env.example` and README with any new keys or endpoints
    

---

## 📬 Maintainers

- **Lead**: Peter Jaffray – [peter@choice.marketing](mailto:peter@choice.marketing)
    
