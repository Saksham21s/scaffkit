# Prism — Build Guide

## 📦 Complete Dependency Graph

```
                    ┌─────────────────────────┐
                    │     prism CLI            │
                    │     package.json          │
                    └──────────┬──────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │                          │                          │
    ▼                          ▼                          ▼
┌──────────────┐   ┌──────────────────────┐   ┌──────────────────┐
│ Production   │   │    Development        │   │    Peer           │
│ Dependencies │   │    Dependencies       │   │    Dependencies   │
├──────────────┤   ├──────────────────────┤   ├──────────────────┤
│ commander    │   │ typescript           │   │ react            │
│ inquirer     │   │ @types/node          │   │ react-dom        │
│ chalk        │   │ @types/commander     │   │ @tanstack/react-query │
│ ora          │   │ @types/inquirer      │   │ zustand          │
│ ejs          │   │ @types/ejs          │   │ axios            │
│ fs-extra     │   │ vitest               │   │ tailwindcss      │
│ prettier     │   │ tsx                  │   │ lucide-react     │
│ validate-npm-package-name │ │ eslint    │   │                 │
│ ──────────── │   │ prettier             │   │                 │
│ ~12 deps     │   │ ~10 deps             │   │ ~8 deps         │
└──────────────┘   └──────────────────────┘   └──────────────────┘
```

---

## 🛠️ Development Environment Setup

### Prerequisites

```bash
# Required
Node.js >= 18.0.0
npm >= 9.0.0  # or yarn/pnpm

# Recommended
VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript + JavaScript
```

### Clone and Install

```bash
git clone https://github.com/yourusername/prism.git
cd prism
npm install
```

---

## 🏗️ Build Commands

```jsonc
// package.json scripts
{
  "scripts": {
    "dev": "tsx watch src/cli/index.ts",
    "build": "tsup src/cli/index.ts --format cjs --clean --minify",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/ --ext .ts",
    "lint:fix": "eslint src/ --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit",
    "prepublish": "npm run build",
    "prism:test": "node dist/index.js init --yes --output ./test-output",
    "clean": "node -e \"const fs=require('fs');['dist','node_modules','test-output'].forEach(d=>fs.rmSync(d,{recursive:true,force:true}))\""
  }
}
```

### Development Workflow

```bash
# Terminal 1: Watch mode
npm run dev -- init --yes --output ./my-test

# Terminal 2: Test iteration
npm run test:watch

# Before commit
npm run typecheck && npm run lint && npm run test && npm run build
```

---

## 📁 Test Strategy

### Unit Tests (Vitest)

```typescript
// test/helpers.ts
import { describe, it, expect } from "vitest";

// Test utilities
function runPrism(args: string[]): Promise<string> {
  // Run CLI with temp directory
}

function compareGeneratedFiles(actual: string, expected: string): boolean {
  // File-by-file comparison ignoring whitespace
}
```

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
| **Integration** | `full-generation.test.ts` | 5 | 🔴 High |

### Snapshot Testing

```typescript
// test/__snapshots__/feature-generator.test.ts.snap
exports[`FeatureGenerator > generates TypeScript service file 1`] = `
"import { apiClient } from '@core/api/client';
import { API_ROUTES } from '@core/api/apiRoutes';

export const usersService = {
  getAll: async (params = {}) => {
    const { data } = await apiClient.get(API_ROUTES.users.list, { params });
    return data;
  },
  ...
};
"`
```

### Integration Test

```typescript
// test/full-generation.test.ts
describe("End-to-End Generation", () => {
  it("generates a complete project that builds", async () => {
    // 1. Run prism init with fixture config
    const outputDir = await runPrism([
      "init",
      "--yes",
      "--output", "./test-output",
    ]);

    // 2. Verify structure exists
    expect(fs.existsSync(`${outputDir}/package.json`)).toBe(true);
    expect(fs.existsSync(`${outputDir}/src/main.tsx`)).toBe(true);
    expect(fs.existsSync(`${outputDir}/src/features/auth`)).toBe(true);

    // 3. Install deps
    execSync("npm install", { cwd: outputDir });

    // 4. Build
    execSync("npm run build", { cwd: outputDir });

    // 5. Verify build output
    expect(fs.existsSync(`${outputDir}/dist/index.html`)).toBe(true);
  }, 120_000); // 2 minute timeout
});
```

---

## 📈 Performance Budget

### Build Performance

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **Install time** | < 10s | > 20s | > 30s |
| **Build time** | < 3s | > 5s | > 10s |
| **Bundle size (gzip)** | < 5MB | > 8MB | > 12MB |
| **Test suite** | < 30s | > 60s | > 120s |

### Generation Performance

| Operation | Target | Warning | Critical |
|-----------|--------|---------|----------|
| **Prompt flow** | < 30s | > 60s | > 120s |
| **Generate 20 files** | < 2s | > 5s | > 10s |
| **Generate 100 files** | < 10s | > 20s | > 30s |
| **npm install** | < 60s | > 120s | > 180s |

---

## 🔒 Security Considerations

| Concern | Mitigation |
|---------|------------|
| **npm package supply chain** | Lock dependencies, use `npm audit` in CI |
| **User project names** | `validate-npm-package-name` for validation |
| **File path injection** | Sanitize feature names, reject special chars |
| **Template injection** | EJS escape by default, no raw eval |
| **Sensitive user data** | No data collection; all local |

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: Template Rendering Errors

```bash
# Error
Error: Could not find template: templates/feature/service.ejs

