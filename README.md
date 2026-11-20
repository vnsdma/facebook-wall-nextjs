# Facebook Wall (2008) | Test 2 Challenge

A faithful 2008-era Facebook Wall built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase Realtime. Features real-time multi-client post updates, author naming, 280-character validation, and graceful local storage fallback.

## Features

- **Real-Time Wall Feed**: Posts display newest first and update across all connected clients simultaneously via Supabase Realtime WebSockets (`postgres_changes` on `INSERT`).
- **280-Character Validation**: Live character counter with client-side and database-level length constraints.
- **Author Attribution**: Custom author name input with fallback to "Guest".
- **Nostalgic 2008 UI**: Faithful recreation of the 2008 Facebook layout (Facebook blue `#3b5998`, profile card, poke counter, status edit, and wall tabs).
- **Interactive Post Actions**: Toggleable like counter and post deletion.
- **Offline / Local Fallback**: Seamlessly persists to `localStorage` when Supabase credentials are not present, ensuring zero-configuration local evaluation.

## Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run:

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  author_name text default 'Guest',
  body text check (char_length(body) <= 280),
  created_at timestamptz default now()
);

-- Enable Realtime for the table
alter publication supabase_realtime add table posts;

-- Set up Row Level Security (RLS) for public read/write
alter table posts enable row level security;
create policy "Public posts are viewable by everyone" on posts for select using (true);
create policy "Anyone can insert a post" on posts for insert with check (true);
```

3. Copy your **Project URL** and **Anon Key** from **Project Settings > API**.

## Local Development

1. Clone and install dependencies:
   ```bash
   git clone <repo-url>
   cd facebook-wall-nextjs
   npm install
   ```

2. (Optional) Set up environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   *(If omitted, the app will automatically run in local preview mode with browser storage)*.

3. Start development server:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000).

## Deployment to Vercel

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), import the repository.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Backend / Database**: Supabase (PostgreSQL + Realtime WebSockets)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
