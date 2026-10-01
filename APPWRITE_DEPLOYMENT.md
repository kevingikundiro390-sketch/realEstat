# Appwrite deployment

This project can be deployed to Appwrite Sites as a static website. No Appwrite database, storage, or authentication is required for the public site.

## Appwrite Sites settings

Create an Appwrite project at https://cloud.appwrite.io/, then create a Site connected to this repository.

Use these values in the Site build settings:

- Framework: `Custom` (or `React` if Appwrite offers it)
- Production branch: your deploy branch, usually `main`
- Root directory: `/`
- Install command: `npm install`
- Build command: `npm run build:static`
- Output directory: `./dist`

The static build creates `dist/index.html`, which Appwrite serves as the website entry point.

## Environment variables

Add these Site environment variables. Use the values from your Supabase project:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

Never add a Supabase service-role key or any private secret to a `VITE_` variable.

## Domains

After Appwrite gives the Site a domain, open the root site URL to verify the public homepage. The existing login buttons still require the Supabase variables and provider configuration; no Appwrite auth setup is needed for hosting only.

## Important backend note

The application currently uses Supabase for authentication, OAuth, sessions, and saved-home data. Deploying the public frontend on Appwrite Sites does not automatically move that backend to Appwrite.

To migrate the backend to Appwrite, the application would need a separate code change replacing Supabase Auth with Appwrite Account, replacing the `user_favorites` table with an Appwrite Database collection, and reconfiguring Google/X providers in Appwrite. Do not remove the Supabase variables until that migration is complete.
