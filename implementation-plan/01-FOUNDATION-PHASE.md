# Phase 1: Foundation — CLI Skeleton + Core Engine

> **Duration:** ~10 milestones
> **Goal:** `docify init` runs end-to-end with prompts but generates empty output.

---

## Milestone 1.1: Project Scaffolding

### Tasks

- [ ] Initialize the docify CLI project
- [ ] Set up TypeScript strict mode
- [ ] Configure build pipeline
- [ ] Set up ESLint + Prettier

### Files to Create

| File | Purpose |
|------|---------|
| `docify-cli/package.json` | Dependencies, scripts, bin entry |
| `docify-cli/tsconfig.json` | Strict TS config with path aliases |
| `docify-cli/vitest.config.ts` | Test configuration |
| `docify-cli/.eslintrc.cjs` | Linting rules |
| `docify-cli/.prettierrc` | Formatting rules |
| `docify-cli/.gitignore` | Ignore patterns |

### package.json Configuration

```json
{
  "name": "docify",
  "version": "1.0.0",
  "description": "One command. Complete React project. Production ready.",
  "bin": {
    "docify": "./dist/index.js"
  },
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/cli/index.ts",
    "build": "tsup src/cli/index.ts --format esm --clean --minify",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/ --ext .ts",
    "lint:fix": "eslint src/ --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit",
    "prepublish": "npm run build",
    "docify:test": "node dist/index.js init --yes --output ./test-output",
    "clean": "node -e \"const fs=require('fs');['dist','node_modules','test-output'].forEach(d=>fs.rmSync(d,{recursive:true,force:true}))\""
  },
  "dependencies": {
    "commander": "^12.0.0",
    "inquirer": "^9.0.0",
    "@inquirer/prompts": "^5.0.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.0",
    "ejs": "^3.1.0",
    "fs-extra": "^11.0.0",
    "prettier": "^3.0.0",
    "validate-npm-package-name": "^5.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/commander": "^12.0.0",
    "@types/inquirer": "^9.0.0",
    "@types/ejs": "^3.1.0",
    "@types/fs-extra": "^11.0.0",
    "tsup": "^8.0.0",
    "tsx": "^4.7.0",
    "vitest": "^1.6.0",
    "@types/validate-npm-package-name": "^4.0.0"
  }
}
```

### Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Node version < 18 | Check `process.version` at startup, show clear error |
| npm/yarn/pnpm not found | Auto-detect package manager, fallback with warning |
| Corrupted node_modules | Clear error with reinstall instructions |
| Global install conflicts | Use `npx docify` as primary recommendation |

---

## Milestone 1.2: CLI Entry Point & Commands

### Tasks

- [ ] Create Commander.js CLI entry point
- [ ] Implement `docify init` command
- [ ] Implement `docify add` command
- [ ] Implement `docify generate` command
- [ ] Implement `docify docs` command
- [ ] Implement `docify info` command
- [ ] Implement `docify sync` command (OpenAPI sync — advanced)
- [ ] Add --yes, --template, --output flags

### File Structure

```
src/cli/
├── index.ts                    # Commander setup
└── commands/
    ├── init.ts                 # docify init — main command
    ├── add.ts                  # docify add feature — add features
    ├── generate.ts             # docify generate — re-generate
    ├── docs.ts                 # docify docs — docs only
    ├── info.ts                 # docify info — project diagnostics
    └── sync.ts                 # docify sync — OpenAPI sync (advanced)
```

### Implementation Details

```typescript
// src/cli/index.ts
#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { generateCommand } from "./commands/generate";
import { docsCommand } from "./commands/docs";
import { infoCommand } from "./commands/info";
import { syncCommand } from "./commands/sync";
import { checkNodeVersion } from "../utils/env";
import { handleError } from "../core/errors";

// Check Node.js version first
checkNodeVersion();

const program = new Command();

program
  .name("docify")
  .description("One command. Complete React project. Production ready.")
  .version("1.0.0");

program
  .command("init")
  .description("Create a new React project")
  .option("-y, --yes", "Skip prompts, use defaults")
  .option("-t, --template <name>", "Use a template (default, minimal, enterprise)")
  .option("-o, --output <dir>", "Output directory")
  .option("-v, --verbose", "Show detailed output")
  .action(initCommand);

program
  .command("add")
  .description("Add a new feature to existing project")
  .argument("<type>", "Feature type (feature, page, component, hook)")
  .argument("<name>", "Name of the item to add")
  .option("-f, --force", "Overwrite existing files")
  .action(addCommand);

program
  .command("generate")
  .alias("g")
  .description("Generate or regenerate project parts")
  .option("-d, --docs", "Regenerate documentation only")
  .option("-t, --types", "Regenerate TypeScript types only")
  .action(generateCommand);

program
  .command("docs")
  .description("Generate project documentation")
  .option("-w, --watch", "Watch mode for live updates")
  .action(docsCommand);

program
  .command("info")
  .description("Show project diagnostics and insights")
  .action(infoCommand);

program
  .command("sync")
  .description("Sync OpenAPI/Swagger spec → project features")
  .argument("<spec>", "Swagger spec URL or local file path")
  .option("-d, --dry-run", "Preview changes without applying")
  .action(syncCommand);

program.parse(process.argv);
```

