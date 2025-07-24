# Course Management Platform Backend Service

## Overview
A multi-feature backend system for academic institutions to support faculty operations, monitor student progress, and enhance academic coordination. Built with Node.js, Express, MySQL, Sequelize, Redis, JWT, and i18n.

---

## Features
- **Course Allocation System**: Managers assign facilitators to courses, CRUD for course offerings.
- **Facilitator Activity Tracker (FAT)**: Facilitators log weekly activities, managers monitor and receive notifications.
- **Student Reflection Page**: Simple multilingual HTML/JS page (see `reflection-page/`).
- **Role-based Access**: Manager, Facilitator, Student.
- **Authentication**: JWT-based, secure password hashing.
- **Redis Notifications**: Reminders and alerts via Bull queue.
- **API Documentation**: Swagger UI at `/api-docs`.
- **Unit Testing**: Jest for models and utilities.

---

## Setup & Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your MySQL/Redis details (see `.env` in project root).
4. **Set up MySQL and Redis**
   - MySQL: Create a database and user as described above.
   - Redis: Install and run locally (or use Memurai on Windows).
5. **Seed the database**
   ```bash
   node src/seed.js
   ```
6. **Start the server**
   ```bash
   npm start
   ```
7. **Start the notification worker** (in a separate terminal)
   ```bash
   npm run worker
   ```

---

## API Documentation
- Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for live Swagger UI.
- All endpoints are documented and testable from the browser.

---

## Database Schema Overview
- **User**: id, name, email, password, role
- **Module**: id, code, name
- **Cohort**: id, name
- **Class**: id, name
- **Mode**: id, type
- **CourseOffering**: id, ModuleId, CohortId, ClassId, ModeId, facilitatorId, intakePeriod, trimester
- **ActivityTracker**: id, week, attendance, grading statuses, courseModeration, intranetSync, gradeBookStatus, CourseOfferingId, facilitatorId

---

## Authentication Flow
- Register/login via `/api/auth/register` and `/api/auth/login`
- Use JWT token in `Authorization: Bearer <token>` header for all protected endpoints
- Role-based access enforced via middleware

---

## Example Requests
- **Register**:
  ```json
  POST /api/auth/register
  {
    "name": "Alice Manager",
    "email": "alice.manager@example.com",
    "password": "password123",
    "role": "manager"
  }
  ```
- **Login**:
  ```json
  POST /api/auth/login
  {
    "email": "alice.manager@example.com",
    "password": "password123"
  }
  ```
- **Create Course Offering**:
  ```json
  POST /api/course-offerings
  {
    "ModuleId": 1,
    "CohortId": 1,
    "ClassId": 1,
    "ModeId": 1,
    "facilitatorId": 2,
    "intakePeriod": "HT1",
    "trimester": "2024S"
  }
  ```

---

## Testing
- Run all tests:
  ```bash
  npm test
  ```
- Tests cover models and utility functions.

---

## Student Reflection Page (Module 3)
- See the `reflection-page/` folder.
- Open `index.html` in your browser or host on GitHub Pages.
- Supports English and French with a language switcher.

---

## Deployment
- Host the backend on any Node.js-compatible server.
- Host the reflection page on GitHub Pages (see instructions above).

---

## Assumptions & Limitations
- Email notifications are simulated via console logs (can be extended to real email/SMS).
- No file upload implemented (can be added if required).
- For production, set `sequelize.sync({ alter: false })` and use migrations.

---

## Authors & License
- Developed by [Your Name].
- License: ISC 