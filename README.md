# FoodPro - Premium Restaurant Management System

A full-stack restaurant system featuring a high-class, minimalist public food menu and a complete administrative control panel.

## 🏗️ Project Architecture

This repository contains both the frontend and backend applications:

* **/FoodPro.API**: The backend server built with .NET 10 Web API, Entity Framework Core, and MySQL. It manages food data, categories, and secure media uploads via Cloudinary.
* **/frontend**: The frontend application built with Next.js 15+ (App Router), TypeScript, and Tailwind CSS.

---

## 🚀 Getting Started

### 1. Backend Setup (.NET 10)
1. Navigate to the backend directory:
   ```bash
   cd FoodPro.API
Configure your database connection string and Cloudinary keys in appsettings.Development.json.

Apply database migrations:

Bash
dotnet ef database update
Start the API server:

Bash
dotnet run
The API will be available at https://localhost:7123 or http://localhost:5123.

2. Frontend Setup (Next.js)
Navigate to the frontend directory:

Bash
cd frontend
Install the dependencies:

Bash
npm install
Create a .env.local file based on .env.example and add your local API URL.

Run the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser to view the application.