### Edge Cases

| Edge Case | Handling |
|-----------|----------|
| No command provided | Show help menu by default |
| Invalid feature name | Validate with `validate-npm-package-name` + custom rules |
| / in feature names | Sanitize: replace special chars, enforce kebab-case |
| Already-existing project directory | Prompt for overwrite, merge, or cancel |
| Running outside a project (for `add`) | Detect missing `docify.config.json`, show error |
| Very long project names | Truncate to 50 chars with warning |
| Unicode/special chars in name | Strip to ASCII-safe, show warning |

---

## Milestone 1.3: Core Engine — Generator Pipeline

### Tasks

- [ ] Build `GeneratorEngine` class with pipeline orchestration
- [ ] Build `ConfigBuilder` — transform prompts → typed config
- [ ] Build `ProgressEngine` — beautiful Ora spinners
- [ ] Build `FileWriter` — atomic disk output with formatting
- [ ] Build error handling system
- [ ] Build utility modules (formatter, package-manager, git)

### File Structure

```
src/core/
├── engine.ts              # GeneratorEngine — pipeline orchestration
├── config.ts              # ConfigBuilder — prompt answers → DocifyConfig
├── progress.ts            # ProgressEngine — Ora spinners + summary
├── file-writer.ts          # FileWriter — atomic disk output + prettier
├── errors.ts               # DocifyError class + centralized handler
└── types.ts               # Core TypeScript interfaces

src/utils/
├── formatter.ts            # Prettier code formatting
├── package-manager.ts      # npm/yarn/pnpm auto-detect
├── git.ts                  # git init, first commit
├── logger.ts               # Debug logging
├── env.ts                  # Node version check, env detection
├── names.ts                # PascalCase, camelCase, kebab-case converters
└── validators.ts           # Input validation utilities
```

### Core Interfaces

```typescript
// src/core/types.ts

export interface DocifyConfig {
  project: {
    name: string;
    description: string;
    author: string;
    version: string;
  };
  tech: {
    typescript: boolean;
    styling: "tailwind" | "custom-css" | "css-modules";
    platforms: ("web" | "mobile")[];
    state: "zustand-query" | "redux" | "context-only";
    packageManager: "npm" | "yarn" | "pnpm";
    apiClient: "axios" | "fetch";
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
  generated: {
    date: string;
    docifyVersion: string;
  };
}

export interface Generator {
  name: string;
  priority: number;
  validate(config: DocifyConfig): Promise<void>;
  generate(config: DocifyConfig): Promise<GeneratedFile[]>;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: "new" | "merge";
  encoding?: "utf-8" | "base64";
}

export interface DocifyConfigFile {
  version: string;
  project: {
    name: string;
    description: string;
    author: string;
  };
  tech: {
    typescript: boolean;
    styling: string;
    platforms: string[];
    state: string;
    packageManager: string;
  };
  structure: {
    type: string;
    features: string[];
  };
  modules: {
    auth: boolean;
    routing: boolean;
    testing: boolean;
    docs: boolean;
    pwa: boolean;
  };
  generated: {
    date: string;
    docifyVersion: string;
  };
}
```

### GeneratorEngine Implementation

