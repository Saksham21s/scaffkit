import ora, { type Ora } from "ora";
import chalk from "chalk";

const STEP_ICONS = ["🔍", "📦", "⚙️", "🎨", "🔗", "📝", "🔐", "🧪", "📖"];

export class ProgressEngine {
  private spinners = new Map<string, Ora>();
  private stepIndex = 0;
  private startTime = Date.now();

  constructor(private totalSteps: number) {}

  private stepLabel(): string {
    return this.totalSteps > 0 ? ` [${this.stepIndex}/${this.totalSteps}]` : "";
  }

  start(name: string): void {
    const icon = STEP_ICONS[this.stepIndex] || "⚡";
    this.stepIndex++;
    const spinner = ora({
      text: `${icon}  ${name}${this.stepLabel()}`,
      color: "cyan",
      spinner: "dots12",
    }).start();
    this.spinners.set(name, spinner);
  }

  succeed(name: string, detail?: string): void {
    const spinner = this.spinners.get(name);
    if (spinner) {
      spinner.succeed(
        `${chalk.green("✔")} ${name}${detail ? chalk.dim(` — ${detail}`) : ""}`,
      );
    }
  }

  fail(name: string, error: string): void {
    const spinner = this.spinners.get(name);
    if (spinner) {
      spinner.fail(`${chalk.red("✘")} ${name}${chalk.dim(` — ${error}`)}`);
    }
  }

  summary(projectName: string): string {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    return [
      ``,
      chalk.bold(`✨  Project "${projectName}" created!`),
      chalk.dim(`📂  cd ${projectName}`),
      chalk.dim(`🚀  npm run dev`),
      chalk.dim(`⏱️  ${elapsed}s`),
      ``,
    ].join("\n");
  }
}
