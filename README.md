Here’s the improved README in plain copy-ready text:

```
# 🌱 Sustain-A-Prompt

*Because every keystroke has a footprint.*  
An eco-aware **prompt optimizer** built at **PennApps XXVI** with **Next.js 15, TypeScript, Tailwind v4, and shadcn/ui**.  

👉 Enter a prompt → we estimate **energy ⚡ / CO₂ 🌍 / water 💧** impact → we generate an optimized prompt with projected savings → and render a clean, copy-paste-ready answer (thanks to our regex-powered sanitizer).

---

## ✨ Why it’s cool
- **Optimized Prompting:** Get a leaner, greener prompt with % savings shown right up front.  
- **Eco Stats You Can Flex:** Glowing metric cards display your energy, CO₂, and water footprint.  
- **No AI Clutter:** Regex sanitizer scrubs disclaimers, fences, and markdown noise.  
- **Cyberpunk Vibes:** Dark glassmorphism, neon accents (aqua/green/violet), and smooth animations.  
- **Modern Architecture:** Next.js App Router split (server + client), safe for RSC.  
- **Auth-Ready:** Login/Register routes, toast feedback, and header actions built-in.  

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router, RSC), TypeScript  
- **UI:** Tailwind CSS v4, shadcn/ui, lucide-react, Sonner toasts  
- **Animations:** framer-motion, @motionone/react  
- **APIs:** Google Gemini (prompt optimization), Cerebras (chat/models)  

⚠️ *Note:* **styled-jsx** will break builds in Next 15. Stick with Tailwind.

---

## 🔄 How It Works
1. You drop in a prompt (chat-style console).  
2. Backend estimates its **energy, CO₂, and water** footprint.  
3. UI glows with eco stats + suggests a greener prompt.  
4. Response is sanitized → clean, readable answer box.  

---

## 📂 Repo Tour
```

src/app
├─ page.tsx        → Server Component (renders HomeClient w/ Suspense)
├─ layout.tsx      → Global styles, header, toaster
├─ api/
│   ├─ gemini/optimize   → Prompt optimization endpoints
│   ├─ cerebras/chat     → Chat with Cerebras
│   └─ cerebras/models   → Model list
├─ login/, register/     → Auth pages

src/components
├─ OptimizedPrompt.tsx   → Main UI + regex sanitizer
└─ ui/                   → shadcn/ui components + Sonner toaster

src/lib, src/hooks          → Utilities & hooks
src/db (optional)           → Drizzle/Turso setup

````

---

## 🧩 Feature Deep-Dive
- **Regex Sanitizer:**  
  Strips out filler, fences, and citations. Normalizes bullets/headings. Keeps line breaks. If sanitization wipes too much, it falls back gracefully.  

- **Server/Client Split:**  
  Home page = Server Component (SSR/RSC stable). Interactive magic = `HomeClient`.  

- **Design System:**  
  Neon glassmorphism, animated gradients, and cyber-grid vibes (`globals.css`). Tailwind v4 `@theme` for consistent tokens.  

---

## 🚀 Getting Started
**Prereqs:** Node 18+, npm (or bun/pnpm).  

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build & start
npm run build
npm run start
````

---

## 🔑 Environment Setup

Create a `.env` at project root with only the keys you actually use:

```
GOOGLE_GEMINI_API_KEY=your_key_here
CEREBRAS_API_KEY=your_key_here
# Auth provider vars if using login/register
```

⚠️ Never commit real keys.

---

## 📡 API Endpoints

* `POST /api/gemini/optimize` → optimized prompt + savings
* `POST /api/cerebras/chat` → chat with selected model
* `GET /api/cerebras/models` → list available models

(*Server-side only—don’t leak secrets!*)

---

## 🎨 UI/UX Notes

* Tron-like aesthetic: dark glass + neon glow
* Answer panel respects line breaks (`whitespace-pre-wrap`)
* Header = logo + auth menu

---

## 🧭 Conventions & Gotchas

* Pages default to **Server Components** (under `src/app`).
* Client-only logic must be wrapped with `"use client"`.
* Styling = **Tailwind only**, no styled-jsx.
* For UI: stick to **shadcn/ui** + Sonner patterns.

---

## 🤝 Contributing

* Keep PRs small + focused.
* Follow TypeScript typings & exports.
* UI changes? Add screenshots in your PR description.

---

## 📜 License

MIT – see LICENSE file (or update if your project uses another license).

---

⚡ *Built with love, caffeine, and way too many regexes at PennApps XXVI.* 🌍💧

```

Would you like me to also give you an **ASCII banner version** at the very top so it pops instantly on GitHub?
```