```typescript
// src/core/engine.ts
class GeneratorEngine {
  private generators: Generator[] = [];
  private config: DocifyConfig;
  private progress: ProgressEngine;

  constructor(config: DocifyConfig) {
    this.config = config;
    this.progress = new ProgressEngine(10); // 10 generator steps
    this.registerGenerators();
  }

  registerGenerators() {
    // Priority order — dependencies must be built first
    this.generators.push(new CoreScaffoldGenerator());    // 100
    this.generators.push(new APIGenerator());             // 200
    this.generators.push(new StateGenerator());           // 300
    this.generators.push(new UIGenerator());              // 350
    this.generators.push(new FeatureGenerator());         // 400
    this.generators.push(new RouteGenerator());           // 500
    this.generators.push(new AuthGenerator());            // 600
    this.generators.push(new TestGenerator());            // 700
    this.generators.push(new DocGenerator());             // 800
    if (this.config.tech.platforms.includes("mobile")) {
      this.generators.push(new MobileGenerator());        // 900
    }
  }

  async generate(targetDir: string): Promise<void> {
    for (const gen of this.generators) {
      this.progress.startStep(gen.name);
      try {
        await gen.validate(this.config);
        const files = await gen.generate(this.config);
        await this.fileWriter.writeAll(targetDir, files);
        this.progress.completeStep(gen.name, `${files.length} files`);
      } catch (error) {
        this.progress.failStep(gen.name, (error as Error).message);
        throw error;
      }
    }
    await this.installDependencies(targetDir);
    await this.gitInit(targetDir);
    console.log(this.progress.getSummary());
  }
}
```

### ProgressEngine

```typescript
// src/core/progress.ts
class ProgressEngine {
  private spinners: Map<string, Ora> = new Map();
  private totalSteps: number;
  private currentStep: number = 0;
  private startTime: number = Date.now();

  constructor(totalSteps: number) {
    this.totalSteps = totalSteps;
  }

  startStep(name: string): void {
    this.currentStep++;
    const spinner = ora({
      text: `${this.getStepIcon()}  ${name}`,
      color: "cyan",
      spinner: "dots",
    }).start();
    this.spinners.set(name, spinner);
  }

  completeStep(name: string, detail?: string): void {
    const spinner = this.spinners.get(name);
    if (spinner) {
      spinner.succeed(
        `${chalk.green("✓")} ${name}${detail ? chalk.dim(` — ${detail}`) : ""}`
      );
    }
  }

  failStep(name: string, error: string): void {
    const spinner = this.spinners.get(name);
    if (spinner) {
      spinner.fail(`${chalk.red("✗")} ${name}${chalk.dim(` — ${error}`)}`);
    }
  }

  getSummary(config: DocifyConfig): string {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    return [
      `\n${chalk.bold("✨  Project created successfully!")}`,
      `${chalk.dim(`📂  cd ${config.project.name}`)}`,
      `${chalk.dim(`🚀  ${config.tech.packageManager} run dev`)}`,
      `${chalk.dim(`⏱️   Completed in ${elapsed}s`)}`,
      ``,
    ].join("\n");
  }

  private getStepIcon(): string {
    const icons = ["🔍", "📦", "⚙️", "🎨", "🔗", "📝", "🔐", "🧪", "📖", "📱"];
    return icons[this.currentStep - 1] || "⚡";
  }
}
```

### FileWriter with Atomic Transactions

```typescript
// src/core/file-writer.ts
class FileWriter {
  private formatter: CodeFormatter;

  async writeAll(targetDir: string, files: GeneratedFile[]): Promise<void> {
    // Stage 1: Write to temp directory
    const tempDir = path.join(targetDir, ".docify-temp-build");
    const writePromises = files.map(async (file) => {
      const fullPath = path.join(tempDir, file.path);
      await fs.ensureDir(path.dirname(fullPath));
      let content = file.content;
      if (this.shouldFormat(file.path)) {
        content = await this.formatter.formatWithPrettier(content);
      }
      await fs.writeFile(fullPath, content, file.encoding || "utf-8");
    });

    try {
      await Promise.all(writePromises);

      // Stage 2: Atomic swap — move each file from temp to target
      for (const file of files) {
        const tempPath = path.join(tempDir, file.path);
        const finalPath = path.join(targetDir, file.path);
        await fs.ensureDir(path.dirname(finalPath));
        await fs.move(tempPath, finalPath, { overwrite: true });
      }
    } catch (error) {
      // Rollback: clean up temp directory
      await fs.remove(tempDir);
      throw new DocifyError(
        `Failed to write files: ${(error as Error).message}`,
        ErrorCode.GENERATION_FAILED,
        "Check disk space and permissions"
      );
    } finally {
      // Clean up temp directory
      await fs.remove(tempDir);
    }
  }

  async mergePackageJson(targetDir: string, additions: object): Promise<void> {
    const pkgPath = path.join(targetDir, "package.json");
    const existing = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
    const merged = deepMerge(existing, additions);
    await fs.writeFile(pkgPath, JSON.stringify(merged, null, 2));
  }

  private shouldFormat(filePath: string): boolean {
    return /\.(ts|tsx|js|jsx|json|css|md)$/.test(filePath);
  }
}
```

