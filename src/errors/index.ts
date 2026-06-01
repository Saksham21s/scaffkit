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
  if (error instanceof ScaffkitError) {
    console.error(`\n${chalk.red("✗")} ${error.message}`);
    if (error.hint) {
      console.error(`  ${chalk.dim("💡")} ${error.hint}`);
    }
    process.exit(1);
  }

  console.error(chalk.red("\n✗ Unexpected error:"));
  console.error(chalk.dim(error));
  process.exit(1);
}
