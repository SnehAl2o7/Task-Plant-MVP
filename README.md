# 🚀 TaskPlanet — Social Feed MVP

A full-stack social media feature where users can **create accounts, post text or images, like, and comment** on a public feed. Built as an internship project using React, Node.js, MongoDB, and Cloudinary.

**Live Demo:**
- 🌐 **Frontend (Live Demo):** ([https://task-plant-4b954lczq-snehalsingh353-8471s-projects.vercel.app/](task-plant-4b954lczq-snehalsingh353-8471s-projects.vercel.app))
- 🔗 **Backend API URL:** ([https://task-plant-mvp.onrender.com](https://task-plant-mvp.onrender.com))
---

## 📁 Project Structure

```
Task-Plant-MVP/
├── backend/                    # Node.js + Express REST API
│   ├── config/
│   │   ├── db.js               # MongoDB Atlas connection (Mongoose)
│   │   └── cloudinary.js       # Cloudinary + Multer image upload config
│   ├── controllers/
│   │   ├── authController.js   # signup, login logic
│   │   └── postController.js   # CRUD, like, comment, delete
│   ├── middleware/
│   │   └── auth.js             # JWT Bearer token verification
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt hashed password)
│   │   └── Post.js             # Post schema (likes array + embedded comments)
│   ├── routes/
│   │   ├── authRoutes.js       # POST /api/auth/signup  /login
│   │   └── postRoutes.js       # GET/POST/PUT/DELETE /api/posts
│   ├── .env.example            # Environment variable template
│   ├── render.yaml             # Render deployment config (IaC)
│   └── server.js               # Express entry point
│
├── frontend/                   # React (Vite) SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Sticky glassmorphism top bar
│   │   │   ├── Feed.jsx        # Infinite scroll post list
│   │   │   ├── PostCard.jsx    # Individual post (like, comment, delete)
│   │   │   ├── CreatePost.jsx  # Post composer (text + image upload)
│   │   │   └── CommentSection.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state + localStorage
│   │   └── pages/
│   │       ├── AuthPage.jsx    # Login / Register tabs
│   │       └── FeedPage.jsx    # Main feed page
│   ├── .env.example            # VITE_API_BASE_URL template
│   ├── vercel.json             # Vercel SPA routing + security headers
│   └── vite.config.js          # Vite build config
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Material UI v5, React Router v6, Axios |
| **Backend** | Node.js 20, Express 4, express-async-errors |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | bcryptjs (salt 12) + JWT (7-day expiry) |
| **Image Upload** | Cloudinary v1 + multer-storage-cloudinary |
| **Styling** | MUI dark theme + custom CSS variables (glassmorphism) |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js v20+
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free M0 cluster)
- A [Cloudinary](https://cloudinary.com) account (free tier)

### 1. Clone & install

```bash
git clone https://github.com/SnehAl2o7/Task-Plant-MVP.git
cd Task-Plant-MVP

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
```

Fill in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskplanet?retryWrites=true&w=majority
JWT_SECRET=any_random_long_string_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Leave blank for local dev — localhost:5173 is allowed by default
CLIENT_URL=
```

```bash
# Frontend
cp frontend/.env.example frontend/.env
```

`frontend/.env` (already set correctly for local):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run both servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → 🚀 Server running on http://localhost:5000
# → ✅ MongoDB Connected: ...
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → VITE v8  ready at http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## 🌐 Deployment Guide

### Step 1 — Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo: `SnehAl2o7/Task-Plant-MVP`
3. Set these settings:

| Setting | Value |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Node Version** | `20` |

4. Under **Environment Variables**, add all of these:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random secret string |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
| `CLIENT_URL` | *(leave blank for now — fill in after Step 2)* |

5. Click **Deploy**. Wait ~2 minutes. When it shows **Live**, copy the URL:
   ```
   https://taskplanet-backend.onrender.com
   ```
6. Test it: open `https://taskplanet-backend.onrender.com/api/health` — should return `{"status":"OK"}`

> ⚠️ **Free tier note:** Render free services spin down after 15 min of inactivity. The first request after idle takes ~30 seconds to wake up. This is normal.

---

### Step 2 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo: `SnehAl2o7/Task-Plant-MVP`
3. Set **Root Directory** → `frontend`
4. Vercel auto-detects Vite. Confirm these build settings:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

5. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://taskplanet-backend.onrender.com/api` |

6. Click **Deploy**. After ~1 minute copy your Vercel URL:
   ```
   https://task-plant-mvp.vercel.app
   ```

---

### Step 3 — Connect Backend CORS to Frontend URL

Now that you have both URLs, go back to **Render → your service → Environment**:

1. Add / update `CLIENT_URL` = `https://task-plant-mvp.vercel.app` *(your exact Vercel URL)*
2. Render will **auto-redeploy** with the new CORS config

✅ **Your app is now fully live!**

---

### Step 4 — MongoDB Atlas IP Whitelist

1. Go to **MongoDB Atlas → Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** → `0.0.0.0/0`
4. Click **Confirm**

This allows Render's servers (which have dynamic IPs) to connect to your database.

---

## 📡 API Reference

Base URL (local): `http://localhost:5000/api`
Base URL (prod): `https://taskplanet-backend.onrender.com/api`

### Auth Routes

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| `POST` | `/auth/signup` | `{ username, email, password }` | ❌ | Register a new user, returns JWT |
| `POST` | `/auth/login` | `{ email, password }` | ❌ | Login, returns JWT + user |

### Post Routes

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| `GET` | `/posts` | `?page=1&limit=10` | ❌ | Paginated public feed |
| `POST` | `/posts` | `FormData: { content, image? }` | ✅ | Create a post (text + optional image) |
| `PUT` | `/posts/:id/like` | — | ✅ | Toggle like (add/remove) |
| `POST` | `/posts/:id/comments` | `{ text }` | ✅ | Add a comment |
| `DELETE` | `/posts/:id` | — | ✅ | Delete own post |
| `GET` | `/health` | — | ❌ | Health check |

> ✅ Auth required → set `Authorization: Bearer <token>` header

---

## 🔑 Key Features

| Feature | How it works |
|---|---|
| **JWT Auth** | 7-day tokens stored in `localStorage`, auto-attached by Axios interceptor |
| **Image Upload** | Cloudinary via Multer (5MB limit, auto-resized to max 1200px wide) |
| **Infinite Scroll** | `IntersectionObserver` (react-intersection-observer) triggers next page load |
| **Optimistic Likes** | UI updates instantly, reverts automatically if the API call fails |
| **Owner Controls** | Delete button only appears on posts you authored |
| **Protected Routes** | React Router guard redirects unauthenticated users to `/auth` |
| **CORS** | Allows `localhost:5173` (dev) + `CLIENT_URL` (prod Vercel) simultaneously |

---

## 🗂️ Database Schemas

### User
```js
{
  username: String (unique, 3–30 chars),
  email:    String (unique, lowercase),
  password: String (bcrypt hash, salt 12),
  avatar:   String (URL, default ''),
  bio:      String (max 160 chars),
  timestamps: true
}
```

### Post
```js
{
  author:   ObjectId → User,
  content:  String (max 500 chars),
  imageUrl: String (Cloudinary URL),
  likes:    [ObjectId → User],       // toggle array
  comments: [{
    user:      ObjectId → User,
    text:      String (max 300),
    timestamps: true
  }],
  timestamps: true
}
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `EADDRINUSE :5000` | Run `kill -9 $(lsof -ti :5000)` |
| Backend on Render shows 502 | Check Render logs → likely missing env var |
| Images not uploading | Verify Cloudinary credentials in `.env` |
| CORS error in browser | Make sure `CLIENT_URL` in Render matches your exact Vercel URL |
| Blank page on Vercel | Check `vercel.json` exists in `frontend/` folder |
| MongoDB connection refused | Whitelist `0.0.0.0/0` in Atlas → Network Access |
| Render cold start (slow) | First request after idle takes ~30s — normal on free tier |

---

*Built with ❤️ for TaskPlanet MVP — Internship Project 2026*
