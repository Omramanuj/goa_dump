# Goa Squad Spots

Private travel board for a Goa friend trip, built with Next.js 14 App Router, Tailwind CSS, and Supabase.

## Setup Notes

- The `public.spots` table was provisioned via the Supabase MCP server.
- Row Level Security is disabled on `public.spots`.
- The public storage bucket `spot-photos` was provisioned via Supabase MCP.
- An anonymous storage insert policy was added for `spot-photos` so the client app can upload photos without Supabase Auth.
- `.env.local` contains the real Supabase URL and anon key for the `supabase_goadump` project.
- The phone gate uses `ALLOWED_CONTACTS` from `.env.local`, passed from the server into client components.

## Run

```bash
npm install
npm run dev
```
