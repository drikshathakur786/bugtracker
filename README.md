# Bug Tracker

A full-stack bug and task management platform built for software teams who want clarity, not clutter. From filing a bug to closing it — every step is tracked, visualized, and accessible based on your role.

Built from the ground up with **Spring Boot** and **React**. No templates, no boilerplate generators.

🔗 https://drikshathakur-bugtracker.vercel.app

> The backend runs on a free-tier server and may take ~30s to wake up on the first request. After that, it's snappy.

---

## The Problem

Bug tracking shouldn't require a 200-page manual. Most tools are either overengineered enterprise suites or glorified sticky notes. This project is the sweet spot — powerful enough for a real team, simple enough to use on day one.

---

## What It Does

**Authentication & Roles**  
Every user signs up with a role — Admin, Developer, or Tester. Each role has different permissions. Admins manage projects and people. Developers handle assignments. Testers report and verify. JWT handles all session management with no cookies and no server-side state.

**Projects & Bugs**  
Create a project, invite members, and start logging bugs. Each bug carries a severity level, an assignee, a status, and a full comment thread. Inline editing means you fix details without navigating away.

**Kanban Board** 🗂️  
Four columns — Open, In Progress, In Review, Closed. Drag a bug card from one column to another and the status updates instantly. It's the fastest way to see where everything stands at a glance.

**Analytics Dashboard** 📊  
Pie charts for severity distribution. Bar charts for status breakdown. Per-assignee workload metrics. All powered by live data from the database — not mock numbers.

**Audit Trail**  
Every status change is logged automatically — who changed it, what it was before, and when. No manual effort required.

---

## Tech Stack

| Layer        | Technology                                                  |
|--------------|-------------------------------------------------------------|
| **Backend**  | Java 17, Spring Boot 3, Spring Security, Hibernate (JPA)   |
| **Frontend** | React 18, Vite, Recharts, @hello-pangea/dnd                |
| **Database** | PostgreSQL (Neon)                                           |
| **Auth**     | JWT with BCrypt password hashing                            |
| **Hosting**  | Vercel (frontend) · Render (backend) · Neon (database)     |

---

## How It's Built

```
┌──────────────┐       HTTPS        ┌──────────────────┐       JDBC       ┌────────────┐
│   React SPA  │  ←─────────────→   │  Spring Boot API │  ←────────────→  │ PostgreSQL │
│   (Vercel)   │    JWT in header    │    (Render)      │                  │   (Neon)   │
└──────────────┘                     └──────────────────┘                  └────────────┘
```

The frontend is a single-page React app that communicates with a stateless REST API. Authentication is handled entirely through JWT tokens passed in the `Authorization` header. The backend validates every request through a custom security filter chain before it reaches any controller.

**Backend structure:**
```
com.drikshathakur.bugtracker/
├── config/          # Security, CORS
├── controller/      # REST endpoints — Auth, Bug, Project, Analytics
├── dto/             # Request/response objects
├── entity/          # JPA entities — User, Bug, Project, Comment, AuditLog
├── exception/       # Global exception handling
├── repository/      # Spring Data JPA repositories
├── security/        # JWT filter, token generation & validation
└── service/         # Core business logic
```

---

## API Overview

| Method   | Endpoint                          | Description               | Auth     |
|----------|-----------------------------------|---------------------------|----------|
| `POST`   | `/api/auth/register`              | Create a new account      | Public   |
| `POST`   | `/api/auth/login`                 | Login, receive JWT        | Public   |
| `GET`    | `/api/auth/me`                    | Current user profile      | Required |
| `GET`    | `/api/projects`                   | List your projects        | Required |
| `POST`   | `/api/projects`                   | Create a project          | Required |
| `GET`    | `/api/projects/{id}/bugs`         | Bugs in a project         | Required |
| `POST`   | `/api/projects/{id}/bugs`         | File a new bug            | Required |
| `PATCH`  | `/api/bugs/{id}`                  | Update bug details        | Required |
| `PATCH`  | `/api/bugs/{id}/status`           | Change bug status         | Required |
| `GET`    | `/api/analytics/project/{id}`     | Project analytics         | Required |

---

## Run Locally

**Prerequisites:** Java 17+, Maven, Node.js 18+, PostgreSQL

```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` · Backend at `http://localhost:8080/api`

---

## License

This project is licensed under the [MIT License](LICENSE).
