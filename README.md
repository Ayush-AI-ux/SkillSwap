# SkillSwap

**Hackathon ID: AZIS-4MWXBG**

- **Track:** Track 2, Real-World AI Products
- **Brief:** SkillSwap (creator gig marketplace)
- **Live app:** (https://skill-swap-six-umber.vercel.app/)

## What it is

A marketplace where young creators post gigs and clients book them. There is no login: anyone can use every feature.

## The five required features

1. **Post a gig:** `/gigs/new` (title, category, rate, description, creator name)
2. **Browse & search:** `/` (search, category filter, price range, sort)
3. **Book a gig:** `/gigs/[id]` (booking form, then a confirmation page)
4. **Creator dashboard:** `/dashboard` (pick a creator, accept or decline bookings)
5. **My bookings:** `/my-bookings` (enter your email to see Pending, Accepted, or Declined)

Decision Point behavior is explained in [DECISIONS.md](./DECISIONS.md).

## Tech stack

Next.js (App Router) with TypeScript, React, Tailwind CSS, Prisma ORM, PostgreSQL on Neon, deployed on Vercel.

## Test credentials

**None. No authentication is required.** Open the live URL and use any feature.

Seeded demo data: creators Aarav, Meera, Kabir, Riya and Ishaan. Try `sam@example.com` in My bookings to see a Pending, Accepted and Declined example.

## Run locally

1. `npm install`
2. Create a `.env` file with `DATABASE_URL="your-postgres-connection-string"`
3. `npx prisma db push`
4. `npx tsx prisma/seed.ts`
5. `npm run dev`, then open http://localhost:3000

## Standard API

Not implemented. Features are meant to be graded through the UI. Key elements have `data-testid` attributes.
