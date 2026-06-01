# Prism — Implementation Plan

## 📋 Phase-Based Build Plan

```
Phase 1: Foundation    →  Week 1-2   →  CLI skeleton + core engine
Phase 2: Generators    →  Week 3-4   →  All 9 generators
Phase 3: Templates     →  Week 5     →  EJS templates for every file
Phase 4: Polish        →  Week 6     →  Testing, docs, publish
```

---

## 🗓️ Phase 1: Foundation (Week 1-2)

### Day 1-2: Project Setup

```bash
mkdir prism && cd prism
npm init -y
npx tsc --init --strict
npm install commander inquirer chalk ora ejs fs-extra prettier
npm install -D typescript @types/node tsx vitest
```

| Task | Files | Status |
|------|-------|--------|
| Initialize package.json | `package.json` | ✅ |
| TypeScript strict config | `tsconfig.json` | ✅ |
| ESLint + Prettier config | `.eslintrc.js`, `.prettierrc` | ✅ |
| Build script (tsx → node) | `tsconfig.json`, `scripts/` | ✅ |
| **CLI Entry Command** | `src/cli/index.ts` | ✅ |

### Day 3-4: CLI Commands

| File | Purpose |
|------|---------|
| `src/cli/index.ts` | Commander setup, 5 commands |
| `src/cli/commands/init.ts` | `prism init` — main command |
| `src/cli/commands/add.ts` | `prism add feature` — add features |
| `src/cli/commands/generate.ts` | `prism generate` — re-generate |
| `src/cli/commands/docs.ts` | `prism docs` — documentation only |
| `src/cli/commands/info.ts` | `prism info` — project diagnostics |

### Day 5-7: Core Engine

| File | Purpose |
|------|---------|
| `src/core/engine.ts` | GeneratorEngine — pipeline orchestration |
| `src/core/config.ts` | ConfigBuilder — prompt answers → PrismConfig |
| `src/core/progress.ts` | ProgressEngine — Ora spinners + summary |
| `src/core/file-writer.ts` | FileWriter — disk output + prettier |
| `src/core/errors.ts` | PrismError class + centralized handler |
| `src/utils/formatter.ts` | Prettier code formatting |
| `src/utils/package-manager.ts` | npm/yarn/pnpm auto-detect |

### Day 8-10: Prompt System

| File | Purpose |
|------|---------|
| `src/prompts/index.ts` | Main prompt orchestrator |
| `src/prompts/questions/project-info.ts` | Name, description, author |
| `src/prompts/questions/tech-stack.ts` | TS/JS, Tailwind/CSS, platforms |
| `src/prompts/questions/features.ts` | Auth, routing, testing, etc. |
| `src/prompts/questions/structure.ts` | Feature vs flat structure |
| `src/prompts/validators.ts` | Input validation |
| `src/utils/logger.ts` | Debug logging |

**Milestone:** `prism init` runs end-to-end with prompts but generates empty output.

---

## 🗓️ Phase 2: Generators (Week 3-4)

### Week 3: Core + API + State Generators

#### Day 11-12: Core Generator

Generates the project skeleton:

```
EJS Templates:    src/templates/core/
                  ├── package.json.ejs
                  ├── tsconfig.json.ejs
                  ├── vite.config.ts.ejs
                  ├── index.html.ejs
                  ├── .gitignore.ejs
                  └── .env.example.ejs

Generator:        src/generators/core-scaffold.ts
```

| File | Complexity | Key Detail |
|------|-----------|------------|
| `package.json.ejs` | 🟡 Medium | Dynamic deps based on config |
| `tsconfig.json.ejs` | 🟢 Low | Path aliases, strict mode |
| `vite.config.ts.ejs` | 🟢 Low | Plugins, resolve aliases |
| `index.html.ejs` | 🟢 Low | App shell, SEO meta |

#### Day 13-15: API Generator

```
EJS Templates:    src/templates/api/
                  ├── client-axios.ts.ejs
                  ├── client-fetch.ts.ejs
                  ├── apiRoutes.ts.ejs
                  └── types.ts.ejs

Generator:        src/generators/api-generator.ts
```

**Key Implementation Detail:**
- Token refresh interceptor uses a **queue** pattern to avoid multiple simultaneous refresh calls
- Service builder generates CRUD with **loading + error** states built into every method

