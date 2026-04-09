# Connect — Ethical Dating App

> A capstone project by Malvin Mallock Boye. Built as a direct critique of dark patterns in mainstream dating apps.

**Live:** [(https://connect-app-rho.vercel.app/my-profile)]
**Thesis:** Incumbent dating apps are financially incentivized to prevent users from finding relationships. Ethical design is both a moral imperative and a defensible competitive advantage.

---

## The Problem

Apps like Tinder, Bumble, and Hinge are structurally unable to prioritize user outcomes because their revenue depends on continued engagement, not successful matches. Dark patterns documented in audit:

- Mutual likes hidden behind paywalls (Bumble, Hinge)
- Pay-to-win visibility boosts
- Aggressive premium upsell interruptions within seconds of opening
- Opaque, gamified recommendation algorithms
- Artificial urgency such as match expiration timers, fake scarcity
- Infinite scroll engineered to prevent stopping

Connect inverts every one of these patterns.

---

## Screens & Ethical Design Choices

| Screen | What it does | Why it's ethical |
|---|---|---|
| **Splash** | Animated C + onnect wordmark | Sets a calm, considered tone from the first second |
| **Auth** | Email sign up / sign in | No dark patterns in onboarding |
| **Profile Setup** | 4-step flow: info → preferences → intention → bio | Collects only what the algorithm needs; explained upfront |
| **Potential Partners** | Scored list of up to 5 profiles/day | Daily hard cap; full score breakdown visible to user |
| **Reflection — Connect** | Pause before sending a connection | Deliberate friction reduces impulsive behavior |
| **Reflection — Pass** | Optional reason before passing | Anonymous; no guilt, no re-engagement dark pattern |
| **Transparency Dashboard** | Full algorithmic accounting | No equivalent exists in any mainstream dating app |
| **Connections** | Matched users with conversation health | Health indicators inform, don't pressure |
| **Messages** | Real-time conversation | Move-offline nudge after extended chatting |
| **Date Ideas** | Curated offline date suggestions | Actively encourages users to leave the app |
| **My Profile** | View, edit, completeness tracker | Full user control; settings include data download |
| **Settings** | Account, privacy, subscription info | Transparent flat pricing; no upsells |

---

## The Algorithm

Profiles are scored 0-100 across 7 signals. Every signal and its weight is shown to the user in the transparency panel with no hidden factors and no pay-to-win.

| Signal | Max pts | How it works |
|---|---|---|
| Interest compatibility | 30 | Interest graph with 28 categories and adjacency map. Scores both exact matches (you both like hiking) and complementary interests (your languages, their travel) |
| Age range | 15 | Both within each other's stated range scores higher |
| Mutual signals | 15 | Does this person share interests with people you've already connected with? |
| Recency | 15 | Active in the last 7 days scores higher; inactive accounts surface less |
| Profile completeness | 10 | Rewards effort, not payment |
| Response rate | 10 | Auto-updated when messages are sent; rewards active conversationalists |
| Relationship readiness | 5 | Self-reported 1-5 scale; closer scores match better |

**Hard filters (not scored):** shared intention, gender preference (mutual). Non-negotiable — you only see people who want the same thing.

**Daily cap:** 5 profiles maximum, enforced in the database. No paid bypass.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| Backend | Supabase (Postgres, Auth, Realtime, Storage) |
| Hosting | Vercel |
| Styling | Custom CSS by Yours Truly |
| Font | Courier Prime (Google Fonts) |

**Design system:** Warm cream #F4F1E8 background, dark brown #2C2416 text, olive/sage #8A8C6A as the sole accent. Named after Circeé — the sorceress (キルケー) — the brand mixes editorial serif with Japanese stamp aesthetics. Circeé is the name of my design "business" and wanted use a design I have been thinking of doing and felt like adding the name was justifiable

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm 8+
- A Supabase project (free tier works)

### Install
```bash
git clone https://github.com/MalvinBoye/connect-app.git
cd connect-app
npm install
```

### Environment variables
Create a `.env.local` file in the root:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database setup
Run `supabase_schema.sql` in your Supabase SQL Editor. Creates all tables, triggers, RLS policies, and the avatar storage bucket in one shot.

### Dev server
```bash
npm run dev
# Opens at http://localhost:5173
```

### Production build
```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
  components/
    SplashScreen.tsx      # Animated opening — C + onnect with leaf texture
    BottomNav.tsx         # 5-tab nav: Messages / Partners / Date Ideas / Connections / Me
  screens/
    AuthScreen.tsx
    ProfileSetupScreen.tsx
    ProfileCardScreen.tsx       # Potential partners list with expand/connect
    ReflectionAcceptScreen.tsx
    ReflectionPassScreen.tsx
    TransparencyScreen.tsx      # Full algorithmic transparency dashboard
    ConnectionsScreen.tsx       # Matched users with conversation health
    MessagesScreen.tsx          # Real-time conversation
    DateIdeasScreen.tsx         # Curated offline date suggestions
    CompletionScreen.tsx        # Daily hard stop
    MatchedScreen.tsx           # Mutual match celebration
    MyProfileScreen.tsx         # Profile view, edit, settings
  lib/
    supabase.ts           # Supabase client + type definitions
    AuthContext.tsx       # Session management
    matching.ts           # Scoring algorithm
    interests.ts          # Interest graph (28 categories, adjacency map)
  App.tsx                 # Auth-gated routing + splash
  main.tsx
  index.css               # Design system (CSS custom properties)
```

---

## Database Schema

Five tables, all with row-level security:

- **profiles** — user data, preferences, algorithm signals (response_rate, last_active, relationship_readiness)
- **swipes** — every connect/pass decision
- **matches** — auto-created by Postgres trigger when two users both connect
- **messages** — real-time conversation content
- **daily_swipes** — enforces the 5/day cap per user

---

---

## Usability Testing Protocol

Five tasks, each mapped to a screen and an ethical hypothesis. The question is never whether users can complete the task rather whether they understand the intent behind the design.

**Task 1 — Profile setup**
Sign up and complete the 4-step setup. Expected: user understands why bio specificity matters for matching.

**Task 2 — Potential Partners list**
Browse profiles, expand one, read the score breakdown. Expected: user can explain why a profile appeared without being told.

**Task 3 — Transparency dashboard**
Navigate to "Why these?" from the Partners screen. Expected: user understands ranking is not pay-to-win.

**Task 4 — Pass flow**
Pass on a profile, optionally select a reason. Expected: no guilt and no dark-pattern re-engagement.

**Task 5 — Daily limit**
Hit the 5-profile cap. Expected: user understands the rationale, doesn't feel punished.

### Questions asked to test users
- "At any point did you feel pressured to pay for something?"
- "Did you understand why each profile was shown to you?"
- "Did the daily limit feel frustrating or reasonable?"
- "Did the reflection prompts feel intrusive or valuable?"
- "Did anything feel manipulative?"

---

## Design Principles

1. **Transparency by default** — every algorithmic decision shown to the user in full
2. **Friction as care** — deliberate pauses at decision points reduce impulsive behavior
3. **Completion over engagement** — success means users leave the app with a relationship
4. **Flat monetization** — one price, all features, no tiers, no ads
5. **Data minimalism** — collect only what the algorithm needs; never sell
6. **Adjacent interests** — the algorithm rewards complementary passions, not just overlap
7. **Move offline** — the app actively nudges users toward real-world meetups

---
---

## Author

By Malvin Mallock Boye
