# 🛠️ Garage Estimator Web App

This is a full-stack Dockerized application for Northland Building Supplies’ garage estimator. It uses a **Go API backend** and a **React + Vite + Tailwind CSS frontend**, deployed via Docker on a Plesk server with nginx reverse proxy at `/gbd/`.

---

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Go (`net/http`)
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
│ ├── cmd/server/ # Go entry point  
│ ├── pkg/handlers/ # API logic  
│ ├── Dockerfile  
│ └── .env  
├── frontend/  
│ ├── src/ # React components  
│ ├── index.html  
│ ├── Dockerfile  
│ ├── vite.config.ts  
│ ├── .env  
│ └── tailwind.config.js  
├── tests/  
│ └── e2e/ # Playwright tests  
├── docker-compose.yml  
└── README.md

````

---

## 💻 Local Development

```bash
docker-compose up --build
````

- Frontend: [http://localhost:5173](http://localhost:5173)
    
- Backend API: [http://localhost:3000/api/hello](http://localhost:3000/api/hello)
    

---

### 🔁 Live Reloading

Both frontend and backend support hot reload via **volume mounting**:

- Frontend:
    
    - Uses `npm run dev` with Vite
        
    - Mounts `frontend/` into container
        
- Backend:
    
    - Uses [`air`](https://github.com/cosmtrek/air) for Go file watching
        
    - Mounts `backend/` into container
        

---

## 🔐 Environment Variables

### Backend: `backend/.env`

```env
PORT=3000
SMTP_HOST=smtp.mailprovider.com
SMTP_PORT=587
SMTP_USER=info@northlandbuildingsupplies.ca
SMTP_PASS=supersecretpassword
MAIL_FROM=info@northlandbuildingsupplies.ca
MAIL_TO=sales@northlandbuildingsupplies.ca
RECAPTCHA_SECRET=...
```

### Frontend: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

> In production, secrets are entered via the **Plesk Docker container UI**.

---

## 🧪 Local Testing

### Frontend

```bash
cd frontend
npm test       # Runs Jest tests
npx playwright test  # Runs E2E tests
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
docker build -t peterjaffray/garage-estimator:latest .
docker push peterjaffray/garage-estimator:latest
```

2. **In Plesk:**
    
    - Use Docker extension to pull `peterjaffray/garage-estimator:latest`
        
    - Expose port (e.g. `32768`)
        
    - Set env vars via UI
        
    - Restart container
        
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
    