#### Day 16-17: State Generator

```
EJS Templates:    src/templates/state/
                  ├── queryClient.ts.ejs
                  ├── store-factory.ts.ejs
                  ├── feature-store.ts.ejs
                  └── providers.tsx.ejs

Generator:        src/generators/state-generator.ts
```

**Key Implementation Detail:**
- Zustand store factory uses **generic TypeScript** with middleware chain
- Query client configures **retry logic, stale times, error normalization**

### Week 4: UI + Feature + Route + Auth Generators

#### Day 18-20: UI Generator (Most Complex)

```
EJS Templates:    src/templates/ui/
                  ├── components/
                  │   ├── Button.tsx.ejs
                  │   ├── Input.tsx.ejs
                  │   ├── Card.tsx.ejs
                  │   ├── Modal.tsx.ejs
                  │   ├── Badge.tsx.ejs
                  │   ├── Select.tsx.ejs
                  │   ├── Tabs.tsx.ejs
                  │   ├── Switch.tsx.ejs
                  │   ├── Toast.tsx.ejs
                  │   ├── Tooltip.tsx.ejs
                  │   ├── Skeleton.tsx.ejs
                  │   └── DataTable.tsx.ejs
                  ├── layout/
                  │   ├── DashboardLayout.tsx.ejs
                  │   ├── Sidebar.tsx.ejs
                  │   ├── Header.tsx.ejs
                  │   └── AuthLayout.tsx.ejs
                  └── common/
                      ├── SearchBar.tsx.ejs
                      ├── Breadcrumbs.tsx.ejs
                      └── EmptyState.tsx.ejs
```

**Key Implementation Detail:**
- Every component has **3 variants** (Tailwind, Custom CSS, CSS Modules)
- Conditional rendering based on config.tech.styling
- All components include **ARIA attributes + keyboard navigation**

#### Day 21-22: Feature Generator

```
Generator:        src/generators/feature-generator.ts
```

**Key Implementation Detail:**
- Builds **entire feature folder** with service, hooks, pages, components
- `prism add feature` also updates routes + sidebar + config
- Programmatic builder (not EJS) for maximum flexibility

#### Day 23: Route Generator

```
EJS Templates:    src/templates/routes/
                  ├── index.tsx.ejs
                  └── authRoutes.tsx.ejs

Generator:        src/generators/route-generator.ts
```

**Key Detail:** React Router v6 with lazy loading + Suspense + auth guards.

#### Day 24: Auth Generator

```
EJS Templates:    src/templates/auth/
                  ├── AuthContext.tsx.ejs
                  ├── sessionService.ts.ejs
                  ├── LoginPage.tsx.ejs
                  ├── ForgotPasswordPage.tsx.ejs
                  └── PrivateRoute.tsx.ejs

Generator:        src/generators/auth-generator.ts
```

---

## 🗓️ Phase 3: Templates + Mobile (Week 5)

### Day 25-27: Doc Generator

```
Generator:        src/generators/doc-generator.ts
```

**Generates:**
- `README.md` — Project overview, badges, quick start
- `docs/architecture.md` — Mermaid architecture diagram
- `docs/features/[feature].md` — Per-feature documentation
- `docs/data-flow.md` — Data flow diagrams
- `CONTRIBUTING.md` — Contribution guidelines

### Day 28-30: Mobile Generator (Optional)

```
EJS Templates:    src/templates/mobile/
                  ├── app.json.ejs
                  ├── App.tsx.ejs
                  ├── babel.config.js.ejs
                  └── metro.config.js.ejs

Generator:        src/generators/mobile-generator.ts
```

**Components shared with web:**
- Types (shared/types/)
- API client (shared/api/)
- Auth logic (shared/auth/)

---

## 🗓️ Phase 4: Polish + Publish (Week 6)

### Day 31-32: Tests

```typescript
// test/engine.test.ts
describe("GeneratorEngine", () => {
  it("registers all generators in priority order");
  it("executes pipeline successfully");
  it("handles errors gracefully");
});

// test/generators.test.ts
describe("FeatureGenerator", () => {
  it("generates TypeScript feature files");
  it("generates JavaScript feature files");
  it("handles custom feature names");
  it("skips generation for flat structure");
});

// test/config.test.ts
describe("ConfigBuilder", () => {
  it("merges CLI flags with defaults");
  it("validates required fields");
});
```

