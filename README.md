# Arnifi Job Portal

A full-stack job application portal with role-based access control. Built with React, Express.js, PostgreSQL, and JWT authentication.

## Tech Stack

**Frontend:** React 19, Vite, React Router v7, Redux Toolkit (RTK Query), Tailwind CSS v4
**Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL
**Auth:** JWT (HS256) + bcrypt
**Deployment:** Vercel (frontend) + Render (backend) + Neon (database)

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

## Deployed Links

- **Frontend:** _Coming soon_
- **Backend:** _Coming soon_
