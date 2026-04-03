# Connect — Ethical Dating App Prototype

A React + TypeScript prototype built as a capstone project critique of dark patterns in mainstream dating apps. Core thesis: **ethical design is both a moral imperative and a competitive advantage**.

## The Problem

Apps like Tinder, Bumble, and Hinge are financially incentivized to prevent users from finding relationships. Dark patterns identified in audit:
- Hidden likes paywalls
- Pay-to-win visibility boosts
- Premium upsell bombardment
- Opaque, gamified algorithms
- Artificial time pressure

## The Design Response

Connect inverts these patterns across 8 screens:

| Screen | Ethical Design Choice |
|---|---|
| **1. Intentionality Check-In** | Declares purpose upfront; no swipe loops |
| **2. Profile Card** | Transparent "why you're seeing this" panel |
| **3. Reflection — Accept** | Pause before connecting; optional reflection prompt |
| **4. Reflection — Pass** | Friction on dismissal; anonymous feedback |
| **5. Transparency Dashboard** | Full algorithmic transparency; data policy |
| **6. Messages** | Conversation health indicators; no dark nudges |
| **7. Daily Completion** | Hard stop at 5 profiles/day; explains why |
| **8. Conversation** | Move-offline milestone; conversation balance metrics |

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **React Router v6** (client-side routing)
- No UI library — hand-coded minimal CSS (CSS custom properties)
- Design: Inter font, white/black/#2C5F5D (charcoal teal) palette

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm 8+

### Install
```bash
git clone https://github.com/YOUR_USERNAME/connect-app.git
cd connect-app
npm install
```

### Dev server
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Production build
```bash
npm run build
npm run preview  # serves the built output
```

---

## Project Structure

```
src/
  components/
    PhoneFrame.tsx        # iPhone shell wrapper
  screens/
    IntentionalityScreen.tsx
    ProfileCardScreen.tsx
    ReflectionAcceptScreen.tsx
    ReflectionPassScreen.tsx
    TransparencyScreen.tsx
    MessagesScreen.tsx
    CompletionScreen.tsx
    ConversationScreen.tsx
  App.tsx                 # routing + demo nav bar
  main.tsx                # entry point
  index.css               # global CSS variables & reset
```

---

## Navigating the Prototype

A **demo nav bar** appears at the top showing all 8 screens — click any to jump directly. Inside the phone frame, screens link to each other via button actions that mirror real user flows:

```
Intentionality → Profile Card → Reflection (Accept/Pass) → Messages → Conversation
                                                          ↓
                                                    Transparency Dashboard
                                                    Daily Completion State
```

---

## Testing

### Manual usability testing checklist

Run through these scenarios with test participants:

**Task 1 — First-time flow**
1. Open app at `/`
2. Select an intention and energy level
3. Tap Continue
4. Review Maya's profile — expand "Why you're seeing Maya"
5. Tap Connect → complete reflection
6. Expected: user can articulate *why* they connected

**Task 2 — Transparency**
1. From Profile screen, tap the info icon (top right)
2. Read through dashboard sections
3. Expected: user understands ranking is not pay-to-win

**Task 3 — Pass flow**
1. From Profile screen, tap Pass
2. Select a reason (optional)
3. Confirm
4. Expected: no guilt, no dark-pattern re-engagement prompt

**Task 4 — Message health**
1. Navigate to Messages screen
2. Observe the three conversation health states (healthy / fading / stale)
3. Tap Maya's conversation
4. Expected: user notices health indicators without feeling surveilled

**Task 5 — Daily limit**
1. Navigate to Completion screen
2. Read the "Why only 5 profiles?" explanation
3. Expected: user understands the ethical rationale, doesn't feel punished

### Questions to ask testers
- "At any point did you feel pressured to pay for something?"
- "Did you understand why each profile was shown to you?"
- "Did the daily limit feel frustrating or reasonable?"
- "Did the reflection prompts feel intrusive or valuable?"

### Ethical testing notes
- Testers should be briefed that this is a prototype, not a live service
- No real personal data is collected at any point
- Testers should be drawn from the target demographic (adults 22–35 seeking relationships)
- Debriefing should include explanation of the dark pattern research context

---

## GitHub Repository Setup

```bash
# Initialize and push
git init
git add .
git commit -m "Initial commit: Connect ethical dating app prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/connect-app.git
git push -u origin main
```

### Recommended repo structure
```
/
  src/           (app source)
  dist/          (build output — add to .gitignore)
  docs/          (link your capstone documents here)
    ethical_design_principles.md
    feature_inversion_table.md
    requirements_specification.md
  README.md
  .gitignore
```

### .gitignore
```
node_modules/
dist/
.env
```

---

## Design Principles

1. **Transparency by default** — users always know why they see what they see
2. **Friction as care** — deliberate pauses prevent impulsive behavior
3. **Flat monetization** — $12/month, no tiers, no upsells, no ads
4. **Data minimalism** — collect only what's needed; never sell
5. **Completion over engagement** — success = users leaving the app with a relationship

---

## Capstone Context

- **Project:** Designing for Connection Instead of Engagement
- **Course:** UX/Design Capstone
- **Report due:** Late April/early May 2026
- **Methodology:** Dark pattern audit of Hinge + Bumble → ethical design inversion → prototype → user testing

---

## Author

Built solo as a capstone project. Questions? Open an issue.
