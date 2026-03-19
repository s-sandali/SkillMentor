# SkillMentor

A full-stack online mentoring platform that connects students with industry experts for one-on-one sessions. Students can browse mentors, book sessions, and track their learning — while admins manage everything from a dedicated dashboard.

---

## Live Links

| Service | URL |
|---|---|
| Frontend | [https://skillmentor-frontend-sepia.vercel.app](https://skillmentor-frontend-sepia.vercel.app) |
| Backend API | [https://skill-mentor-backend-service-am5v.onrender.com](https://skill-mentor-backend-service-am5v.onrender.com) |
| API Docs (Swagger) | [https://skill-mentor-backend-service-am5v.onrender.com/swagger-ui/index.html](https://skill-mentor-backend-service-am5v.onrender.com/swagger-ui/index.html) |

> **Heads up:** The backend is hosted on Render's free tier, so the first request after inactivity may take 30–60 seconds to wake up.

---

## What It Does

SkillMentor is built around two core experiences:

**For students** — browse a catalogue of mentors, view their profiles and subject offerings, book a one-on-one session, upload a bank transfer slip as payment proof, and track session status from a personal dashboard.

**For admins** — manage the entire platform without touching Postman. Create mentors and subjects, view all bookings in a filterable table, confirm payments, mark sessions complete, and attach meeting links — all from a protected admin panel.

---

## Features

### Student-facing
- Browse all available mentors with their subjects and expertise
- View detailed mentor profiles (bio, experience, certifications, enrolled students)
- Book sessions by selecting a subject, date, and time
- Upload bank transfer slip to confirm payment
- Personal dashboard showing all enrolled sessions with live status updates
- Protected against double-booking (same mentor/subject + overlapping time slots)
- Past dates are blocked at both frontend and backend levels

### Admin Panel (`/admin`)
- Role-based access via Clerk public metadata — non-admins are redirected automatically
- Sidebar navigation across all admin sections
- **Mentor management** — create mentor profiles with a live card preview before submitting
- **Subject management** — create subjects and assign them to mentors via dropdown
- **Booking management** — paginated, searchable, filterable table of all sessions across the platform
  - Confirm pending payments
  - Mark sessions as completed
  - Attach a meeting link via dialog
- Platform overview with total counts and recent activity feed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| Authentication | Clerk |
| Backend | Spring Boot 4, Java 17 |
| Database | PostgreSQL (hosted on Supabase) |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + Clerk JWKS JWT validation |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
skillmentor-platform/
├── skillmentor-frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/            # Shared UI components
│   │   ├── layouts/               # AdminLayout with sidebar
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── Bookings/      # ManageBookingsPage
│   │   │   │   ├── Mentors/       # CreateMentorPage, ManageMentorsPage
│   │   │   │   ├── Subjects/      # CreateSubjectPage, ManageSubjectsPage
│   │   │   │   └── AdminDashboardOverview.tsx
│   │   │   ├── DashboardPage.tsx  # Student session dashboard
│   │   │   ├── HomePage.tsx       # Mentor discovery / browse
│   │   │   ├── LoginPage.tsx
│   │   │   └── PaymentPage.tsx    # Bank slip upload + enrollment
│   │   ├── lib/
│   │   │   └── api.ts             # All API calls
│   │   ├── types.ts               # Shared TypeScript types
│   │   └── App.tsx                # Route definitions
│   ├── vercel.json
│   └── vite.config.ts
│
└── skill-mentor-backend-service/  # Spring Boot application
    └── src/main/java/com/stemlink/skillmentor/
        ├── configs/               # CORS, Redis, Security config
        ├── controllers/           # REST controllers
        │   ├── AdminDashboardController.java
        │   ├── AdminMentorController.java
        │   ├── AdminSessionController.java
        │   ├── AdminSubjectController.java
        │   ├── MentorController.java
        │   ├── SessionController.java
        │   └── SubjectController.java
        ├── dto/                   # Request/response DTOs
        ├── entities/              # JPA entities
        ├── repositories/          # Spring Data repositories
        ├── security/              # JWT filter, UserPrincipal, Clerk JWKS
        └── services/              # Business logic
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Java 17+
- Maven 3.9+
- A PostgreSQL database (local or Supabase)
- A [Clerk](https://clerk.com) account

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd skillmentor-platform
```

### 2. Backend setup

```bash
cd skill-mentor-backend-service
```

Create an `application-local.properties` file (or set environment variables) with the values below, then run:

```bash
./mvnw spring-boot:run
```

The API will start on `http://localhost:8081`.

### 3. Frontend setup

```bash
cd skillmentor-frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:3001`.

---

## Environment Variables

### Frontend (`skillmentor-frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:8081
```

### Backend

These can be set as environment variables on your host, or in a local properties file.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full JDBC connection string, e.g. `jdbc:postgresql://...` |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `CLERK_JWKS_URL` | Your Clerk JWKS endpoint, e.g. `https://<your-clerk-domain>/.well-known/jwks.json` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed origins, e.g. `https://yourapp.vercel.app` |
| `PORT` | Server port (defaults to `8081` if not set — Render injects this automatically) |

---

## API Reference

All endpoints are prefixed with `/api/v1`. The full interactive documentation is available at `/swagger-ui/index.html` on the deployed backend.

### Public endpoints (no auth required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/mentors` | List all mentors with their subjects |
| `GET` | `/api/v1/mentors/{id}` | Get a single mentor's full profile |

### Student endpoints (requires valid Clerk JWT with `STUDENT` role)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/sessions/enroll` | Book a session with a mentor |
| `GET` | `/api/v1/sessions/my-sessions` | Get all sessions for the logged-in student |

### Admin endpoints (requires `ADMIN` role in Clerk public metadata)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Platform stats + recent activity |
| `POST` | `/api/v1/admin/mentors` | Create a new mentor profile |
| `POST` | `/api/v1/admin/subjects` | Create a new subject |
| `GET` | `/api/v1/admin/sessions` | Paginated list of all bookings (supports `search`, `paymentStatus`, `sessionStatus` query params) |
| `PATCH` | `/api/v1/admin/sessions/{id}/confirm-payment` | Approve a pending payment |
| `PATCH` | `/api/v1/admin/sessions/{id}/complete` | Mark a session as completed |
| `PATCH` | `/api/v1/admin/sessions/{id}/meeting-link` | Attach a meeting link to a session |

### Enrollment request body (`POST /api/v1/sessions/enroll`)

```json
{
  "mentorId": "clerk_user_id_of_mentor",
  "subjectId": 1,
  "sessionDateTime": "2025-04-15T10:00:00",
  "durationMinutes": 60
}
```

The backend validates that: the date is not in the past, there are no overlapping sessions for the same mentor, and the student hasn't already booked the same subject in the same time window.

---

## Authentication & Roles

This project uses [Clerk](https://clerk.com) for authentication. JWTs are issued using a custom Clerk JWT template named `skillmentor-auth`, which the backend validates against the Clerk JWKS endpoint.

Roles are stored in Clerk's **public metadata** on the user object:

```json
// Admin user
{
  "role": "admin"
}
```

Users without this metadata are treated as students. The `AdminLayout` component checks for this metadata on the frontend and redirects anyone without the admin role to `/dashboard`. The backend enforces the same check via Spring Security's `@PreAuthorize("hasRole('ADMIN')")`.

To make a user an admin, go to the Clerk dashboard → Users → select the user → Edit public metadata → add `{ "role": "admin" }`.

---

## Deployment Notes

### Frontend (Vercel)

The `vercel.json` at the root of the frontend folder rewrites all routes to `index.html`, which is required for client-side routing to work correctly on refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend (Render)

The backend is containerised with Docker. Render injects a `PORT` environment variable at runtime, and the application is configured to pick this up automatically. The `Dockerfile` uses a single-stage Maven build.

### Database (Supabase)

Hibernate is set to `ddl-auto=update`, so tables are created/updated automatically on startup. Seed at least 3 mentors and 5 subjects via the admin panel or directly in the database before demoing.

---

## Known Limitations

- Payment is simulated — the bank slip image is uploaded but not stored persistently (no object storage integration). The enrollment is confirmed regardless of slip content.
- Redis caching is configured but currently disabled in production to keep infrastructure simple.
- The mentor profile page (`/mentors/:mentorId`) is built for the public browse flow; reviews are visible but the "Write Review" button is only shown for completed sessions in the student dashboard.