import chalk from "chalk";

export enum ErrorCode {
  INVALID_CONFIG = "INVALID_CONFIG",
  DIRECTORY_EXISTS = "DIRECTORY_EXISTS",
  GENERATION_FAILED = "GENERATION_FAILED",
  DEPENDENCY_FAILED = "DEPENDENCY_FAILED",
  TEMPLATE_NOT_FOUND = "TEMPLATE_NOT_FOUND",
  FILE_WRITE_FAILED = "FILE_WRITE_FAILED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class ScaffkitError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly hint?: string,
  ) {
    super(message);
    this.name = "ScaffkitError";
  }
}

export function handleError(error: unknown): never {
  const dim = chalk.dim.hex("#475569");
  const subtle = chalk.hex("#94a3b8");

  if (error instanceof ScaffkitError) {
    console.error(`\n  ${chalk.red.bold("✘")}  ${chalk.bold(error.message)}`);
    console.error(`  ${dim("╰─")}  ${subtle(error.code)}`);
    if (error.hint) {
      console.error(`     ${chalk.hex("#f59e0b")("▶")}  ${subtle(error.hint)}`);
    }
    console.error();
    process.exit(1);
  }

  console.error(`\n  ${chalk.red.bold("✘")}  ${chalk.bold("Unexpected error")}`);
  console.error(`  ${dim("╰─")}  ${subtle(String(error))}`);
  console.error();
  process.exit(1);
}