### Day 33-34: Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main project page (badges, quick start, examples) |
| `CONTRIBUTING.md` | How to contribute, local dev setup |
| `docs/getting-started.md` | Detailed installation + usage guide |
| `docs/architecture.md` | System architecture |
| `examples/basic/` | Example generated project |
| `examples/enterprise/` | Full enterprise setup example |

### Day 35: CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
      - run: npm run build

  publish:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: JS-DevTools/npm-publish@v3
        with:
          token: ${{ secrets.NPM_TOKEN }}
```

### Day 36: Release

```bash
# Release checklist
npm run test                  # All tests pass
npm run build                 # Builds cleanly
npm pack --dry-run            # Check package contents
npm version patch/minor/major # Bump version
npm publish                   # Ship to npm
git push --tags               # Push tags
```

---

## 📊 Effort Estimation

| Phase | Days | Files | Lines | Complexity |
|-------|------|-------|-------|-----------|
| **Foundation** | 10 | ~18 | ~1,500 | 🟡 Medium |
| **Generators** | 14 | ~50 | ~3,000 | 🔴 High |
| **Templates** | 8 | ~45 | ~2,500 | 🟡 Medium |
| **Polish** | 6 | ~15 | ~1,500 | 🟢 Low |
| **Total** | **36** | **~128** | **~8,500** | |

---

## 🚀 First Release Scope (MVP)

### Must Have (v1.0.0)
- [x] `prism init` with interactive prompts
- [x] TypeScript project generation
- [x] Tailwind CSS setup
- [x] Feature-based structure
- [x] Zustand + TanStack Query state
- [x] API client with auth interceptor
- [x] Login + routing
- [x] 12 UI components
- [x] 1 example feature

### Should Have (v1.1.0)
- [ ] `prism add feature` command
- [ ] Custom CSS variant
- [ ] JavaScript variant (non-TS)
- [ ] Dark mode
- [ ] Test generation
- [ ] Doc generation

### Nice to Have (v2.0.0)
- [ ] React Native / Expo mobile
- [ ] CSS Modules variant
- [ ] Redux Toolkit variant
- [ ] `prism generate docs` — doc regeneration
- [ ] VS Code extension
- [ ] GitHub template integration
- [ ] Prism Cloud (project templates marketplace)

---

## ⚠️ Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Template complexity too high | 🟡 Medium | 🔴 High | Use programmatic builders for complex files |
| Edge cases in feature naming | 🟡 Medium | 🟡 Medium | Comprehensive name conversion utilities |
| Package version conflicts | 🟢 Low | 🟡 Medium | Pin major versions, test combinations |
| EJS syntax errors | 🟡 Medium | 🟡 Medium | Unit test template output |
| Performance (large projects) | 🟢 Low | 🟢 Low | Async generators, streaming writes |
| Cross-platform issues | 🟡 Medium | 🟡 Medium | Test on Windows/Mac/Linux in CI |

---

## 🧩 File Generation Order (Critical)

```
1. package.json              ← Dependencies first
2. Config files              ← tsconfig, vite, tailwind, postcss
3. index.html                ← HTML shell
4. src/styles/               ← CSS tokens, globals
5. src/shared/lib/           ← cn, queryClient, etc
6. src/shared/utils/         ← format, notify, etc
7. src/shared/hooks/         ← useDebounce, useLocalStorage, etc
8. src/shared/constants/     ← Status, roles, actions
9. src/shared/core/api/      ← API client, routes
10. src/shared/core/auth/    ← Auth context, session
11. src/shared/core/context/ ← Theme, Notification, Layout
12. src/shared/core/config/  ← App config, routes config
13. src/shared/routes/       ← Router setup
14. src/components/ui/       ← All UI components
15. src/components/layout/   ← Layout components
16. src/components/common/   ← Shared components
17. src/features/            ← Feature modules + services
18. src/App.tsx              ← Root component
19. src/main.tsx             ← Entry point
20. docs/                    ← Auto-generated docs
21. README.md                ← Project README
22. .env.example             ← Environment variables
23. .gitignore               ← Git ignore rules
```

**Why this order:** Each step depends on the previous. You can't generate feature hooks before the API client exists, and you can't generate the router before modules exist.
