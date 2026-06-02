#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init";
import { testCommand } from "./commands/test";
import { handleError } from "./errors";

// ── Color palette ──
const c = {
  i1: chalk.hex("#a78bfa"),  // lightest indigo
  i2: chalk.hex("#818cf8"),  // light indigo
  i3: chalk.hex("#6366f1"),  // indigo
  i4: chalk.hex("#4f46e5"),  // deep indigo
  i5: chalk.hex("#4338ca"),  // deeper indigo
  i6: chalk.hex("#3730a3"),  // darkest indigo
  d:  chalk.dim.hex("#475569"),
  s:  chalk.hex("#94a3b8"),  // subtle slate
  b:  chalk.bold,
};

const LINE = chalk.dim("─").repeat(46);

// ── Large gradient banner ──
const BANNER = `
  ${c.i1("╭─")}${c.i1(LINE)}${c.i1("─╮")}
  ${c.i1("│")}  ${c.i2("███████╗ ██████╗ █████╗ ███████╗███████╗██╗  ██╗██╗████████╗")}  ${c.i1("│")}
  ${c.i1("│")}  ${c.i3("██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝██║ ██╔╝██║╚══██╔══╝")}  ${c.i1("│")}
  ${c.i1("│")}  ${c.i4("███████╗██║     ███████║█████╗  █████╗  █████╔╝ ██║   ██║   ")}  ${c.i1("│")}
  ${c.i1("│")}  ${c.i5("╚════██║██║     ██╔══██║██╔══╝  ██╔══╝  ██╔═██╗ ██║   ██║   ")}  ${c.i1("│")}
  ${c.i1("│")}  ${c.i6("███████║╚██████╗██║  ██║██║     ██║     ██║  ██╗██║   ██║   ")}  ${c.i1("│")}
  ${c.i1("│")}  ${c.i6("╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝  ╚═╝╚═╝   ╚═╝   ")}  ${c.i1("│")}
  ${c.i1("╰─")}${c.i1(LINE)}${c.i1("─╯")}
  ${c.s("  ✦  react project generator  ")}${c.d("v0.1.1")}
`;

// ── Minimal banner for subcommands ──
const SHORT_BANNER = `
  ${c.i2("◆")}  ${c.b("scaffkit")} ${c.d("v0.1.1")} ${c.d("·")} ${c.s("react project generator")}
`;

const program = new Command();

program
  .name("scaffkit")
  .description("Production-grade React project scaffolding from a single CLI command")
  .version("0.1.1")

program
  .command("init")
  .description("Create a new React project with interactive prompts")
  .option("-y, --yes", "Skip all prompts and use defaults")
  .option("-o, --output <dir>", "Output directory (defaults to project name)")
  .option("-v, --verbose", "Show detailed output")
  .action(async (options) => {
    try {
      await initCommand(options);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("add")
  .description("Add a feature module to an existing project")
  .argument("<name>", "Feature name (e.g., 'analytics', 'billing')")
  .option("-f, --force", "Overwrite existing files")
  .action(() => {
    console.log(`\n  ${chalk.yellow("⏳")} ${c.s("Coming soon — add feature in next release")}\n`);
  });

program
  .command("sync")
  .description("Generate features and types from an OpenAPI/Swagger spec")
  .argument("<spec>", "Path or URL to OpenAPI/Swagger spec")
  .option("-d, --dry-run", "Preview changes without writing files")
  .action(() => {
    console.log(`\n  ${chalk.yellow("⏳")} ${c.s("Coming soon — OpenAPI sync in next release")}\n`);
  });

program
  .command("test")
  .description("Run end-to-end self-test to verify the CLI works")
  .action(async () => {
    try {
      await testCommand();
    } catch (error) {
      handleError(error);
    }
  });

// Show banner for any command
const args = process.argv.slice(2);
if (args.length > 0 && !args.includes("--help") && !args.includes("-h")) {
  if (args[0] === "init") {
    console.log(BANNER);
  } else {
    console.log(SHORT_BANNER);
  }
}

program.parse(process.argv);
