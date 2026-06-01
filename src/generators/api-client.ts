/**
 * Axios client template builder.
 * Each function builds a generated file as a string.
 * Uses string arrays joined by newlines — zero escaped backticks.
 * Generated code imports API_ROUTES from ./routes (no fallback).
 */

function lines(...chunks: string[]): string {
  return chunks.join("\n");
}

/* ── Generated: src/shared/core/api/client.ts ── */

export function buildClient(): string {
  return lines(
    'import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";',
    'import { API_ROUTES } from "./routes";',
    "",
    "const BASE_URL = import.meta.env.VITE_API_BASE_URL;",
    'if (!BASE_URL) throw new Error("VITE_API_BASE_URL is required");',
    "const TIMEOUT = 30_000;",
    "",
    "export const api: AxiosInstance = axios.create({",
    "  baseURL: BASE_URL,",
    "  timeout: TIMEOUT,",
    '  headers: { "Content-Type": "application/json" },',
    "});",
    "",
    "// ── Token store ──",
    'const TOKEN_KEY = "docify:auth";',
    "",
    "function getToken(): string | null {",
    "  try {",
    "    const raw = localStorage.getItem(TOKEN_KEY);",
    "    return raw ? JSON.parse(raw).accessToken : null;",
    "  } catch {",
    "    localStorage.removeItem(TOKEN_KEY);",
    "    return null;",
    "  }",
    "}",
    "",
    'function setToken(token: string): void {',
    "  localStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken: token }));",
    "}",
    "",
    "function clearToken(): void {",
    "  localStorage.removeItem(TOKEN_KEY);",
    "}",
    "",
    "// ── Request interceptor ──",
    "api.interceptors.request.use((config: InternalAxiosRequestConfig) => {",
    "  const token = getToken();",
    '  if (token && config.headers) config.headers.Authorization = "Bearer " + token;',
    "  return config;",
    "});",
    "",
    "// ── Token refresh queue (single refresh, queued retries) ──",
    "let refreshing = false;",
    "type Pending = { resolve: (t: string) => void; reject: (e: unknown) => void };",
    "const pending: Pending[] = [];",
    "",
    "function flush(err: unknown, token: string | null): void {",
    "  while (pending.length) {",
    "    const p = pending.shift()!;",
    "    err ? p.reject(err) : p.resolve(token!);",
    "  }",
    "}",
    "",
    "api.interceptors.response.use(",
    "  (res) => res,",
    "  async (error: AxiosError) => {",
    '    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };',
    "    if (!config) return Promise.reject(error);",
    "",
    '    if (error.code === "ECONNABORTED") {',
    '      return Promise.reject(new ApiClientError("Request timed out", "TIMEOUT", 408));',
    "    }",
    "",
    "    if (!error.response) {",
    '      return Promise.reject(new ApiClientError("Network error", "NETWORK", 0));',
    "    }",
    "",
    "    const { status } = error.response;",
    "",
    '    if (status === 401 && !config._retry && !config.url?.includes("/auth/")) {',
    "      if (refreshing) {",
    "        return new Promise<string>((resolve, reject) => {",
    "          pending.push({ resolve, reject });",
    "        }).then((token) => {",
    '          config.headers!.Authorization = "Bearer " + token;',
    "          return api(config);",
    "        });",
    "      }",
    "",
    "      config._retry = true;",
    "      refreshing = true;",
    "",
    "      try {",
    "        const { data } = await axios.post(",
    "          BASE_URL + API_ROUTES.auth.refresh,",
    "          {},",
    "          { withCredentials: true },",
    "        );",
    "        setToken(data.accessToken);",
    "        flush(null, data.accessToken);",
    '        config.headers!.Authorization = "Bearer " + data.accessToken;',
    "        return api(config);",
    "      } catch (err) {",
    "        flush(err, null);",
    "        clearToken();",
    '        window.location.href = "/auth/login";',
    "        return Promise.reject(err);",
    "      } finally {",
    "        refreshing = false;",
    "      }",
    "    }",
    "",
    "    return Promise.reject(error);",
    "  }",
    ");",
    "",
    "// ── Error helpers ──",
    "export class ApiClientError extends Error {",
    "  constructor(",
    "    message: string,",
    "    public code: string,",
    "    public status: number,",
    "  ) {",
    "    super(message);",
    '    this.name = "ApiClientError";',
    "  }",
    "}",
    "",
    "export interface PaginatedResponse<T> {",
    "  items: T[];",
    "  pagination: { page: number; limit: number; total: number; totalPages: number };",
    "}",
    "",
  );
}

/* ── Generated: src/shared/core/api/routes.ts ── */

export function buildRoutes(features: string[]): string {
  const r: string[] = [
    "export const API_ROUTES = {",
    "  auth: {",
    '    login: "/auth/login",',
    '    register: "/auth/register",',
    '    logout: "/auth/logout",',
    '    refresh: "/auth/refresh",',
    '    me: "/auth/me",',
    "  },",
  ];

  for (const f of features) {
    if (f === "auth") continue;
    r.push("  " + f + ": {");
    r.push('    list: "/' + f + '",');
    r.push("    detail: (id: string) => `/" + f + "/${id}`,");
    r.push('    create: "/' + f + '",');
    r.push("    update: (id: string) => `/" + f + "/${id}`,");
    r.push("    delete: (id: string) => `/" + f + "/${id}`,");
    r.push("  },");
  }

  r.push("} as const;");
  return r.join("\n");
}

/* ── Generated: src/shared/core/api/index.ts ── */

export function buildApiIndex(): string {
  return lines(
    'export { api, ApiClientError } from "./client";',
    'export { API_ROUTES } from "./routes";',
    'export type { PaginatedResponse } from "./client";',
  );
}
