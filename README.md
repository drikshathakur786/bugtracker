# Bug Tracker

A full-stack bug and task management platform designed for software teams. Built from scratch with **Spring Boot** and **React**, it provides a complete workflow for tracking bugs — from creation and assignment to resolution — with role-based access, a drag-and-drop Kanban board, and real-time analytics.

**[Live Demo →](https://drikshathakur-bugtracker.vercel.app)**

> **Note:** The backend is hosted on a free tier and may take ~30 seconds to wake up on the first request. Subsequent requests are fast.

---

## Why This Exists

Most bug trackers are either bloated enterprise tools or oversimplified todo lists. This project sits in the middle — a clean, focused tool that covers the real needs of a small dev team: authentication, role management, bug lifecycle tracking, and visual analytics — all without the overhead.

---

## Features

**Authentication & Access Control**
- JWT-based authentication with secure token management
- Role-based authorization — Admin, Developer, and Tester each see and do different things
- Protected routes on both frontend and backend

**Project & Bug Management**
- Create projects and invite team members
- Full bug lifecycle — create, assign, update status, resolve, close
- Inline editing on bug detail pages
- Comment threads on every bug for team discussion

**Kanban Board**
- Drag-and-drop interface with four status columns: Open, In Progress, In Review, Closed
- Visual at-a-glance view of where every bug stands

**Analytics Dashboard**
- Severity distribution (pie chart)
- Status breakdown (bar chart)
- Per-assignee workload analysis

**Audit Trail**
- Every status change is automatically logged with timestamps
- Full history of who changed what, and when

---

## Tech Stack

| Layer        | Technology                                                  |
|--------------|-------------------------------------------------------------|
| **Backend**  | Java 17, Spring Boot 3, Spring Security, Hibernate (JPA)   |
| **Frontend** | React 18, Vite, Recharts, @hello-pangea/dnd                |
| **Database** | PostgreSQL (hosted on Neon)                                 |
| **Auth**     | JWT (jjwt library), BCrypt password hashing                 |
| **Deploy**   | Vercel (frontend), Render (backend), Neon (database)        |

---

## Architecture

```
┌──────────────┐       HTTPS        ┌──────────────────┐       JDBC       ┌────────────┐
│   React SPA  │  ←─────────────→   │  Spring Boot API │  ←────────────→  │ PostgreSQL │
│   (Vercel)   │    JWT in header    │    (Render)      │                  │   (Neon)   │
└──────────────┘                     └──────────────────┘                  └────────────┘
```

**Backend structure:**
```
backend/src/main/java/com/drikshathakur/bugtracker/
├── config/          # Security, CORS configuration
├── controller/      # REST endpoints (Auth, Bug, Project, Analytics)
├── dto/             # Request/response data transfer objects
├── entity/          # JPA entities (User, Bug, Project, Comment, AuditLog)
├── exception/       # Custom exception handling
├── repository/      # Spring Data JPA repositories
├── security/        # JWT filter, token utilities
└── service/         # Business logic layer
```

---

## Running Locally

**Prerequisites:** Java 17+, Maven, Node.js 18+, PostgreSQL

**Backend**
```bash
cd backend
mvn spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and expects the backend at `http://localhost:8080/api`.

---

## API Endpoints

| Method   | Endpoint                          | Description               | Auth     |
|----------|-----------------------------------|---------------------------|----------|
| `POST`   | `/api/auth/register`              | Register a new user       | Public   |
| `POST`   | `/api/auth/login`                 | Login and receive JWT     | Public   |
| `GET`    | `/api/auth/me`                    | Get current user profile  | Required |
| `GET`    | `/api/projects`                   | List user's projects      | Required |
| `POST`   | `/api/projects`                   | Create a new project      | Required |
| `GET`    | `/api/projects/{id}/bugs`         | List bugs in a project    | Required |
| `POST`   | `/api/projects/{id}/bugs`         | Create a bug              | Required |
| `PATCH`  | `/api/bugs/{id}`                  | Update bug details        | Required |
| `PATCH`  | `/api/bugs/{id}/status`           | Change bug status         | Required |
| `GET`    | `/api/analytics/project/{id}`     | Get project analytics     | Required |

---

## License

MIT
