# Supabase Auth + Candidates Persistence

## Context

The Feria Tabasco 2026 app currently has zero backend: contestants live in a static file (`lib/data/contestants.ts`, 17 entries), state lives in Zustand + localStorage, and there are no API routes. We're starting backend persistence, beginning with two pieces: **email/password auth** to gate the prediction flow, and **contestants stored in Supabase** as the first persisted entity.

Hard constraint from the user: the **browser must never talk to Supabase directly**. All Supabase access goes through Next.js server code — API routes for client-initiated calls, server components / server helpers for SSR reads. This keeps the Supabase keys server-only (no `NEXT_PUBLIC_*` exposure) and gives us one place to enforce auth.

Decisions already made (from clarifying questions):
- Unauth users hitting protected routes → **redirect to `/login?redirectTo=<path>`** (handled by middleware, not per-page).
- **Open sign-up, no email confirmation** — login UI has both Iniciar sesión / Crear cuenta; users land authenticated immediately after signup.
- Contestants **move to Supabase**; seed from the existing file. The file stays as the seed source of truth in git.
- User has a Supabase project — they'll provide URL + keys.

Protected routes: `/seleccion`, `/revision`, `/pago`, `/dashboard`. Public: `/`, `/ranking`, `/login`.

---

## Architecture

**Auth transport**: `@supabase/ssr` cookie-based sessions. Login/signup/logout are POSTed by client forms to internal `/api/auth/*` routes, which call Supabase server-side and `Set-Cookie` the session. Middleware refreshes the session cookie on every request and gates protected routes.

**Data transport**:
- *Server components* (e.g. `app/seleccion/page.tsx`) call a server-only helper `getContestants()` directly. No internal HTTP round-trip.
- *Client components* that need contestants receive them as props from server parents. (Today none of them fetch independently — contestants flow through props already.)
- A public `/api/contestants` route exists for any future client-side needs and as the documented "internal API" surface.

**Why no `NEXT_PUBLIC_*`**: dropping the prefix keeps the anon key out of the browser bundle. Server-only is sufficient since the browser never instantiates a Supabase client.

---

## Database (Supabase SQL)

One table for now. Run this in the Supabase SQL editor:

```sql
create table public.contestants (
  id          text primary key,        -- "c01" .. "c17"
  name        text not null,
  ciudad      text not null,
  bio         text not null,
  image       text not null,
  sort_order  int  not null,           -- preserves c01..c17 display order
  created_at  timestamptz default now()
);

alter table public.contestants enable row level security;

-- Reads happen via service role (server-only), so no public select policy is needed.
-- If we later move some reads to the anon key, add:
-- create policy "contestants_public_read" on public.contestants for select using (true);
```

