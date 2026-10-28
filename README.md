# PulseMonitor — API Monitoring & Incident Management Platform

PulseMonitor is a full-stack API monitoring platform designed to monitor API availability, track response times, perform health checks, and maintain monitoring history through a centralized dashboard.

The platform allows users to register APIs, manage monitoring configurations, execute health checks, and view the latest monitoring results through a modern and responsive interface.

## 🚀 Live Demo

- **Frontend:** https://api-monitoring-management.vercel.app/
- **Backend:** https://api-monitoring-incident-management.onrender.com

> Note: The backend is hosted on Render's free tier, if applicable to your service configuration, and may take time to wake up after inactivity.

## ✨ Features

- **API Management:** Register, view, update, and delete monitored APIs.
- **Health Checks:** Check whether a monitored API is operational or unavailable.
- **Response Time Tracking:** Measure API response time in milliseconds.
- **Monitoring History:** Store and retrieve historical health-check results.
- **Automated Monitoring:** Run scheduled health checks for active APIs.
- **Active/Inactive Controls:** Enable or disable monitoring for individual APIs.
- **Dashboard Analytics:** Display total APIs, operational APIs, APIs that are down, and average response time.
- **REST API Integration:** Communicate with the backend through REST endpoints.
- **Responsive Dashboard:** Access monitoring information through a React-based interface.
- **Database Persistence:** Store API configurations and monitoring results in MongoDB.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Lucide React
- JavaScript
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- Node.js Fetch API
- Scheduled jobs using a cron scheduler

### Deployment
- Vercel — Frontend hosting
- Render — Backend hosting
- MongoDB Atlas — Cloud database

## 📸 Application Overview

The dashboard provides a centralized view of monitored APIs, including:

- Total registered APIs
- APIs currently operational
- APIs currently down
- Average response time
- Monitored API list
- Monitoring history

## ⚙️ Prerequisites

Before running the project locally, install:

- Node.js and npm
- Git
- MongoDB Atlas account or a local MongoDB instance

## 💻 Installation and Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd api-monitoring-platform
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual GitHub repository URL.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB connection URI. Include your intended database name in the URI if required.

### 3. Start the Backend

```bash
npm start
```

If your project includes a development script, you can use:

```bash
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

### 4. Configure the Frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The frontend reads this variable using:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### 5. Start the Frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal, usually:

```text
http://localhost:5173
```

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb+srv://...` |
| `VITE_API_BASE_URL` | Base URL for frontend API requests | `http://localhost:5000/api` |

**Security guidelines:**

- Never commit `.env` files or database credentials to GitHub.
- Keep `.env` in `.gitignore`.
- Configure production environment variables in Render and Vercel.
- The Vite `VITE_` prefix exposes a variable to client-side code. Never store passwords, database URIs, or private API keys in frontend environment variables.

## 🌐 API Endpoints

The following endpoints use `/api` as the base prefix.

### Monitored APIs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/monitored-apis` | Register a new API |
| `GET` | `/api/monitored-apis` | Retrieve all monitored APIs |
| `GET` | `/api/monitored-apis/:id` | Retrieve an API by ID |
| `PATCH` | `/api/monitored-apis/:id` | Update API configuration |
| `DELETE` | `/api/monitored-apis/:id` | Delete a monitored API |
| `PATCH` | `/api/monitored-apis/:id/toggle` | Toggle active/inactive status |
| `POST` | `/api/monitored-apis/:id/health-check` | Execute a manual health check |
| `GET` | `/api/monitored-apis/:id/history` | Retrieve monitoring history |

### Example: Register a Monitored API

**Request**

```http
POST /api/monitored-apis
Content-Type: application/json
```

**Request body**

```json
{
  "name": "JSONPlaceholder Posts API",
  "url": "https://jsonplaceholder.typicode.com/posts/1",
  "method": "GET",
  "interval": 10,
  "isActive": true
}
```

The interval is configured in minutes, subject to the validation rules in the backend.

### Example: Retrieve Monitored APIs

```http
GET /api/monitored-apis
```

### Example: Execute a Health Check

```http
POST /api/monitored-apis/:id/health-check
```

Replace `:id` with the ID of the monitored API.

### Example: Retrieve Monitoring History

```http
GET /api/monitored-apis/:id/history
```

Replace `:id` with the relevant monitored API ID.

> These endpoint paths reflect the project's current API structure. Request payloads and response formats may vary with your implementation.

## 🩺 How Monitoring Works

1. Register an API by providing its name, URL, HTTP method, and monitoring interval.
2. Save the API configuration in MongoDB.
3. Execute a manual health check or let the scheduler run an automated check.
4. Send an HTTP request to the configured endpoint.
5. Measure response time and determine the health status.
6. Store the monitoring result in the database.
7. Display the latest status and monitoring information on the dashboard.

The health-check implementation uses a request timeout to prevent slow or unresponsive APIs from blocking monitoring indefinitely.

## 🐳 Docker

Dockerfiles are included in the project for containerizing the frontend and backend.

Build the backend image from the project root:

```bash
docker build -t api-monitoring-backend ./server
```

Build the frontend image:

```bash
docker build -t api-monitoring-frontend ./client
```

Run the backend container with environment variables supplied at runtime:

```bash
docker run --env-file server/.env -p 5000:5000 api-monitoring-backend
```

The backend container must be able to reach MongoDB Atlas or your configured database.

For the frontend Docker build, configure `VITE_API_BASE_URL` to point to a backend URL accessible by the browser. The frontend URL must not point to `localhost` unless the browser and backend are running in the same intended local environment.

## 🚀 Deployment

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Set the Root Directory to `client`.
3. Select Vite as the framework preset.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Configure `VITE_API_BASE_URL` with the deployed backend URL and the correct API prefix.
7. Deploy the project.

### Backend — Render

1. Create a Web Service connected to the GitHub repository.
2. Set the Root Directory to `server`.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Add `MONGODB_URI` to the service's environment variables.
6. Configure MongoDB Atlas Network Access to permit connections from the backend hosting environment.
7. Deploy the service and inspect its logs.

The backend should listen on `process.env.PORT` when deployed.

## 🧪 Testing

Recommended manual tests:

- Create a monitored API.
- Retrieve all APIs and retrieve an API by ID.
- Update its configuration.
- Run a manual health check.
- Verify response time and status.
- Retrieve monitoring history.
- Toggle monitoring on and off.
- Delete an API.
- Refresh the frontend and verify that stored data persists.

Postman or Thunder Client can be used to test backend endpoints.

## 🔮 Future Improvements

- User authentication and role-based access control
- Email or Slack incident notifications
- Configurable alert thresholds
- API uptime and availability reports
- Response-time charts and historical analytics
- Incident acknowledgement and resolution workflows
- Docker Compose for multi-container local development
- GitLab CI/CD automation
- Cloud deployment and centralized logging

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Building REST APIs using Node.js and Express.js
- Designing MongoDB schemas with Mongoose
- Integrating a React frontend with a backend service
- Implementing scheduled jobs and health checks
- Tracking API response times and monitoring history
- Managing environment variables across development and production
- Deploying a full-stack application using Vercel, Render, and MongoDB Atlas

## 👨‍💻 Author

**Rahul Tiwari**

## 📄 License

This project is available for educational and portfolio purposes. Add a `LICENSE` file if you intend to distribute it under a specific open-source license.
<img width="1525" height="780" alt="Screenshot 2026-10-28 205632" src="https://github.com/user-attachments/assets/c0bfc757-83a8-4de5-bb11-3bca3cef24fd" />
