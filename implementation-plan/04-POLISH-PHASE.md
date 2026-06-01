# Phase 4: Polish — Testing, Documentation, CI/CD, Publish

> **Duration:** ~3 milestones
> **Goal:** Production-ready npm package with CI/CD, tests, and docs.

---

## Milestone 4.1: Testing Strategy

### Test Categories

| Category | Files | Tests | Priority |
|----------|-------|-------|----------|
| **Config Builder** | `config.test.ts` | 15 | 🔴 High |
| **Generator Engine** | `engine.test.ts` | 10 | 🔴 High |
| **Core Generator** | `core-scaffold.test.ts` | 8 | 🔴 High |
| **API Generator** | `api-generator.test.ts` | 12 | 🔴 High |
| **State Generator** | `state-generator.test.ts` | 10 | 🟡 Medium |
| **UI Generator** | `ui-generator.test.ts` | 18 | 🔴 High |
| **Feature Generator** | `feature-generator.test.ts` | 15 | 🔴 High |
| **Route Generator** | `route-generator.test.ts` | 8 | 🟡 Medium |
| **Auth Generator** | `auth-generator.test.ts` | 10 | 🟡 Medium |
| **Doc Generator** | `doc-generator.test.ts` | 6 | 🟢 Low |
| **OpenAPI Sync** | `sync-engine.test.ts` | 12 | 🔴 High |
| **Anchor Injector** | `anchor-injector.test.ts` | 10 | 🟡 Medium |
| **Dashboard Generator** | `dashboard.test.ts` | 6 | 🟢 Low |
| **Integration** | `full-generation.test.ts` | 5 | 🔴 High |

### Unit Test Example

```typescript
// test/generators/feature-generator.test.ts
import { describe, it, expect } from "vitest";
import { FeatureGenerator } from "../../src/generators/feature-generator";
import { defaultConfig } from "../fixtures/config";

describe("FeatureGenerator", () => {
  const generator = new FeatureGenerator();

  it("returns empty array for flat structure", async () => {
    const config = { ...defaultConfig, structure: { type: "flat", features: [] } };
    const files = await generator.generate(config);
    expect(files).toHaveLength(0);
  });

  it("generates service file for each feature", async () => {
    const config = {
      ...defaultConfig,
      structure: { type: "feature", features: ["users"] },
    };
    const files = await generator.generate(config);
    const serviceFile = files.find((f) =>
      f.path.includes("services/usersService")
    );
    expect(serviceFile).toBeDefined();
    expect(serviceFile!.content).toContain("usersService");
  });

  it("generates TypeScript interfaces when typescript is enabled", async () => {
    const config = {
      ...defaultConfig,
      tech: { ...defaultConfig.tech, typescript: true },
      structure: { type: "feature", features: ["users"] },
    };
    const files = await generator.generate(config);
    const serviceFile = files.find((f) =>
      f.path.includes("services/usersService")
    );
    expect(serviceFile!.content).toContain(": string");
    expect(serviceFile!.content).toContain("interface");
  });

  it("generates JavaScript when typescript is disabled", async () => {
    const config = {
      ...defaultConfig,
      tech: { ...defaultConfig.tech, typescript: false },
      structure: { type: "feature", features: ["users"] },
    };
    const files = await generator.generate(config);
    const serviceFile = files.find((f) =>
      f.path.includes("services/usersService")
    );
    expect(serviceFile!.content).not.toContain(": string");
  });

  it("handles kebab-case feature names", async () => {
    const config = {
      ...defaultConfig,
      structure: { type: "feature", features: ["user-profiles"] },
    };
    const files = await generator.generate(config);
    const hasPascal = files.some((f) => f.path.includes("UserProfiles"));
    const hasCamel = files.some((f) => f.path.includes("userProfiles"));
    expect(hasPascal || hasCamel).toBe(true);
  });

  it("generates correct number of files per feature", async () => {
    const config = {
      ...defaultConfig,
      structure: { type: "feature", features: ["users"] },
    };
    const files = await generator.generate(config);
    // Expect ~12 files per feature
    expect(files.length).toBeGreaterThanOrEqual(10);
    expect(files.length).toBeLessThanOrEqual(15);
  });

  it("rejects invalid feature names", async () => {
    const config = {
      ...defaultConfig,
      structure: { type: "feature", features: ["123invalid", "has spaces"] },
    };
    await expect(generator.validate(config)).rejects.toThrow();
  });
});
```

### Integration Test

