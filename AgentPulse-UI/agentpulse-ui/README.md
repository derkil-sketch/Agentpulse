# AgentPulse UI

A dark navy, blue/purple Next.js workspace UI for the existing AgentPulse FastAPI backend. It has three dashboard launch cards (AI Agent, Security, and a separate Chat with Agent option). The AI Agent and Security consoles are independent floating windows; the Security console has a horizontal dock-like section menu.

## Important data behavior

- The UI does **not** generate fake events or fabricated security detections.
- Runtime events are fetched from the backend and refreshed every 2.5 seconds while live polling is enabled.
- Sending a chat prompt submits a real POST request to `/agent/message` and then refreshes runtime events.
- If the backend is unavailable or an endpoint returns no records, the UI shows an error or empty state.
- Summary counts labelled “matches” are simple text matches against returned event payloads. They are not a substitute for the backend's detection/risk endpoints.

## Requirements

- Node.js 20.9+
- AgentPulse FastAPI backend running locally (default `http://127.0.0.1:8000`)
- The backend must expose the established routes, particularly `GET /health`, `POST /agent/message`, and `GET /events`. Security-specific views try `GET /security`, `/behavior`, `/ml`, `/risk`, and `/timeline` and show a truthful unavailable state if the backend does not implement them.

## Run locally

```bash
npm install
cp .env.example .env.local
# Start the FastAPI backend in its own terminal first.
npm run dev
```

Open http://localhost:3000. On Windows PowerShell, copy the env file with:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` if the backend runs elsewhere:

```env
NEXT_PUBLIC_API_URL=/api/backend
AGENTPULSE_BACKEND_URL=http://127.0.0.1:8000
```

The Next.js same-origin proxy avoids browser CORS issues and keeps the backend base URL server-side.

## Connect to the current repository

This downloadable package is a standalone UI scaffold based on the known AgentPulse integration contract. Since the existing Git checkout was not mounted in this session, review the current repository before copying files over it. Merge `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `app/api/backend/[...path]/route.ts`, and `lib/api.ts` into the existing frontend rather than replacing backend files.

## Validate

```bash
npm run build
```

A build validates the frontend code; live API behavior still requires the backend running. If your backend uses a different response envelope, adjust `recordsFrom()` and the response parsing in `sendPrompt()` in `lib/api.ts` / `app/page.tsx` to match the actual contract.

## Push to Git

Option A — merge into your existing frontend repo (recommended):

1. Back up or commit your current changes.
2. Copy the relevant files from this package into the frontend repository, merging rather than overwriting existing API routes.
3. Run `npm install` and `npm run build`.
4. Commit and push:

```bash
git checkout -b feat/agentpulse-floating-workspaces
git add app lib package.json package-lock.json .env.example README.md tsconfig.json next.config.ts
git commit -m "Build AgentPulse floating workspaces UI"
git push -u origin feat/agentpulse-floating-workspaces
```

Option B — use this package as a new repository:

```bash
git init
git add .
git commit -m "Initial AgentPulse UI"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Do not commit `.env.local`, API keys, or other secrets. Replace the example remote URL with your actual repository URL.
