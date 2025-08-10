# Scrum Board Web App
Project management tool - web app

## Preview


### Screenshot


### To run on local system
- Clone a project
- From terminal, run, "npm i" or "npm install"
- From terminal, run, "npm run dev"

1)
Clone the repo

2)
cd client 
npm i (will create node_modules)
npm run build (will create dist folder)

3)
cd server
dotnet restore
dotnet build

dotnet publish -c Release -o ./publish

ADD new file inside client (direct file under client folder) 
filename -  .env.production

ADD
VITE_API_URL=https://scrum-board-app-backend-api.onrender.com/api

UPDATE .gitignore (client)
ADD (at last line)
# Environment variables
.env.production


DB:
https://scrum-board-app-backend-api.onrender.com/api/ScrumBoard/getall
