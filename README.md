# Doable — AI-Augmented Task Management Platform

Doable is a full-stack task management platform that blends structured productivity tools with AI-assisted workflows. It features a **Daily Focus Assistant**, **Smart Deadline Risk Detection**, and automatic **Task Breakdown** powered by the Gemini API, alongside role-based access control at both the workspace and system-admin level.

---

## ✨ Features

### 🤖 AI-Powered Productivity
- **Daily Focus Briefing** — Gemini analyzes your due/overdue tasks and generates a prioritized daily plan with a motivational opener.
- **Smart Risk Detection** — Classifies all active tasks into `high_risk`, `medium_risk`, and `on_track` buckets based on deadline proximity, priority, and workload.
- **Auto Task Breakdown** — Paste a task title + description; Gemini returns 4–6 concrete, actionable subtasks with priorities.
- **AI Chat** — Built-in conversational assistant for productivity guidance.

### ✅ Task Management
- Create, update, soft-delete, and restore tasks
- Set priority (`low` / `medium` / `high`) and due dates
- Assign tasks to workspace members
- Subtask management (create, update status, delete)
- Task comments with real-time updates
- Trash / restore workflow with hard-delete option
- Filter and paginate tasks by status

### 🏢 Workspaces
- Create multiple workspaces with a name, description, and logo
- Invite members via tokenized invite links (`/join/[token]`)
- Role-based access: **Owner**, **Admin**, **Member**
- Transfer workspace ownership
- Remove members or leave a workspace
- Soft-delete and restore workspaces (admin)

### 🔔 Real-Time Notifications
- Socket.IO-powered live notifications
- Notification inbox with read/unread state
- Configurable notification preferences

### 🔐 Authentication & Security
- JWT access tokens + refresh tokens stored in **HttpOnly cookies**
- Bcrypt password hashing
- Forgot password / reset password via email (Nodemailer + EmailJS)
- Rate limiting on sensitive endpoints (`express-rate-limit`)
- Input validation (`express-validator`)
- Helmet for HTTP security headers
- CORS whitelist

### 👤 User & Admin
- Profile management with Cloudinary avatar upload
- Personal dashboard with productivity stats (Recharts)
- System-admin panel: view all users and all tasks across the platform
- Feedback submission system

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework, routing, SSR |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui + Radix UI** | Component library |
| **Zustand** | Global auth state |
| **TanStack React Query** | Server state, caching, mutations |
| **Axios** | HTTP client |
| **Socket.IO Client** | Real-time notifications |
| **@dnd-kit** | Drag-and-drop task ordering |
| **Recharts** | Dashboard analytics charts |
| **react-markdown** | Render AI-generated markdown |
| **Formik + Yup / Zod** | Form validation |
| **next-themes** | Dark/light mode |
| **Sonner** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | HTTP server |
| **TypeScript** | Type safety |
| **PostgreSQL (Neon)** | Primary database |
| **Socket.IO** | Real-time WebSocket events |
| **Gemini API** (`gemini-3.5-flash-lite`) | AI features |
| **JWT** | Access & refresh token auth |
| **bcrypt** | Password hashing |
| **Cloudinary** | Image (avatar/logo) storage |
| **Multer** | Multipart file uploads |
| **Nodemailer + EmailJS** | Transactional email |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | Rate limiting |
| **express-validator** | Input validation |

---

## 📁 Project Structure

```
doable/
├── frontend/                   # Next.js App Router frontend
│   ├── app/
│   │   ├── (admin)/            # Admin-only panel
│   │   ├── (auth)/             # Login, register, forgot/reset password
│   │   ├── (protected)/        # Authenticated user routes
│   │   │   ├── dashboard/      # Personal dashboard + AI insights
│   │   │   ├── tasks/          # Task list & management
│   │   │   ├── workspace/      # Workspace view & members
│   │   │   ├── inbox/          # Notification inbox
│   │   │   ├── trash/          # Deleted tasks
│   │   │   └── settings/       # Profile & notification settings
│   │   └── join/[token]/       # Workspace invite acceptance
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # React Query hooks (auth, tasks, workspace…)
│   ├── context/                # Zustand auth store
│   ├── types/                  # TypeScript type definitions
│   ├── schemas/                # Zod/Yup validation schemas
│   └── lib/                    # Axios instance, utilities
│
└── backend/                    # Express + TypeScript API
    └── src/
        ├── controllers/        # Route handlers
        ├── models/             # PostgreSQL query functions
        ├── routes/             # Express routers (REST API)
        ├── middleware/         # Auth, authorization, rate-limit, validator
        ├── services/           # AI service (Gemini), chat service
        ├── utils/              # Notify user, error handler, email, image upload
        ├── config/             # Cloudinary, Multer setup
        ├── socket.ts           # Socket.IO initialization & events
        ├── db.ts               # PostgreSQL connection pool
        └── server.ts           # App entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL database (or a [Neon](https://neon.tech) serverless instance)
- Cloudinary account
- Google Gemini API key
- An email account for Nodemailer (or EmailJS credentials)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd doable
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
GEMINI_AI=<your-gemini-api-key>
JWT_SECRET=<long-random-secret>
JWT_REFRESH_SECRET=<another-long-random-secret>
EMAIL=<your-email>
PASSWORD=<email-app-password>
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
EMAILJS_PUBLIC_KEY=<emailjs-public-key>
EMAILJS_PRIVATE_KEY=<emailjs-private-key>
EMAILJS_SERVICE_ID=<emailjs-service-id>
EMAILJS_TEMPLATE_ID=<emailjs-template-id>
EMAILJS_FEEDBACK_TEMPLATE_ID=<emailjs-feedback-template-id>
CRON_SECRET=<cron-secret>
```

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

The API runs on **port 8000** by default (`/api/v1/...`).

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
```

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

The frontend runs on **port 3000** by default.

---

## 🌐 API Overview

All routes are prefixed with `/api/v1`.

| Module | Base Path | Description |
|---|---|---|
| Health | `GET /` | Server health check |
| Auth | `/auth` | Register, login, logout, refresh, forgot/reset password |
| Users | `/users` | Profile, settings, avatar upload |
| Tasks | `/tasks` | CRUD, subtasks, AI features, trash |
| Task Comments | `/tasks/:id/comments` | Add, edit, delete task comments |
| Workspaces | `/workspaces` | CRUD, members, invite links |
| Dashboard | `/dashboard` | Personal stats and AI daily focus |
| Notifications | `/notifications` | List, mark read, preferences |
| Feedback | `/feedback` | Submit user feedback |
| Chat | `/chat` | AI chat assistant |

---

## 🔄 Real-Time Events (Socket.IO)

The backend initializes a Socket.IO server on the same HTTP port. Events include:

- **Task assigned** — notify the assignee in real time
- **Task status changed** — update all task participants
- **New comment** — push comment notifications to task members
- **Workspace invite accepted** — notify workspace owner
- **Generic notifications** — routed per user via `notifyUser`

---

## 🚢 Deployment

| Layer | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | Any Node.js host (Railway, Render, Fly.io…) |
| Database | [Neon](https://neon.tech) (serverless PostgreSQL) |
| Images | [Cloudinary](https://cloudinary.com) |

> [!IMPORTANT]
> Set `FRONTEND_URL` on the backend to your deployed frontend domain so CORS and cookie settings work correctly in production.

---

## 📄 License

ISC
