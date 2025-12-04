# Deploying instructions
Skip Step 1 & 2 if frontend is connected to deployed database on ec2.

# Backend:

### Step 1: Deploy Database env
- cd backend
- docker-compose up (check docker desktop to make sure the correct container is running)

### Steo 2: Deploy API endpoints
- cd backend/cmd
- go mod tidy
- go run main.go

# Step 3: Deploy Frontend
- cd frontend
- npm install
- npm run serve (deloys development build)