### Edge Cases for FileWriter

| Edge Case | Handling |
|-----------|----------|
| Disk full during write | Catch ENOSPC error, show clear message |
| Permission denied | Catch EACCES error, suggest sudo/admin |
| File already exists with different content | Check diff, prompt for overwrite/merge/skip |
| Path too long (Windows) | Use path.resolve, warn if > 200 chars |
| Unicode characters in paths | Normalize NFC form for cross-platform |
| Symlink in path | Follow symlinks safely, detect cycles |
| Race condition on concurrent writes | Use temp dir + atomic move pattern |

---

## Milestone 1.4: Config Builder & Validation

### Tasks

- [ ] Build ConfigBuilder with Zod validation
- [ ] Implement config resolution (flags → prompts → file → defaults)
- [ ] Build config file reader/writer
- [ ] Handle --yes flag for skip-prompt mode

### Implementation

```typescript
// src/core/config.ts
import { z } from "zod";

const DocifyConfigSchema = z.object({
  project: z.object({
    name: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
    description: z.string().max(200).default(""),
    author: z.string().max(100).default(""),
    version: z.string().default("1.0.0"),
  }),
  tech: z.object({
    typescript: z.boolean().default(true),
    styling: z.enum(["tailwind", "custom-css", "css-modules"]).default("tailwind"),
    platforms: z.array(z.enum(["web", "mobile"])).default(["web"]),
    state: z.enum(["zustand-query", "redux", "context-only"]).default("zustand-query"),
    packageManager: z.enum(["npm", "yarn", "pnpm"]).default("npm"),
    apiClient: z.enum(["axios", "fetch"]).default("axios"),
  }),
  structure: z.object({
    type: z.enum(["feature", "flat"]).default("feature"),
    features: z.array(z.string()).default(["auth", "dashboard", "users"]),
  }),
  modules: z.object({
    auth: z.boolean().default(true),
    routing: z.boolean().default(true),
    testing: z.boolean().default(true),
    docs: z.boolean().default(true),
    pwa: z.boolean().default(false),
  }),
  generated: z.object({
    date: z.string(),
    docifyVersion: z.string(),
  }),
});

class ConfigBuilder {
  async build(options: CLIOptions): Promise<DocifyConfig> {
    const defaults = this.getDefaults();
    const configFile = await this.tryLoadConfig(options.output);
    const answers = options.yes ? {} : await this.runPrompts(configFile);
    const merged = this.mergeConfigs(defaults, configFile, answers, options);
    return DocifyConfigSchema.parse(merged);
  }

  private mergeConfigs(
    defaults: Partial<DocifyConfig>,
    configFile: Partial<DocifyConfig> | null,
    answers: Partial<DocifyConfig>,
    options: CLIOptions
  ): DocifyConfig {
    return {
      ...defaults,
      ...configFile,
      ...answers,
      project: {
        ...defaults.project,
        ...configFile?.project,
        ...answers.project,
        ...(options.output ? { name: path.basename(options.output) } : {}),
      },
      // Deep merge for nested objects
      tech: { ...defaults.tech, ...configFile?.tech, ...answers.tech },
      structure: { ...defaults.structure, ...configFile?.structure, ...answers.structure },
      modules: { ...defaults.modules, ...configFile?.modules, ...answers.modules },
      generated: {
        date: new Date().toISOString(),
        docifyVersion: pkg.version,
      },
    };
  }
}
```

### Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Invalid config file (malformed JSON) | Catch parse error, fall back to defaults |
| Config file has unknown keys | Strip unknown keys, show warning |
| Config file has incompatible values (e.g., TS + JS) | Validate with Zod, show specific error |
| CLI flag contradicts config file | CLI flags take highest priority |
| No interactive terminal (CI mode) | Auto-fallback to defaults + --yes behavior |
| Empty string for project name | Generate random name (e.g., "docify-app-1234") |
| Project name starts with number | Prepend underscore, show warning |

---

## Milestone 1.5: Prompt System

### Tasks

- [ ] Build main prompt orchestrator
- [ ] Implement project-info questions
- [ ] Implement tech-stack questions
- [ ] Implement features questions
- [ ] Implement structure questions
- [ ] Add dynamic follow-up questions
- [ ] Add input validation with nice error messages

