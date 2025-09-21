# Sustain-A-Prompt

Eco-aware prompt optimizer built with Next.js 15, TypeScript, Tailwind v4, and shadcn/ui. Enter a prompt → we estimate energy/CO₂/water impact → generate an optimized prompt with projected savings, and render a clean, copy-paste–ready answer using a regex-based sanitizer.

## Highlights
- Optimized Prompting: Suggests a more efficient prompt and shows estimated % savings
- Environmental Metrics: Glowing stat cards for energy, CO₂, and water footprint
- Clean Answer Output: Regex sanitizer removes AI boilerplate, markdown fences, and clutter
- Futuristic UI: Dark glassmorphism theme with neon accents (aqua/green/violet)
- Modern App Router: Server page + client component split for performance and RSC safety
- Auth-Ready: Login/Register routes wired with toasts and header actions

## Tech Stack
- Framework: Next.js 15 (App Router, RSC), TypeScript
- UI: Tailwind CSS v4, shadcn/ui, lucide-react, Sonner toasts
- Animations: framer-motion, @motionone/react
- API Integrations: Google Gemini (optimize), Cerebras (chat/models)

Important: styled-jsx is not used and will break builds in Next 15. Tailwind only.

## Core Flow
1. User enters a prompt in the chat-style console
2. Backend analyzes estimated footprint (energy, CO₂, water)
3. UI displays glowing metric cards and an optimized prompt suggestion
4. Model response is sanitized via regex before rendering in the main answer box

## Repository Structure (key paths)
- src/app
  - page.tsx: Server component page rendering HomeClient with Suspense
  - layout.tsx: Global styles, header, Toaster, and utilities
  - api/
    - gemini/optimize: Prompt optimization endpoint(s)
    - cerebras/chat, cerebras/models: Chat and model list endpoints
  - login/, register/: Auth pages
- src/components
  - OptimizedPrompt.tsx: Main prompt/answer UI + regex sanitizer for answers
  - ui/: shadcn/ui components and Sonner toaster
- src/lib, src/hooks: Utilities and hooks
- src/db: (If present) Drizzle/Turso structures and seeds (project-ready)

## Key Features In Detail
- Regex Sanitizer (main answer box)
  - Strips AI fillers/disclaimers, code fences, blockquotes, bracketed citations
  - Normalizes bullets and headings, preserves line breaks (whitespace-pre-wrap)
  - Falls back to original text if heavy sanitization empties the string
- Server/Client Split
  - Home page is a Server Component wrapped in Suspense for stable SSR/RSC
  - Interactive logic lives in `HomeClient` (Client Component)
- Design System
  - Neon glassmorphism, animated gradients, cyber grid utilities in `globals.css`
  - Consistent tokens via CSS variables and Tailwind v4 `@theme`

## Getting Started
Prerequisites: Node 18+, npm (or bun/pnpm if you prefer adjusting scripts)

Install dependencies:
- npm install

Run the dev server:
- npm run dev

Build & start:
- npm run build
- npm run start

## Environment Variables
Create a .env file at the repo root. Add what you need based on the APIs you enable.

Common keys (examples):
- GOOGLE_GEMINI_API_KEY=your_key_here
- CEREBRAS_API_KEY=your_key_here
- AUTH-related variables if you enable full auth flows (see your auth provider's docs)

Only include variables you actively use. Never commit real keys.

## API Endpoints (overview)
- POST /api/gemini/optimize: Returns optimized prompt and savings estimates
- POST /api/cerebras/chat: Chat with a selected model
- GET /api/cerebras/models: Retrieve available model list

Note: Keep calls server-side where possible; never expose secrets client-side.

## UI/UX Notes
- Dark, futuristic aesthetic (Tron vibes) with smooth animations
- Answer panel uses whitespace-pre-wrap to preserve line breaks
- Navigation header contains logo and auth menu

## Conventions & Gotchas
- App Router under src/app; pages are server components by default
- Client-only behavior must live in client components ("use client")
- Never use styled-jsx; Tailwind-only for styling
- Use shadcn/ui patterns for buttons, dialogs, inputs; Sonner for toasts

## Contributing
- Keep changes focused and incremental
- Follow existing TypeScript types and export patterns
- Prefer small PRs with clear descriptions and screenshots when UI changes

## License
MIT – see LICENSE (or update this if your project uses a different license)