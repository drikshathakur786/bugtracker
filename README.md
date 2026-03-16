# 🐛 Bug Tracker

A production-grade Bug & Task Tracker for software teams — built from scratch with Spring Boot and React.

## 🌐 Live Demo
**[drikshathakur-bugtracker.vercel.app](https://drikshathakur-bugtracker.vercel.app)**

## ✨ Features
- JWT authentication with role-based access (Admin, Developer, Tester)
- Drag-and-drop Kanban board with 4 status columns
- Full bug lifecycle — create, assign, track, close
- Inline editing on bug detail page
- Comment threads on every bug
- Automatic audit trail — every status change is logged
- Analytics dashboard — severity pie chart, status bars, assignee breakdown

## 🛠 Tech Stack
**Backend:** Java 17, Spring Boot 3, Spring Security, PostgreSQL, Hibernate  
**Frontend:** React 18, Vite, Recharts, @hello-pangea/dnd  
**Deployment:** Railway (backend + DB), Vercel (frontend)

## 🚀 Running Locally

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
