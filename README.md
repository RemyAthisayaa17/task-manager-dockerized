# Task Manager (Dockerized)

Role-based task management app (React, TypeScript, Express, PostgreSQL) packaged to run with Docker Compose: PostgreSQL, backend, frontend and an Nginx reverse proxy start with a single command.

The same application without Docker is in [task-manager](https://github.com/RemyAthisayaa17/task-manager).

---

## Problem

Setting up a full-stack app locally means installing the right Node and PostgreSQL versions, wiring ports and environment variables, and repeating that on every machine. "Works on my machine" setups slow down onboarding and testing.

## Solution

Each part of the system runs in its own container, and Docker Compose connects them. Nginx sits in front as a reverse proxy, so the whole app is reachable on one address while the frontend and API stay separate services.

---

## Architecture

```
Browser ──► Nginx (:80)
              ├── /      ──► frontend  (Vite, :5173)
              └── /api/  ──► backend   (Express, :3000) ──► PostgreSQL 16 (:5432)
```

| Service | Image / build | Port |
|---|---|---|
| `postgres` | `postgres:16` with a named volume for data | 5432 |
| `backend` | `node:20`, Prisma client generated at build time | 3000 |
| `frontend` | `node:20`, Vite dev server | 5173 |
| `nginx` | `nginx:alpine` with a custom `nginx.conf` | 80 |

---

## What the App Does

- JWT authentication with registration and login
- Role-based access control (`admin` and `user`) enforced in backend middleware
- Task create, read, update and delete with ownership checks; completed tasks cannot be edited
- Users see their own tasks, admins see all tasks and manage users
- Dashboard with task counts, title search, status filter and pagination
- Request validation with Zod (backend) and Yup with React Hook Form (frontend)
- Soft deletes and audit fields on every record

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios  
**Backend:** Node.js, Express, TypeScript  
**Database:** PostgreSQL 16, Prisma ORM  
**Auth and validation:** JWT, bcrypt, Zod, Yup  
**Infrastructure:** Docker, Docker Compose, Nginx

---

## Setup

Requires Docker and Docker Compose.

```bash
# Clone
git clone https://github.com/RemyAthisayaa17/task-manager-dockerized.git
cd task-manager-dockerized
```

Create `backend/.env`. The database host is the Compose service name `postgres`, and the credentials match `docker-compose.yml`:

```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/task_manager
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
PORT=3000
```

```bash
# Build and start everything
docker compose up --build

# In a second terminal: apply migrations and create the admin account
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run seed
```

Open `http://localhost`. The seed script creates the admin account defined in `backend/prisma/seed.ts`.

Stop the stack with `docker compose down`. Add `-v` to also delete the database volume.

The database credentials in `docker-compose.yml` are for local development only. Change them, and the seeded admin password, before using this anywhere else.

---

## API

All routes are under `/api` and proxied by Nginx.

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET, POST | `/api/tasks` | User |
| GET, PUT, DELETE | `/api/tasks/:id` | Owner or admin |
| GET | `/api/admin/users`, `/api/admin/users/:id` | Admin |
| DELETE | `/api/admin/users/:id` | Admin |

---

## Project Structure

```
task-manager-dockerized/
├── docker-compose.yml          # postgres, backend, frontend, nginx
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf              # routes / to frontend and /api/ to backend
├── backend/
│   ├── Dockerfile
│   ├── prisma/                 # schema, migrations, seed
│   └── src/                    # routes, controllers, services, middleware
└── frontend/
    ├── Dockerfile
    └── src/                    # pages, components, hooks, API client
```

---

## Known Limitations

- Both application containers run their development servers (`tsx watch` and `vite --host`). A production setup would use a compiled backend and a static frontend build served by Nginx.
- Migrations and seeding are run manually after the first start.
- The frontend calls the API through the relative path `/api`, so it depends on the Nginx proxy being in front of it.

---

## Future Improvements

- Multi-stage Docker builds with a production frontend build
- A `.env.example` file and a health check on the database service
- A CI workflow that builds the images on every push