# Fix
Check that the template path is relative to the generator file,
not the CLI entry point. Use path.resolve(__dirname, ...).
```

### Issue 2: Permission Issues (npm publish)

```bash
# Error
npm ERR! 403 Forbidden

# Fix
npm login                    # Login to npm
npm access public            # Ensure package is public
```

### Issue 3: Generated Project Build Fails

```bash
# Error (in generated project)
Module not found: @core/api/client

# Fix
Check path aliases in tsconfig.json and vite.config.ts match
the generated structure. Verify paths.json is generated correctly.
```

---

## 📤 Publishing Checklist

### Pre-Publish

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] ESLint clean: `npm run lint`
- [ ] Package includes all files: Check `npm pack --dry-run`
- [ ] Version bumped: `npm version patch`
- [ ] CHANGELOG updated
- [ ] README badges updated

### Publishing

```bash
# Step 1: Build
npm run build

# Step 2: Test the built version
node dist/index.js init --yes --output ./test-gen
cd ./test-gen && npm install && npm run build

# Step 3: Bump version
npm version patch  # or minor, or major

# Step 4: Publish
npm publish

# Step 5: Tag
git push --tags

# Step 6: Create GitHub Release
gh release create v1.0.0 --title "v1.0.0" --notes "First release!"
```

---

## 🔮 Post-Build Evolution

```
v1.0.0 ──► Core CLI + all generators + 18 UI components
              │
              ▼
v1.1.0 ──► React Native support + JavaScript variant
              │
              ▼
v1.2.0 ──► Prism add feature + Prism generate docs
              │
              ▼
v2.0.0 ──► VS Code extension + Template marketplace
              │
              ▼
v2.1.0 ──► AI-enhanced generation (optional DeepSeek)
              │
              ▼
v3.0.0 ──► Prism Cloud — share and discover templates
```

---

## 📋 Complexity Analysis Summary

```
┌──────────────────────────────────────────────────────────────┐
│                 PRISM — COMPLEXITY MATRIX                     │
├───────────────────────────────┬──────────────┬───────────────┤
│ Component                     │ Difficulty    │ Lines        │
├───────────────────────────────┼──────────────┼───────────────┤
│ CLI Entry + Commands          │ 🟢 Easy       │ ~300         │
│ Prompt System                 │ 🟡 Medium     │ ~400         │
│ Config Builder                │ 🟡 Medium     │ ~250         │
│ Generator Engine              │ 🔴 Hard       │ ~450         │
│ File Writer                   │ 🟡 Medium     │ ~200         │
│ Progress Engine               │ 🟢 Easy       │ ~150         │
│ Error Handling                │ 🟢 Easy       │ ~100         │
│ Core Generator                │ 🟡 Medium     │ ~350         │
│ API Generator                 │ 🟡 Medium     │ ~400         │
│ State Generator               │ 🟡 Medium     │ ~350         │
│ UI Generator (18 components)  │ 🔴 Hard       │ ~1,500       │
│ Feature Generator             │ 🔴 Hard       │ ~600         │
│ Route Generator               │ 🟡 Medium     │ ~250         │
│ Auth Generator                │ 🟡 Medium     │ ~350         │
│ Test Generator                │ 🟡 Medium     │ ~200         │
│ Doc Generator                 │ 🟡 Medium     │ ~300         │
│ Mobile Generator              │ 🔴 Hard       │ ~400         │
│ Tests (Vitest)                │ 🟡 Medium     │ ~500         │
│ Documentation                 │ 🟢 Easy       │ ~500         │
│ CI/CD                         │ 🟢 Easy       │ ~100         │
├───────────────────────────────┼──────────────┼───────────────┤
│ TOTAL                         │               │ ~7,650        │
└───────────────────────────────┴──────────────┴───────────────┘
```

---

## 🎯 Key Implementation Tips

### 1. Start with EJS Templates for Simple Files

```typescript
// ✅ DO: Use EJS for files with minimal dynamic parts
const content = ejs.render(template, { config, featureName });

// ❌ DON'T: Use EJS for complex conditional logic
// Use programmatic builders instead
```

### 2. Use Programmatic Builders for Complex Files

```typescript
// ✅ DO: Build complex files string by string
class FeatureGenerator {
  buildService(name: string): string {
    const lines = [];
    lines.push(`export const ${name}Service = {`);
    lines.push(`  getAll: async (params) => { ... },`);
    lines.push(`}`);
    return lines.join("\n");
  }
}
```

### 3. Test Generated Output, Not Implementation

```typescript
// ✅ DO: Test the output files
expect(fs.existsSync(`${output}/src/features/users/services/usersService.ts`)).toBe(true);

// ✅ DO: Test generated content
const content = fs.readFileSync(`${output}/src/shared/lib/cn.ts`, "utf-8");
expect(content).toContain("export function cn");
```

### 4. Handle Edge Cases Early

```typescript
// Name conversion utilities
function toPascalCase(name: string): string {
  return name
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function toCamelCase(name: string): string {
  return name
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toLowerCase());
}

// Validate feature names
function isValidFeatureName(name: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name);
}
```

---

## 🚀 Final Build Command

```bash
# Complete build pipeline
npm run typecheck && \
  npm run lint && \
  npm run test -- --coverage && \
  npm run build && \
  echo "✅ Build successful!"

# Quick development test
node dist/index.js init --yes --output ./_test && \
  cd ./_test && npm install && npm run build && \
  echo "✅ Generated project builds!"
```
