import type { Generator, GeneratedFile } from "../core/engine";
import type { PromptAnswers } from "../prompts";
import { toPascalCase } from "../utils/names";

/**
 * Generates feature module scaffolding including auth pages
 * and stub pages for each selected feature.
 */
export class FeatureGenerator implements Generator {
  name = "Feature Modules";
  priority = 400;

  async generate(answers: PromptAnswers): Promise<GeneratedFile[]> {
    const extx = answers.tech.typescript ? "tsx" : "jsx";
    const ext = answers.tech.typescript ? "ts" : "js";
    const files: GeneratedFile[] = [];

    // Auth pages (if auth module is enabled)
    if (answers.modules.auth) {
      files.push(
        {
          path: `src/features/auth/pages/LoginPage.${extx}`,
          content: this.buildLoginPage(),
        },
        {
          path: `src/features/auth/services/authService.${ext}`,
          content: this.buildAuthService(),
        },
        {
          path: `src/features/auth/types/index.${ext}`,
          content: this.buildAuthTypes(),
        },
      );
    }

    // Stub pages for each feature
    for (const f of answers.features) {
      if (f === "auth") continue;

      const pascal = toPascalCase(f);
      files.push(
        {
          path: `src/features/${f}/pages/${pascal}List.${extx}`,
          content: this.buildStubListPage(pascal, f),
        },
        {
          path: `src/features/${f}/pages/${pascal}Detail.${extx}`,
          content: this.buildStubDetailPage(pascal, f),
        },
        {
          path: `src/features/${f}/services/${f}Service.${ext}`,
          content: this.buildStubService(f),
        },
        {
          path: `src/features/${f}/types/index.${ext}`,
          content: `export interface ${pascal} {\n  id: string;\n  name: string;\n  createdAt: string;\n  updatedAt: string;\n}\n`,
        },
      );
    }

    return files;
  }

  private buildLoginPage(): string {
    return [
      'import { useState } from "react";',
      'import { useNavigate } from "react-router-dom";',
      'import { Button } from "@/components/ui/Button";',
      'import { Input } from "@/components/ui/Input";',
      "",
      "export function LoginPage() {",
      "  const navigate = useNavigate();",
      '  const [email, setEmail] = useState("");',
      '  const [password, setPassword] = useState("");',
      "",
      "  const handleSubmit = (e: React.FormEvent) => {",
      "    e.preventDefault();",
      "    // TODO: Implement actual auth",
      '    localStorage.setItem("app:auth", JSON.stringify({ accessToken: "demo" }));',
      '    navigate("/dashboard");',
      "  };",
      "",
      "  return (",
      '    <div className="flex min-h-screen items-center justify-center bg-surface-muted">',
      '      <div className="w-full max-w-sm rounded-xl border bg-surface p-8 shadow-lg">',
      '        <h1 className="mb-2 text-2xl font-bold text">Sign In</h1>',
      '        <p className="mb-6 text-sm text-subtle">Welcome back! Enter your credentials.</p>',
      "        <form onSubmit={handleSubmit} className=\"flex flex-col gap-4\">",
      "          <Input",
      '            id="email"',
      '            label="Email"',
      '            type="email"',
      "            value={email}",
      "            onChange={(e) => setEmail(e.target.value)}",
      '            placeholder="you@example.com"',
      "            required",
      "          />",
      "          <Input",
      '            id="password"',
      '            label="Password"',
      '            type="password"',
      "            value={password}",
      "            onChange={(e) => setPassword(e.target.value)}",
      '            placeholder="Enter your password"',
      "            required",
      "          />",
      '          <Button type="submit" className="w-full">',
      "            Sign In",
      "          </Button>",
      "        </form>",
      "      </div>",
      '    </div>',
      "  );",
      "}",
    ].join("\n");
  }

