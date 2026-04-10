# iTunes Search & Favourites App

## Overview

A full-stack web application built with React, Express, MongoDB, and JWT authentication. Users can register, log in, search the iTunes API for media content, and save favourites linked to their account.

## Features

- User registration and login
- JWT-protected routes
- Search iTunes media by term and media type
- Incremental “Load more” search results (pagination)
- Save and remove favourites
- Delete all favourites with confirmation
- Sort search results (title, artist, release date)
- Responsive UI built with Bootstrap
- Form validation using Formik and Yup
- Password strength feedback on registration

## Live Demo

Frontend: https://itunes-fullstack-app.vercel.app  
Backend: https://itunes-fullstack-app.onrender.com

## Tech Stack

### Frontend
- React + Vite
- React Router
- Axios
- Bootstrap
- Formik + Yup

### Backend
- Express.js
- MongoDB Atlas + Mongoose
- JWT + bcryptjs
- Axios

## Project Structure

```
itunes-fullstack-app/
├── frontend/   # React application
└── backend/    # Express API
    ├── models/
    ├── controllers/
    └── routes/
```

## Environment Variables

```env
Frontend (Vercel):
- VITE_API_URL = https://itunes-fullstack-app.onrender.com/api

Backend (Render):
- MONGO_URI
- JWT_SECRET
```

## Installation

**Backend:**

```bash
cd backend
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Register a new account
2. Log in
3. Search for media from the iTunes API
4. Load additional results as needed
5. Add items to favourites
6. View, sort, and remove favourites

## Notes

- Favourites are stored per user in MongoDB
- Search results are fetched live from the iTunes API
- All protected routes require a valid JWT token
