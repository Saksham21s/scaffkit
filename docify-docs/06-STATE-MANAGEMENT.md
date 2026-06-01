# Prism — State Management Generator

## 🎯 Purpose

The State Management Generator creates the complete state layer for the generated project. It supports three patterns:

1. **Zustand + TanStack Query** (recommended — default)
2. **Redux Toolkit** (enterprise teams)
3. **React Context only** (minimal)

---

## 🧠 State Architecture Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│                     State Architecture                       │
├───────────────────┬───────────────────┬─────────────────────┤
│   Server State    │    UI State       │   URL State         │
│   (TanStack Query)│   (Zustand)       │   (React Router)    │
├───────────────────┼───────────────────┼─────────────────────┤
│ • API data        │ • Sidebar open    │ • Search params     │
│ • Auth session    │ • Modal state     │ • Page numbers      │
│ • Feature lists   │ • Theme mode      │ • Filters           │
│ • Cache & sync    │ • Toast queue     │ • Tab selection     │
│ • Loading states  │ • Form state      │                     │
└───────────────────┴───────────────────┴─────────────────────┘
```

---

## 📦 Generated State Structure

### Zustand + TanStack Query (Default)

```
src/
├── shared/
│   ├── core/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state
│   │   │   ├── ThemeContext.jsx       # Theme state
│   │   │   ├── NotificationContext.jsx # Toast/notifications
│   │   │   └── LayoutContext.jsx       # Sidebar, breadcrumbs
│   │   └── components/
│   │       └── Providers.jsx           # All providers nested
│   ├── lib/
│   │   ├── queryClient.js            # TanStack Query config
│   │   └── store.js                  # Zustand store creator
│   └── hooks/
│       ├── useStore.js               # Zustand selector hook
│       └── index.js
├── features/
│   └── [feature]/
│       ├── hooks/
│       │   ├── queryKeys.js           # Query key constants
│       │   ├── use[Feature]List.js    # List query
│       │   ├── use[Feature]Detail.js  # Detail query
│       │   └── use[Feature]Mutations.js
│       └── store/
│           └── [feature]Store.js     # Feature UI state (Zustand)
```

---

## ⚛️ TanStack Query Client Generator

```typescript
// generators/state-generator.ts
class StateGenerator implements Generator {
  name = "State Management Generator";
  priority = 300;

  async generate(config: PrismConfig): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    if (config.tech.state === "zustand-query") {
      files.push(...this.generateZustandQueryLayer(config));
    } else if (config.tech.state === "redux") {
      files.push(...this.generateReduxLayer(config));
    } else {
      files.push(...this.generateContextOnlyLayer(config));
    }

    return files;
  }
}
```

### Query Client

```typescript
// src/shared/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@core/api/types";

// Global error handler for queries
const globalQueryErrorHandler = (error: unknown): void => {
  const apiError = error as ApiError;

  // Don't show toast for auth errors — interceptor handles redirect
  if (apiError?.status === 401) return;

  console.error("[Query Error]", apiError?.message || error);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,             // 30 seconds
      gcTime: 5 * 60 * 1000,            // 5 minutes
      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        // Don't retry on 4xx errors
        if (apiError?.status && apiError.status < 500) return false;
        return failureCount < 2;          // Max 2 retries for 5xx
      },
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData, // Keep previous data while fetching
    },
    mutations: {
      retry: false,
      onError: globalQueryErrorHandler,
    },
  },
});
```

---

## 🐻 Zustand Store Generator

### Base Store Factory

```typescript
// src/shared/lib/store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface StoreConfig<T> {
  name: string;
  initialState: T;
  persist?: boolean;
}

export function createStore<T extends Record<string, unknown>>(
  config: StoreConfig<T>
) {
  const store = (set: (fn: (state: T) => Partial<T>) => void, get: () => T) => ({
    ...config.initialState,

    /** Reset store to initial state */
    reset: () => set(() => config.initialState),

    /** Update specific fields */
    set: (updates: Partial<T>) => set(() => updates),
  });

  // Apply middleware
  const middlewares = [devtools];

  if (config.persist) {
    middlewares.push(persist);
  }

  return create<T & { reset: () => void; set: (updates: Partial<T>) => void }>()(
    ...middlewares,
    store
  );
}
```

### Generated Feature Store Example

```typescript
// src/features/users/store/usersStore.ts
import { createStore } from "@shared/lib/store";

interface UsersUIState {
  selectedIds: string[];
  viewMode: "table" | "card";
  activeTab: string;
  isFilterDrawerOpen: boolean;
  searchQuery: string;
}

export const useUsersStore = createStore<UsersUIState>({
  name: "users-store",
  initialState: {
    selectedIds: [],
    viewMode: "table",
    activeTab: "all",
    isFilterDrawerOpen: false,
    searchQuery: "",
  },
  persist: true, // Persist view preferences
});

// Selector hooks for performance
export const useUsersSelectedIds = () =>
  useUsersStore((state) => state.selectedIds);

export const useUsersViewMode = () =>
  useUsersStore((state) => state.viewMode);

export const useUsersFilters = () =>
  useUsersStore((state) => ({
    searchQuery: state.searchQuery,
    activeTab: state.activeTab,
  }));
