# Deploying instructions for local machine

# Backend:

### Deploy Database env
- cd backend
- docker-compose up (check docker desktop to make sure the correct container is running)

### Deploy API endpoints
- cd backend/cmd
- go mod tidy
- go run main.go

# Frontend:
- cd frontend
- npm install
- npm run serve (deloys development build)
