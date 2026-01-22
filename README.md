# Scrum Board Web App
Project management tool - web app

## Preview
https://scrum-board-app.onrender.com/

### Screenshot
<img width="3840" height="2070" alt="Scrum Board Web App" src="https://github.com/user-attachments/assets/a04a0e9b-da75-43a9-bbc2-3455db88464b" />

### To run on local system
I)
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
dotnet run

II)
1)
ADD new file inside client (create a new file directly under client folder) 
filename -  .env.development

ADD
VITE_API_URL=http://localhost:5203


2)
ADD new file inside client (create a new file directly under client folder) 
filename -  .env.production

ADD
VITE_API_URL=https://scrum-board-app-backend-api.onrender.com


3)
UPDATE .gitignore (client)
ADD (at last line)

# Environment variables
.env.development
.env.production


III)
Command to run locally:

On one terminal,
cd client
npm i
npm run dev

local test:
client:
http://localhost:5173/


On another terminal,
cd server
dotnet restore

dotnet clean

dotnet build
dotnet run

server:
http://localhost:5203/api/ScrumBoard


http://localhost:5203/swagger


IV)
production test:
client:
https://scrum-board-app.onrender.com/

server:
https://scrum-board-app-backend-api.onrender.com/api/ScrumBoard


SERVER:

MongoDB

-cd server
dotnet add package MongoDB.Driver
