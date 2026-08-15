# Kulan

An events app built with Vite, React, React Router, and Convex.

Guests can browse, search, and filter events without an account. Members can join
and leave events. Organizers can create events and edit or delete the ones they
own — and only the ones they own.

## Running it locally

You need **two terminal tabs**, both open in this folder.

**First time only**, install the packages:

```bash
npm install
```

**Tab 1 — the database.** This opens your browser the first time so you can
create a free Convex account and a project. Leave it running.

```bash
npx convex dev
```

That command writes a `.env.local` file containing `VITE_CONVEX_URL`, which is
how the React app finds your database. `.env.local` is gitignored on purpose —
it's specific to your machine.

**Tab 2 — the website.**

```bash
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## Filling the database with sample events

A fresh database is empty. To load eight demo events, run this in a third tab
while `npx convex dev` is running:

```bash
npx convex run seed:seed
```

That also creates a demo organizer account you can log in as:

- Email: `demo@kulan.app`
- Password: `kulan123`

Log in as the demo organizer to see the edit and delete buttons. Sign up as
yourself to see the join and leave flow from a member's point of view.

## How the pieces fit together

```
convex/
  schema.ts   three tables: users, events, rsvps
  auth.ts     signUp, signIn, me
  events.ts   list (search + filters), get, byOrganizer, create, update, remove
  rsvps.ts    join, leave, isJoined, joinedEventIds, myEvents
  seed.ts     one-off mutation that loads demo data

src/
  AppContext.jsx      session, search/filter state, toasts
  pages/Home.jsx      guest-browsable event list with search and filters
  pages/EventDetail.jsx   /events/:id — details, join/leave, organizer actions
  pages/CreateEvent.jsx   /events/new
  pages/EditEvent.jsx     /events/:id/edit — organizer only
  pages/MyEvents.jsx      /my-events — events you joined
  pages/Organizing.jsx    /organizing — events you created
```

### Ownership

`events.update` and `events.remove` both compare `event.organizerId` against the
user making the request, and throw if they don't match. Hiding the Edit button in
the UI is a convenience — the check on the server is what actually protects the
data.

### A note on the auth

Passwords are hashed with SHA-256 before being stored, so plain text never hits
the database. This is enough to demonstrate real database-backed sign-up and
login, but it is not production security: a real app needs a slow hash such as
bcrypt or argon2, plus server-verified sessions rather than an id kept in
`localStorage`.

## Deploying

The site is hosted on Vercel. `vercel.json` rewrites every path to `index.html`
so that client-side routes like `/events/abc123` survive a page refresh.

For the deployed site to reach a database, set `VITE_CONVEX_URL` in the Vercel
project's environment variables, pointing at your Convex **production**
deployment (`npx convex deploy` prints it).

## Scope

Kulan intentionally has no messaging, payments, maps, comments, or admin
dashboard.
