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
- Track progress in a Scrum board
- Backend powered by .NET and MongoDB
- Frontend built with modern web technologies

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

**Frontend:** [https://scrum-board-app.onrender.com/](https://scrum-board-app.onrender.com/)
**Backend API:** [https://scrum-board-app-backend-api.onrender.com/api/ScrumBoard](https://scrum-board-app-backend-api.onrender.com/api/ScrumBoard)

---

### Server Setup with MongoDB

```bash
cd server
dotnet add package MongoDB.Driver
```

* Ensure MongoDB is running locally or provide a connection string in `appsettings.json`.

---

## Tech Stack

* **Frontend:** Vite, React
* **Backend:** .NET 7
* **Database:** MongoDB
* **Hosting:** Render (Frontend & Backend)

---

## License

This project is **open-source** and free to use for personal or educational purposes.
