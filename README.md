# PackUp 🏕️

> Find your camping crew across Australia.

## Stack
- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS**
- **Supabase** — Auth, Postgres, Realtime, Storage
- **Resend** — transactional email
- **Vercel** — hosting (free tier)

---

## Quick Start

### 1. Install
```bash
npm install
```

### 2. Create Supabase project
1. Go to [supabase.com](https://supabase.com) → New project (choose ap-southeast-1 for Melbourne latency)
2. SQL Editor → run migrations **in order**:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_notifications.sql`
   - `supabase/migrations/003_storage.sql`
3. Authentication → Providers → Email → disable "Confirm email" for dev

### 3. Environment variables
```bash
cp .env.example .env.local
# Fill in your keys from Supabase dashboard → Settings → API
```

### 4. Run locally
```bash
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
packup/
├── app/
│   ├── (auth)/            → /login  /signup
│   ├── (app)/             → all protected routes
│   │   ├── explore/       → browse trips
│   │   ├── trips/
│   │   │   ├── new/       → post a trip
│   │   │   └── [id]/
│   │   │       ├── page   → trip detail + join request
│   │   │       └── chat/  → realtime group chat
│   │   ├── my-trips/      → hosting / joined / pending requests
│   │   ├── notifications/ → realtime notification feed
│   │   └── profile/       → edit profile, avatar, reviews
│   └── api/
│       ├── trips/
│       ├── join-requests/
│       ├── messages/
│       ├── profiles/
│       └── reviews/
├── components/
│   ├── ui/                → Avatar, Badge, Button, Input, Textarea
│   ├── layout/            → TopBar, BottomNav (with notification badge)
│   ├── trips/             → TripCard, TripForm, LeaveReview
│   ├── chat/              → ChatWindow
│   └── profile/           → AvatarUpload, ReviewsList
├── hooks/
│   ├── useUser.ts         → current user profile
│   ├── useTrips.ts        → trip list with filters
│   ├── useChat.ts         → realtime messages
│   ├── useNotifications.ts → realtime notification feed
│   └── useAvatarUpload.ts → Supabase Storage upload
├── lib/supabase/          → client / server / admin / middleware
├── types/index.ts         → all TypeScript interfaces
├── utils/index.ts         → helpers, constants, AU_STATES
└── supabase/migrations/
    ├── 001_schema.sql     → core tables + RLS + triggers
    ├── 002_notifications.sql → notifications + auto-triggers
    └── 003_storage.sql    → avatars + trip-photos buckets
```

---

## Key Features Built

| Feature | Where |
|---|---|
| Auth (signup/login/logout) | `app/(auth)/` + Supabase Auth |
| Browse + filter trips | `app/(app)/explore/` |
| Post a trip | `app/(app)/trips/new/` |
| Trip detail + join flow | `app/(app)/trips/[id]/` |
| Realtime group chat | `app/(app)/trips/[id]/chat/` + `hooks/useChat.ts` |
| Host approve/decline | `app/(app)/my-trips/` |
| Realtime notifications | `app/(app)/notifications/` + DB triggers |
| Profile + avatar upload | `app/(app)/profile/` + Supabase Storage |
| Reviews after trip | `components/trips/LeaveReview.tsx` |
| Email on join/approve | `lib/resend.ts` |
| Auth middleware | `middleware.ts` |
| Notification badge | `components/layout/BottomNav.tsx` |

---

## Deploy to Vercel

```bash
npx vercel
```

Add these env vars in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL` → your Vercel URL

---

## What to build next (Month 2+)

- [ ] Trip photo uploads (storage bucket ready)
- [ ] Map view on explore page (Mapbox free tier)
- [ ] Organiser trip pricing + Stripe payments
- [ ] Share trip card to Instagram Stories
- [ ] Push notifications (OneSignal free tier)
- [ ] Admin dashboard to moderate trips
