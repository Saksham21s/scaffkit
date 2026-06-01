# Prism — System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         prism CLI                               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Interactive  │→ │  Config      │→ │  Project Generator    │  │
│  │ Prompt       │  │  Builder     │  │  Engine               │  │
│  └─────────────┘  └──────────────┘  └───────────┬───────────┘  │
│                                                  │              │
│  ┌───────────────────────────────────────────────▼──────────┐  │
│  │               Generator Modules                          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ Core     │ │ Feature  │ │ API      │ │ State    │   │  │
│  │  │ Scaffold │→│ Generator│→│ Generator│→│ Generator│   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ UI      │ │ Route    │ │ Test     │ │ Doc      │   │  │
│  │  │ Generator│→│ Generator│→│ Generator│→│ Generator│   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌───────────────────────────▼──────────────────────────────┐  │
│  │                   File Writer                            │  │
│  │  Writes all generated files to disk with proper format   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Module Architecture

### 1. Interactive Prompt Layer

```
prompts/
├── index.ts              # Main prompt orchestrator
├── questions/
│   ├── project-info.ts   # name, description, author
│   ├── tech-stack.ts     # ts/js, tailwind/custom, etc.
│   ├── features.ts       # auth, routing, tests, etc.
│   └── structure.ts      # feature-based vs flat
└── validators.ts         # Input validation
```

Each question module uses [Inquirer](https://github.com/SBoudrias/Inquirer.js) with dynamic follow-up questions. Example:

```typescript
// Question: TypeScript or JavaScript?
{
  type: "list",
  name: "typescript",
  message: "TypeScript or JavaScript?",
  choices: [
    { name: "TypeScript (recommended)", value: true },
    { name: "JavaScript", value: false }
  ],
  default: true
}
```

---

### 2. ConfigBuilder

Transforms raw answers into a typed configuration object:

```typescript
interface PrismConfig {
  project: {
    name: string;
    description: string;
    author: string;
  };
  tech: {
    typescript: boolean;
    styling: "tailwind" | "custom-css" | "css-modules";
    platforms: ("web" | "mobile")[];
    state: "zustand-query" | "redux" | "context-only";
  };
  structure: {
    type: "feature" | "flat";
    features: string[];
  };
  modules: {
    auth: boolean;
    routing: boolean;
    testing: boolean;
    docs: boolean;
    pwa: boolean;
  };
  mobile?: {
    expo: boolean;
    expoRouter: boolean;
  };
}
```

---

### 3. Generator Engine (Core)

The brain of Prism. Pipeline architecture:

```typescript
class GeneratorEngine {
  private generators: Generator[] = [];
  private config: PrismConfig;

  constructor(config: PrismConfig) {
    this.config = config;
    this.registerGenerators();
  }

  registerGenerators() {
    // Order matters — dependencies must be built first
    this.generators.push(
      new CoreScaffoldGenerator(),   // package.json, tsconfig, vite config
      new APIGenerator(),           // API client, routes, services
      new StateGenerator(),         // Zustand stores, query client
      new UIGenerator(),            // Components, styles, theme
      new FeatureGenerator(),       // Feature modules
      new RouteGenerator(),         // Router, lazy loading
      new AuthGenerator(),          // Auth context, guards
      new TestGenerator(),          // Test setup, example tests
      new DocGenerator(),           // READMEs, Mermaid diagrams
      new MobileGenerator(),        // Expo setup (if RN)
    );
  }

  async generate(targetDir: string): Promise<void> {
    for (const gen of this.generators) {
      await gen.validate(this.config);
      const files = await gen.generate(this.config);
      await this.fileWriter.writeAll(targetDir, files);
    }
    await this.installDependencies(targetDir);
    await this.gitInit(targetDir);
  }
}
```

Each `Generator` follows this interface:

```typescript
interface Generator {
  name: string;
  priority: number;          // Execution order
  validate(config: PrismConfig): Promise<void>;
  generate(config: PrismConfig): Promise<GeneratedFile[]>;
}

interface GeneratedFile {
  path: string;              // Relative path in project
  content: string;           // File content
  type: "new" | "merge";    // Merge for package.json
  encoding?: "utf-8" | "base64";
}
```

---

### 4. Template System

Prism uses **two approaches** for file generation:

#### A. Static Templates (EJS)
For files that have minimal dynamic parts:

```typescript
// templates/core/api/client.ts.ejs
import axios from "axios";
import { sessionService } from "./sessionService";

const API_BASE = "<%= config.apiBaseUrl %>";

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: <%= config.apiTimeout || 30000 %>,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = sessionService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### B. Programmatic Builders
For complex files with conditional logic:

```typescript
// core/feature-generator.ts
class FeatureGenerator implements Generator {
  async generate(config: PrismConfig): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const feature of config.structure.features) {
      files.push({
        path: `src/features/${feature}/index.ts`,
        content: this.buildFeatureIndex(feature, config),
      });
      files.push({
        path: `src/features/${feature}/services/${feature}Service.ts`,
        content: this.buildService(feature, config),
      });
      // ... more files per feature
    }

    return files;
  }

  private buildService(name: string, config: PrismConfig): string {
    if (config.tech.typescript) {
      return this.buildTypeScriptService(name);
    }
    return this.buildJavaScriptService(name);
  }
}
```

---

### 5. File Writer

Manages the final output:

```typescript
class FileWriter {
  private formatter: CodeFormatter;

  async writeAll(targetDir: string, files: GeneratedFile[]): Promise<void> {
    for (const file of files) {
      const fullPath = path.join(targetDir, file.path);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      let content = file.content;
      if (file.path.endsWith(".ts") || file.path.endsWith(".tsx")) {
        content = await this.formatter.formatWithPrettier(content);
      }

      await fs.writeFile(fullPath, content, file.encoding || "utf-8");
    }
  }

  async mergePackageJson(targetDir: string, additions: object): Promise<void> {
    const pkgPath = path.join(targetDir, "package.json");
    const existing = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
    const merged = deepMerge(existing, additions);
    await fs.writeFile(pkgPath, JSON.stringify(merged, null, 2));
  }
}
```

---

## 🔄 Data Flow

```
User Input → Config → Generator Engine
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         Core Gen    Feature Gen   API Gen
              │          │          │
              └──────────┼──────────┘
                         ▼
                    File Writer
                         │
                         ▼
                    Disk Output
                         │
                         ▼
              npm install / yarn
                         │
                         ▼
              git init + first commit
```

---

## 📦 Dependency Graph

```
                    package.json
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    Core Files      Config Files    Build Config
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  Shared Modules
               (hooks, utils, lib)
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    API Layer      State Layer     UI System
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  Feature Modules
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    Auth Module    Route Module    Doc Module
```

---

## 🔐 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **EJS for templates** | Familiar syntax, excellent for conditional rendering |
| **Programmatic builders** | Full TypeScript control for complex generation logic |
| **Plugin-based generators** | Easy to add new generators without modifying core |
| **Pipeline architecture** | Clear ordering, easy to debug, testable in isolation |
| **Prettier post-processing** | Ensures generated code matches team formatting standards |
| **Deep merge for package.json** | Multiple generators can add dependencies without conflicts |
