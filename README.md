# Presto Backend API

Backend service for the Presto presentation platform. Provides authentication and data storage for presentation management.

**🌐 Live API:** https://presto-backend.vercel.app *(will update after deployment)*

---

## 🚀 Features

- User authentication (register, login, logout) with JWT tokens
- Presentation data storage and retrieval
- RESTful API design
- Swagger API documentation at `/docs`

---

## 🛠 Tech Stack

- **Runtime:** Node.js with Express
- **Authentication:** JSON Web Tokens (JWT)
- **Storage:** Vercel KV (key-value database)
- **API Docs:** Swagger UI
- **Deployment:** Vercel serverless functions

---

## 📁 Project Structure
```text
.
├── api/
│   ├── index.js       # Main Express server and routes
│   ├── service.js     # Business logic (auth, storage)
│   └── error.js       # Custom error classes
├── test/              # API tests
├── swagger.json       # API documentation
├── vercel.json        # Vercel deployment config
└── package.json       # Dependencies and scripts
```

---

## 🔧 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file:
```env
USE_VERCEL_KV=false
PROD_BACKEND_PORT=5005
```

For local development, you'll use a local JSON file for storage. For production deployment, Vercel KV is used.

### 3. Start development server
```bash
npm start
```

Server runs on http://localhost:5005

### 4. View API documentation

Navigate to http://localhost:5005/docs to see Swagger documentation.

### 5. Run tests
```bash
npm test
```

---

## 📋 API Endpoints

**Authentication:**
- `POST /admin/auth/register` - Register new user
- `POST /admin/auth/login` - Login user
- `POST /admin/auth/logout` - Logout user

**Data Storage:**
- `GET /store` - Get user's presentation store
- `PUT /store` - Update user's presentation store

**Documentation:**
- `GET /` - Redirects to `/docs`
- `GET /docs` - Swagger UI documentation

---

## 🧑‍💻 About This Project

This backend API was developed as part of the Presto presentation platform project at UNSW.

**Key technical contributions:**
- RESTful API design with JWT authentication
- Integration with Vercel KV for serverless data persistence
- Swagger documentation for all endpoints
- Error handling middleware
- Comprehensive test coverage

---

## 🌐 Deployment

Deployed on Vercel as serverless functions with automatic deployments from the main branch.

**Environment Variables (Set in Vercel):**
- `USE_VERCEL_KV=true`
- `PROD_BACKEND_PORT=5005`
- `KV_REST_API_URL` - Automatically set by Vercel KV
- `KV_REST_API_TOKEN` - Automatically set by Vercel KV

**Live API:** https://presto-backend.vercel.app *(will update)*

---

## 🔗 Related

**Frontend Repository:** https://github.com/ThomasBordado/presto-frontend