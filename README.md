# iMedia Finder – Full Stack Application

## Overview
A full-stack web application that allows users to search iTunes media content and manage personalised favourites.

Built using React, Express, MongoDB, and JWT authentication.

Users can:
- Register and log in
- Search the iTunes API for media content
- Save and manage favourites linked to their account

This project demonstrates full-stack integration, external API consumption, secure authentication, and client-side state management.

---

## Features

- User registration and login (JWT-based authentication)
- Protected API routes
- Search iTunes media by term and media type
- Incremental “Load more” results (pagination)
- Add and remove favourites
- Delete all favourites with confirmation
- Sort search results (title, artist, release date)
- Responsive UI using Bootstrap
- Form validation with Formik and Yup
- Password strength feedback and suggestion

---

## Live Demo

**Frontend (Vercel):**  
https://itunes-fullstack-app.vercel.app  

**Backend API (Render):**  
https://itunes-fullstack-app.onrender.com  

---

## Screenshots

### Home – Search & Results
Search for media content and manage favourites with sorting and pagination.

![Home](./screenshots/home.png)

![Search](./screenshots/search.png)

![Favourites](./screenshots/favourites.png)

### Login – Authentication
Secure login with JWT-based authentication.

![Login](./screenshots/login.png)

### Register – Account Creation
Create an account with real-time password strength feedback.

![Register](./screenshots/register.png)

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Bootstrap
- Formik and Yup

### Backend
- Node.js with Express
- MongoDB Atlas with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Axios (for external API requests)

---

## Project Structure

```
itunes-fullstack-app/
├── frontend/   # React client (UI + API integration)
└── backend/    # Express API (authentication, search, favourites)
```

## Environment Variables

### Frontend

For local development:

```
VITE_API_URL=http://localhost:5001/api
```

For production (Vercel):
```
VITE_API_URL=https://itunes-fullstack-app.onrender.com/api
```
Backend:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Note:

- The backend connects to MongoDB Atlas.
- Local and deployed environments use the same database.

---

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

## Future Improvements

- Add user profile page
- Add persistent search history
- Improve accessibility (ARIA + keyboard nav)
- Add unit tests (Jest / React Testing Library)