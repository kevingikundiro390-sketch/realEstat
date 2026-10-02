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

## Base44 Dev Environment

This is a Vite + TanStack Start (React 19) frontend app ("HomeBase" real estate listings).
Backend is Supabase (external, configured via `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`).
The Supabase anon key is a publishable (public) key — safe to keep in `.env.base44-defaults`.

### Running
- `docker compose -f docker-compose.base44.yml up -d` starts the Vite dev server on port 3000.
- Package manager is **bun** (bun.lock + bunfig.toml). The lockfile is not frozen — `bun install` (no `--frozen-lockfile`) is used because the committed lockfile drifts from package.json.
- The `@lovable.dev/vite-tanstack-config` plugin handles Vite plugins, port/host, and SSR. Do not add duplicate Vite plugins manually.
- Vite runs with `--host 0.0.0.0 --port 5173` (mapped to host 3000). `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed for preview host allowlisting.

### Notes
- The app gracefully degrades when Supabase is not configured (`isSupabaseConfigured` flag in `src/lib/store.ts`).
- `src/start.ts` opts into TanStack Start's CSRF middleware for server functions — do not remove it.
