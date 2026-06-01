# Performance Budget & Quality Gates

> **Performance targets for Docify CLI and generated projects.**

---

## 1. CLI Performance Budget

### Generation Speed

| Metric | Target | Warning | Critical | Measurement |
|--------|--------|---------|----------|-------------|
| Prompt flow (all questions) | < 30s | > 60s | > 120s | Real user timing |
| Generate 20 files | < 2s | > 5s | > 10s | Benchmark test |
| Generate 100 files | < 10s | > 20s | > 30s | Benchmark test |
| npm install | < 60s | > 120s | > 180s | CI pipeline |
| Total time (typical project) | < 15s | > 30s | > 60s | Integration test |

### Memory Usage

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Peak heap usage | < 200MB | > 400MB | > 600MB |
| RSS (resident set size) | < 100MB | > 200MB | > 300MB |
| Heap snapshots (large projects) | < 50MB | > 100MB | > 200MB |

### Bundle Size

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| CLI bundle (gzip) | < 500KB | > 1MB | > 2MB |
| CLI bundle (uncompressed) | < 2MB | > 4MB | > 6MB |
| Template dir (EJS files) | < 100KB | > 200KB | > 500KB |

### Startup Time

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Cold start (first run) | < 500ms | > 1s | > 2s |
| Warm start (subsequent) | < 200ms | > 500ms | > 1s |
| Help menu display | < 100ms | > 300ms | > 500ms |

---

## 2. Generated Project Performance Budget

### Build Performance

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| `npm install` (fresh) | < 45s | > 90s | > 120s |
| `npm run build` (production) | < 15s | > 30s | > 60s |
| `npm run dev` (cold start) | < 3s | > 5s | > 10s |
| TypeScript check (`tsc --noEmit`) | < 10s | > 20s | > 30s |
| Test suite run | < 20s | > 40s | > 60s |

### Bundle Size — Production Build

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Total bundle (gzip) | < 50KB | > 80KB | > 120KB |
| Total bundle (uncompressed) | < 150KB | > 250KB | > 400KB |
| Initial JS (gzip) | < 30KB | > 50KB | > 80KB |
| Initial CSS (gzip) | < 10KB | > 20KB | > 30KB |
| Lazy-loaded features (per feature) | < 15KB | > 30KB | > 50KB |
| Vendor chunk (react, etc.) | < 40KB | > 60KB | > 80KB |
| Lucide icons (tree-shaken) | < 5KB | > 10KB | > 20KB |

### Runtime Performance

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Time to Interactive (TTI) | < 1.5s | > 3s | > 5s |
| First Contentful Paint (FCP) | < 0.8s | > 1.5s | > 3s |
| Largest Contentful Paint (LCP) | < 1.5s | > 2.5s | > 4s |
| Cumulative Layout Shift (CLS) | < 0.05 | > 0.1 | > 0.25 |
| First Input Delay (FID) | < 50ms | > 100ms | > 300ms |
| Lighthouse Performance score | > 95 | > 85 | > 70 |
| Lighthouse Accessibility score | > 95 | > 85 | > 70 |
| Re-render on state change | < 5ms | > 15ms | > 30ms |

---

## 3. File Count & Lines Budget

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Generated project total files | 80-120 | > 150 | > 200 |
| Generated project total LOC | 8,000-12,000 | > 15,000 | > 20,000 |
| Per feature files | 10-15 | > 20 | > 30 |
| Per feature LOC | 400-600 | > 1,000 | > 1,500 |
| UI components | 18 | > 25 | > 30 |
| UI components total LOC | ~1,500 | > 2,500 | > 4,000 |
| Shared modules | ~25 | > 35 | > 50 |
| Generated README | < 100 lines | > 200 lines | > 500 lines |
| Dashboard HTML | < 50KB | > 100KB | > 200KB |

---

## 4. UX Quality Gates

### CLI UX

| Gate | Standard | Measurement |
|------|----------|-------------|
| **Spinner feedback** | Every step shows a spinner | Visual inspection |
| **Error messages** | Specific, actionable, human-readable | Review all error paths |
| **Success messages** | Show summary: time, files, next steps | Visual inspection |
| **Progress visibility** | Shows "3/10" or similar | Visual inspection |
| **Prompt validation** | Inline error messages with hints | Test all validators |
| **--help output** | Clear, organized with examples | `docify --help` test |
| **--version** | Shows version | `docify --version` test |
| **ANSI color support** | Auto-detects terminal color support | CI and terminal tests |
| **Unicode support** | Falls back to ASCII if no Unicode | Terminal detection |
| **Tab completion** | Bash/Zsh completion scripts | Manual test |

### Generated Project UX

| Gate | Standard | Measurement |
|------|----------|-------------|
| **Dark mode** | All components support dark/light | Toggle theme test |
| **Responsive** | Mobile-first, works at 320px-1920px | Responsive design test |
| **Accessible** | WCAG 2.1 AA minimum | axe-core audit |
| **Keyboard nav** | All interactive elements operable | Tab-through all pages |
| **Loading states** | Skeleton/spinner for every data view | Visual inspection |
| **Empty states** | Professional empty state for empty lists | Test with empty data |
| **Error boundaries** | Component-level error catching | Simulate render errors |
| **Form validation** | Inline errors, disabled submit | Test all form types |
| **Toast notifications** | Success/error/warning/info | Test CRUD operations |
| **Page transitions** | Smooth, no layout shift | Navigation test |

---

## 5. Code Quality Gates

### TypeScript

