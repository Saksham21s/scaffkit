import path from "path";
import fs from "fs-extra";
import { readFileSync } from "fs";
import chalk from "chalk";
import { ScaffkitError, ErrorCode } from "../errors";
import { GeneratorEngine } from "../core/engine";
import { CoreGenerator } from "../generators/core-scaffold";
import { APIGenerator } from "../generators/api-client";
import { StateGenerator } from "../generators/state-generator";
import { UIGenerator } from "../generators/ui-generator";
import { RouteGenerator } from "../generators/route-generator";
import { FeatureGenerator } from "../generators/feature-generator";
import { runPrompts } from "../prompts";
import type { CLIOptions } from "../config/schema";

// ── Styling ──
const accent = chalk.hex("#818cf8");
const dim = chalk.dim.hex("#475569");
const subtle = chalk.hex("#94a3b8");

const VERSION = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf-8"),
).version as string;

function badge(value: boolean): string {
  const text = value ? "yes" : "no";
  return value ? chalk.green.bold(text) : chalk.yellow.bold(text);
}

function padRight(s: string, len: number): string {
  const plain = s.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
  return s + " ".repeat(Math.max(0, len - plain.length));
}

function displayPath(p: string): string {
  const home = process.env.HOME || process.env.USERPROFILE || "~";
  return p.replace(home, "~").replace(/\\/g, "/");
}

export async function initCommand(options: CLIOptions): Promise<void> {
  // Run interactive prompts (or skip with --yes)
  const answers = await runPrompts(!!options.yes);

  // Determine output directory: --output flag > project name > "my-app"
  const projectDir = answers.project.name || "my-app";
  const targetDir = options.output
    ? path.resolve(options.output)
    : path.resolve(process.cwd(), projectDir);

  // Validate target directory
  if (fs.existsSync(targetDir)) {
    const contents = fs.readdirSync(targetDir);
    if (contents.length > 0) {
      throw new ScaffkitError(
        `Directory "${path.basename(targetDir)}" already exists and is not empty`,
        ErrorCode.DIRECTORY_EXISTS,
        "Use a different project name, remove the directory, or use --output to set a different path",
      );
    }
  }

  // ── Beautiful configuration summary ──
  const w = 18;
  const cw = 22;
  console.log();
  console.log(`  ${dim("╭─")}${dim("─".repeat(40))}${dim("─╮")}`);
  console.log(`  ${dim("│")}  ${accent("✦")}  ${chalk.bold("Configuration")}  ${subtle(`v${VERSION}`)}  ${dim("│")}`);
  console.log(`  ${dim("│")}  ${dim("─".repeat(38))}  ${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("Project"), w)} ${padRight(chalk.bold(answers.project.name), cw)}${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("Directory"), w)} ${padRight(chalk.cyan(displayPath(targetDir)), cw)}${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("TypeScript"), w)} ${padRight(badge(answers.tech.typescript), cw)}${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("Styling"), w)} ${padRight(answers.tech.styling, cw)}${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("State Mgmt"), w)} ${padRight(answers.tech.state, cw)}${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("Auth"), w)} ${padRight(badge(answers.modules.auth), cw)}${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("Routing"), w)} ${padRight(badge(answers.modules.routing), cw)}${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("Testing"), w)} ${padRight(badge(answers.modules.testing), cw)}${dim("│")}`);
  console.log(`  ${dim("│")}  ${padRight(chalk.dim("Features"), w)} ${padRight(subtle(answers.features.join(", ") || "none"), cw)}${dim("│")}`);
  console.log(`  ${dim("╰─")}${dim("─".repeat(40))}${dim("─╯")}`);
  console.log();

  // Initialize generator engine and register all generators
  const engine = new GeneratorEngine(answers);
  engine.register(new CoreGenerator());
  engine.register(new APIGenerator());
  engine.register(new StateGenerator());
  engine.register(new UIGenerator());

  if (answers.modules.routing) {
    engine.register(new RouteGenerator());
  }

  engine.register(new FeatureGenerator());

  // Generate the project
  await engine.generate(targetDir);
}
