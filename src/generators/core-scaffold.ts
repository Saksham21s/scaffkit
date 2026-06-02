import type { Generator, GeneratedFile } from "../core/engine";
import type { PromptAnswers } from "../prompts";

export class CoreGenerator implements Generator {
  name = "Core scaffold";
  priority = 100;

  async generate(answers: PromptAnswers): Promise<GeneratedFile[]> {
    const { project, tech, modules } = answers;
    const ext = tech.typescript ? "ts" : "js";
    const extx = tech.typescript ? "tsx" : "jsx";
    const isTailwind = tech.styling === "tailwind";

    const rawFiles: Array<GeneratedFile & { skip?: boolean }> = [
      {
        path: "package.json",
        content: JSON.stringify({
          name: project.name,
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
            ...(tech.state === "zustand-query"
              ? { "@tanstack/react-query": "^5.62.0", zustand: "^5.0.0" }
              : {}),
            ...(tech.state === "redux" ? { "@reduxjs/toolkit": "^2.5.0", "react-redux": "^9.2.0" } : {}),
            ...(modules.routing ? { "react-router-dom": "^6.28.0" } : {}),
            axios: "^1.7.9",
            "lucide-react": "^0.460.0",
            clsx: "^2.1.1",
          },
          devDependencies: {
            ...(tech.typescript
              ? { "@types/react": "^18.3.12", "@types/react-dom": "^18.3.1", typescript: "^5.7.2" }
              : {}),
            "@vitejs/plugin-react": "^4.3.4",
            vite: "^6.0.0",
            ...(isTailwind ? { tailwindcss: "^3.4.16", autoprefixer: "^10.4.20", postcss: "^8.4.49" } : {}),
          },
        }, null, 2),
      },
      {
        path: `tsconfig.json`,
        content: tech.typescript
          ? JSON.stringify({
              compilerOptions: {
                target: "ES2022",
                lib: ["ES2022", "DOM", "DOM.Iterable"],
                module: "ESNext",
                moduleResolution: "bundler",
                jsx: "react-jsx",
                strict: true,
                noEmit: true,
                skipLibCheck: true,
                baseUrl: ".",
                paths: {
                  "@/*": ["./src/*"],
                },
              },
              include: ["src"],
            }, null, 2)
          : "",
        skip: !tech.typescript,
      },
      {
        path: `vite.config.${ext}`,
        content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
`,
      },
      ...(isTailwind
        ? [
            {
              path: "tailwind.config.ts",
              content: `import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{${ext},${extx}}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "var(--color-primary)", hover: "var(--color-primary-hover)", subtle: "var(--color-primary-subtle)" },
        surface: { DEFAULT: "var(--surface)", subtle: "var(--surface-subtle)", muted: "var(--surface-muted)" },
        text: { DEFAULT: "var(--text)", subtle: "var(--text-subtle)", muted: "var(--text-muted)" },
        border: { DEFAULT: "var(--border)", strong: "var(--border-strong)" },
        success: "var(--color-success)", warning: "var(--color-warning)", error: "var(--color-error)", info: "var(--color-info)",
      },
      fontFamily: { sans: ["var(--font-sans)"], mono: ["var(--font-mono)"] },
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
          ]
        : []),
      {
        path: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${extx}"></script>
  </body>
</html>
`,
      },
      {
        path: `src/main.${extx}`,
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
        path: `src/App.${extx}`,
        content: `import { Providers } from "@/components/Providers";
import { RouterProvider } from "react-router-dom";
import { router } from "@/lib/routes";

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
`,
      },
      {
        path: `src/vite-env.d.${ext}`,
        content: '/// <reference types="vite/client" />\n',
      },
      {
        path: "src/styles/index.css",
        content: isTailwind
          ? `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n@import "./tokens.css";\n@import "./base.css";\n`
          : `@import "./tokens.css";\n@import "./base.css";\n`,
      },
      {
        path: "src/styles/tokens.css",
        content: this.buildTokensCSS(),
      },
      {
        path: "src/styles/base.css",
        content: this.buildBaseCSS(),
      },
      {
        path: ".env.example",
        content: `VITE_API_BASE_URL=/api\n`,
      },
      {
        path: ".gitignore",
        content: `node_modules\ndist\n.env\n.env.local\n*.tsbuildinfo\ncoverage\n.DS_Store\n`,
      },
    ];
    return rawFiles.filter((f): f is GeneratedFile => !f.skip);
  }

  private buildTokensCSS(): string {
    return `:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-active: #1d4ed8;
  --color-primary-subtle: #eff6ff;
  --color-secondary: #8b5cf6;
  --color-secondary-hover: #7c3aed;
  --color-tertiary: #06b6d4;
  --color-tertiary-hover: #0891b2;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  --surface: #ffffff;
  --surface-subtle: #f8fafc;
  --surface-muted: #f1f5f9;
  --surface-inverse: #0f172a;
  --text: #0f172a;
  --text-subtle: #475569;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --radius-sm: 0.375rem;
  --radius: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1);
  --chart-1: #3b82f6;
  --chart-2: #10b981;
  --chart-3: #f59e0b;
  --chart-4: #ef4444;
  --chart-5: #8b5cf6;
}

.dark {
  --surface: #0f172a;
  --surface-subtle: #1e293b;
  --surface-muted: #334155;
  --surface-inverse: #ffffff;
  --text: #f1f5f9;
  --text-subtle: #94a3b8;
  --text-muted: #64748b;
  --border: #334155;
  --border-strong: #475569;
  --color-primary-subtle: #172554;
}
`;
  }

  private buildBaseCSS(): string {
    return `* { box-sizing: border-box; margin: 0; padding: 0; border-color: var(--border); }
body { font-family: var(--font-sans); background: var(--surface); color: var(--text); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-weight: 600; line-height: 1.25; }
a { color: var(--color-primary); transition: color 200ms ease; }
a:hover { color: var(--color-primary-hover); }
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
::selection { background: var(--color-primary); color: var(--text-inverse); }
`;
  }
}