```typescript
// test/integration/full-generation.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

const TEST_DIR = path.join(__dirname, "../.test-output");

describe("End-to-End Generation", () => {
  beforeAll(() => {
    fs.ensureDirSync(TEST_DIR);
  });

  afterAll(() => {
    fs.removeSync(TEST_DIR);
  }, 30_000);

  it(
    "generates a complete project that installs and builds",
    async () => {
      // 1. Run docify init with default config
      execSync(`node ${path.join(__dirname, "../../dist/index.js")} init --yes --output "${TEST_DIR}"`, {
        stdio: "pipe",
        timeout: 30_000,
      });

      // 2. Verify key files exist
      const expectedFiles = [
        "package.json",
        "tsconfig.json",
        "vite.config.ts",
        "index.html",
        "src/main.tsx",
        "src/App.tsx",
        "src/shared/lib/cn.ts",
        "src/shared/core/api/client.ts",
        "src/shared/core/api/apiRoutes.ts",
        "src/shared/core/api/types.ts",
        "src/shared/lib/queryClient.ts",
        "src/shared/lib/store.ts",
        "src/components/ui/Button.tsx",
        "src/components/ui/Modal.tsx",
        "src/components/layout/DashboardLayout.tsx",
        "src/features/auth/pages/LoginPage.tsx",
        "src/features/users/services/usersService.ts",
        "src/shared/routes/index.tsx",
      ];

      for (const file of expectedFiles) {
        expect(fs.existsSync(path.join(TEST_DIR, file))).toBe(true);
      }

      // 3. Install dependencies
      execSync("npm install --prefer-offline", {
        cwd: TEST_DIR,
        stdio: "pipe",
        timeout: 120_000,
      });

      // 4. TypeScript check
      execSync("npx tsc --noEmit", {
        cwd: TEST_DIR,
        stdio: "pipe",
        timeout: 60_000,
      });

      // 5. Build
      execSync("npm run build", {
        cwd: TEST_DIR,
        stdio: "pipe",
        timeout: 60_000,
      });

      // 6. Verify build output
      expect(fs.existsSync(path.join(TEST_DIR, "dist/index.html"))).toBe(true);
    },
    300_000
  ); // 5 minute timeout
});
```

### Test Fixtures

```typescript
// test/fixtures/config.ts
import type { DocifyConfig } from "../../src/core/types";

export const defaultConfig: DocifyConfig = {
  project: {
    name: "test-app",
    description: "Test project",
    author: "Test User",
    version: "1.0.0",
  },
  tech: {
    typescript: true,
    styling: "tailwind",
    platforms: ["web"],
    state: "zustand-query",
    packageManager: "npm",
    apiClient: "axios",
  },
  structure: {
    type: "feature",
    features: ["auth", "dashboard", "users"],
  },
  modules: {
    auth: true,
    routing: true,
    testing: true,
    docs: true,
    pwa: false,
  },
  generated: {
    date: "2026-06-01T00:00:00Z",
    docifyVersion: "1.0.0",
  },
};
```

---

## Milestone 4.2: Documentation

### Generated CLI docs

| File | Purpose |
|------|---------|
| `README.md` | Main project page (badges, quick start, examples) |
| `CONTRIBUTING.md` | How to contribute, local dev setup |
| `docs/getting-started.md` | Detailed installation + usage guide |
| `docs/architecture.md` | System architecture |
| `docs/commands.md` | All CLI commands reference |
| `docs/configuration.md` | Config file reference |
| `examples/basic/` | Example generated project |
| `examples/enterprise/` | Full enterprise setup example |

### README.md Template

```markdown
# Docify 🚀

> **One command. Complete React project. Production ready.**

[![npm version](https://img.shields.io/npm/v/docify)](https://www.npmjs.com/package/docify)
[![npm downloads](https://img.shields.io/npm/dm/docify)](https://www.npmjs.com/package/docify)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/docify)](https://github.com/yourusername/docify)
[![License](https://img.shields.io/npm/l/docify)](LICENSE)

Docify generates production-grade React projects from a single command.
80-120 files, 18 UI components, API layer, state management, auth, routing — all with zero manual setup.

## Quick Start

```bash
npx docify init

# Or with defaults
npx docify init --yes --output my-app
```

## Features

- 🎯 **Zero Config** — Opinionated defaults that work
- ⚡ **14 Second Setup** — From prompt to complete project
- 🏗️ **Feature Architecture** — Scalable for teams
- 🎨 **18 UI Components** — Accessible, dark mode, responsive
- 🔐 **Auth Included** — Login, JWT, token refresh
- 🔗 **API Layer** — Axios/fetch with interceptors
- 📊 **State Management** — Zustand + TanStack Query
- 📱 **Mobile Support** — React Native / Expo (coming soon)
- 📖 **Auto Documentation** — README, Mermaid diagrams

## Commands

| Command | Description |
|---------|-------------|
| `docify init` | Create new project |
| `docify add feature <name>` | Add feature to existing project |
| `docify sync <spec>` | Sync OpenAPI spec |
| `docify docs` | Generate documentation |
| `docify info` | Project diagnostics |
```

---

## Milestone 4.3: CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run test -- --coverage
      - uses: codecov/codecov-action@v4

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - name: Verify package works
        run: node dist/index.js --version

  e2e-test:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - name: Generate test project
        run: |
          node dist/index.js init --yes --output /tmp/e2e-test
          cd /tmp/e2e-test
          npm install --prefer-offline
          npm run build
      - name: Verify generated project
        run: |
          test -f /tmp/e2e-test/dist/index.html || exit 1
          test -f /tmp/e2e-test/package.json || exit 1
          test -f /tmp/e2e-test/src/features/users/services/usersService.ts || exit 1

  publish:
    needs: [e2e-test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Release Checklist

```bash
# Step 1: Everything green
npm run typecheck && npm run lint && npm test && npm run build

# Step 2: Update CHANGELOG.md
# Step 3: Bump version
npm version patch  # or minor, or major

# Step 4: Publish
npm publish

# Step 5: Git
git push --tags
git push origin main

# Step 6: GitHub Release
gh release create v1.0.0 --title "v1.0.0" --notes "First stable release!"
```

---

## 🎯 Phase 4 Completion Criteria

- [ ] All tests pass with >80% coverage
- [ ] End-to-end test generates a project that builds
- [ ] CI pipeline runs on every PR
- [ ] npm package publishes successfully
- [ ] README has badges, quick start, examples
- [ ] CLI reference docs are complete
