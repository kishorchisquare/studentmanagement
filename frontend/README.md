# Student Management Frontend

Next.js frontend for the Student Management system. This app provides:

- Login and registration flows
- JWT-based authenticated access to the dashboard
- Student listing and superadmin admin-creation UI
- Shared API layer so pages do not call backend endpoints directly

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

## Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm 9+
- Running backend API (Spring Boot) at `http://localhost:8080` by default

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

Create or update `frontend/.env`:

```env
NEXT_PUBLIC_API_BASE="http://localhost:8080"
```

3. Start development server:

```bash
npm run dev
```

4. Open:

- `http://localhost:3000`

## Available Scripts

- `npm run dev`: start local dev server
- `npm run build`: production build
- `npm run start`: run built app
- `npm run lint`: run Next.js lint (requires ESLint config to be initialized)

## Routing

- `/` redirects to `/login`
- `/login`: login form
- `/register`: user registration form
- `/dashboard`: authenticated dashboard

## API Layer (Centralized)

All backend API calls are centralized in:

- `frontend/lib/api.ts`

Pages should import functions from this module instead of using `fetch` directly.

### Exported Types

- `School`
- `Student`
- `AuthResponse`
- `RegisterPayload`
- `ApiError`

### Exported Functions

- `login(username, password)`
- `getStudents(token, tokenType?)`
- `getSchools()`
- `register(payload)`
- `registerAdmin(payload, token, tokenType?)`

### Error Handling

- Non-2xx responses throw `ApiError` with:
- `message`: backend message (if available)
- `status`: HTTP status code

Recommended page behavior:

- Show user-friendly error from `ApiError.message`
- For `401/403`, clear local auth storage and redirect to `/login`

## Auth Flow

On successful login (`/auth/login`), frontend stores:

- `localStorage["jwt"]`
- `localStorage["jwtType"]` (typically `Bearer`)
- `localStorage["userEmail"]`

Dashboard reads these values and uses them for authenticated requests.
Logout clears all three keys.

## Backend Endpoint Usage

The frontend currently depends on:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/register-admin`
- `GET /students` (authenticated)
- `GET /schools`

Base URL is controlled by `NEXT_PUBLIC_API_BASE`.

## Project Structure

```text
frontend/
  app/
    dashboard/page.tsx
    login/page.tsx
    register/page.tsx
    layout.tsx
    page.tsx
    globals.css
  lib/
    api.ts
  .env
  package.json
  tsconfig.json
```

## Development Notes

- Keep UI logic in page/components; keep network logic in `lib/api.ts`.
- Add new endpoint integrations by:
1. Creating a typed function in `lib/api.ts`
2. Reusing it in pages/components
3. Handling `ApiError` in UI

## Common Issues

- `npm run lint` asks ESLint setup questions:
  - Initialize ESLint once (through Next.js prompt) or add an ESLint config file.
- Login works but dashboard fails with 401:
  - Token expired/invalid. Re-login and ensure backend JWT secret/config matches.
- CORS errors in browser:
  - Verify backend CORS configuration allows `http://localhost:3000`.
- `Failed to load schools`:
  - Check backend is running and `NEXT_PUBLIC_API_BASE` is correct.

## Production Build

```bash
npm run build
npm run start
```

Set production API base before build/start:

```env
NEXT_PUBLIC_API_BASE="https://your-api-host"
```