| Gate | Standard | Enforcement |
|------|----------|-------------|
| Strict mode | `strict: true` | `tsconfig.json` |
| No `any` | Zero `any` types. Exception: OpenAPI `oneOf` resolution | ESLint `no-explicit-any` |
| Explicit return types | All functions have return types | ESLint rule |
| Generics usage | Proper generic constraints where applicable | Code review |
| Discriminated unions | All union types use discriminant | Code review |

### Code Style

| Gate | Standard | Enforcement |
|------|----------|-------------|
| Line length | 100 chars | Prettier |
| Indentation | 2 spaces | Prettier |
| Quotes | Double quotes | Prettier |
| Semicolons | Required | Prettier |
| Trailing commas | ES5 mode | Prettier |
| File naming | kebab-case for files, PascalCase for components | Manual |
| Import ordering | Groups: builtin → external → internal → styles | ESLint `import/order` |
| Console.log | Zero in production code | ESLint `no-console` |
| Unused variables | Zero | `noUnusedLocals`, `noUnusedParameters` |

### Testing

| Gate | Standard | Enforcement |
|------|----------|-------------|
| Unit test coverage | > 80% lines | vitest --coverage |
| Integration tests | Full generation + build | CI pipeline |
| Test naming | `describe` + `it` with clear English names | Code review |
| No `.only` or `.skip` committed | Zero | CI check |
| Snapshot tests | For generated file output | vitest snapshot |
| Mutation tests (future) | > 70% mutation score | Stryker |

---

## 6. Security Gates

| Gate | Standard | Enforcement |
|------|----------|-------------|
| npm audit | Zero critical, zero high | CI pipeline |
| Dependency scanning | Weekly Dependabot | GitHub |
| No secrets in code | Zero | Secret scanning |
| Input sanitization | All user inputs sanitized | Code review |
| Template injection | EJS escape by default | Template review |
| Path traversal | Path normalization, reject `../` | Code review |
| SSRF protection | Local file read only for `sync` | Code review |

---

## 7. Monitoring & Alerts

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| Generation success rate | < 99% | Investigate failures |
| Average generation time | > 30s | Performance audit |
| npm install failure rate | > 5% | Check dependencies |
| Generated project build failure | > 2% | Check generated output |
| npm downloads (weekly) | < 0 for 2 weeks | Deprecation warning |
| GitHub issues unresolved | > 20 | Triage session |
| CI failure rate | > 5% | Fix pipeline |

---

## 8. Performance Optimization Techniques

### CLI Optimizations

```typescript
// 1. Lazy-load generators (don't import all at startup)
const generators: Record<string, () => Promise<Generator>> = {
  "core-scaffold": () => import("../generators/core-scaffold"),
  "api": () => import("../generators/api-generator"),
  "feature": () => import("../generators/feature-generator"),
  // ...
};

// 2. Stream large file writes
async function writeLargeFile(path: string, content: string): Promise<void> {
  const writer = fs.createWriteStream(path);
  const chunks = chunkContent(content, 64 * 1024); // 64KB chunks
  for (const chunk of chunks) {
    await new Promise<void>((resolve, reject) => {
      writer.write(chunk, (error) => (error ? reject(error) : resolve()));
    });
  }
  writer.end();
}

// 3. Cache resolved template paths
const templateCache = new Map<string, string>();
function getTemplate(name: string): string {
  if (templateCache.has(name)) return templateCache.get(name)!;
  const content = fs.readFileSync(resolve(__dirname, `../templates/${name}`), "utf-8");
  templateCache.set(name, content);
  return content;
}

// 4. Parallel template rendering
const renderedFiles = await Promise.all(
  features.map(async (feature) => ({
    path: `src/features/${feature}/services/${feature}Service.ts`,
    content: renderServiceTemplate(config, feature),
  }))
);
```

### Generated Project Optimizations

```typescript
// 1. Code splitting by routes (built into route generator)
const UsersListPage = lazy(() => import("@features/users/pages/UsersListPage"));
const UsersDetailPage = lazy(() => import("@features/users/pages/UsersDetailPage"));

// 2. React.memo for list items (built into DataTable)
const TableRow = React.memo(function TableRow({ row, columns }: Props) {
  return (
    <tr>
      {columns.map((col) => (
        <td key={col.key}>{row[col.key]}</td>
      ))}
    </tr>
  );
});

// 3. Zustand selector optimization (built into store pattern)
const useUsersSelectedIds = () => useUsersStore((state) => state.selectedIds);

// 4. TanStack Query caching (built into queryClient)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
  },
});

// 5. CSS purging (built into Tailwind config)
// tailwind.config.js content paths ensure only used classes are in production
```

---

## Summary Dashboard

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      DOCIFY — PERFORMANCE DASHBOARD                      │
├─────────────────────────────────────┬───────────────────┬────────────────┤
│ METRIC                              │ TARGET            │ CURRENT        │
├─────────────────────────────────────┼───────────────────┼────────────────┤
│ CLI cold start                      │ < 500ms           │ —              │
│ Generate 20 files                   │ < 2s              │ —              │
│ Generate 100 files                  │ < 10s             │ —              │
│ Bundle size (gzip)                  │ < 500KB           │ —              │
│ Generated project build             │ < 15s             │ —              │
│ Generated bundle (gzip)             │ < 50KB            │ —              │
│ Lighthouse Performance              │ > 95              │ —              │
│ Lighthouse Accessibility            │ > 95              │ —              │
│ Test coverage                       │ > 80%             │ —              │
│ npm audit (critical)                │ 0                 │ —              │
├─────────────────────────────────────┼───────────────────┼────────────────┤
│ OVERALL STATUS                      │ 🟡 IN PROGRESS    │ v0.0.0        │
└─────────────────────────────────────┴───────────────────┴────────────────┘
```
