# Contributing to scaffkit

## Development Setup

```bash
git clone <repo-url>
cd scaffkit
npm install
```

## Workflow

```bash
npm run dev -- init --yes --output ./test-project
npm run typecheck
npm run build
npm test
npx scaffkit test
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make changes — write clean TypeScript, add tests
3. Run `npm run typecheck` — zero errors required
4. Run `npm test` — all tests must pass
5. Run `npx scaffkit test` — end-to-end test must pass
6. Submit PR with description

## Coding Standards

- TypeScript strict mode — no `any` type
- Named function exports preferred over default exports
- Files under 200 lines — split if larger
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

## Project Structure

```
scaffkit/
├── src/
│   ├── index.ts              # CLI entry
│   ├── commands/
│   │   ├── init.ts           # Project generation
│   │   └── test.ts           # Self-test
│   ├── config/
│   │   ├── schema.ts         # Zod validation
│   │   └── builder.ts        # Config builder
│   ├── generators/
│   │   └── api-client.ts     # Axios template builder
│   ├── templates/styles/
│   │   ├── tokens.css.ts     # Design tokens
│   │   └── base.css.ts       # Base styles
│   ├── progress/bar.ts       # Progress bar
│   ├── writer/file-writer.ts # Atomic file writer
│   ├── errors/index.ts       # Error handling
│   └── utils/names.ts        # Name utilities
├── package.json
├── tsconfig.json
└── vitest.config.ts
```
