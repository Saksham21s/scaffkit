# Phase 2: Generators — All 10 Code Generators

> **Duration:** ~10 milestones
> **Goal:** Every generator produces production-grade files.

---

## Milestone 2.1: Core Scaffold Generator

**Priority: 100** — Runs first. Creates the foundation of every project.

### Generated Files

| File | Purpose | Complexity |
|------|---------|-----------|
| `package.json` | Dependencies, scripts | 🟡 Medium — dynamic deps based on config |
| `tsconfig.json` | TypeScript strict config | 🟢 Low — path aliases |
| `vite.config.ts` | Vite + React + path aliases | 🟢 Low |
| `postcss.config.js` | PostCSS + Tailwind | 🟢 Low |
| `index.html` | HTML shell with SEO meta | 🟢 Low |
| `.gitignore` | Git ignore rules | 🟢 Low |
| `.env.example` | Environment variables | 🟢 Low |
| `src/main.tsx` | React entry point | 🟢 Low |
| `src/App.tsx` | Root component | 🟢 Low |
| `src/vite-env.d.ts` | Vite type declarations | 🟢 Low |

### Implementation

```typescript
// src/generators/core-scaffold.ts
class CoreScaffoldGenerator implements Generator {
  name = "Core Scaffold";
  priority = 100;

  async generate(config: DocifyConfig): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // package.json — dynamic deps
    files.push({
      path: "package.json",
      content: this.buildPackageJson(config),
    });

    // Build configs
    files.push({
      path: "tsconfig.json",
      content: this.buildTsConfig(config),
    });

    files.push({
      path: "vite.config.ts",
      content: this.buildViteConfig(config),
    });

    // index.html — SEO-aware
    files.push({
      path: "index.html",
      content: this.buildIndexHtml(config),
    });

    // Config files
    files.push({
      path: "postcss.config.js",
      content: `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n`,
    });

    files.push({
      path: ".gitignore",
      content: `node_modules\ndist\n.env\n.env.local\n*.tsbuildinfo\n`,
    });

    files.push({
      path: ".env.example",
      content: `VITE_API_BASE_URL=/api\nVITE_APP_TITLE=${config.project.name}\n`,
    });

    // Entry points
    files.push({
      path: "src/main.tsx",
      content: this.buildMainEntry(config),
    });

    files.push({
      path: "src/App.tsx",
      content: this.buildApp(config),
    });

    files.push({
      path: "src/vite-env.d.ts",
      content: `/// <reference types="vite/client" />\n`,
    });

    // Shared lib utilities
    files.push({
      path: "src/shared/lib/cn.ts",
      content: this.buildCnUtility(config),
    });

    return files;
  }

  private buildPackageJson(config: DocifyConfig): string {
    const deps: Record<string, string> = {
      "react": "^18.3.0",
      "react-dom": "^18.3.0",
    };

    if (config.tech.styling === "tailwind") {
      deps["lucide-react"] = "^0.400.0";
    }

    if (config.modules.routing) {
      deps["react-router-dom"] = "^6.23.0";
    }

    if (config.tech.state === "zustand-query") {
      deps["@tanstack/react-query"] = "^5.40.0";
      deps["zustand"] = "^4.5.0";
    } else if (config.tech.state === "redux") {
      deps["@reduxjs/toolkit"] = "^2.2.0";
      deps["react-redux"] = "^9.1.0";
    }

    if (config.tech.apiClient === "axios") {
      deps["axios"] = "^1.7.0";
    }

    if (config.modules.auth) {
      deps["jose"] = "^5.3.0"; // For JWT verification
    }

    const devDeps: Record<string, string> = {
      "@types/react": "^18.3.0",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.0",
      "vite": "^5.2.0",
    };

    if (config.tech.typescript) {
      devDeps["typescript"] = "^5.4.0";
    }

    if (config.tech.styling === "tailwind") {
      devDeps["tailwindcss"] = "^3.4.0";
      devDeps["autoprefixer"] = "^10.4.0";
      devDeps["postcss"] = "^8.4.0";
    }

    if (config.modules.testing) {
      devDeps["vitest"] = "^1.6.0";
      devDeps["@testing-library/react"] = "^15.0.0";
      devDeps["@testing-library/jest-dom"] = "^6.4.0";
      devDeps["jsdom"] = "^24.0.0";
    }

    return JSON.stringify({
      name: config.project.name,
      private: true,
      version: config.project.version,
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        lint: "eslint .",
        preview: "vite preview",
        ...(config.modules.testing ? { test: "vitest run", "test:watch": "vitest" } : {}),
      },
      dependencies: deps,
      devDependencies: devDeps,
    }, null, 2);
  }

  private buildTsConfig(config: DocifyConfig): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolateModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"],
          "@core/*": ["./src/shared/core/*"],
          "@shared/*": ["./src/shared/*"],
          "@components/*": ["./src/components/*"],
          "@features/*": ["./src/features/*"],
        },
      },
      include: ["src"],
    }, null, 2);
  }
}
```

### Edge Cases for Core Scaffold

| Edge Case | Handling |
|-----------|----------|
| Invalid package name (scoped names like @company/app) | Handle with validate-npm-package-name |
| No Tailwind + no CSS Modules | Generate minimal styles/index.css |
| fetch API client (no axios) | Skip axios dep, generate fetch-based client |
| Redux + devtools | Add @reduxjs/dex-tools only in dev |
| PWA enabled | Add vite-plugin-pwa + service worker registration |
| Mobile-only project | Skip web-only deps (react-router-dom, etc.) |

---

## Milestone 2.2: API Layer Generator

**Priority: 200** — Creates the HTTP communication layer.

### Generated Files

| File | Purpose |
|------|---------|
| `src/shared/core/api/client.ts` | Axios/Fetch instance with interceptors |
| `src/shared/core/api/apiRoutes.ts` | Centralized route definitions |
| `src/shared/core/api/types.ts` | Generic API types |
| `src/shared/core/api/index.ts` | Barrel exports |

### API Client (Axios variant — recommended)

```typescript
// Generated: src/shared/core/api/client.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { sessionService } from "../auth/sessionService";
import type { ApiError } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const API_TIMEOUT = 30000;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — token refresh queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await sessionService.refreshToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        sessionService.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || "Something went wrong",
      status: error.response?.status || 500,
      code: error.response?.data?.code || "UNKNOWN_ERROR",
      details: error.response?.data?.details,
    };

    return Promise.reject(apiError);
  }
);
```

### API Routes

```typescript
// Generated: src/shared/core/api/apiRoutes.ts
export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  // [DOCIFY-INJECT-NEW-API-ROUTE-HERE] — Anchor for sync command
} as const;
```

### Edge Cases for API Layer

| Edge Case | Handling |
|-----------|----------|
| Token refresh race condition | Queue pattern — only one refresh at a time |
| 401 on refresh endpoint itself | Don't retry, redirect to login |
| Network offline | Catch with axios retry, show offline state |
| Multiple 401s in parallel | Queue them, single refresh call |
| API base URL with trailing slash | Normalize in client constructor |
| CORS errors | Show clear error with CORS troubleshooting |
| 5xx server errors (retry) | Exponential backoff, max 2 retries for 5xx, 0 for 4xx |
| Timeout on slow network | Configurable timeout, default 30s |
| Large response payload | Stream support, progress tracking |
| API versioning in URL | Support configurable base path prefix |

---

## Milestone 2.3: State Management Generator

**Priority: 300** — Creates the state layer.

### Generated Files (Zustand + TanStack Query — default)

| File | Purpose |
|------|---------|
| `src/shared/lib/queryClient.ts` | TanStack Query configuration |
| `src/shared/lib/store.ts` | Zustand store factory |
| `src/shared/lib/devtools.ts` | DevTools configuration |
| `src/shared/core/context/ThemeContext.tsx` | Theme provider |
| `src/shared/core/context/NotificationContext.tsx` | Toast notification context |
| `src/shared/core/context/LayoutContext.tsx` | Sidebar/breadcrumbs context |
| `src/shared/core/components/Providers.tsx` | All providers nested |

### Query Client Configuration

```typescript
// Generated: src/shared/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@core/api/types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,           // 30 seconds
      gcTime: 5 * 60 * 1000,          // 5 minutes
      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        if (apiError?.status && apiError.status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Zustand Store Factory

```typescript
// Generated: src/shared/lib/store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface StoreConfig<T> {
  name: string;
  initialState: T;
  persist?: boolean;
  partialize?: (state: T) => Partial<T>;
}

export function createStore<T extends Record<string, unknown>>(config: StoreConfig<T>) {
  const store = (
    set: (fn: (state: T) => Partial<T>) => void,
    get: () => T
  ) => ({
    ...config.initialState,
    reset: () => set(() => config.initialState),
    set: (updates: Partial<T>) => set(() => updates),
  });

  const middlewares = [devtools];

  if (config.persist) {
    middlewares.push(
      persist({
        name: config.name,
        partialize: config.partialize,
      })
    );
  }

  return create<T & { reset: () => void; set: (updates: Partial<T>) => void }>()(
    ...middlewares,
    store
  );
}
```

### Edge Cases for State

| Edge Case | Handling |
|-----------|----------|
| Zustand + Query devtools conflict | Separate devtools imports for clarity |
| Zustand persist with undefined values | Filter out undefined with partialize |
| Redux + RTK Query code splitting | Use injectEndpoints for lazy features |
| Context-only with many re-renders | Split contexts by concern (theme, notifications, layout) |
| SSR compatibility (if needed) | Skip persist in SSR, use useEffect for hydration |

---

## Milestone 2.4: UI System Generator

**Priority: 350** — The most complex generator. See full component details in component docs.

### Generated Files (Tailwind variant)

```
src/styles/
├── index.css                  # Tailwind directives
├── animations.css             # Keyframe animations
└── forms.css                  # Form element overrides

src/components/ui/
├── Button.tsx                 # 5 variants, 5 sizes, loading, icon
├── Input.tsx                  # 3 variants, 3 sizes, error, icon
├── Badge.tsx                  # 5 semantic colors
├── Card.tsx                   # 7 variants, compound components
├── Modal.tsx                  # Focus trap, escape, animation
├── Select.tsx                 # Searchable, multi, clearable, portal
├── Tabs.tsx                   # 2 styles, keyboard nav
├── Switch.tsx                 # role="switch", animation
├── Toast.tsx                  # 4 types, auto-dismiss
├── Tooltip.tsx                # 4 positions, portal
├── Skeleton.tsx               # 3 variants
├── Avatar.tsx                 # 3 sizes, initials, gradient
├── Dropdown.tsx               # Menu pattern, keyboard
├── DataTable.tsx              # Full data table with pagination
├── Pagination.tsx             # Page nav, rows per page
├── EmptyState.tsx             # Icon, message, action
├── ErrorBoundary.tsx          # Error capture, reset
└── index.ts                   # Barrel exports

src/components/layout/
├── DashboardLayout.tsx        # Main app shell
├── Sidebar.tsx                # Collapsible, nested groups
├── Header.tsx                 # Breadcrumbs, search, notifications
└── AuthLayout.tsx             # Centered auth pages

src/components/common/
├── SearchBar.tsx              # Debounced search
├── Breadcrumbs.tsx            # Breadcrumb trail
├── KpiGrid.tsx                # Stats cards grid
├── EntityHeroSection.tsx      # Entity page hero
├── ViewToggle.tsx             # Grid/List toggle
└── EmptyState.tsx             # (re-export from ui/)
```

### Key UI Components to Generate

#### Button (5 variants, 5 sizes)

```tsx
// Generated: src/components/ui/Button.tsx
import { forwardRef } from "react";
import { cn } from "@shared/lib/cn";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
  secondary: "bg-surface-secondary text-text-primary border border-border hover:bg-surface-tertiary",
  outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
  ghost: "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary",
  danger: "bg-error text-white hover:bg-red-600 active:bg-red-700",
} as const;

const sizes = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", isLoading, disabled, icon: Icon, children, className, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-base",
        "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children && <span>{children}</span>}
    </button>
  );
});
```

#### Modal (with Focus Trap)

```tsx
// Generated: src/components/ui/Modal.tsx
import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@shared/lib/cn";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") { onClose?.(); return; }
    if (e.key === "Tab") {
      const focusable = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = "hidden";
      contentRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      (previousActiveElement.current as HTMLElement)?.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-modal flex items-center justify-center"
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div ref={contentRef} tabIndex={-1}
        className={cn("relative bg-surface-bg rounded-xl shadow-modal animate-scale-in p-6 max-h-[85vh] overflow-y-auto focus:outline-none", sizes[size])}>
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-sm hover:bg-surface-tertiary" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

### Edge Cases for UI Generator

| Edge Case | Handling |
|-----------|----------|
| Custom CSS variant instead of Tailwind | Generate CSS modules + design tokens instead of Tailwind classes |
| CSS Modules variant | Generate `.module.css` files alongside components |
| No lucide-react (lighter setup) | Use SVG inline icons or simple text fallbacks |
| Dark mode at component level | All components use CSS variables, dark mode works automatically |
| RTL layout support | Add `dir="rtl"` support in layout components, mirror margins |
| Reduced motion preference | Respect `prefers-reduced-motion`, disable animations |
| High contrast mode | Ensure WCAG AA contrast ratios with CSS variables |

---

## Milestone 2.5: Feature Generator

**Priority: 400** — The most powerful generator. Creates complete feature modules.

### Generated Files per Feature

```
src/features/[feature-name]/
├── components/
│   ├── [FeatureName]List.tsx       # List view component
│   ├── [FeatureName]Card.tsx       # Card view component
│   ├── [FeatureName]Filter.tsx     # Filter bar
│   ├── [FeatureName]Form.tsx       # Add/Edit form
│   ├── [FeatureName]Detail.tsx     # Detail view
│   └── index.ts                    # Barrel exports
├── hooks/
│   ├── use[FeatureName]List.ts     # TanStack Query list hook
│   ├── use[FeatureName]Detail.ts   # TanStack Query detail hook
│   ├── use[FeatureName]Mutations.ts # Create/Update/Delete mutations
│   ├── queryKeys.ts                # Query key factory
│   └── index.ts
├── pages/
│   ├── [FeatureName]ListPage.tsx   # List page
│   ├── [FeatureName]DetailPage.tsx # Detail page
│   └── index.ts
├── services/
│   └── [featureName]Service.ts     # API calls
├── types/
│   └── index.ts                    # Feature-specific types
├── constants/
│   └── index.ts                    # Feature constants
├── store/
│   └── [featureName]Store.ts       # Zustand UI state
├── index.ts                        # Feature barrel export
└── README.md                       # Auto-generated docs
```

### Edge Cases for Feature Generator

| Edge Case | Handling |
|-----------|----------|
| Feature name is a JS reserved keyword | Prefix with underscore, e.g., "class" → "_class" |
| Feature name has spaces | Auto-convert to kebab-case with warning |
| Flat structure (no features) | Skip feature generation entirely |
| Adding feature to existing project via `docify add` | Read existing config, generate feature files, update routes+sidebar |
| Feature already exists | Check for conflicts, prompt for overwrite/skip/merge |
| Very deep feature nesting | Limit to 2 levels (e.g., "users/admins" → users feature, admins subsection) |

---

## Milestone 2.6: Route Generator

**Priority: 500** — Creates routing infrastructure.

### Generated Files

| File | Purpose |
|------|---------|
| `src/shared/routes/index.tsx` | Router setup with lazy loading |
| `src/shared/routes/authRoutes.tsx` | Auth-protected route wrapper |
| `src/shared/config/routes.config.ts` | Route path constants |

### Implementation

```tsx
// Generated: src/shared/routes/index.tsx
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@components/layout/DashboardLayout";
import { AuthLayout } from "@components/layout/AuthLayout";
import { Spinner } from "@components/ui";
import { AuthGuard } from "./authRoutes";

// Lazy-loaded pages
const LoginPage = lazy(() => import("@features/auth/pages/LoginPage"));
const DashboardPage = lazy(() => import("@features/dashboard/pages/DashboardPage"));
const UsersListPage = lazy(() => import("@features/users/pages/UsersListPage"));
const UsersDetailPage = lazy(() => import("@features/users/pages/UsersDetailPage"));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
    ],
  },
  {
    path: "/",
    element: <AuthGuard><DashboardLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: "users", element: <SuspenseWrapper><UsersListPage /></SuspenseWrapper> },
      { path: "users/:id", element: <SuspenseWrapper><UsersDetailPage /></SuspenseWrapper> },
      // [DOCIFY-INJECT-ROUTE-HERE] — Anchor for docify add command
    ],
  },
]);
```

### Edge Cases for Route Generator

| Edge Case | Handling |
|-----------|----------|
| No routing module | Wrap app in simple BrowserRouter without routes |
| Auth disabled | Remove AuthGuard wrapper |
| Deeply nested routes | Support up to 3 levels of nesting |
| Route collision | Detect duplicate paths, warn user |
| Dynamic segments (e.g., /users/:id) | Add proper param types |

---

## Milestone 2.7: Auth Generator

**Priority: 600** — Creates authentication infrastructure.

### Generated Files

| File | Purpose |
|------|---------|
| `src/shared/core/auth/AuthContext.tsx` | Auth state + user session |
| `src/shared/core/auth/sessionService.ts` | Token management (storage, refresh) |
| `src/shared/core/auth/PrivateRoute.tsx` | Auth guard component |
| `src/features/auth/pages/LoginPage.tsx` | Login form |
| `src/features/auth/pages/ForgotPasswordPage.tsx` | Forgot password form |
| `src/features/auth/components/LoginForm.tsx` | Reusable login form component |
| `src/features/auth/services/authService.ts` | Auth API calls |
| `src/features/auth/hooks/useAuth.ts` | Auth hook (login, logout, signup) |
| `src/features/auth/types/index.ts` | Auth type definitions |

### Edge Cases for Auth Generator

| Edge Case | Handling |
|-----------|----------|
| Token expired mid-session | Auto-refresh with queue pattern |
| Refresh token also expired | Redirect to login, preserve return URL |
| Multiple tabs open | Sync logout across tabs via storage event |
| Auth disabled | Skip all auth files |
| OAuth/SSO support | Add configurable OAuth provider wrapper |
| Session persistence | Use localStorage with `jose` for JWT verification |

---

## Milestone 2.8: Test Generator

**Priority: 700** — Creates testing infrastructure.

### Generated Files

| File | Purpose |
|------|---------|
| `src/test/setup.ts` | Test environment setup |
| `src/test/test-utils.tsx` | Custom render with providers |
| `src/test/mocks/handlers.ts` | MSW handlers (if testing enabled) |
| `src/test/mocks/server.ts` | MSW server setup |
| `src/components/ui/__tests__/Button.test.tsx` | Example button test |
| `src/features/users/components/__tests__/UsersList.test.tsx` | Example feature test |

---

## Milestone 2.9: Doc Generator

**Priority: 800** — Creates documentation.

### Generated Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview with badges, quick start |
| `docs/architecture.md` | Mermaid architecture diagrams |
| `docs/features/[feature].md` | Per-feature documentation |
| `docs/data-flow.md` | Data flow diagrams |
| `CONTRIBUTING.md` | Contribution guidelines |

### Mermaid Diagram Generation

```typescript
// generators/doc-generator.ts — Mermaid builder
private buildArchitectureDiagram(config: DocifyConfig): string {
  return `\`\`\`mermaid
graph TD
    User[User] --> UI[React UI]
    UI --> API[API Client Layer]
    API --> Services[Feature Services]
    Services --> TanStack[TanStack Query]
    TanStack --> Cache[Query Cache]
    UI --> Zustand[Zustand UI State]
    Zustand --> Store[Feature Stores]
    Auth[Auth Module] --> API
    Auth --> Session[Session Management]
    Router[React Router] --> UI
    Router --> Guards[Auth Guards]
\`\`\``;
}
```

---

## Milestone 2.10: Mobile Generator (Optional)

**Priority: 900** — Creates React Native / Expo setup.

### Generated Files (Conditional)

| File | Purpose |
|------|---------|
| `app.json` | Expo configuration |
| `App.tsx` | React Native entry |
| `babel.config.js` | Babel with Expo preset |
| `metro.config.js` | Metro bundler config |
| `src/shared/core/api/client.ts` | Shared API client (fetch-based for RN) |

### Edge Cases for Mobile Generator

| Edge Case | Handling |
|-----------|----------|
| React Native + Web shared code | Shared core modules (types, API, auth) |
| Platform-specific components | Use .web.tsx and .native.tsx extensions |
| Expo Router vs React Navigation | Configurable, Expo Router preferred |
| Mobile-only project | Skip web-specific deps and components |
