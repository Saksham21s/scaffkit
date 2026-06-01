#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init";
import { testCommand } from "./commands/test";
import { handleError } from "./errors";

const program = new Command();

program
  .name("scaffkit")
  .description("Generate production-grade React projects from a single command")
  .version("0.1.0");

program
  .command("init")
  .description("Create a new React project")
  .option("-y, --yes", "Skip prompts, use defaults")
  .option("-o, --output <dir>", "Output directory")
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
  .description("Add a feature to an existing project")
  .argument("<name>", "Feature name")
  .option("-f, --force", "Overwrite existing files")
  .action(() => {
    console.log(chalk.yellow("Coming soon — add feature in next release"));
  });

program
  .command("sync")
  .description("Sync OpenAPI spec to generate features and types")
  .argument("<spec>", "Path or URL to OpenAPI/Swagger spec")
  .option("-d, --dry-run", "Preview changes without writing")
  .action(() => {
    console.log(chalk.yellow("Coming soon — OpenAPI sync in next release"));
  });

program
  .command("test")
  .description("Run end-to-end self-test to verify CLI works")
  .action(async () => {
    try {
      await testCommand();
    } catch (error) {
      handleError(error);
    }
  });

program.parse(process.argv);
