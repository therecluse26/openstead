# Openstead

Openstead is an open-source homestead management app/platform

### Architecture

This project is a monorepo that uses the Laravel Breeze/Next.js starter as a base, so the project is split into a `frontend` and `backend` folder. The backend is an api-only version of Laravel that uses Sanctum for authentication and the frontend uses a Next.js SPA

The backend uses a docker-compose for development and a docker for the production deployment.

### Development

To start the backend services, navigate to the `backend` folder and run `docker-compose up -d`

To start the frontend in development mode, navigate to `frontend` and run `npm run dev`