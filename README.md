FoodPro — Premium Restaurant Management System

A full-stack restaurant management system featuring a high-class, minimalist public food menu and a complete administrative control panel.

🔗 Live Demo: https://restaurant-system-git-main-khai-dev1.vercel.app


⚠️ The backend is hosted on Render's free tier — the first request may take 30–60 seconds to wake up the server. Please be patient on initial load.




Project Architecture

This is a monorepo containing both the frontend and backend applications:

restaurant_system/
├── FoodPro.API/          # .NET 10 Web API backend
│   ├── docker-compose.yml
│   └── ...
└── frontend/             # Next.js 15 frontend
    └── ...

Getting Started

Prerequisites

.NET 10 SDK
Node.js 18+
Docker & Docker Compose
A Cloudinary account
A Neon PostgreSQL database (or any PostgreSQL instance)

1. Backend Setup (.NET 10)

The backend and database are managed together via Docker Compose.

Navigate to the backend directory:

bash   cd FoodPro.API

Create your appsettings.Development.json and configure your secrets:

json   {
     "ConnectionStrings": {
       "DefaultConnection": "your_postgresql_connection_string"
     },
     "Cloudinary": {
       "CloudName": "your_cloud_name",
       "ApiKey": "your_api_key",
       "ApiSecret": "your_api_secret"
     },
     "Jwt": {
       "Key": "your_jwt_secret_key",
       "Issuer": "your_issuer",
       "Audience": "your_audience"
     }
   }

Start the backend and database with Docker Compose:

bash   docker compose up --build

Apply database migrations:

bash   dotnet ef database update

The API will be available at http://localhost:8080.


2. Frontend Setup (Next.js)

The frontend runs directly with Node.js — no Docker needed.

Navigate to the frontend directory:

bash   cd frontend

Install dependencies:

bash   npm install

Create a .env.local file and configure your environment variables:

env   NEXT_PUBLIC_API_URL=http://localhost:8080

Run the development server:

bash   npm run dev

Open http://localhost:3000 in your browser.


Features

Public-facing food menu with category filtering
Admin dashboard for full CRUD management of menu items and categories
JWT authentication with role-based access control
Cloudinary image uploads for food items
Soft deletes across all entities
CI/CD pipeline via GitHub Actions — builds and tests before deploying to Render and Vercel via webhooks


Deployment
Automatic deploys are disabled on both Render and Vercel. All deployments are triggered exclusively by the GitHub Actions CI/CD pipeline after a successful build.
