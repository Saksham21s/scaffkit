import type { Generator, GeneratedFile } from "../core/engine";
import type { PromptAnswers } from "../prompts";
import { toPascalCase } from "../utils/names";

/**
 * Generates the route configuration file with React Router lazy loading.
 */
export class RouteGenerator implements Generator {
  name = "Routes";
  priority = 500;

  async generate(answers: PromptAnswers): Promise<GeneratedFile[]> {
    if (!answers.modules.routing) return [];

    const extx = answers.tech.typescript ? "tsx" : "jsx";
    const ext = answers.tech.typescript ? "ts" : "js";
    const features = answers.features.filter((f) => f !== "auth");

    return [
      {
        path: `src/lib/routes/index.${ext}`,
        content: this.buildRoutes(features, extx),
      },
      {
        path: `src/lib/routes/ProtectedRoute.${extx}`,
        content: this.buildProtectedRoute(),
      },
    ];
  }

  private buildRoutes(features: string[], extx: string): string {
    const imports = [
      'import { lazy, Suspense } from "react";',
      'import { createBrowserRouter, Navigate } from "react-router-dom";',
      'import { AppLayout } from "@/components/layout/AppLayout";',
      'import { ProtectedRoute } from "./ProtectedRoute";',
      "",
      "// ── Lazy-loaded pages ──",
    ];

    // Lazy imports for each feature
    for (const f of features) {
      const pascal = toPascalCase(f);
      imports.push(
        `const ${pascal}List = lazy(() => import("@/features/${f}/pages/${pascal}List.${extx}"));`,
      );
      imports.push(
        `const ${pascal}Detail = lazy(() => import("@/features/${f}/pages/${pascal}Detail.${extx}"));`,
      );
    }

    imports.push("");
    imports.push('import { LoginPage } from "@/features/auth/pages/LoginPage";');
    imports.push("");

    // Suspense wrapper
    imports.push([
      "function SuspensePage({ children }: { children: React.ReactNode }) {",
      "  return (",
      '    <Suspense fallback={<div className="flex h-32 items-center justify-center text-subtle">Loading...</div>}>',
      "      {children}",
      "    </Suspense>",
      "  );",
      "}",
      "",
    ].join("\n"));

    // Route config
    const routes: string[] = [
      "export const router = createBrowserRouter([",
      "  {",
      '    path: "/login",',
      "    element: <LoginPage />,",
      "  },",
      "  {",
      "    element: (",
      "      <ProtectedRoute>",
      "        <AppLayout />",
      "      </ProtectedRoute>",
      "    ),",
      "    children: [",
      '      { index: true, element: <Navigate to="/dashboard" replace /> },',
    ];

    for (const f of features) {
      const pascal = toPascalCase(f);
      routes.push("      {");
      routes.push(`        path: "${f}",`);
      routes.push(
        `        element: <SuspensePage><${pascal}List /></SuspensePage>,`,
      );
      routes.push("      },");
      routes.push("      {");
      routes.push(`        path: "${f}/:id",`);
      routes.push(
        `        element: <SuspensePage><${pascal}Detail /></SuspensePage>,`,
      );
      routes.push("      },");
    }

    // Dashboard route
    routes.push("      {");
    routes.push('        path: "dashboard",');
    routes.push(
      '        element: <div className="p-8 text-center text-subtle">Dashboard coming soon</div>,',
    );
    routes.push("      },");

    routes.push("    ],");
    routes.push("  },");

    // 404
    routes.push("  {");
    routes.push('    path: "*",');
    routes.push('    element: <Navigate to="/dashboard" replace />,');
    routes.push("  },");

    routes.push("]);");

    return [...imports, ...routes].join("\n");
  }

  private buildProtectedRoute(): string {
    return [
      'import { type ReactNode } from "react";',
      'import { Navigate } from "react-router-dom";',
      "",
      "interface ProtectedRouteProps {",
      "  children: ReactNode;",
      "}",
      "",
      "// Simple auth check — replace with real auth logic",
      "function useAuth() {",
      "  return { isAuthenticated: !!localStorage.getItem(\"app:auth\") };",
      "}",
      "",
      "export function ProtectedRoute({ children }: ProtectedRouteProps) {",
      "  const { isAuthenticated } = useAuth();",
      "",
      "  if (!isAuthenticated) {",
      '    return <Navigate to="/login" replace />;',
      "  }",
      "",
      "  return <>{children}</>;",
      "}",
    ].join("\n");
  }
}