Auth: in the Supabase dashboard, **Authentication → Providers → Email** → disable "Confirm email" (matches the user's choice). Keep email + password enabled.

---

## Files to create

### Supabase clients (server-only)

- `lib/supabase/server.ts` — `createServerSupabase()` returning a server client bound to `cookies()` from `next/headers`. Used in route handlers and server components.
- `lib/supabase/middleware.ts` — `updateSession(request)` helper that refreshes the auth cookie and returns the response. Per `@supabase/ssr` recommended pattern.
- `lib/supabase/admin.ts` — `createAdminSupabase()` using `SUPABASE_SERVICE_ROLE_KEY`. Used by the seed script and any future privileged ops. **Never** imported by route handlers that handle user input.

### Middleware

- `middleware.ts` (project root) — calls `updateSession()` to refresh cookies, then enforces:
  - If pathname matches `/seleccion|/revision|/pago|/dashboard` and `getUser()` is null → redirect to `/login?redirectTo=<encoded original path>`.
  - If pathname is `/login` and user is authenticated → redirect to `/`.
  - Matcher excludes `_next`, static assets, and image optimizer.

### API routes

- `app/api/auth/signup/route.ts` — POST `{ email, password }` → `supabase.auth.signUp()`. Returns 200 on success (user is signed in immediately since email confirmation is off). 400 on validation/Supabase error with a Spanish message.
- `app/api/auth/login/route.ts` — POST `{ email, password }` → `signInWithPassword()`. 200 / 401.
- `app/api/auth/logout/route.ts` — POST → `signOut()`. 200.
- `app/api/contestants/route.ts` — GET → returns `{ contestants: Contestant[] }` ordered by `sort_order`. Public (no auth check) since contestant data isn't sensitive; uses the server client which already has session context if present.

### Server data helpers

- `lib/data/contestants-server.ts` — exports `getContestants()` and `findContestantById(id)`. Both query Supabase via `createServerSupabase()`. Cached per-request via React `cache()`.

### Login UI

- `app/login/page.tsx` — server component. Reads `?redirectTo=` from `searchParams` and passes to the form. Renders the existing layout style (Wordmark header, centered card on dark surface).
- `app/login/LoginForm.tsx` — `"use client"` component. Tabs: **Iniciar sesión** / **Crear cuenta**. Fields: email, password (+ confirmar contraseña on signup). Submits to `/api/auth/login` or `/api/auth/signup`. On success: `router.push(redirectTo ?? "/")` then `router.refresh()` so server components re-read auth state. Inline error message in a `Card` (no toast lib, matches existing pattern in `PaymentClient.tsx`).
- `components/ui/Input.tsx` — minimal text input matching the dark theme (`bg-surface`, focus ring with brand color, label + error slot). The codebase has no input component yet; this is the smallest reusable primitive.

### Seed script

- `scripts/seed-contestants.ts` — Node script run via `tsx` (`pnpm seed:contestants`). Reads `contestants` from `lib/data/contestants.ts`, upserts into Supabase using the service role key, sets `sort_order` from array index. Idempotent (`upsert` on `id`).
- Add to `package.json` scripts: `"seed:contestants": "tsx scripts/seed-contestants.ts"`. Add `tsx` to devDependencies.

### Env

- `.env.example` (committed) — keys with placeholder values:
  ```
  SUPABASE_URL=
  SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ```
- `.env.local` (gitignored — verify `.gitignore` covers it) — user fills in real values.

### Dependencies

`pnpm add @supabase/supabase-js @supabase/ssr` and `pnpm add -D tsx`. (Project uses pnpm; do not run npm.)

---

## Files to modify

- `app/seleccion/page.tsx` — call `getContestants()` (server) and pass as prop to `<ContestantGrid contestants={...} />`. Today the page doesn't pass props at all.
- `components/selection/ContestantGrid.tsx` — accept `contestants: Contestant[]` prop instead of importing from `lib/data/contestants.ts`. (Need to confirm during exploration of the file; if it currently imports the static array, that's the line to change.)
- Any other consumers of `lib/data/contestants.ts` (`findContestant` in particular — likely used by `/revision`, `/dashboard`) — switch to either prop-passing from server parents or `findContestantById()` from `contestants-server.ts`. Implementation must do a `grep -rn "lib/data/contestants" app components lib` first and update each call site.
- `lib/data/contestants.ts` — keep file as seed source; add a `// Seed source: do not import in app code. App reads from Supabase.` comment at the top.
- `app/dashboard/page.tsx` — add a small "Cerrar sesión" button (calls `POST /api/auth/logout` then `router.refresh()`). Dashboard is the natural home for it; we're not adding a global nav in this scope.
- `package.json` — new dependencies + seed script.
- `.gitignore` — verify `.env.local` is ignored (Next.js default does this; double-check).

---

## Out of scope (explicitly)

- Persisting tickets / picks to Supabase (next phase — the user said "this will be the first step").
- Password reset, OAuth, magic links.
- Global nav with auth state.
- Admin UI for editing contestants.
- Per-user RLS policies (no user-owned data yet).

---

## Verification

1. `pnpm install` succeeds.
2. Fill `.env.local` with the user's Supabase URL, anon key, service role key.
3. Run the SQL block in Supabase SQL editor; disable email confirmation in Auth settings.
4. `pnpm seed:contestants` → 17 rows in `public.contestants`. Verify with `select count(*), min(sort_order), max(sort_order) from contestants;` → `17, 0, 16` (or `1, 17` depending on indexing — just confirm 17).
5. `pnpm dev`. Logged out:
   - Visit `/` → loads, "Elegir mis 5 favoritas" link goes to `/seleccion`.
   - Click it → redirected to `/login?redirectTo=%2Fseleccion`.
   - `/dashboard`, `/revision`, `/pago` direct visits → same redirect with appropriate `redirectTo`.
6. On `/login`:
   - **Crear cuenta** with a fresh email + password → lands on `/seleccion` (the redirectTo).
   - Open devtools Network: confirm calls go to `/api/auth/signup`, no requests to `*.supabase.co` from the browser.
   - **Cerrar sesión** from dashboard → back to logged-out state, protected routes redirect again.
   - **Iniciar sesión** with the same creds → success, lands on redirectTo.
   - Wrong password → inline Spanish error, stays on `/login`.
7. `/seleccion` shows all 17 candidates loaded from Supabase (temporarily change a name in the DB and reload to confirm it's not coming from the file).
8. `curl http://localhost:3000/api/contestants` returns `{ contestants: [...17 items...] }`.
9. `pnpm typecheck` and `pnpm lint` clean.
10. Browser bundle inspection (`pnpm build` then check `.next/static/chunks/*`): grep for the Supabase URL — it should **not** appear in any client bundle.

---

## Critical files (reference list)

Read-only during exploration: `app/components/landing/Hero.tsx:48` (the "Elegir" link — no change needed, middleware handles auth), `app/globals.css` (design tokens for the new Input component), `components/ui/Card.tsx` & `Button.tsx` (style references), `app/layout.tsx` (no change — keep scope tight, no global nav).

Modify: `app/seleccion/page.tsx`, `components/selection/ContestantGrid.tsx`, any other importer of `lib/data/contestants`, `app/dashboard/page.tsx`, `package.json`.

Create: `middleware.ts`, `lib/supabase/{server,middleware,admin}.ts`, `lib/data/contestants-server.ts`, `app/api/auth/{login,signup,logout}/route.ts`, `app/api/contestants/route.ts`, `app/login/page.tsx`, `app/login/LoginForm.tsx`, `components/ui/Input.tsx`, `scripts/seed-contestants.ts`, `.env.example`.
