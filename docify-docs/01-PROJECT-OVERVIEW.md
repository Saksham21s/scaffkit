# Prism — Project Overview

> **Tagline:** One command. Complete React project. Production ready.

## 🧠 Vision

Prism is a **smart CLI scaffolding tool** that generates complete, production-grade React projects — web, React Native, or both — from a single interactive prompt. You tell it your preferences, and Prism builds the entire foundation:

- API client with interceptors
- State management (Zustand + TanStack Query)
- Feature-based or flat structure
- UI system (Tailwind or custom)
- Every feature's service, hooks, components, pages
- Documentation + Mermaid diagrams
- Authentication flow
- Routing with lazy loading
- TypeScript or JavaScript

All with **one command.**

---

## 🎯 Core Philosophy

| Principle | Description |
|-----------|-------------|
| **Zero Config** | Opinionated defaults that work. No manual setup. |
| **Production First** | Every file is production-optimized. Error boundaries, loading states, validation built in. |
| **Feature-Focused** | Feature-based architecture as default. Scalable for teams. |
| **Developer Joy** | Beautiful CLI, clear prompts, instant output. |
| **No AI Dependency** | Works fully offline. AI (DeepSeek) is optional for enhanced docs. |

---

## 🛠️ What Prism Generates

```
my-project/
├── src/
│   ├── shared/
│   │   ├── core/
│   │   │   ├── api/
│   │   │   │   ├── client.ts          # Axios/fetch client with interceptors
│   │   │   │   ├── apiRoutes.ts       # Centralized route definitions
│   │   │   │   └── index.ts
│   │   │   ├── auth/
│   │   │   │   ├── AuthContext.tsx     # Auth state management
│   │   │   │   ├── sessionService.ts  # Token management
│   │   │   │   └── index.ts
│   │   │   ├── config/
│   │   │   │   ├── app.ts             # App configuration
│   │   │   │   └── routes.config.ts   # Route definitions
│   │   │   └── components/
│   │   │       ├── Providers.tsx       # All providers nested
│   │   │       ├── ErrorPage.tsx       # Global error boundary
│   │   │       └── index.ts
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useModal.ts
│   │   │   ├── usePagination.ts
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── cn.ts                  # className utility
│   │   │   ├── queryClient.ts         # TanStack Query config
│   │   │   ├── supabase.ts            # Optional Supabase
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.tsx         # Auth guard
│   │   │   ├── index.tsx              # Router setup
│   │   │   └── index.ts
│   │   ├── constants/
│   │   │   ├── icons.ts
│   │   │   ├── status.ts
│   │   │   ├── roles.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── format.ts
│   │   │   ├── notify.ts
│   │   │   ├── exportService.ts
│   │   │   └── index.ts
│   │   └── styles/
│   │       ├── tokens.css
│   │       ├── reset.css
│   │       ├── animations.css
│   │       ├── forms.css
│   │       └── index.css
│   ├── features/           # OR flat src/components/
│   │   └── [feature-name]/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       ├── services/
│   │       ├── constants/
│   │       ├── index.ts
│   │       └── README.md
│   ├── components/         # Shared UI (only if Tailwind)
│   │   ├── ui/             # Reusable UI primitives
│   │   ├── layout/         # Layout components
│   │   └── common/         # Shared feature components
│   ├── App.tsx
│   ├── main.tsx
│   └── index.html
├── tests/
├── docs/                   # Auto-generated documentation
│   ├── architecture.md
│   └── features/
├── .env.example
├── tailwind.config.js      # If Tailwind chosen
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md               # Beautiful, complete README
```

---

## 🔄 User Flow

```
$ npx prism init

  ◇  What is your project name? … my-app
  ◇  TypeScript or JavaScript? … typescript / javascript
  ◇  Target platforms? … web / mobile / both
  ◇  Styling system? … tailwind / custom-css / css-modules
  ◇  Project structure? … feature-based / flat
  ◇  State management? … zustand-query / redux / context-only
  ◇  Include auth? … yes / no
  ◇  Include routing? … yes / no
  ◇  Include tests? … yes / no

  ✓  Generating project structure...
  ✓  Creating shared core modules...
  ✓  Setting up state management...
  ✓  Configuring API layer...
  ✓  Creating UI system...
  ✓  Setting up routing...
  ✓  Generating documentation...
  ✓  Installing dependencies...

  ✨  Project "my-app" created in 12.4s!
  📂  cd my-app
  🚀  npm run dev
```

---

## 📦 Output Quality

Every generated file follows the **Nexo Standard** — the same architecture, patterns, and production optimizations used in the Nexo Admin project:

| Quality | Standard |
|---------|----------|
| **TypeScript** | Strict mode. No `any`. Full generics. |
| **Error Handling** | Every async operation wrapped. Error boundaries. |
| **Performance** | Lazy loading. Code splitting. Memoization. |
| **Accessibility** | ARIA labels. Keyboard nav. Focus management. |
| **Styling** | Dark mode ready. Responsive. Design tokens. |
| **State** | TanStack Query for server state. Zustand for UI state. |
| **API** | Axios/fetch with interceptors. Token refresh. Error mapping. |
| **Testing** | Vitest + React Testing Library setup. |
| **Documentation** | Auto-generated READMEs + Mermaid diagrams. |

---

## 🎯 Job Market Impact

| Hiring Manager Sees | Prism Demonstrates |
|--------------------|-------------------|
| **Architecture expertise** | Designed a code generation engine that understands React patterns |
| **Tooling skills** | Built a production-grade CLI with Commander, Chalk, Ora |
| **TypeScript mastery** | Complex generics, template literals, mapped types |
| **Full-stack thinking** | API layer, state, routing, auth — all integrated |
| **Developer advocacy** | Created a tool that helps thousands of developers |
| **Product mindset** | From user input → complete product output |
| **System design** | Template engine, file generation, dependency management |
