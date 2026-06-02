import type { Generator, GeneratedFile } from "../core/engine";
import type { PromptAnswers } from "../prompts";

/**
 * Generates state management infrastructure:
 * - TanStack Query client setup
 * - Zustand stores (theme, UI state)
 * - Provider component
 */
export class StateGenerator implements Generator {
  name = "State Management";
  priority = 250;

  async generate(answers: PromptAnswers): Promise<GeneratedFile[]> {
    const ext = answers.tech.typescript ? "ts" : "js";
    const extx = answers.tech.typescript ? "tsx" : "jsx";
    const ts = answers.tech.typescript;

    const files: GeneratedFile[] = [];

    // cn utility
    if (ts) {
      files.push({
        path: `src/lib/cn.${ext}`,
        content: [
          'import { clsx, type ClassValue } from "clsx";',
          "export function cn(...inputs: ClassValue[]): string {",
          "  return clsx(inputs);",
          "}",
        ].join("\n"),
      });
    } else {
      files.push({
        path: `src/lib/cn.${ext}`,
        content: [
          'import { clsx } from "clsx";',
          "export function cn(...inputs) {",
          "  return clsx(inputs);",
          "}",
        ].join("\n"),
      });
    }

    if (answers.tech.state === "zustand-query") {
      // QueryClient
      if (ts) {
        files.push({
          path: `src/lib/queryClient.${ext}`,
          content: [
            'import { QueryClient } from "@tanstack/react-query";',
            "export const queryClient = new QueryClient({",
            "  defaultOptions: {",
            "    queries: {",
            "      staleTime: 30_000,",
            "      gcTime: 5 * 60_000,",
            "      retry: 1,",
            "      refetchOnWindowFocus: false,",
            "    },",
            "  },",
            "});",
          ].join("\n"),
        });
      } else {
        files.push({
          path: `src/lib/queryClient.${ext}`,
          content: [
            'import { QueryClient } from "@tanstack/react-query";',
            "export const queryClient = new QueryClient({",
            "  defaultOptions: {",
            "    queries: {",
            "      staleTime: 30_000,",
            "      gcTime: 5 * 60_000,",
            "      retry: 1,",
            "      refetchOnWindowFocus: false,",
            "    },",
            "  },",
            "});",
          ].join("\n"),
        });
      }

      // Store (Zustand)
      if (ts) {
        files.push({
          path: `src/lib/store.${ext}`,
          content: [
            'import { create } from "zustand";',
            'import { persist } from "zustand/middleware";',
            "",
            "interface ThemeState {",
            '  theme: "light" | "dark";',
            "  toggleTheme: () => void;",
            "}",
            "",
            "export const useThemeStore = create<ThemeState>()(",
            "  persist(",
            "    (set) => ({",
            '      theme: "light",',
            "      toggleTheme: () =>",
            "        set((state) => ({",
            '          theme: state.theme === "light" ? "dark" : "light",',
            "        })),",
            "    }),",
            '    { name: "app:theme" },',
            "  ),",
            ");",
            "",
            "interface UIState {",
            "  sidebarOpen: boolean;",
            "  setSidebarOpen: (open: boolean) => void;",
            "}",
            "",
            "export const useUIStore = create<UIState>()((set) => ({",
            "  sidebarOpen: false,",
            "  setSidebarOpen: (open) => set({ sidebarOpen: open }),",
            "}));",
          ].join("\n"),
        });
      } else {
        files.push({
          path: `src/lib/store.${ext}`,
          content: [
            'import { create } from "zustand";',
            'import { persist } from "zustand/middleware";',
            "",
            "export const useThemeStore = create(",
            "  persist(",
            "    (set) => ({",
            '      theme: "light",',
            "      toggleTheme: () =>",
            "        set((state) => ({",
            '          theme: state.theme === "light" ? "dark" : "light",',
            "        })),",
            "    }),",
            '    { name: "app:theme" },',
            "  ),",
            ");",
            "",
            "export const useUIStore = create((set) => ({",
            "  sidebarOpen: false,",
            "  setSidebarOpen: (open) => set({ sidebarOpen: open }),",
            "}));",
          ].join("\n"),
        });
      }

      // Providers
      if (ts) {
        files.push({
          path: `src/components/Providers.${extx}`,
          content: [
            'import { QueryClientProvider } from "@tanstack/react-query";',
            'import { queryClient } from "@/lib/queryClient";',
            'import { useThemeStore } from "@/lib/store";',
            'import { useEffect, type ReactNode } from "react";',
            "",
            "interface ProvidersProps {",
            "  children: ReactNode;",
            "}",
            "",
            "export function Providers({ children }: ProvidersProps) {",
            "  const theme = useThemeStore((s) => s.theme);",
            "",
            "  useEffect(() => {",
            '    document.documentElement.classList.toggle("dark", theme === "dark");',
            "  }, [theme]);",
            "",
            "  return (",
            "    <QueryClientProvider client={queryClient}>",
            "      {children}",
            "    </QueryClientProvider>",
            "  );",
            "}",
          ].join("\n"),
        });
      } else {
        files.push({
          path: `src/components/Providers.${extx}`,
          content: [
            'import { QueryClientProvider } from "@tanstack/react-query";',
            'import { queryClient } from "@/lib/queryClient";',
            'import { useThemeStore } from "@/lib/store";',
            'import { useEffect } from "react";',
            "",
            "export function Providers({ children }) {",
            "  const theme = useThemeStore((s) => s.theme);",
            "",
            "  useEffect(() => {",
            '    document.documentElement.classList.toggle("dark", theme === "dark");',
            "  }, [theme]);",
            "",
            "  return (",
            "    <QueryClientProvider client={queryClient}>",
            "      {children}",
            "    </QueryClientProvider>",
            "  );",
            "}",
          ].join("\n"),
        });
      }
    }

    return files;
  }
}
