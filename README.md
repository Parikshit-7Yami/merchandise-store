# Campus Threads Co.

Campus merchandise store for Medicaps University. The project is split into **Frontend** and **Backend** folders.

## Structure

- **Frontend/** – React + Vite + TypeScript app. Run with `npm run dev` (from root or from Frontend).
- **Backend/** – Node.js + Express + MongoDB API. Run with `npm run server` (from root) or `npm run start` (from Backend). Serves `/api/products` and `/api/students`; sends email notifications when admin adds a new product.

## Setup

1. **Install dependencies** (from project root):
   ```bash
   npm run install:all
   ```
   Or install in each folder:
   ```bash
   npm install --prefix Frontend
   npm install --prefix Backend
   ```

2. **Backend env** – Copy `Backend/.env.example` to `Backend/.env` and set `MONGODB_URI` (and optionally SMTP). See **MONGODB_SETUP.md** for MongoDB Atlas and email setup.

## Run

From the **project root**:

- **Frontend (dev):** `npm run dev` → http://localhost:8080 (proxies `/api` to Backend)
- **Backend:** `npm run server` → http://localhost:3001

Run both in separate terminals for full app.

## Scripts (root)

| Script          | Description                    |
|-----------------|--------------------------------|
| `npm run dev`   | Start Frontend dev server      |
| `npm run server`| Start Backend API              |
| `npm run build` | Build Frontend for production  |
| `npm run preview` | Preview Frontend build      |
| `npm run lint`  | Lint Frontend                  |
| `npm run test`  | Run Frontend tests             |
| `npm run install:all` | Install deps in root, Frontend, Backend |

## Cleanup (optional)

If you still have **src**, **public**, or **server** folders at the project root from before the split, you can remove them; the app now runs from **Frontend/** and **Backend/** only. Close any tools using those folders before deleting.
