# Arnifi Job Portal

A full-stack job application portal with role-based access control. Built with React, Express.js, PostgreSQL, and JWT authentication.

## Tech Stack

**Frontend:** React 19, Vite, React Router v7, Redux Toolkit (RTK Query), Tailwind CSS v4
**Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL
**Auth:** JWT (HS256) + bcrypt
**Deployment:** Render (frontend static site + backend web service) + Neon (database)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or a [Neon](https://neon.tech) free account)

### Setup

```bash
# Clone the repository
git clone https://github.com/Suraj-B12/Arnifi.git
cd Arnifi

# Install server dependencies
cd server
npm install
cp .env.example .env   # Fill in your DATABASE_URL and JWT_SECRET

# Run database migrations
npx prisma migrate dev

# Start the server
npm run dev

# In a new terminal — install client dependencies
cd ../client
npm install

# Start the client
npm run dev
```

The client runs at `http://localhost:5173` and the server at `http://localhost:5000`.

### Environment Variables

**Server (`server/.env`):**
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS |

**Client (`client/.env`):**
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register a new user |
| POST | `/api/auth/login` | — | Login and receive JWT |
| GET | `/api/jobs` | — | Get all job listings |
| POST | `/api/jobs` | Admin | Create a new job |
| PUT | `/api/jobs/:id` | Admin | Update a job |
| DELETE | `/api/jobs/:id` | Admin | Delete a job |
| POST | `/api/jobs/:id/apply` | User | Apply to a job |
| GET | `/api/applications` | User | Get user's applications |

## Roles

- **Admin:** Users with email ending in `@arnifi.com`
- **User:** All other registered users

## Project Structure

```
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── app/               # Redux store, RTK Query base API
│   │   ├── components/        # Navbar, Layout, Route Guards, ScrollReveal
│   │   ├── features/
│   │   │   ├── auth/          # Login, Signup, authSlice, authApi
│   │   │   ├── jobs/          # JobsPage, JobCard, jobsApi
│   │   │   ├── applications/  # AppliedJobsPage, applicationsApi
│   │   │   └── admin/         # Dashboard, PostJob, JobFormModal
│   │   ├── hooks/             # useScrollReveal
│   │   └── lib/               # cn utility
│   └── vercel.json            # SPA routing for Vercel
│
└── server/                    # Express backend
    ├── prisma/                # Schema + migrations
    └── src/
        ├── config/            # Environment variables
        ├── controllers/       # Auth, Jobs, Applications handlers
        ├── lib/               # Prisma client singleton
        ├── middleware/         # JWT auth, admin role guard
        └── routes/            # API route definitions
```

## Design System

| Token | Value |
|-------|-------|
| Primary | `#4F46E5` (Indigo 600) |
| CTA | `#F59E0B` (Amber 500) |
| Headings | Plus Jakarta Sans Variable |
| Body | Inter Variable |
| Background | `#F9FAFB` with dot grid pattern |
| Cards | White, rounded-2xl, subtle shadow on hover |

## Deployment (Render)

Both frontend and backend deploy from a single repo using `render.yaml` (Render Blueprint).

1. Push to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your GitHub repo — Render auto-detects `render.yaml`
4. Set environment variables:
   - `arnifi-api`: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL` (your frontend URL)
   - `arnifi-app`: `VITE_API_URL` (your backend URL + `/api`)
5. Deploy

## Deployed Links

- **Frontend:** _Coming soon_
- **Backend API:** _Coming soon_