### File Structure

```
src/prompts/
├── index.ts                   # Main prompt orchestrator
├── questions/
│   ├── project-info.ts        # Name, description, author
│   ├── tech-stack.ts          # TS/JS, Tailwind/CSS, platforms, state
│   ├── features.ts            # Auth, routing, testing, etc.
│   └── structure.ts           # Feature vs flat, feature names
└── validators.ts              # Input validation
```

### Prompt Orchestrator

```typescript
// src/prompts/index.ts
import inquirer from "inquirer";
import { askProjectInfo } from "./questions/project-info";
import { askTechStack } from "./questions/tech-stack";
import { askFeatures } from "./questions/features";
import { askStructure } from "./questions/structure";

export async function runPrompts(defaults?: Partial<DocifyConfig>): Promise<DocifyConfig> {
  const answers: Partial<DocifyConfig> = {};

  answers.project = await askProjectInfo(defaults?.project);
  answers.tech = await askTechStack(defaults?.tech);
  answers.structure = await askStructure(defaults?.structure);
  answers.modules = await askFeatures(defaults?.modules);

  return answers as DocifyConfig;
}
```

### Question Examples

```typescript
// src/prompts/questions/project-info.ts
export async function askProjectInfo(defaults?: any) {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your project name?",
      default: defaults?.name || "my-app",
      validate: (input: string) => {
        if (!input.trim()) return "Project name is required";
        if (!/^[a-z0-9-]+$/.test(input)) {
          return "Use lowercase letters, numbers, and hyphens only";
        }
        if (input.length > 50) return "Name must be ≤ 50 characters";
        return true;
      },
    },
    {
      type: "input",
      name: "description",
      message: "Project description:",
      default: defaults?.description || "",
    },
    {
      type: "input",
      name: "author",
      message: "Author name:",
      default: defaults?.author || "",
    },
  ]);
}

// src/prompts/questions/tech-stack.ts
export async function askTechStack(defaults?: any) {
  return inquirer.prompt([
    {
      type: "list",
      name: "typescript",
      message: "TypeScript or JavaScript?",
      choices: [
        { name: "TypeScript (recommended)", value: true },
        { name: "JavaScript", value: false },
      ],
      default: defaults?.typescript !== undefined ? defaults.typescript : true,
    },
    {
      type: "list",
      name: "styling",
      message: "Styling system?",
      choices: [
        { name: "Tailwind CSS (recommended)", value: "tailwind" },
        { name: "Custom CSS with design tokens", value: "custom-css" },
        { name: "CSS Modules", value: "css-modules" },
      ],
      default: defaults?.styling || "tailwind",
    },
    {
      type: "checkbox",
      name: "platforms",
      message: "Target platforms?",
      choices: [
        { name: "Web", value: "web", checked: true },
        { name: "Mobile (React Native / Expo)", value: "mobile" },
      ],
      default: defaults?.platforms || ["web"],
    },
    {
      type: "list",
      name: "state",
      message: "State management?",
      choices: [
        { name: "Zustand + TanStack Query (recommended)", value: "zustand-query" },
        { name: "Redux Toolkit", value: "redux" },
        { name: "React Context only (minimal)", value: "context-only" },
      ],
      default: defaults?.state || "zustand-query",
      when: (answers: any) => answers.platforms?.includes("web"),
    },
    {
      type: "list",
      name: "apiClient",
      message: "API client library?",
      choices: [
        { name: "Axios (recommended — interceptors, token refresh)", value: "axios" },
        { name: "Fetch (lighter, no external dep)", value: "fetch" },
      ],
      default: defaults?.apiClient || "axios",
    },
    {
      type: "list",
      name: "packageManager",
      message: "Package manager?",
      choices: [
        { name: "npm", value: "npm" },
        { name: "yarn", value: "yarn" },
        { name: "pnpm", value: "pnpm" },
      ],
      default: defaults?.packageManager || "npm",
    },
  ]);
}

// src/prompts/questions/features.ts
export async function askFeatures(defaults?: any) {
  return inquirer.prompt([
    {
      type: "confirm",
      name: "auth",
      message: "Include authentication? (login, register, password reset)",
      default: defaults?.auth !== undefined ? defaults.auth : true,
    },
    {
      type: "confirm",
      name: "routing",
      message: "Include routing? (lazy loading, auth guards)",
      default: defaults?.routing !== undefined ? defaults.routing : true,
    },
    {
      type: "confirm",
      name: "testing",
      message: "Include testing setup? (Vitest + React Testing Library)",
      default: defaults?.testing !== undefined ? defaults.testing : true,
    },
    {
      type: "confirm",
      name: "docs",
      message: "Auto-generate documentation? (README, architecture docs)",
      default: defaults?.docs !== undefined ? defaults.docs : true,
    },
    {
      type: "confirm",
      name: "pwa",
      message: "Include PWA support? (service worker, manifest)",
      default: defaults?.pwa || false,
    },
  ]);
}

// src/prompts/questions/structure.ts
export async function askStructure(defaults?: any) {
  const { type } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Project structure?",
      choices: [
        { name: "Feature-based (recommended for teams)", value: "feature" },
        { name: "Flat (simple projects)", value: "flat" },
      ],
      default: defaults?.type || "feature",
    },
  ]);

  if (type === "feature") {
    const { features } = await inquirer.prompt([
      {
        type: "input",
        name: "features",
        message: "Initial feature names (comma-separated):",
        default: (defaults?.features || ["auth", "dashboard", "users"]).join(", "),
        filter: (input: string) =>
          input.split(",").map((f) => f.trim().toLowerCase().replace(/\s+/g, "-")),
        validate: (features: string[]) => {
          if (features.length === 0) return "At least one feature is required";
          const invalid = features.filter((f) => !/^[a-z][a-z0-9-]*$/.test(f));
          if (invalid.length > 0) {
            return `Invalid feature names: ${invalid.join(", ")}. Use kebab-case.`;
          }
          return true;
        },
      },
    ]);
    return { type, features };
  }

  return { type, features: [] };
}
```

