SUSTAIN-A-PROMPT (PennApps XXVI)
=================================
Because every prompt has a footprint.

WHAT IS THIS
------------
Sustain-A-Prompt is eco‑aware prompt optimizer. You paste a prompt, we estimate its
energy, CO2, and water impact, suggest a leaner alternative with projected savings,
and render a clean, copy‑paste‑ready answer (sanitized to remove boilerplate).

WHY IT MATTERS
--------------
Generative AI has a real environmental cost. Sustain-A-Prompt makes that cost visible,
then helps you lower it—without sacrificing answer quality.

HIGHLIGHTS
----------
- Optimized prompting with percent savings shown alongside the original.
- Environmental metrics: energy (Wh/kWh), CO2 (g), and water (L).
- Clean output: regex sanitizer removes disclaimers, code fences, blockquotes, and noisy citations.
- Futuristic but usable UI: dark glassmorphism with subtle neon accents.
- Modern architecture: Next.js App Router with a safe server/client split.
- Auth-ready routes for login/register, toast notifications, and header actions.

TECH STACK
----------
- Framework: Next.js 15 (App Router, React Server Components), TypeScript
- UI: Tailwind CSS v4, shadcn/ui, lucide-react, Sonner (toasts)
- Animations: framer-motion, @motionone/react
- APIs: Google Gemini (optimize), Cerebras (chat/models)

IMPORTANT NOTE
--------------
styled-jsx is NOT used. In Next 15 it will break builds. Use Tailwind-only styling.

HOW IT WORKS
------------
1) You enter a prompt in the chat-style console.
2) Backend estimates footprint (energy, CO2, water).
3) UI shows glowing metric cards and proposes an optimized prompt.
4) The model response is sanitized and displayed in the main answer panel.

REPOSITORY LAYOUT (KEY PATHS)
-----------------------------
src/app/
  page.tsx               -> Server Component that renders HomeClient with Suspense
  layout.tsx             -> Global styles, header, Toaster
  api/
    gemini/optimize      -> Prompt optimization endpoint
    cerebras/chat        -> Chat endpoint
    cerebras/models      -> Model list endpoint
  login/, register/      -> Auth pages

src/components/
  OptimizedPrompt.tsx    -> Main prompt/answer UI + regex sanitizer
  ui/                    -> shadcn/ui components and toaster

src/lib/, src/hooks/     -> Utilities and hooks
src/db/ (optional)       -> Drizzle/Turso schema and seed files

FEATURES IN DETAIL
------------------
Regex Sanitizer
  - Strips fillers/disclaimers, code fences, blockquotes, [#]-style citations.
  - Normalizes bullets/headings; preserves line breaks (whitespace-pre-wrap).
  - Falls back to original if sanitization removes too much.

Server/Client Split
  - Home page is a Server Component (stable SSR/RSC).
  - Interactive logic lives in a Client Component (HomeClient).

Design System
  - Neon glassmorphism, animated gradients, subtle cyber-grid utilities in globals.css.
  - Tailwind v4 @theme ensures consistent tokens.

GETTING STARTED
---------------
Requirements: Node 18+, npm (or bun/pnpm if you adjust scripts).

Install dependencies:
  npm install

Run the dev server:
  npm run dev

Build and start:
  npm run build
  npm run start

ENVIRONMENT VARIABLES
---------------------
Create a .env file in the repo root. Only include variables you actively use.

Common keys (examples):
  GOOGLE_GEMINI_API_KEY=your_key_here
  CEREBRAS_API_KEY=your_key_here
  # Add auth provider variables if enabling full auth flows

Never commit real keys.

API ENDPOINTS (OVERVIEW)
------------------------
POST /api/gemini/optimize   -> returns optimized prompt and savings estimates
POST /api/cerebras/chat     -> chat with a selected model
GET  /api/cerebras/models   -> list available models

Keep calls server-side where possible; do not expose secrets in client code.

UI / UX NOTES
-------------
- Dark, futuristic aesthetic with smooth but restrained motion.
- Answer panel preserves line breaks (CSS: whitespace-pre-wrap).
- Header contains app logo and auth menu.

CONVENTIONS & GOTCHAS
---------------------
- App Router lives under src/app; pages are Server Components by default.
- Client-only behavior must be inside files marked with "use client".
- Do not use styled-jsx; rely on Tailwind utilities and component classes.
- Follow shadcn/ui patterns for buttons, dialogs, inputs; use Sonner for toasts.

CONTRIBUTING
------------
- Keep changes focused and incremental.
- Follow existing TypeScript types and export patterns.
- UI changes: include screenshots or short clips in PRs for review.

LICENSE
-------
MIT — see LICENSE (or update if your project uses a different license).

CREDITS
-------
Built at PennApps XXVI with care, caffeine, and careful regex.
