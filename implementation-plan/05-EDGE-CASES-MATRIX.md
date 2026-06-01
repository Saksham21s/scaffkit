# Edge Cases Matrix — Complete Coverage

> **Every edge case across every component of Docify.**

---

## 1. CLI & Entry Points

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 1.1 | Node.js < 18 | CLI Entry | 🔴 Critical | Check version on startup, show clear error with download link |
| 1.2 | No internet (offline mode) | CLI Entry | 🟡 Medium | All core generation works offline. Warn for `npm install` but allow `--offline` flag |
| 1.3 | Ctrl+C during generation | CLI Entry | 🟡 Medium | Catch SIGINT, clean up temp files, show partial success message |
| 1.4 | Very long command args | CLI Entry | 🟢 Low | Commander handles this, but validate length |
| 1.5 | Unicode args in terminal | CLI Entry | 🟢 Low | Normalize to NFC, strip non-ASCII from project names |
| 1.6 | Running as root/admin | CLI Entry | 🟢 Low | Show security warning but continue |
| 1.7 | TTY not available (CI mode) | CLI Entry | 🟡 Medium | Auto-detect, skip prompts, use defaults |
| 1.8 | Pipe mode (e.g., `echo "y" | docify init`) | CLI Entry | 🟡 Medium | Not supported — use `--yes` flag instead |

## 2. Config System

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 2.1 | Malformed config JSON | Config | 🟡 Medium | Catch parse error, show line number, fall back to prompts |
| 2.2 | Config file has unknown keys | Config | 🟢 Low | Strip unknown keys silently, or warn with `--verbose` |
| 2.3 | Config file has type errors (e.g., string instead of boolean) | Config | 🔴 Critical | Validate with Zod, show specific error messages per field |
| 2.4 | Empty config file | Config | 🟢 Low | Treat as missing, use prompts |
| 2.5 | Config file from older docify version | Config | 🟡 Medium | Detect version mismatch, migrate fields |
| 2.6 | Both CLI flags and config file contradict | Config | 🟢 Low | CLI flags take precedence, warn on contradiction |
| 2.7 | Project name is "docify" or "docify-cli" | Config | 🟡 Medium | Warn about potential npm confusion |
| 2.8 | Project name starts with number | Config | 🟢 Low | Prepend underscore, warn user |

