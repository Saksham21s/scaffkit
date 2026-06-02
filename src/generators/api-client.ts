import type { Generator, GeneratedFile } from "../core/engine";
import type { PromptAnswers } from "../prompts";

/**
 * Generates the API client layer including Axios instance,
 * token refresh queue, route constants, and exports.
 */
export class APIGenerator implements Generator {
  name = "API Client";
  priority = 200;

  async generate(answers: PromptAnswers): Promise<GeneratedFile[]> {
    const { features } = answers;
    const ext = answers.tech.typescript ? "ts" : "js";
    const ts = answers.tech.typescript;

    return [
      {
        path: `src/lib/api/client.${ext}`,
        content: this.buildClient(ts),
      },
      {
        path: `src/lib/api/routes.${ext}`,
        content: this.buildRoutes(features, ts),
      },
      {
        path: `src/lib/api/index.${ext}`,
        content: this.buildApiIndex(ts),
      },
    ];
  }

  private buildClient(ts: boolean): string {
    const lines = [];

    if (ts) {
      lines.push('import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";');
    } else {
      lines.push('import axios from "axios";');
    }
    lines.push('import { API_ROUTES } from "./routes";');
    lines.push("");
    lines.push('const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";');
    lines.push("const TIMEOUT = 30_000;");
    lines.push("");

    if (ts) {
      lines.push("export const api: AxiosInstance = axios.create({");
    } else {
      lines.push("export const api = axios.create({");
    }
    lines.push("  baseURL: BASE_URL,");
    lines.push("  timeout: TIMEOUT,");
    lines.push('  headers: { "Content-Type": "application/json" },');
    lines.push("});");
    lines.push("");
    lines.push("// ── Token management ──");
    lines.push('const TOKEN_KEY = "app:auth";');
    lines.push("");

    if (ts) {
      lines.push("function getToken(): string | null {");
    } else {
      lines.push("function getToken() {");
    }
    lines.push("  try {");
    lines.push("    const raw = localStorage.getItem(TOKEN_KEY);");
    lines.push("    return raw ? JSON.parse(raw).accessToken : null;");
    lines.push("  } catch {");
    lines.push("    localStorage.removeItem(TOKEN_KEY);");
    lines.push("    return null;");
    lines.push("  }");
    lines.push("}");
    lines.push("");

    if (ts) {
      lines.push("function setToken(token: string): void {");
    } else {
      lines.push("function setToken(token) {");
    }
    lines.push('  localStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken: token }));');
    lines.push("}");
    lines.push("");

    if (ts) {
      lines.push("function clearToken(): void {");
    } else {
      lines.push("function clearToken() {");
    }
    lines.push("  localStorage.removeItem(TOKEN_KEY);");
    lines.push("}");
    lines.push("");

    lines.push("// ── Request interceptor — inject Bearer token ──");
    if (ts) {
      lines.push("api.interceptors.request.use((config: InternalAxiosRequestConfig) => {");
    } else {
      lines.push("api.interceptors.request.use((config) => {");
    }
    lines.push("  const token = getToken();");
    lines.push('  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;');
    lines.push("  return config;");
    lines.push("});");
    lines.push("");

    lines.push("// ── Response interceptor — token refresh queue ──");
    lines.push("let isRefreshing = false;");
    if (ts) {
      lines.push("type PendingRequest = { resolve: (t: string) => void; reject: (e: unknown) => void };");
      lines.push("const pendingQueue: PendingRequest[] = [];");
    } else {
      lines.push("const pendingQueue = [];");
    }
    lines.push("");

    if (ts) {
      lines.push("function flushQueue(err: unknown, token: string | null): void {");
    } else {
      lines.push("function flushQueue(err, token) {");
    }
    lines.push("  while (pendingQueue.length) {");
    lines.push("    const p = pendingQueue.shift();");
    lines.push("    err ? p.reject(err) : p.resolve(token);");
    lines.push("  }");
    lines.push("}");
    lines.push("");

    lines.push("api.interceptors.response.use(");
    lines.push("  (res) => res,");
    if (ts) {
      lines.push("  async (error: AxiosError) => {");
      lines.push('    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };');
    } else {
      lines.push("  async (error) => {");
      lines.push("    const config = error.config;");
    }
    lines.push("    if (!config) return Promise.reject(error);");
    lines.push("");
    lines.push('    if (error.code === "ECONNABORTED") {');
    lines.push('      return Promise.reject(new ApiError("Request timed out", "TIMEOUT", 408));');
    lines.push("    }");
    lines.push("    if (!error.response) {");
    lines.push('      return Promise.reject(new ApiError("Network error", "NETWORK", 0));');
    lines.push("    }");
    lines.push("");
    lines.push("    const { status } = error.response;");
    lines.push("");
    lines.push('    if (status === 401 && !config._retry && !config.url?.includes("/auth/")) {');
    lines.push("      if (isRefreshing) {");
    if (ts) {
      lines.push("        return new Promise<string>((resolve, reject) => {");
    } else {
      lines.push("        return new Promise((resolve, reject) => {");
    }
    lines.push("          pendingQueue.push({ resolve, reject });");
    lines.push("        }).then((token) => {");
    lines.push('          config.headers.Authorization = `Bearer ${token}`;');
    lines.push("          return api(config);");
    lines.push("        });");
    lines.push("      }");
    lines.push("");
    lines.push("      config._retry = true;");
    lines.push("      isRefreshing = true;");
    lines.push("");
    lines.push("      try {");
    lines.push("        const { data } = await axios.post(");
    lines.push("          BASE_URL + API_ROUTES.auth.refresh,");
    lines.push("          {},");
    lines.push("          { withCredentials: true },");
    lines.push("        );");
    lines.push("        setToken(data.accessToken);");
    lines.push("        flushQueue(null, data.accessToken);");
    lines.push('        config.headers.Authorization = `Bearer ${data.accessToken}`;');
    lines.push("        return api(config);");
    lines.push("      } catch (err) {");
    lines.push("        flushQueue(err, null);");
    lines.push("        clearToken();");
    lines.push('        window.location.href = "/login";');
    lines.push("        return Promise.reject(err);");
    lines.push("      } finally {");
    lines.push("        isRefreshing = false;");
    lines.push("      }");
    lines.push("    }");
    lines.push("");
    lines.push("    return Promise.reject(error);");
    lines.push("  },");
    lines.push(");");
    lines.push("");

    lines.push("// ── Error class ──");
    if (ts) {
      lines.push("export class ApiError extends Error {");
      lines.push("  constructor(");
      lines.push("    message: string,");
      lines.push("    public code: string,");
      lines.push("    public status: number,");
      lines.push("  ) {");
      lines.push("    super(message);");
      lines.push('    this.name = "ApiError";');
      lines.push("  }");
      lines.push("}");
    } else {
      lines.push("export class ApiError extends Error {");
      lines.push("  constructor(message, code, status) {");
      lines.push("    super(message);");
      lines.push('    this.name = "ApiError";');
      lines.push("    this.code = code;");
      lines.push("    this.status = status;");
      lines.push("  }");
      lines.push("}");
    }
    lines.push("");

    if (ts) {
      lines.push("export interface PaginatedResponse<T> {");
      lines.push("  items: T[];");
      lines.push("  pagination: { page: number; limit: number; total: number; totalPages: number };");
      lines.push("}");
    }

    return lines.join("\n");
  }

  private buildRoutes(features: string[], ts: boolean): string {
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
      r.push(`  ${f}: {`);
      r.push(`    list: "/${f}",`);
      r.push(`    detail: (id) => \`/${f}/\${id}\`,`);
      r.push(`    create: "/${f}",`);
      r.push(`    update: (id) => \`/${f}/\${id}\`,`);
      r.push(`    delete: (id) => \`/${f}/\${id}\`,`);
      r.push("  },");
    }

    if (ts) {
      r.push("} as const;");
    } else {
      r.push("};");
    }
    return r.join("\n");
  }

  private buildApiIndex(ts: boolean): string {
    if (ts) {
      return [
        'export { api, ApiError } from "./client";',
        'export { API_ROUTES } from "./routes";',
        'export type { PaginatedResponse } from "./client";',
      ].join("\n");
    }
    return [
      'export { api, ApiError } from "./client";',
      'export { API_ROUTES } from "./routes";',
    ].join("\n");
  }
}
