# Prism — API Layer Generator

## 🎯 Purpose

The API Layer Generator creates the complete HTTP communication layer for the generated project. It produces:

- API client with interceptors (auth, error, retry)
- Centralized route definitions
- Per-feature service modules
- TanStack Query hooks for every API endpoint
- Axios or fetch-based (user choice)

---

## 🔧 Generated API Layer Structure

```
src/shared/core/api/
├── client.ts              # Axios/fetch instance with interceptors
├── apiRoutes.ts           # Centralized endpoint definitions
├── types.ts               # Request/Response TypeScript types
└── index.ts               # Barrel exports
```

---

## 📦 API Client Generator

```typescript
// generators/api-generator.ts
class APIGenerator implements Generator {
  name = "API Layer Generator";
  priority = 200;

  async generate(config: PrismConfig): Promise<GeneratedFile[]> {
    return [
      {
        path: "src/shared/core/api/client.ts",
        content: this.buildClient(config),
      },
      {
        path: "src/shared/core/api/apiRoutes.ts",
        content: this.buildRoutes(config),
      },
      {
        path: "src/shared/core/api/types.ts",
        content: this.buildTypes(config),
      },
      {
        path: "src/shared/core/api/index.ts",
        content: `export { apiClient } from "./client";\nexport { API_ROUTES } from "./apiRoutes";\nexport type { PaginatedResponse, ApiError } from "./types";\n`,
      },
    ];
  }

  private buildClient(config: PrismConfig): string {
    if (config.tech.typescript) {
      return this.buildTypeScriptClient();
    }
    return this.buildJavaScriptClient();
  }
}
```

---

## 🔌 API Client Templates

### Axios Client (TypeScript)

```typescript
// src/shared/core/api/client.ts
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { sessionService } from "../auth/sessionService";
import type { ApiError } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const API_TIMEOUT = 30000;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

/* ── Request Interceptor ─────────────────────────────── */
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

/* ── Response Interceptor ────────────────────────────── */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 — token expired
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

    // Normalize error shape
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

---

### Fetch Client (lighter alternative)

```typescript
// src/shared/core/api/client.ts
import { sessionService } from "../auth/sessionService";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with params
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Default headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Auth header
  const token = sessionService.getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw {
      message: error.message || "Request failed",
      status: response.status,
      code: error.code || "API_ERROR",
    };
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
```

---

## 🗺️ API Routes Generator

```typescript
// src/shared/core/api/apiRoutes.ts
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
  users: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    create: "/users",
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  // ... dynamic per feature
} as const;
```

### Dynamic Route Generation

```typescript
// api-routes.builder.ts
class ApiRoutesBuilder {
  static fromFeatures(features: string[]): string {
    const routes: Record<string, Record<string, unknown>> = {};

    for (const feature of features) {
      const name = toKebabCase(feature);
      routes[feature] = {
        list: `/${name}`,
        detail: (id: string) => `/${name}/${id}`,
        create: `/${name}`,
        update: (id: string) => `/${name}/${id}`,
        delete: (id: string) => `/${name}/${id}`,
      };
    }

    return `export const API_ROUTES = ${JSON.stringify(routes, null, 2)} as const;`;
  }
}
```

---

## 🏗️ Service Generator

Each feature gets a service module with full CRUD + error handling:

```typescript
// generators/api-generator.ts — service builder
private buildService(name: string, pascal: string, camel: string, config: PrismConfig): string {
  const ext = config.tech.typescript;

  return `// src/features/${name}/services/${camel}Service.${ext ? "ts" : "js"}
import { apiClient } from "@core/api/client";
import { API_ROUTES } from "@core/api/apiRoutes";

${ext ? `
interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: unknown;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
` : ""}

export const ${camel}Service = {
  /** Fetch paginated list */
  getAll: async (params${ext ? ": PaginationParams" : ""} = {}) => {
    const { data } = await apiClient.get(API_ROUTES.${name}.list, { params });
    return data;
  },

  /** Fetch single by ID */
  getById: async (id${ext ? ": string" : ""}) => {
    const { data } = await apiClient.get(API_ROUTES.${name}.detail(id));
    return data;
  },

  /** Create new */
  create: async (payload${ext ? ": Record<string, unknown>" : ""}) => {
    const { data } = await apiClient.post(API_ROUTES.${name}.create, payload);
    return data;
  },

  /** Update existing */
  update: async (id${ext ? ": string" : ""}, payload${ext ? ": Record<string, unknown>" : ""}) => {
    const { data } = await apiClient.put(API_ROUTES.${name}.update(id), payload);
    return data;
  },

  /** Delete */
  delete: async (id${ext ? ": string" : ""}) => {
    await apiClient.delete(API_ROUTES.${name}.delete(id));
  },

  /** Bulk delete */
  bulkDelete: async (ids${ext ? ": string[]" : ""}) => {
    const { data } = await apiClient.post(API_ROUTES.${name}.bulkDelete, { ids });
    return data;
  },

  /** Export */
  export: async (params${ext ? ": Record<string, unknown>" : ""} = {}) => {
    const { data } = await apiClient.get(API_ROUTES.${name}.export, {
      params,
      responseType: "blob",
    });
    return data;
  },
};
`;
}
```

---

## ⚛️ TanStack Query Hooks Generator

```typescript
// generators/api-generator.ts — hooks builder
private buildQueryKeys(name: string, camel: string, config: PrismConfig): string {
  const ext = config.tech.typescript;

  return `// src/features/${name}/hooks/queryKeys.${ext ? "ts" : "js"}
export const ${camel}QueryKeys = {
  all: ["${name}"] as const,
  lists: () => [...${camel}QueryKeys.all, "list"] as const,
  list: (filters${ext ? ": Record<string, unknown>" : ""} = {}) =>
    [...${camel}QueryKeys.lists(), filters] as const,
  details: () => [...${camel}QueryKeys.all, "detail"] as const,
  detail: (id${ext ? ": string" : ""}) =>
    [...${camel}QueryKeys.details(), id] as const,
};
`;
}

