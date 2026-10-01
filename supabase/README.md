# Supabase account setup

HomeBase uses Supabase Auth for email-and-password and Google accounts, plus a user-scoped table for saved homes. No passwords are stored in the browser.

1. Create a Supabase project, enable the Email provider, and turn off **Confirm email** under **Authentication → Providers → Email**. This lets users create an account and sign in immediately without a confirmation code or link.
2. Copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` to the project root URL and `VITE_SUPABASE_ANON_KEY` to the publishable/anon key from **Project Settings → API**. The URL must be `https://<project-ref>.supabase.co`, without `/rest/v1/` or `/auth/v1`; the client normalizes pasted API paths to the project origin. Never put a service-role key in a `VITE_` variable.
3. Run [`migrations/20260926000000_user_favorites.sql`](migrations/20260926000000_user_favorites.sql) in the Supabase SQL Editor.
4. In **Authentication → Providers → Google**, enable Google and enter the OAuth client ID and secret from Google Cloud. Add `https://<project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI in your Google OAuth client.
5. In **Authentication → URL Configuration**, add `http://localhost:5173/` and `http://localhost:5173/reset-password` to the allowed redirect URLs. Add the equivalent URLs for the deployed domain before publishing.
6. Configure an email sender under **Authentication → SMTP Settings** if you want reliable password-reset delivery, then restart `npm run dev`.

Existing guest favorites from `localStorage` are merged into the signed-in account after authentication succeeds. The old local-only account and session keys are cleared instead of importing browser-stored passwords.