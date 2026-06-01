import path from "path";
import fs from "fs-extra";
import { execSync } from "child_process";
import { DocifyError, ErrorCode } from "../errors";
import { ConfigBuilder } from "../config/builder";
import { FileWriter } from "../writer/file-writer";
import { ProgressBar } from "../progress/bar";
import type { CLIOptions } from "../config/schema";
import { buildTokensCSS } from "../templates/styles/tokens.css";
import { buildBaseCSS } from "../templates/styles/base.css";
import { buildClient, buildRoutes, buildApiIndex } from "../generators/api-client";

const builder = new ConfigBuilder();
const writer = new FileWriter();

export async function initCommand(options: CLIOptions): Promise<void> {
  const targetDir = options.output
    ? path.resolve(options.output)
    : path.resolve(process.cwd(), "my-app");

  // Validate target
  if (fs.existsSync(targetDir)) {
    const contents = fs.readdirSync(targetDir);
    if (contents.length > 0) {
      throw new DocifyError(
        `Directory "${targetDir}" exists and is not empty`,
        ErrorCode.DIRECTORY_EXISTS,
        "Use --output with a new directory name",
      );
    }
  }

  const config = builder.buildFromAnswers({}, options);
  const startTime = Date.now();

  // ── Step 1: Create directories ──
  const dirStep = new ProgressBar(1, "Creating project structure");
  const dirs = [
    "src/components/ui",
    "src/components/layout",
    "src/shared/core/api",
    "src/shared/core/context",
    "src/shared/core/components",
    "src/shared/lib",
    "src/shared/hooks",
    "src/shared/utils",
    "src/shared/routes",
    ...config.structure.features.flatMap((f) => [
      `src/features/${f}/components`,
      `src/features/${f}/hooks`,
      `src/features/${f}/pages`,
      `src/features/${f}/services`,
      `src/features/${f}/types`,
    ]),
    "src/styles",
    "public",
  ];

  for (const dir of dirs) await fs.ensureDir(path.join(targetDir, dir));
  dirStep.tick();
  dirStep.complete(`${dirs.length} dirs`);

  // ── Step 2: Generate files ──
  const genStep = new ProgressBar(1, "Generating project files");

  const files = [
    // Styles
    { path: "src/styles/tokens.css", content: buildTokensCSS() },
    { path: "src/styles/base.css", content: buildBaseCSS() },
    {
      path: "src/styles/index.css",
      content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n@import "./tokens.css";\n@import "./base.css";\n`,
    },
    // Configs
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: config.project.name,
          private: true,
          version: "1.0.0",
          type: "module",
          scripts: {
            dev: "vite",
            build: "tsc -b && vite build",
            preview: "vite preview",
          },
          dependencies: {
            react: "^18.3.1",
            "react-dom": "^18.3.1",
            "@tanstack/react-query": "^5.62.0",
            "react-router-dom": "^6.28.0",
            axios: "^1.7.9",
            zustand: "^5.0.0",
            "lucide-react": "^0.460.0",
            clsx: "^2.1.1",
          },
          devDependencies: {
            "@types/react": "^18.3.12",
            "@types/react-dom": "^18.3.1",
            "@vitejs/plugin-react": "^4.3.4",
            typescript: "^5.7.2",
            vite: "^6.0.0",
            tailwindcss: "^3.4.16",
            autoprefixer: "^10.4.20",
            postcss: "^8.4.49",
          },
        },
        null,
        2,
      ),
    },
    {
      path: "tsconfig.json",
      content: JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            lib: ["ES2022", "DOM", "DOM.Iterable"],
            module: "ESNext",
            moduleResolution: "bundler",
            jsx: "react-jsx",
            strict: true,
            noEmit: true,
            skipLibCheck: true,
            paths: {
              "@/*": ["./src/*"],
              "@core/*": ["./src/shared/core/*"],
              "@shared/*": ["./src/shared/*"],
              "@components/*": ["./src/components/*"],
              "@features/*": ["./src/features/*"],
            },
          },
          include: ["src"],
        },
        null,
        2,
      ),
    },
    {
      path: "vite.config.ts",
      content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./src/shared/core"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
});
`,
    },
    {
      path: "tailwind.config.ts",
      content: `import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          subtle: "var(--color-primary-subtle)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
          hover: "var(--color-tertiary-hover)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          subtle: "var(--surface-subtle)",
          muted: "var(--surface-muted)",
          inverse: "var(--surface-inverse)",
        },
        text: {
          DEFAULT: "var(--text)",
          subtle: "var(--text-subtle)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
      },
      fontFamily: { sans: ["var(--font-sans)"], mono: ["var(--font-mono)"] },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        DEFAULT: "var(--shadow)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
    },
  },
  plugins: [],
} satisfies Config;
`,
    },
    {
      path: "postcss.config.js",
      content: `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n`,
    },
    {
      path: "index.html",
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.project.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    },
    // Vite env types
    { path: "src/vite-env.d.ts", content: '/// <reference types="vite/client" />\n' },
    // Entry points
    {
      path: "src/main.tsx",
      content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
    },
    {
      path: "src/App.tsx",
      content: `import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "@shared/lib/queryClient";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-surface text">
          <h1 className="text-2xl font-bold p-8">${config.project.name}</h1>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
`,
    },
    // Shared libs
    {
      path: "src/shared/lib/cn.ts",
      content: `import { clsx, type ClassValue } from "clsx";
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
`,
    },
    {
      path: "src/shared/lib/queryClient.ts",
      content: `import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, gcTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: false },
  },
});
`,
    },
    // API Layer
    { path: "src/shared/core/api/client.ts", content: buildClient() },
    { path: "src/shared/core/api/routes.ts", content: buildRoutes(config.structure.features) },
    { path: "src/shared/core/api/index.ts", content: buildApiIndex() },
    // Git & Env
    {
      path: ".gitignore",
      content: `node_modules\ndist\n.env\n.env.local\n*.tsbuildinfo\ncoverage\n.DS_Store\n`,
    },
    { path: ".env.example", content: `VITE_API_BASE_URL=/api\n` },
  ];

  await writer.write(targetDir, files);
  genStep.tick();
  genStep.complete(`${files.length} files`);

  // ── Step 3: Install ──
  const installStep = new ProgressBar(1, "Installing dependencies");
  try {
    execSync("npm install", { cwd: targetDir, stdio: "pipe", timeout: 120_000 });
    installStep.tick();
    installStep.complete();
  } catch {
    installStep.fail("Run 'npm install' manually");
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n  ✨ ${config.project.name} created in ${elapsed}s`);
  console.log(`  📂 cd ${config.project.name}`);
  console.log(`  🚀 npm run dev\n`);
}
