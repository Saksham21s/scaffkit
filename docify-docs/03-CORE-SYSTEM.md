# Prism — Core Engine

## 🎯 Overview

The Core Engine is Prism's heart. It handles:
- CLI entry point and command routing
- Configuration parsing and validation
- Generator orchestration
- Progress reporting
- Error handling
- Dependency management

---

## 🔧 CLI Architecture

```
$ prism init          → Initialize new project
$ prism add feature   → Add a new feature to existing project
$ prism generate      → Re-generate specific parts
$ prism docs          → Generate documentation only
$ prism info          → Show project diagnostics
```

### Entry Point (`src/cli/index.ts`)

```typescript
#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { generateCommand } from "./commands/generate";
import { docsCommand } from "./commands/docs";
import { infoCommand } from "./commands/info";

const program = new Command();

program
  .name("prism")
  .description("One command. Complete React project. Production ready.")
  .version("1.0.0");

program
  .command("init")
  .description("Create a new project")
  .option("-y, --yes", "Skip prompts, use defaults")
  .option("-t, --template <name>", "Use a template (default, minimal, enterprise)")
  .option("-o, --output <dir>", "Output directory")
  .action(initCommand);

program
  .command("add")
  .description("Add a new feature to existing project")
  .argument("<type>", "Feature type (feature, page, component, hook)")
  .argument("<name>", "Name of the item to add")
  .action(addCommand);

program
  .command("generate")
  .alias("g")
  .description("Generate or regenerate project parts")
  .option("-d, --docs", "Regenerate documentation only")
  .option("-t, --types", "Regenerate TypeScript types only")
  .action(generateCommand);

program.parse(process.argv);
```

---

## 🧠 Configuration System

### Config Resolution Order

```
1. CLI flags (--yes, --output)
2. Interactive prompts (if no flags)
3. prism.config.json (if exists in target dir)
4. Defaults (sensible production defaults)
```

### Prism Config File

```typescript
// prism.config.json — auto-generated in project root
{
  "version": "1.0.0",
  "project": {
    "name": "my-app",
    "description": "My awesome React application",
    "author": "John Doe"
  },
  "tech": {
    "typescript": true,
    "styling": "tailwind",
    "platforms": ["web"],
    "state": "zustand-query",
    "packageManager": "npm"
  },
  "structure": {
    "type": "feature",
    "features": ["auth", "dashboard", "users", "settings"]
  },
  "modules": {
    "auth": true,
    "routing": true,
    "testing": true,
    "docs": true,
    "pwa": false
  },
  "generated": {
    "date": "2026-05-31T12:00:00Z",
    "prismVersion": "1.0.0"
  }
}
```

---

## 🚦 Progress Engine