```

---

## 🔄 Context Providers Generator

```typescript
// generators/state-generator.ts — context builder
private buildProviders(config: PrismConfig): string {
  const hasAuth = config.modules.auth;
  const hasQuery = config.tech.state === "zustand-query";

  return `// src/shared/core/components/Providers.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "@shared/lib/queryClient";
import { ThemeProvider } from "@core/context/ThemeContext";
import { NotificationProvider } from "@core/context/NotificationContext";
import { LayoutProvider } from "@core/context/LayoutContext";
${hasAuth ? `import { AuthProvider } from "@core/context/AuthContext";` : ""}
import { Toaster } from "@components/ui/Toaster";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    ${hasQuery ? `<QueryClientProvider client={queryClient}>` : ""}
      <BrowserRouter>
        <ThemeProvider>
          <NotificationProvider>
            <LayoutProvider>
              ${hasAuth ? `<AuthProvider>` : ""}
                {children}
              ${hasAuth ? `</AuthProvider>` : ""}
            </LayoutProvider>
          </NotificationProvider>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
      ${hasQuery ? `<ReactQueryDevtools initialIsOpen={false} />` : ""}
    ${hasQuery ? `</QueryClientProvider>` : ""}
  );
}
`;
}
```

---

## 🎭 Redux Toolkit Generator (Alternative)

For teams that prefer Redux:

```typescript
// generators/state-generator.ts — Redux builder
private generateReduxLayer(config: PrismConfig): GeneratedFile[] {
  return [
    {
      path: "src/shared/lib/store.ts",
      content: `import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Feature reducers added dynamically
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
    },
    // API slice
    {
      path: "src/shared/lib/apiSlice.ts",
      content: `import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("nexo-auth-token");
      if (token) {
        headers.set("Authorization", \`Bearer \${token}\`);
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});`,
    },
  ];
}
```

---

## 📋 Context-Only Generator (Minimal)

```typescript
// generators/state-generator.ts — context-only
private generateContextOnlyLayer(config: PrismConfig): GeneratedFile[] {
  return [
    {
      path: "src/shared/core/context/AppContext.jsx",
      content: `import { createContext, useContext, useReducer, useCallback } from "react";

const AppContext = createContext(null);

const initialState = {
  loading: new Set(),
  notifications: [],
  theme: "light",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = useCallback((key, value) => {
    dispatch({ type: "SET_LOADING", payload: { key, value } });
  }, []);

  const notify = useCallback((notification) => {
    const id = Date.now().toString();
    dispatch({ type: "ADD_NOTIFICATION", payload: { ...notification, id } });
    setTimeout(() => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
    }, 5000);
  }, []);

  return (
    <AppContext.Provider value={{ ...state, setLoading, notify }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}`,
    },
  ];
}
```

---

## 🧪 DevTools Configuration

```typescript
// src/shared/lib/devtools.ts (generated conditionally)
import { queryClient } from "./queryClient";

// TanStack Query DevTools — only renders in dev
export { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Zustand DevTools integration
export const zustandDevtools =
  import.meta.env.DEV
    ? (await import("zustand/middleware")).devtools
    : (fn: unknown) => fn;

// Performance monitoring
export const queryMonitor = {
  log: () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    console.table(
      queries.map((q) => ({
        key: q.queryKey.join("."),
        status: q.state.status,
        dataLength: q.state.data ? JSON.stringify(q.state.data).length : 0,
        fetchTime: q.state.fetchMeta?.fetchTime,
      }))
    );
  },
};
```

---

## 📊 Complexity Matrix

| Component | Difficulty | Lines | Key Challenge |
|-----------|-----------|-------|--------------|
| **Query Client** | 🟡 Medium | ~60 | Retry logic, error boundaries |
| **Zustand Store Factory** | 🔴 Hard | ~80 | Generic types, middleware chaining |
| **Feature Store** | 🟢 Low | ~40 | Simple state slices |
| **Providers Nesting** | 🟢 Low | ~30 | React tree ordering |
| **Redux Store** | 🟡 Medium | ~50 | RTK Query configuration |
| **Context-Only** | 🟢 Low | ~80 | useReducer pattern |
| **DevTools** | 🟡 Medium | ~40 | Conditional imports |

---

## 🎯 State Architecture Decision Tree

```
User selects state management
        │
        ▼
┌── Which pattern? ──┐
│                    │
├─ zustand-query ────┤  🥇 RECOMMENDED
│  ├─ TanStack Query for server state
│  ├─ Zustand for UI state
│  └─ React Context for auth/theme
│
├─ redux ────────────┤  🥈 Enterprise
│  ├─ Redux Toolkit + RTK Query
│  └─ Redux DevTools
│
└─ context-only ─────┤  🥉 Minimal
     ├─ useReducer + Context
     └─ No external deps
```

---

## 📈 Generated State Layer Stats

| Pattern | Files | Lines | Dependencies |
|---------|-------|-------|-------------|
| **Zustand + Query** | ~8 | ~350 | zustand, @tanstack/react-query |
| **Redux Toolkit** | ~6 | ~280 | @reduxjs/toolkit, react-redux |
| **Context Only** | ~3 | ~150 | None |
