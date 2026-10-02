<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Base44 Development Setup

This project runs via `docker-compose.base44.yml` (Vite dev server with live reload on port 3000).

### Stack
- Vite 8 + TanStack Start (SSR via nitro) + React 19 + TypeScript
- Tailwind CSS v4, Radix UI components
- Supabase for auth and favorites (remote instance, public anon key — not a secret)

### Running
```sh
docker compose -f docker-compose.base44.yml up -d
```
The container installs npm deps on startup, then runs `vite dev --port 3000 --host 0.0.0.0`.

### Environment
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public publishable keys already set in the compose file (copied from `.env.example`). The app degrades to guest mode without them.
- No external secrets are required to boot.

### Notes
- Both `bun.lock` and `package-lock.json` exist; the compose setup uses npm (per README).
- The `@lovable.dev/vite-tanstack-config` package provides sandbox detection, TanStack Start, React, Tailwind, and path alias plugins — do not add them manually in `vite.config.ts`.
