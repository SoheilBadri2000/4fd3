# Smart Medical Assistant (Frontend)

This is the Next.js frontend for the Smart Medical Assistant. Users log in with
Supabase, type in their symptoms, and get general information back from the LLM
backend.

This tool gives general information only. It is not a replacement for
professional medical advice.

## Setup

1. Copy the example env file and fill in the values:

       cp .env.example .env.local

2. Install dependencies and start the dev server:

       npm install
       npm run dev

The app runs at http://localhost:3000.

## Environment variables

Set these in .env.local:

- NEXT_PUBLIC_SUPABASE_URL: your Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: your Supabase anon key
- LLM_BACKEND_URL: the URL of the LLM backend, for example http://localhost:8000

The LLM backend is a separate service. The frontend just needs LLM_BACKEND_URL
to point at it.

## Main files

- app/page.js: the home page. It checks the login and sends the user to /login
  if they are not signed in.
- app/login/page.js: the sign up and log in page.
- app/assistant.js: the symptoms form. It calls the generate server action.
- app/actions.js: the server actions (logout and generate).
- utils/supabase and proxy.js: Supabase login handling.

## Supabase

The symptom_checks table needs a user_id column and row level security so each
user only sees their own rows. You can set this up with:

    alter table symptom_checks add column if not exists user_id uuid
      references auth.users (id) default auth.uid();
    alter table symptom_checks enable row level security;
    create policy "own rows" on symptom_checks
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