private buildListHook(name: string, pascal: string, camel: string, config: PrismConfig): string {
  const ext = config.tech.typescript;
  const T = ext ? `<T = unknown>` : "";

  return `// src/features/${name}/hooks/use${pascal}List.${ext ? "ts" : "js"}
import { useQuery } from "@tanstack/react-query";
import { ${camel}Service } from "../services/${camel}Service";
import { ${camel}QueryKeys } from "./queryKeys";

${ext ? `
interface Use${pascal}ListOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  enabled?: boolean;
}
` : ""}

export function use${pascal}List${T}(options${ext ? ": Use${pascal}ListOptions" : ""} = {}) {
  const { enabled = true, ...filters } = options;

  return useQuery({
    queryKey: ${camel}QueryKeys.list(filters),
    queryFn: () => ${camel}Service.getAll(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    enabled,
  });
}
`;
}
```

---

## 🔁 Mutation Hooks Generator

```typescript
private buildMutationsHook(name: string, pascal: string, camel: string, config: PrismConfig): string {
  const ext = config.tech.typescript;

  return `// src/features/${name}/hooks/use${pascal}Mutations.${ext ? "ts" : "js"}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ${camel}Service } from "../services/${camel}Service";
import { ${camel}QueryKeys } from "./queryKeys";
import { useToast } from "@core/hooks/useToast";

export function useCreate${pascal}() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (payload${ext ? ": Record<string, unknown>" : ""}) =>
      ${camel}Service.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${camel}QueryKeys.lists() });
      success("Created successfully");
    },
    onError: (err${ext ? ": Error" : ""}) => {
      error(err?.message || "Failed to create");
    },
  });
}

export function useUpdate${pascal}() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }${ext ? ": { id: string; payload: Record<string, unknown> }" : ""}) =>
      ${camel}Service.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${camel}QueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ${camel}QueryKeys.details() });
      success("Updated successfully");
    },
    onError: (err${ext ? ": Error" : ""}) => {
      error(err?.message || "Failed to update");
    },
  });
}

export function useDelete${pascal}() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id${ext ? ": string" : ""}) => ${camel}Service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${camel}QueryKeys.lists() });
      success("Deleted successfully");
    },
    onError: (err${ext ? ": Error" : ""}) => {
      error(err?.message || "Failed to delete");
    },
  });
}
`;
}
```

---

## 🧪 Error Types Generator

```typescript
// src/shared/core/api/types.ts
export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

---

## 📊 Difficulty Matrix

| Component | Difficulty | Key Challenge |
|-----------|-----------|---------------|
| **Axios Client** | 🟢 Low | Standard interceptors pattern |
| **Fetch Client** | 🟢 Low | No external dependency |
| **Token Refresh** | 🔴 Hard | Race condition handling, queue management |
| **Route Builder** | 🟡 Medium | Dynamic param functions, type safety |
| **Service Builder** | 🟡 Medium | CRUD patterns, response normalization |
| **Query Keys** | 🟢 Low | TanStack Query convention |
| **List Hook** | 🟡 Medium | Placeholder data, staleTime config |
| **Mutation Hooks** | 🟡 Medium | Cache invalidation, toast integration |
| **Export Service** | 🟡 Medium | Blob download, file naming |

---

## 📈 API Layer Output Stats

| File | Lines (TS) | Lines (JS) |
|------|-----------|-----------|
| client.ts | ~120 | ~100 |
| apiRoutes.ts | ~80 | ~60 |
| types.ts | ~40 | — |
| service (per feature) | ~80 | ~60 |
| queryKeys.ts | ~25 | ~20 |
| list hook.ts | ~40 | ~30 |
| mutations hooks.ts | ~90 | ~70 |
| **Total per feature** | **~235** | **~180** |
