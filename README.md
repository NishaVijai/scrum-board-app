# Scrum Board Web App
A web-based project management tool for managing tasks using the Scrum methodology.

## Table of Contents
- [Preview](#preview)
- [Screenshot](#screenshot)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
    - [Step I: Clone and Build](#step-i-clone-and-build)
    - [Step II: Environment Variables](#step-ii-environment-variables)
    - [Step III: Running Locally](#step-iii-running-locally)
    - [Step IV: Production URLs](#step-iv-production-urls)
  - [Server Setup with MongoDB](#server-setup-with-mongodb)
- [Architecture Overview](#architecture-overview)
- [Drag & Drop Behavior](#drag--drop-behavior)
- [Cold Start & Performance Notes](#cold-start--performance-notes)
- [CORS Configuration](#cors-configuration)
- [Example Tasks](#example-tasks)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Preview
[https://scrum-board-app.onrender.com/](https://scrum-board-app.onrender.com/)

## Screenshot
<img width="3840" height="2070" alt="Scrum Board Web App" src="https://github.com/user-attachments/assets/a04a0e9b-da75-43a9-bbc2-3455db88464b" />

---

## Features
- Create, update, and delete tasks
- Drag and drop tasks between columns
- Reorder tasks within the same column
- Optimistic UI updates for smooth drag experience
- Track progress in a Scrum board
- Backend powered by .NET and MongoDB
- Frontend built with modern web technologies
- Deployed on Render (frontend + backend)

---

## Getting Started

### Prerequisites
- Node.js & npm
- .NET SDK
- MongoDB

---

### Local Setup

#### Step I: Clone and Build
```bash
# Clone the repository
git clone <repository-url>

# Setup Client
cd client
npm install          # Install dependencies
npm run build        # Build the production-ready frontend

# Setup Server
cd ../server
dotnet restore       # Restore .NET dependencies
dotnet build         # Build the project
dotnet publish -c Release -o ./publish
dotnet run           # Run the server
````

#### Step II: Environment Variables

**Create development environment file**
Path: `client/.env.development`

```env
VITE_API_URL=http://localhost:5203
```

**Create production environment file**
Path: `client/.env.production`

```env
VITE_API_URL=https://scrum-board-app-backend-api.onrender.com
```

**Update `.gitignore` in `client` folder**
Add the following at the end:

```
# Environment variables
.env.development
.env.production
```

---

#### Step III: Running Locally

**Frontend**

```bash
cd client
npm install
npm run dev
```

* Local URL: [http://localhost:5173](http://localhost:5173)

**Backend**

```bash
cd server
dotnet restore
dotnet clean
dotnet build
dotnet run
```

* API URL: [http://localhost:5203/api/ScrumBoard](http://localhost:5203/api/ScrumBoard)
* Swagger UI: [http://localhost:5203/swagger](http://localhost:5203/swagger)
* Health check: [http://localhost:5203/api/health](http://localhost:5203/api/health)

---

#### Step IV: Production URLs

**Frontend:**
[https://scrum-board-app.onrender.com/](https://scrum-board-app.onrender.com/)

**Backend API:**
[https://scrum-board-app-backend-api.onrender.com/api/ScrumBoard](https://scrum-board-app-backend-api.onrender.com/api/ScrumBoard)

**Backend Health Check:**
[https://scrum-board-app-backend-api.onrender.com/api/health](https://scrum-board-app-backend-api.onrender.com/api/health)

---

### Server Setup with MongoDB

```bash
cd server
dotnet add package MongoDB.Driver
```

* Ensure MongoDB is running locally or provide a connection string in `appsettings.json`.

---

## Architecture Overview

* **Frontend**

  * React + TypeScript (Vite)
  * Zustand for state management
  * React DnD for drag-and-drop
  * Optimistic UI updates for instant feedback

* **Backend**

  * ASP.NET Core Web API
  * MongoDB for persistence
  * REST-based API design

* **Hosting**

  * Render (Frontend + Backend)
  * MongoDB hosted externally

---

## Drag & Drop Behavior

* Cards can be:

  * Reordered within the same column
  * Moved across different columns
  * Dragging updates the UI optimistically
  * Card positions are persisted using `row` indexes
  * Hover position is calculated based on DOM element midpoints
  * Backend updates are batched safely to avoid request flooding

---

## Cold Start & Performance Notes

* Backend is hosted on Render and may experience **cold start delays**
* A health check endpoint is used to warm up the API
* First interaction may take a few seconds; subsequent actions are fast
* Optimistic UI ensures drag interactions feel instant even during backend latency

---

## CORS Configuration

* Backend CORS is configured to allow:

  * `http://localhost:5173` (local development)
  * `https://scrum-board-app.onrender.com` (production frontend)
* CORS middleware is applied globally before routing
* Preflight (`OPTIONS`) requests are handled automatically by ASP.NET Core

---

## Example Tasks

Some casual tasks you can use to test the board:

* Buy groceries
* Reply to emails
* Fix a small bug
* Write documentation
* Clean workspace
* Plan weekend trip
* Drag me around
* Delete me later

These are useful for testing:

* Drag & drop
* Reordering
* Persistence after refresh

---

## Tech Stack

* **Frontend:** Vite, React, TypeScript
* **Backend:** .NET 7 (ASP.NET Core)
* **Database:** MongoDB
* **State Management:** Zustand
* **Drag & Drop:** React DnD
* **Hosting:** Render (Frontend & Backend)

---

## License

This project is **open-source** and free to use for personal or educational purposes.
