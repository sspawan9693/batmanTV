# 🦇 BatmanTV

A full-stack, YouTube-inspired video streaming web application built as a college portfolio project — supporting video uploads, playback, subscriptions, and more.

---

## ✨ Features

- 🔐 User registration & login
- 🔑 JWT-based authentication (Access + Refresh tokens via HTTP-only cookies)
- 👤 User profile & channel pages
- 📤 Video upload with thumbnails
- ▶️ Video streaming/playback
- ❤️ Like/unlike videos
- 💬 Comments
- 🔔 Subscriptions
- 🕒 Watch history
- 📃 Playlists
- 🐦 Tweet functionality
- 📊 User dashboard
- 🔍 Search & browse videos
- 🖼️ Avatar & cover image upload

---

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, React Router DOM, Redux Toolkit, Axios

**Backend:** Node.js, Express.js

**Database:** MongoDB with Mongoose

**Authentication:** JWT (Access + Refresh Tokens, HTTP-only cookies)

**Media Storage:** Cloudinary

**Security:** bcrypt (password hashing)

**Deployment:** Vercel (Frontend) · Render (Backend) · MongoDB Atlas (Database)

---

## 📂 Project Structure

```
BatmanTV/
├── frontend/          # React + Vite app
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── api/           # Axios calls
│
└── backend/           # Express app
    ├── controllers/
    ├── models/
    ├── routes/
    └── middlewares/
```

---

## 🚀 How to Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/sharma-mayankkk/BatmanTV.git
cd BatmanTV
```

**2. Setup Backend**
```bash
cd backend
npm install
npm run dev
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

**4. Add environment variables** (see below) in `.env` files for both `frontend` and `backend`.

---

## 🔑 Environment Variables

**Backend (`backend/.env`)**
```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_uri
CORS_ORIGIN=your_frontend_url

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (`frontend/.env`)**
```env
VITE_BACKEND_URL=your_backend_url
```

---

## ☁️ Deployment

| Layer     | Platform       |
|-----------|----------------|
| Frontend  | Vercel         |
| Backend   | Render         |
| Database  | MongoDB Atlas  |

The frontend communicates with the deployed Express backend via REST APIs, with CORS configured between them.
---

## 🔮 Future Improvements

- Video recommendations based on watch history
- Notifications system
- Video quality selection (adaptive streaming)
- Dark/Light theme toggle

---

## 👨‍💻 Author

**Mayank Sharma**
🔗 [GitHub](https://github.com/sharma-mayankkk)
