import chalk from "chalk";

const BAR_WIDTH = 28;
const FILL = "█";
const EMPTY = "░";

export class ProgressBar {
  private startTime = Date.now();
  private current = 0;

  constructor(
    private readonly total: number,
    private readonly label: string,
  ) {}

  get elapsed(): string {
    return ((Date.now() - this.startTime) / 1000).toFixed(1);
  }

  tick(): void {
    this.current++;
    this.draw();
  }

  set(value: number): void {
    this.current = Math.min(value, this.total);
    this.draw();
  }

  complete(detail?: string): void {
    this.current = this.total;
    const prefix = chalk.green("✔");
    const label = chalk.bold(this.label);
    const info = `${prefix} ${label}${detail ? chalk.dim(` — ${detail}`) : ""} ${chalk.dim(`(${this.elapsed}s)`)}`;
    this.clearLine();
    console.log(info);
  }

  fail(error: string): void {
    const prefix = chalk.red("✘");
    const label = chalk.bold(this.label);
    this.clearLine();
    console.error(`${prefix} ${label}${chalk.dim(` — ${error}`)}`);
  }

  private draw(): void {
    const pct = this.total > 0 ? this.current / this.total : 0;
    const filled = Math.round(pct * BAR_WIDTH);
    const empty = BAR_WIDTH - filled;
    const bar = chalk.cyan(FILL.repeat(filled)) + chalk.dim(EMPTY.repeat(empty));
    const pctStr = chalk.dim(`${(pct * 100).toFixed(0)}%`);
    const idx = chalk.dim(`[${this.current}/${this.total}]`);
    process.stdout.write(`\r  ${bar}  ${pctStr}  ${idx}`);
  }

  private clearLine(): void {
    const cols = process.stdout.columns || 80;
    process.stdout.write("\r" + " ".repeat(cols) + "\r");
  }
}
