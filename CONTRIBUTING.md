# Contributing to scaffkit

## Development Setup

```bash
git clone https://github.com/Saksham21s/scaffkit.git
cd scaffkit
npm install
```

## Quick Start

Just one command:

```bash
npm start init
```

Or skip the prompts:

```bash
npm start -- --yes --output ./my-app
```

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Run the CLI directly (no build needed) |
| `npm start init` | Start interactive project gen |
| `npm test` | Run test suite |
| `npm run typecheck` | TypeScript check (zero errors) |
| `npm run dev` | Watch mode — auto-restart on changes |
| `npm run build` | Build CLI to dist/ using tsup |
| `npm run preview` | Build + run from dist/ |

## Pull Request Process

1. Create a feature branch from main
2. Make changes with clean TypeScript
3. Run `npm run typecheck` — must pass
4. Run `npm test` — must pass
5. Submit PR with description of changes

## Coding Standards

- TypeScript strict mode — no `any` type
- Named function exports preferred
- Files under 200 lines — split if larger
- Conventional commits: `feat:` `fix:` `docs:` `refactor:` `test:` `chore:`
- Tests required for new generators

## Project Structure

```
scaffkit/
├── src/
│   ├── index.ts              # CLI entry (Commander)
│   ├── commands/             # CLI command implementations
│   │   ├── init.ts           # Interactive project generation
│   │   └── test.ts           # Self-test
│   ├── core/                 # Engine pipeline
│   │   ├── engine.ts         # GeneratorEngine
│   │   ├── config.ts         # ConfigBuilder
│   │   ├── progress.ts       # ProgressEngine
│   │   └── file-writer.ts    # FileWriter
│   ├── generators/           # Pipeline generators
│   ├── prompts/              # Interactive questions
│   │   ├── index.ts          # Prompt orchestrator
│   │   └── questions/        # Individual prompt modules
│   ├── templates/            # EJS templates
│   ├── errors/               # Error handling
│   └── utils/                # Shared utilities
├── package.json
├── tsconfig.json
└── vitest.config.ts
```
