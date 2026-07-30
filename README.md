# FoodPro — Premium Restaurant Management System

A full-stack restaurant management system featuring a high-class, minimalist public food menu, reservation system, AI-powered chat assistant, and a complete administrative control panel.

🔗 **Live Demo:** https://restaurant-system-git-main-khai-dev1.vercel.app
🎬 **Demo Video:** <img width="800" height="450" alt="ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/0fe73c28-0cb8-4eb5-9749-919479e7c94b" />

> ⚠️ Backend is hosted on Render's free tier — the first request may take 30–60 seconds to wake up.

---

## Screenshots
### Home
![Home Page](https://github.com/user-attachments/assets/0a4ac2f5-9f40-464a-94bb-d577915fa4ef)

### Menu
![Menu Page](https://github.com/user-attachments/assets/b15382d2-96d4-48ec-8411-012075910054)

### Reservation
![Reservation Page](https://github.com/user-attachments/assets/72d37035-5124-450c-acdb-129e5c9a7e60)

### AI Chatbot
![AI Chatbot](https://github.com/user-attachments/assets/160c0303-c3aa-4b5d-9a3c-256a83133de0)

### Admin Panel
![Admin Panel](https://github.com/user-attachments/assets/f74e2e39-c743-4dee-b8f9-4dec381696a9)

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | .NET 10, ASP.NET Core, Entity Framework Core |
| Database | PostgreSQL (Neon) |
| Infrastructure | Docker, Render, Vercel, GitHub Actions |
| APIs | Cloudinary, Gemini AI |

---

## Features

- Public food menu with category filtering
- Table reservation with real-time availability checking and double-booking prevention via composite unique index with soft-delete filter
- Floating AI chat assistant (Gemini API) — answers natural language questions about menu, tables, and availability
- Admin dashboard with full CRUD for menu items, categories, and tables
- JWT authentication with role-based access control
- Cloudinary integration for food image uploads
- Soft deletes across all entities via global EF Core query filters
- CI/CD pipeline via GitHub Actions — deploys to Render and Vercel on successful build

---

## Project Structure

```
restaurant_system/
├── FoodPro.API/          # .NET 10 Web API backend
│   ├── docker-compose.yml
│   └── ...
└── frontend/             # Next.js 15 frontend
    └── ...
```

---

## Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js 18+
- Docker & Docker Compose
- A Cloudinary account
- A Neon PostgreSQL database (or any PostgreSQL instance)
- A Gemini API key (Google AI Studio)

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd FoodPro.API
```

Create `appsettings.Development.json` and configure your secrets:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your_postgresql_connection_string"
  },
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  },
  "JwtSettings": {
    "SecretKey": "your_jwt_secret_key",
    "Issuer": "FoodProAPI",
    "Audience": "FoodProClient",
    "ExpiryDays": 1
  },
  "Gemini": {
    "ApiKey": "your_gemini_api_key"
  }
}
```

Start the backend with Docker Compose:

```bash
docker compose up --build
```

Apply database migrations:

```bash
dotnet ef database update
```

API available at `http://localhost:8080`

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Demo Access

To test the admin panel, use the following credentials on the live demo:

| Field | Value |
|---|---|
| Route | `/login` |
| Email | `admin@gmail.com` |
| Password | `12345678` |

---

## Roadmap

- [ ] Ordering system with real-time order status updates
- [ ] Payment gateway integration (ToyyibPay / Billplz)
- [ ] Admin dashboard with sales analytics, revenue charts, and date range filtering
- [ ] Ingredient and allergen info per menu item
- [ ] Customer feedback and review module

---

## Deployment

Automatic deploys are disabled on both Render and Vercel. All deployments are triggered exclusively by the GitHub Actions CI/CD pipeline after a successful build.