### Edge Cases for Prompts

| Edge Case | Handling |
|-----------|----------|
| User presses Ctrl+C | Catch SIGINT, show clean exit message |
| Terminal too narrow | Use inquirer's `pageSize` option, auto-adjust |
| Unicode in project name | Reject, show ASCII-safe alternatives |
| Comma in feature name | Split on commas, trim whitespace, show warning |
| Duplicate feature names | Deduplicate, show warning |
| Reserved feature names (e.g., "shared", "core", "components") | Warn about potential conflicts |
| Very long list of features | Limit to 20 features, show warning |

---

## Milestone 1.6: Utility Modules

### Tasks

- [ ] Name conversion utilities (PascalCase, camelCase, kebab-case)
- [ ] Package manager auto-detection
- [ ] Git initialization with proper .gitignore
- [ ] Prettier formatting integration
- [ ] Environment detection
- [ ] Input validation utilities

### Name Converters

```typescript
// src/utils/names.ts

/** "user-profile" → "UserProfile" */
export function toPascalCase(name: string): string {
  return name
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/** "UserProfile" → "userProfile" */
export function toCamelCase(name: string): string {
  return name
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toLowerCase());
}

/** "UserProfile" → "user-profile" */
export function toKebabCase(name: string): string {
  return name
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "")
    .replace(/[-_\s]+/g, "-");
}

/** "user-profile" → "user_profile" */
export function toSnakeCase(name: string): string {
  return name.replace(/-/g, "_").toLowerCase();
}

/** "user-profile" → "user profile" */
export function toTitleCase(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
```

### Edge Cases for Name Converters

| Edge Case | Handling |
|-----------|----------|
| Empty string | Return empty string |
| Single character | Return as-is |
| Mixed separators (e.g., "user_profile-data") | Normalize to single separator |
| Leading/Trailing separators | Strip them |
| Numbers (e.g., "user-2-factor") | Preserve numbers |
| All uppercase (e.g., "API_KEY") | Handle gracefully: `toPascalCase("API_KEY")` → "ApiKey" |
| Unicode accented chars | Preserve accents (don't strip) |
| Reserved JS keywords as feature names | Prefix with underscore (e.g., "class" → "_class") |

---

## 🎯 Phase 1 Completion Criteria

- [ ] `docify` CLI runs and shows help
- [ ] `docify init` shows interactive prompts
- [ ] Config is validated and saved to target directory
- [ ] Generator pipeline runs end-to-end
- [ ] FileWriter creates files atomically
- [ ] Progress spinners display correctly
- [ ] Errors are caught and displayed beautifully
- [ ] `docify add feature` works on existing projects
- [ ] `docify info` shows project diagnostics
- [ ] `docify sync` parses Swagger files (stub)
