# 🚀 TaskPlanet — Social Feed MVP

A full-stack social media feature where users can **create accounts, post text or images, like, and comment** on a public feed. Built as part of an internship project.

---

## 📁 Project Structure

```
Task-Plant-MVP/
├── backend/          # Node.js + Express REST API
│   ├── config/       # DB (Mongoose) + Cloudinary setup
│   ├── controllers/  # Auth & Post business logic
│   ├── middleware/   # JWT auth guard
│   ├── models/       # User.js & Post.js Mongoose schemas
│   ├── routes/       # /api/auth & /api/posts
│   └── server.js     # Express entry point
│
├── frontend/         # React (Vite) SPA
│   └── src/
│       ├── api/      # Axios instance w/ JWT interceptor
│       ├── components/  # Feed, PostCard, CreatePost, Navbar, CommentSection
│       ├── context/  # AuthContext — global user/token state
│       └── pages/    # AuthPage (Login/Register), FeedPage
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), Material UI v5, React Router v6, Axios |
| Backend | Node.js, Express 4, express-async-errors |
| Database | MongoDB Atlas + Mongoose |
| Auth | bcryptjs (salt 12) + JWT (7-day expiry) |
| Image Upload | Cloudinary v1 + multer-storage-cloudinary |
| Styling | MUI dark theme + custom CSS (CSS variables, glassmorphism) |

---

## ⚙️ Environment Setup

### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskplanet?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (https://console.cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend — `frontend/.env`

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Running Locally

### 1. Start the Backend

```bash
cd backend
npm install          # Install dependencies (first time only)
npm run dev          # Starts nodemon dev server on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install          # Install dependencies (first time only)
npm run dev          # Starts Vite dev server on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/signup` | `{ username, email, password }` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | `{ email, password }` | ❌ | Login, returns JWT |

### Post Routes — `/api/posts`

| Method | Endpoint | Body / Query | Auth | Description |
|---|---|---|---|---|
| `GET` | `/api/posts` | `?page=1&limit=10` | ❌ | Fetch paginated feed |
| `POST` | `/api/posts` | `FormData: { content, image? }` | ✅ | Create a post |
| `PUT` | `/api/posts/:id/like` | — | ✅ | Toggle like on a post |
| `POST` | `/api/posts/:id/comments` | `{ text }` | ✅ | Add a comment |
| `DELETE` | `/api/posts/:id` | — | ✅ | Delete own post |

> ✅ = Requires `Authorization: Bearer <token>` header

---

## 🧪 Testing with Postman

1. `POST /api/auth/signup` → copy the returned `token`
2. In Postman, set **Authorization** → **Bearer Token** → paste token
3. `GET /api/posts` → should return `{ posts: [], hasMore: false }`
4. `POST /api/posts` (form-data: `content = Hello World`) → should return the new post
5. `PUT /api/posts/<id>/like` → toggles like, returns updated likes array

---

## 🔑 Key Features

- **JWT Authentication** — 7-day tokens stored in localStorage, auto-attached via Axios interceptor
- **Cloudinary Uploads** — Images auto-resized to max 1200px wide, stored in `taskplanet-posts/` folder
- **Infinite Scroll** — Feed loads 10 posts at a time using IntersectionObserver; automatically fetches next page on scroll
- **Optimistic Likes** — Like button updates instantly in UI; reverts if API call fails
- **Owner Controls** — Delete button only appears on posts you authored
- **Protected Routes** — React Router guards redirect unauthenticated users to `/auth`

---

## 📦 Dependencies

### Backend
```
express, mongoose, bcryptjs, jsonwebtoken, cloudinary, multer,
multer-storage-cloudinary, cors, dotenv, express-async-errors
```

### Frontend
```
react, react-router-dom, axios, @mui/material, @mui/icons-material,
@emotion/react, @emotion/styled, react-bootstrap, bootstrap,
react-intersection-observer
```

---

## 🗂️ MongoDB Schemas

### User
```js
{ username, email, password (hashed), avatar, bio, timestamps }
```

### Post
```js
{
  author: ObjectId(User),
  content: String (max 500),
  imageUrl: String,
  likes: [ObjectId(User)],
  comments: [{ user: ObjectId, text: String, timestamps }],
  timestamps
}
```

---

*Built with ❤️ for TaskPlanet MVP internship project.*
