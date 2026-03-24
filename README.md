# Arnifi Job Portal

A full-stack job application portal with role-based access control, resume uploads, analytics, and real-time application tracking.

## Tech Stack

- **Frontend:** React 19, Vite, Redux Toolkit (RTK Query), Tailwind CSS v4, Recharts
- **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL
- **Auth:** JWT access/refresh tokens + bcrypt

## Getting Started

```bash
# Clone
git clone https://github.com/Suraj-B12/Arnifi.git
cd Arnifi

# Server
cd server
npm install
cp .env.example .env   # Set DATABASE_URL, JWT_SECRET
npx prisma migrate dev
npm run dev

# Client (new terminal)
cd client
npm install
npm run dev
```

Client: `http://localhost:5173` | Server: `http://localhost:5000`

### Seed Test Data

```bash
cd server
node seed-test-data.js
```

## Trial Accounts

All accounts use password: `password123`

| Role | Email | Notes |
|------|-------|-------|
| Admin | `testadmin@arnifi.com` | Can post jobs, manage applicants, view analytics |
| User | `testuser@gmail.com` | Can browse jobs, apply, upload resume, track applications |

> Any email ending in `@arnifi.com` is automatically assigned the Admin role on signup.

## Features

### Users
- Browse and search jobs with filters (type, location, keyword)
- Infinite scroll pagination
- Apply to jobs, track application status
- Withdraw pending applications
- Upload PDF resume (max 5 MB)
- View recruiter notes and competition stats

### Admins
- Post, edit, and delete job listings
- Review applicants, update status (Pending → Reviewed → Interview → Offer / Rejected)
- Add recruiter notes (visible to applicant) and internal admin notes
- Analytics dashboard with charts (applications over time, status breakdown, top jobs)

## Environment Variables

**Server (`server/.env`):**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS |

**Client (`client/.env`):**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:5000/api`) |

## Project Structure

```
client/src/
  app/          — Redux store, RTK Query base API with token refresh
  components/   — Navbar, Layout, Route Guards
  features/
    auth/       — Login, Signup, JWT slice
    jobs/       — Browse jobs, Job detail, infinite scroll
    applications/ — Applied jobs, withdraw, status tracking
    admin/      — Dashboard, Post Job, Applicants modal, Analytics
    profile/    — Profile editor, resume upload
    companies/  — Company pages

server/src/
  controllers/  — Auth, Jobs, Applications, Profile, Analytics, Companies
  middleware/   — JWT auth, admin guard, multer upload
  routes/       — API route definitions
  lib/          — Prisma client singleton
```