Beautiful real-time progress reporting using [Ora](https://github.com/sindresorhus/ora) + custom spinners:

```typescript
class ProgressEngine {
  private spinners: Map<string, Ora> = new Map();
  private totalSteps: number;
  private currentStep: number = 0;

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
      const prefix = `${chalk.green("✓")} `;
      spinner.succeed(
        `${prefix}${name}${detail ? chalk.dim(` — ${detail}`) : ""}`
      );
    }
  }

  failStep(name: string, error: string): void {
    const spinner = this.spinners.get(name);
    if (spinner) {
      spinner.fail(`${chalk.red("✗")} ${name}${chalk.dim(` — ${error}`)}`);
    }
  }

  getSummary(): string {
    const elapsed = this.getElapsed();
    return [
      `\n${chalk.bold("✨  Project created successfully!")}`,
      `${chalk.dim(`📂  cd ${this.projectDir}`)}`,
      `${chalk.dim(`🚀  npm run dev`)}`,
      `${chalk.dim(`⏱️   Completed in ${elapsed}s`)}\n`,
    ].join("\n");
  }

  private getStepIcon(): string {
    const icons = ["🔍", "📦", "⚙️", "🎨", "🔗", "📝", "🧪", "📖", "🚀"];
    return icons[this.currentStep - 1] || "⚡";
  }
}
```

---

## Output Preview

What the user sees during generation:

```
$ npx prism init

  ◇  Project name? … my-app
  ◇  TypeScript? … Yes
  ◇  Styling? … Tailwind CSS
  ...

  🔍  Analyzing configuration...
  📦  Creating project structure...    ✓  48 files
  ⚙️  Setting up core modules...       ✓  12 files
  🎨  Configuring UI system...         ✓  24 files
  🔗  Setting up API layer...          ✓  8 files
  📝  Creating feature modules...      ✓  36 files
  🧪  Setting up testing...            ✓  4 files
  📖  Generating documentation...      ✓  6 files
  🚀  Installing dependencies...       ✓  npm install completed

  ✨  Project "my-app" created in 14.2s!
  📂  cd my-app
  🚀  npm run dev
```

---

## ⚠️ Error Handling System

```typescript
class PrismError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public hint?: string,
    public recoverable: boolean = false,
  ) {
    super(message);
    this.name = "PrismError";
  }
}

enum ErrorCode {
  INVALID_CONFIG = "INVALID_CONFIG",
  DIRECTORY_EXISTS = "DIRECTORY_EXISTS",
  GENERATION_FAILED = "GENERATION_FAILED",
  NPM_INSTALL_FAILED = "NPM_INSTALL_FAILED",
  TEMPLATE_NOT_FOUND = "TEMPLATE_NOT_FOUND",
}

// Central error handler
function handleError(error: unknown): never {
  if (error instanceof PrismError) {
    console.error(`\n${chalk.red("✗")} ${error.message}`);
    if (error.hint) {
      console.error(`  ${chalk.dim("💡")} ${error.hint}`);
    }
    if (error.recoverable) {
      console.error(`  ${chalk.dim("🔄")} Run with --verbose for details`);
    }
    process.exit(1);
  }

  // Unknown errors
  console.error(chalk.red("\n✗ An unexpected error occurred:"));
  console.error(chalk.dim(error));
  process.exit(1);
}
```

---

## 🔌 Plugin System Architecture

Generators register via a plugin interface:

```typescript
// Generator plugin registration
const engine = new GeneratorEngine(config);

engine.register(new CoreGenerator());       // priority: 100
engine.register(new APIGenerator());        // priority: 200
engine.register(new StateGenerator());      // priority: 300
engine.register(new FeatureGenerator());    // priority: 400
engine.register(new MobileGenerator({       // conditional — only for RN
  platforms: config.tech.platforms
}));                                        // priority: 500

await engine.generate("./my-app");
```

---

## 📁 Internal Prism Project Structure

```
prism/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── src/
│   ├── cli/
│   │   ├── index.ts              # CLI entry
│   │   └── commands/
│   │       ├── init.ts
│   │       ├── add.ts
│   │       ├── generate.ts
│   │       ├── docs.ts
│   │       └── info.ts
│   ├── core/
│   │   ├── engine.ts             # GeneratorEngine
│   │   ├── file-writer.ts        # FileWriter
│   │   ├── config.ts             # ConfigBuilder
│   │   ├── progress.ts           # ProgressEngine
│   │   └── errors.ts             # Error handling
│   ├── generators/
│   │   ├── core-scaffold.ts
│   │   ├── api-generator.ts
│   │   ├── state-generator.ts
│   │   ├── ui-generator.ts
│   │   ├── feature-generator.ts
│   │   ├── route-generator.ts
│   │   ├── auth-generator.ts
│   │   ├── test-generator.ts
│   │   ├── doc-generator.ts
│   │   └── mobile-generator.ts
│   ├── templates/
│   │   ├── core/
│   │   ├── api/
│   │   ├── state/
│   │   ├── ui/
│   │   ├── features/
│   │   ├── routes/
│   │   ├── auth/
│   │   └── mobile/
│   ├── prompts/
│   │   ├── index.ts
│   │   └── questions/
│   └── utils/
│       ├── formatter.ts          # Prettier integration
│       ├── package-manager.ts    # npm/yarn/pnpm detection
│       ├── git.ts                # git init
│       └── logger.ts             # Logging
├── test/
│   ├── engine.test.ts
│   ├── generators.test.ts
│   └── fixtures/
└── examples/
    └── basic/
```

---

## 📊 Complexity Matrix

| Component | Complexity | Lines | Dependencies |
|-----------|-----------|-------|-------------|
| CLI Entry | 🟢 Low | ~100 | commander |
| Config Builder | 🟡 Medium | ~200 | inquirer, zod |
| Generator Engine | 🔴 High | ~400 | — |
| File Writer | 🟡 Medium | ~150 | prettier, fs-extra |
| Progress Engine | 🟢 Low | ~100 | ora, chalk |
| Core Generator | 🟡 Medium | ~300 | ejs |
| API Generator | 🟡 Medium | ~350 | ejs |
| Feature Generator | 🔴 High | ~500 | ejs |
| UI Generator | 🟡 Medium | ~400 | ejs |
| State Generator | 🟡 Medium | ~250 | ejs |
| Auth Generator | 🟡 Medium | ~300 | ejs |
| Route Generator | 🟢 Low | ~200 | ejs |
| Mobile Generator | 🔴 High | ~400 | ejs |
| Doc Generator | 🟡 Medium | ~300 | ejs |
| **Total** | | **~3,550** | |