  private buildAuthService(): string {
    return [
      'import { api } from "@/lib/api";',
      "",
      "export interface LoginPayload {",
      "  email: string;",
      "  password: string;",
      "}",
      "",
      "export interface RegisterPayload {",
      "  email: string;",
      "  password: string;",
      "  name: string;",
      "}",
      "",
      "export interface AuthResponse {",
      "  accessToken: string;",
      "  user: { id: string; email: string; name: string };",
      "}",
      "",
      "export const authService = {",
      "  login: (payload: LoginPayload) =>",
      '    api.post<AuthResponse>("/auth/login", payload),',
      "  register: (payload: RegisterPayload) =>",
      '    api.post<AuthResponse>("/auth/register", payload),',
      "  logout: () => api.post(\"/auth/logout\"),",
      "  me: () => api.get<AuthResponse[\"user\"]>(\"/auth/me\"),",
      "};",
    ].join("\n");
  }

  private buildAuthTypes(): string {
    return [
      "export interface User {",
      "  id: string;",
      "  email: string;",
      "  name: string;",
      "  role: \"admin\" | \"user\";",
      "  avatar?: string;",
      "}",
      "",
      "export interface Session {",
      "  user: User;",
      "  accessToken: string;",
      "}",
    ].join("\n");
  }

  private buildStubListPage(pascal: string, feature: string): string {
    return [
      'import { useState } from "react";',
      'import { Plus, Search } from "lucide-react";',
      'import { Button } from "@/components/ui/Button";',
      'import { Input } from "@/components/ui/Input";',
      'import { EmptyState } from "@/components/EmptyState";',
      "",
      `export function ${pascal}List() {`,
      '  const [search, setSearch] = useState("");',
      "",
      "  return (",
      "    <div className=\"flex flex-col gap-6\">",
      '      <div className="flex items-center justify-between">',
      `        <h1 className="text-2xl font-bold text">${pascal}</h1>`,
      "        <Button>",
      '          <Plus className="h-4 w-4" />',
      `          Add ${pascal}`,
      "        </Button>",
      "      </div>",
      "",
      '      <div className="relative max-w-sm">',
      '        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />',
      "        <Input",
      "          value={search}",
      "          onChange={(e) => setSearch(e.target.value)}",
      `          placeholder=\"Search ${feature}...\"`,
      '          className="pl-10"',
      "        />",
      "      </div>",
      "",
      "      <EmptyState",
      `        title="No ${feature} yet"`,
      `        description="Create your first ${feature} to get started."`,
      "      />",
      "    </div>",
      "  );",
      "}",
    ].join("\n");
  }

  private buildStubDetailPage(pascal: string, feature: string): string {
    return [
      'import { useParams, useNavigate } from "react-router-dom";',
      'import { ArrowLeft } from "lucide-react";',
      'import { Button } from "@/components/ui/Button";',
      "",
      `export function ${pascal}Detail() {`,
      "  const { id } = useParams<{ id: string }>();",
      "  const navigate = useNavigate();",
      "",
      "  return (",
      "    <div className=\"flex flex-col gap-6\">",
      '      <div className="flex items-center gap-4">',
      "        <Button variant=\"ghost\" size=\"sm\" onClick={() => navigate(-1)}>",
      '          <ArrowLeft className="h-4 w-4" />',
      "          Back",
      "        </Button>",
      `        <h1 className="text-2xl font-bold text">${pascal} Details</h1>`,
      "      </div>",
      "",
      `      <p className="text-subtle">Viewing ${feature} with ID: {id}</p>`,
      "    </div>",
      "  );",
      "}",
    ].join("\n");
  }

  private buildStubService(feature: string): string {
    const pascal = toPascalCase(feature);
    return [
      `import { api } from "@/lib/api";`,
      `import type { ${pascal} } from "../types";`,
      "",
      `export const ${feature}Service = {`,
      `  list: () => api.get<${pascal}[]>("/${feature}"),`,
      `  detail: (id: string) => api.get<${pascal}>(\`/${feature}/\${id}\`),`,
      `  create: (data: Partial<${pascal}>) => api.post<${pascal}>("/${feature}", data),`,
      `  update: (id: string, data: Partial<${pascal}>) => api.patch<${pascal}>(\`/${feature}/\${id}\`, data),`,
      `  delete: (id: string) => api.delete(\`/${feature}/\${id}\`),`,
      "};",
    ].join("\n");
  }
}
