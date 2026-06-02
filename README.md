# scaffkit

[![npm version](https://img.shields.io/npm/v/scaffkit)](https://www.npmjs.com/package/scaffkit)
[![License](https://img.shields.io/npm/l/scaffkit)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-strict)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/github/stars/Saksham21s/scaffkit)](https://github.com/Saksham21s/scaffkit)

**scaffkit** is an interactive CLI that generates production-grade React projects. It asks you a series of questions about your preferences, then builds a complete application with API client, design tokens, state management, routing, and feature modules — all wired together and ready to run.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#3b82f6', 'primaryTextColor': '#ffffff', 'lineColor': '#3b82f6'}}}%%
graph LR
    subgraph Input["Interactive Prompts"]
        P1["Project name"]
        P2["TypeScript or JavaScript"]
        P3["Styling system"]
        P4["Features to include"]
    end
    
    subgraph Output["Generated Project"]
        O1["API client with auth"]
        O2["Design token system"]
        O3["State management"]
        O4["Feature modules"]
        O5["Routing + layouts"]
        O6["UI components"]
    end
    
    P1 --> Output
    P2 --> Output
    P3 --> Output
    P4 --> Output
```

---

## Quick Start

```bash
npx scaffkit init
```

The CLI will ask you a series of questions about your project preferences. Answer them, and within seconds you will have a complete, production-ready React application.

To skip prompts and use defaults:

```bash
npx scaffkit init --yes --output my-app
cd my-app
npm run dev
```

---

## Interactive Prompts

When you run `npx scaffkit init` without the `--yes` flag, the CLI presents a series of interactive prompts:

| Prompt | Options | Default |
|---|---|---|
| Project name | Text input | `my-app` |
| TypeScript or JavaScript | TypeScript / JavaScript | TypeScript |
| Styling system | Tailwind CSS / Custom CSS / CSS Modules | Tailwind CSS |
| Target platforms | Web / Mobile / Both | Web |
| State management | Zustand + TanStack Query / Redux Toolkit / Context only | Zustand + TanStack Query |
| Include authentication | Yes / No | Yes |
| Include routing | Yes / No | Yes |
| Include testing setup | Yes / No | Yes |
| Feature modules | Multi-select: auth, dashboard, users, settings | auth, dashboard, users |

Each answer dynamically changes the generated output. Choosing JavaScript gives you `.jsx` files instead of `.tsx`. Choosing Custom CSS generates a complete design token system instead of Tailwind config.

---

## Generated Project

### Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── ui/                  # Button, Input, Modal, Select, DataTable, etc.
│   │   ├── layout/              # Sidebar, Header, AuthLayout
│   │   └── common/              # SearchBar, Breadcrumbs, EmptyState
│   ├── features/
│   │   ├── auth/                # Authentication module
│   │   │   ├── components/      # LoginForm, RegisterForm
│   │   │   ├── hooks/           # useAuth, useLogin, useRegister
│   │   │   ├── pages/           # LoginPage, RegisterPage
│   │   │   ├── services/        # authService
│   │   │   ├── constants/       # route paths, roles
│   │   │   └── types/           # User, LoginPayload
│   │   ├── dashboard/
│   │   └── users/
│   ├── shared/
│   │   ├── core/
│   │   │   ├── api/             # Axios client, interceptors, routes
│   │   │   ├── auth/            # Session service, token management
│   │   │   ├── context/         # Theme, Notification, Layout providers
│   │   │   └── components/      # Providers, ErrorBoundary
│   │   ├── hooks/               # useDebounce, useLocalStorage, useModal
│   │   ├── lib/                 # cn, queryClient, store factory
│   │   ├── utils/               # format, notify, export
│   │   ├── constants/           # Status, roles, icons
│   │   ├── routes/              # Router config with lazy loading
│   │   └── styles/              # tokens.css, base.css, animations.css
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts           # Only when Tailwind is chosen
```

### Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#3b82f6', 'secondaryColor': '#8b5cf6', 'tertiaryColor': '#06b6d4', 'lineColor': '#94a3b8'}}}%%
graph TD
    subgraph Pipeline["scaffkit Generation Pipeline"]
        Prompts["Interactive Prompts<br/>inquirer"] --> Config["Config Builder<br/>Zod validation"]
        Config --> Engine["Generator Engine<br/>Priority-ordered pipeline"]
        Engine --> Core["Core Generator<br/>package.json, tsconfig, vite"]
        Engine --> API["API Generator<br/>Axios client, routes, types"]
        Engine --> State["State Generator<br/>QueryClient, stores, providers"]
        Engine --> UI["UI Generator<br/>Components, tokens, layouts"]
        Engine --> Feature["Feature Generator<br/>Per-module services, hooks, pages"]
        Engine --> Route["Route Generator<br/>Router, lazy loading, guards"]
        Engine --> Auth["Auth Generator<br/>Context, session, login page"]
        Engine --> Doc["Doc Generator<br/>README, Mermaid diagrams"]
        Engine --> FileWriter["File Writer<br/>Atomic disk output + Prettier"]
    end

    style Pipeline fill:#1e293b,color:#f1f5f9
```

### API Client

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ef4444', 'secondaryColor': '#f59e0b', 'tertiaryColor': '#10b981'}}}%%
sequenceDiagram
    participant App as Application
    participant Interceptor as Request Interceptor
    participant API as Axios Instance
    participant Queue as Refresh Queue
    participant Backend as Backend API

    App->>Interceptor: API call
    Interceptor->>Interceptor: Attach Bearer token
    Interceptor->>API: Forward request
    API->>Backend: HTTP request

    alt 200 success
        Backend-->>API: Response data
        API-->>App: Success response
    end

    alt 401 unauthorized
        Backend-->>API: 401 status
        API->>Queue: Queue concurrent requests
        Queue->>Backend: POST /auth/refresh
        alt Refresh succeeds
            Backend-->>Queue: New access token
            Queue->>Queue: Replay queued requests
            Queue-->>API: Retry with new token
            API-->>App: Success response
        else Refresh fails
            Backend-->>Queue: Refresh expired
            Queue->>Queue: Clear token, redirect login
            Queue-->>App: Error
        end
    end

    alt Network error
        Backend--xAPI: No response
        API-->>App: ApiClientError("Network error", "NETWORK", 0)
    end

    alt Timeout (30s)
        Backend--xAPI: Connection aborted
        API-->>App: ApiClientError("Request timed out", "TIMEOUT", 408)
    end
```

---

## CLI Commands

| Command | Description |
|---|---|
| `scaffkit init` | Start interactive project generation |
| `scaffkit init --yes --output <dir>` | Generate project with default options |
| `scaffkit test` | Run end-to-end self-test |
| `scaffkit add <feature>` | Add a feature to an existing project (coming) |
| `scaffkit sync <spec>` | Generate from OpenAPI spec (coming) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build | Vite 6 + TypeScript 5.7 |
| Styling | Tailwind CSS 3.4 / Custom CSS / CSS Modules |
| API Client | Axios with interceptor pipeline |
| Server State | TanStack Query 5 |
| Client State | Zustand 5 / Redux Toolkit / Context |
| Routing | React Router 6 with lazy loading |
| Icons | Lucide React |

---

## CLI Development

```bash
git clone https://github.com/Saksham21s/scaffkit.git
cd scaffkit
npm install

# Run the CLI directly (no build needed)
npm start init

# Skip prompts with defaults
npm start -- --yes --output ./my-app

# Or build and run from dist/
npm run preview init
```

---

## License

MIT.
