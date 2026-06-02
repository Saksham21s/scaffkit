import path from "path";
import fs from "fs-extra";
import { execSync, type ExecSyncOptions } from "child_process";
import { ScaffkitError, ErrorCode } from "../errors";
import { ProgressBar } from "../progress/bar";

const TEST_DIR = path.resolve(process.cwd(), "scaffkit-test");

function opts(timeout: number): ExecSyncOptions {
  return {
    stdio: "pipe",
    timeout,
    shell: process.platform === "win32"
      ? process.env.COMSPEC || "cmd.exe"
      : "/bin/bash",
    env: { ...process.env, NODE_ENV: "test" },
  };
}

export async function testCommand(): Promise<void> {
  console.log("\n  Running scaffkit self-test\n");

  fs.removeSync(TEST_DIR);

  const steps = [
    { name: "Scaffolding project", fn: () => runInit() },
    { name: "Verifying project structure", fn: () => verifyStructure() },
    { name: "Checking TypeScript compilation", fn: () => checkTypes() },
    { name: "Running production build", fn: () => runBuild() },
  ];

  for (const step of steps) {
    const bar = new ProgressBar(1, step.name);
    try {
      await step.fn();
      bar.tick();
      bar.complete();
    } catch (err) {
      bar.fail((err as Error).message);
      throw new ScaffkitError(
        "Self-test failed",
        ErrorCode.UNKNOWN_ERROR,
        "Check logs above for details",
      );
    }
  }

  fs.removeSync(TEST_DIR);
  console.log("\n  ✅ Self-test passed!\n");
}

function runInit(): void {
  const entry = path.resolve(process.cwd(), "src/index.ts");
  const runner = fs.existsSync(entry)
    ? `npx tsx "${entry}"`
    : `node "${path.resolve(process.cwd(), "dist/index.js")}"`;

  execSync(`${runner} init --yes --output "${TEST_DIR}"`, opts(60_000));
}

function verifyStructure(): void {
  const required = [
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "index.html",
    "src/main.tsx",
    "src/App.tsx",
    "src/styles/tokens.css",
    "src/styles/base.css",
    "src/styles/index.css",
    "src/components/ui/Button.tsx",
    "src/components/ui/Input.tsx",
    "src/components/layout/AppLayout.tsx",
    "src/lib/api/client.ts",
    "src/lib/api/routes.ts",
    "src/lib/api/index.ts",
    "src/lib/cn.ts",
    "src/lib/store.ts",
    "src/lib/queryClient.ts",
    "src/components/Providers.tsx",
    ".env.example",
  ];

  const missing = required.filter(
    (f) => !fs.existsSync(path.join(TEST_DIR, f)),
  );
  if (missing.length > 0) {
    throw new Error(`Missing required files:\n  - ${missing.join("\n  - ")}`);
  }
}

function checkTypes(): void {
  execSync("npx tsc --noEmit", { cwd: TEST_DIR, ...opts(60_000) });
}

function runBuild(): void {
  execSync("npm install", { cwd: TEST_DIR, ...opts(120_000) });
  execSync("npm run build", { cwd: TEST_DIR, ...opts(120_000) });
}