## 3. File Writer

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 3.1 | Disk full during write | File Writer | 🔴 Critical | Catch ENOSPC, show free space needed, rollback |
| 3.2 | Permission denied (EACCES) | File Writer | 🔴 Critical | Show file path, suggest sudo/admin |
| 3.3 | Path too long (Windows MAX_PATH = 260) | File Writer | 🔴 Critical | Use `\\?\` prefix on Windows, warn if > 200 chars |
| 3.4 | File already exists with different content | File Writer | 🟡 Medium | Show diff, ask overwrite/merge/skip/batch |
| 3.5 | File locked by another process | File Writer | 🟡 Medium | Retry 3 times with backoff, then fail |
| 3.6 | Temp dir cleanup on crash | File Writer | 🔴 Critical | Register cleanup handlers for SIGINT, SIGTERM, uncaughtException |
| 3.7 | Read-only filesystem | File Writer | 🟡 Medium | Catch EROFS, show clear error |
| 3.8 | Symlink loops in path | File Writer | 🟢 Low | Use `fs.realpath` to resolve before writing |
| 3.9 | Concurrent writes to same file | File Writer | 🟡 Medium | Use temp files + atomic rename |
| 3.10 | Files with same name in different generators | File Writer | 🟡 Medium | Priority-based overwrite, last writer wins for `package.json` merges |

## 4. Feature Names & Naming

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 4.1 | JS reserved keyword (class, const, let, etc.) | Names | 🟡 Medium | Prefix with underscore: `class` → `_class` |
| 4.2 | Empty feature name | Names | 🟡 Medium | Validate at prompt level, reject |
| 4.3 | Feature name with spaces | Names | 🟢 Low | Auto-convert to kebab-case, warn |
| 4.4 | Feature name with special chars (@, #, $, etc.) | Names | 🟡 Medium | Strip to `[a-z0-9-]`, warn |
| 4.5 | Feature name all numbers (e.g., "123") | Names | 🟢 Low | Prefix with underscore |
| 4.6 | Feature name starting with hyphen | Names | 🟢 Low | Strip leading hyphens |
| 4.7 | Mixed case feature (e.g., "UserProfile") | Names | 🟢 Low | Auto-convert to kebab-case, keep original for display |
| 4.8 | Feature name collision with core modules | Names | 🟡 Medium | Warn if feature name matches "shared", "core", "components", etc. |
| 4.9 | Duplicate feature names in list | Names | 🟢 Low | Deduplicate, warn |
| 4.10 | Maximum feature name length (50+ chars) | Names | 🟢 Low | Truncate to 50 with warning |

## 5. Prompt System

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 5.1 | User types "npx docify init" in existing project dir | Prompts | 🟡 Medium | Detect existing project, offer to merge/overwrite |
| 5.2 | User provides no features | Prompts | 🟢 Low | Default to ["auth", "dashboard", "users"] |
| 5.3 | Terminal resize during prompts | Prompts | 🟢 Low | Inquirer handles this gracefully |
| 5.4 | Very long input (>1000 chars) | Prompts | 🟢 Low | Truncate at input level |
| 5.5 | ANSI escape sequences in input | Prompts | 🟡 Medium | Sanitize input, strip ANSI codes |
| 5.6 | Non-interactive shell (SSH, CI) | Prompts | 🟡 Medium | Detect `!process.stdin.isTTY`, use `--yes` mode |
| 5.7 | Invalid selection (checkbox min/max) | Prompts | 🟢 Low | Inquirer validation handles this |

## 6. Generator Engine

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 6.1 | Generator throws during validation | Engine | 🔴 Critical | Catch error, show generator name + reason, abort cleanly |
| 6.2 | Generator produces empty file list | Engine | 🟢 Low | Skip empty generators, log in verbose mode |
| 6.3 | Generator has circular dependency | Engine | 🔴 Critical | Detect cycles in priority-based DAG, abort with error |
| 6.4 | Generator takes too long (>30s) | Engine | 🟡 Medium | Show progress spinner with elapsed time |
| 6.5 | Generator file data too large (100MB+) | Engine | 🟢 Low | Stream writes, don't buffer all in memory |
| 6.6 | All generators skip (no features, no styling, etc.) | Engine | 🟡 Medium | Show "Nothing to generate" message |
| 6.7 | Generator priority conflict (same priority) | Engine | 🟡 Medium | Log warning, use registration order as tiebreaker |

## 7. API Client Generation

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 7.1 | Token refresh endpoint also returns 401 | API Gen | 🔴 Critical | Don't retry refresh, clear session, redirect to login |
| 7.2 | Multiple concurrent 401s | API Gen | 🔴 Critical | Queue pattern — single refresh, resolve all queued requests |
| 7.3 | Network offline during request | API Gen | 🟡 Medium | Axios retry with exponential backoff, show offline state |
| 7.4 | API base URL with trailing slash | API Gen | 🟢 Low | Normalize in client constructor |
| 7.5 | CORS errors on first request | API Gen | 🟢 Low | Show clear CORS troubleshooting in console |
| 7.6 | 5xx server error (retry strategy) | API Gen | 🟡 Medium | Retry up to 2 times with exponential backoff for 5xx |
| 7.7 | 4xx client error (no retry) | API Gen | 🟢 Low | Don't retry, reject with error |
| 7.8 | Timeout (>30s) | API Gen | 🟡 Medium | Configurable timeout, default 30s |
| 7.9 | ResponseType blob for file downloads | API Gen | 🟡 Medium | Support responseType in service methods |
| 7.10 | No auth token available | API Gen | 🟢 Low | Proceed without Authorization header |

## 8. State Management

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 8.1 | Zustand persist with undefined in state | State Gen | 🟡 Medium | Use `partialize` to filter out undefined values |
| 8.2 | Zustand + TanStack Query devtools conflict | State Gen | 🟢 Low | Separate devtools imports, use different ports |
| 8.3 | Redux store too large (>100MB) | State Gen | 🟡 Medium | Lazy loading, code splitting |
| 8.4 | Context-only with 1000+ re-renders | State Gen | 🟡 Medium | Split contexts by concern (theme, notification, layout) |
| 8.5 | SSR hydration mismatch | State Gen | 🟡 Medium | Use `useEffect` for client-only state, `suppressHydrationWarning` |
| 8.6 | Multiple providers order dependency | State Gen | 🟡 Medium | Nested in correct order: QueryClient → Router → Theme → Auth |

## 9. UI Component Generation

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 9.1 | Reduced motion preference | UI Gen | 🟡 Medium | Respect `prefers-reduced-motion`, disable animations |
| 9.2 | High contrast mode | UI Gen | 🟡 Medium | Ensure WCAG AA contrast (4.5:1) with CSS variables |
| 9.3 | Screen reader compatibility | UI Gen | 🔴 Critical | ARIA labels on all interactive elements |
| 9.4 | RTL layout (Arabic, Hebrew) | UI Gen | 🟢 Low | Add `dir="rtl"` support, mirror margins in CSS |
| 9.5 | Keyboard navigation (Tab, Enter, Escape) | UI Gen | 🟡 Medium | All interactive components keyboard-accessible |
| 9.6 | Focus visible vs focus (mouse) | UI Gen | 🟡 Medium | Use `:focus-visible` for keyboard, not `:focus` |
| 9.7 | Zoom 200%+ (accessibility) | UI Gen | 🟡 Medium | Use relative units (rem), test at 200% zoom |
| 9.8 | Long content overflow in DataTable | UI Gen | 🟡 Medium | Ellipsis + tooltip on hover via portal |
| 9.9 | Empty DataTable state | UI Gen | 🟢 Low | Show EmptyState component with icon + message |
| 9.10 | Loading state for every component | UI Gen | 🟡 Medium | Skeleton loading for all data-dependent components |
| 9.11 | Error state for every component | UI Gen | 🟡 Medium | ErrorBoundary with retry for all feature components |

## 10. OpenAPI Sync Engine

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 10.1 | Invalid Swagger/OpenAPI file | Sync Engine | 🔴 Critical | Catch parse error, show schema validation errors |
| 10.2 | External `$ref` references ($ref: ./other-file.json) | Sync Engine | 🟡 Medium | Resolve all external references before processing |
| 10.3 | Circular `$ref` references (A → B → A) | Sync Engine | 🔴 Critical | Detect cycles, break with fallback type `Record<string, unknown>` |
| 10.4 | `allOf` (intersection types) | Sync Engine | 🟡 Medium | Flatten allOf into single merged interface |
| 10.5 | `oneOf` / `anyOf` (union types) | Sync Engine | 🟡 Medium | Generate discriminated union with `discriminator` property |
| 10.6 | No tags on any endpoint | Sync Engine | 🟡 Medium | Fall back to path tokenization strategy |
| 10.7 | Undocumented endpoints (x-internal: true) | Sync Engine | 🟢 Low | Skip when marked as internal |
| 10.8 | Very large spec (1000+ endpoints) | Sync Engine | 🟡 Medium | Process in batches of 100, show progress bar |
| 10.9 | Swagger 2.0 vs OpenAPI 3.0 | Sync Engine | 🟡 Medium | Auto-detect version, use appropriate parser |
| 10.10 | Security schemes (Bearer, API Key, OAuth2) | Sync Engine | 🟡 Medium | Translate to auth interceptor configuration |
| 10.11 | Parameters in path vs query vs header | Sync Engine | 🟡 Medium | Extract all parameter types, generate proper interface |
| 10.12 | No response schema (204 No Content) | Sync Engine | 🟢 Low | Generate `Promise<void>` return type |

## 11. Anchor Injection

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 11.1 | Anchor marker deleted or modified | Anchor | 🟡 Medium | Show warning, suggest re-running `docify init` |
| 11.2 | Multiple anchor instances in same file | Anchor | 🟢 Low | Inject at first instance only, add counter for subsequent |
| 11.3 | File has been heavily modified structurally | Anchor | 🟡 Medium | Detect structural changes, use fuzzy match fallback |
| 11.4 | No target file exists | Anchor | 🟡 Medium | Create file with anchor marker included and generate initial content |
| 11.5 | Injection creates duplicate entries | Anchor | 🟢 Low | Deduplicate before writing |
| 11.6 | Syntax error after injection | Anchor | 🟡 Medium | Run formatter, check for parse errors, rollback if invalid |
| 11.7 | Injection into deeply nested location | Anchor | 🟢 Low | Use path array to navigate to insertion point |

## 12. Package Manager

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 12.1 | npm not installed | Pkg Mgr | 🔴 Critical | Detect missing, show install instructions |
| 12.2 | npm install fails (network, permissions) | Pkg Mgr | 🔴 Critical | Show error with troubleshooting steps |
| 12.3 | Lockfile conflict (package-lock.json vs yarn.lock) | Pkg Mgr | 🟡 Medium | Use specified package manager only |
| 12.4 | Outdated npm version | Pkg Mgr | 🟢 Low | Warn if npm < 9 |
| 12.5 | pnpm with no pnpm-lock.yaml | Pkg Mgr | 🟢 Low | Generate lockfile on first install |
| 12.6 | Corporate npm registry | Pkg Mgr | 🟡 Medium | Respect `.npmrc` registry configuration |

## 13. Cross-Platform

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 13.1 | Windows CRLF line endings | Cross-Platform | 🟡 Medium | Use `\n` in generated files, let Prettier normalize |
| 13.2 | Windows bat vs bash scripts | Cross-Platform | 🟡 Medium | Generate `.sh` files only, recommend Git Bash |
| 13.3 | Case-insensitive filesystem (Windows/macOS) | Cross-Platform | 🟢 Low | Enforce consistent casing in generated imports |
| 13.4 | File paths with spaces | Cross-Platform | 🟢 Low | Quote paths in shell commands |
| 13.5 | macOS .DS_Store files | Cross-Platform | 🟢 Low | Add to .gitignore by default |

## 14. Mobile / React Native

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 14.1 | Expo CLI not installed | Mobile | 🟡 Medium | Show install instructions, skip mobile gen |
| 14.2 | Platform-specific code (web vs native) | Mobile | 🟡 Medium | Use `.web.tsx` / `.native.tsx` convention |
| 14.3 | Shared types between web and mobile | Mobile | 🟡 Medium | Extract shared types to `src/shared/types/` |
| 14.4 | Navigation library conflict | Mobile | 🟢 Low | Default to Expo Router, offer React Navigation |
| 14.5 | Mobile-only project (no web) | Mobile | 🟢 Low | Skip web-specific deps (react-router-dom, etc.) |

## 15. Performance & Scale

| # | Edge Case | Component | Severity | Handling Strategy |
|---|-----------|-----------|----------|-------------------|
| 15.1 | 20+ features in single project | Scale | 🟡 Medium | Process features in parallel, show batch progress |
| 15.2 | Single feature with 100+ endpoints | Scale | 🟡 Medium | Batch service methods into multiple files |
| 15.3 | 5000+ lines in generated template | Scale | 🟢 Low | Stream write, use highWaterMark |
| 15.4 | Very long generation (>60 seconds) | Scale | 🟡 Medium | Show per-generator timing in verbose mode |
| 15.5 | Low memory environment (<512MB) | Scale | 🟡 Medium | Reduce parallel writes, use sequential fallback |
