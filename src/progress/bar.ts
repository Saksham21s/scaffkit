import chalk from "chalk";

const BAR_WIDTH = 24;
const FILL = "━";
const EMPTY = "─";
const accent = chalk.hex("#818cf8");
const dim = chalk.dim.hex("#475569");

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
    const elapsed = dim(`(${this.elapsed}s)`);
    const info = detail ? dim(` — ${detail}`) : "";
    this.clearLine();
    console.log(`  ${prefix}  ${chalk.bold(this.label)}${info} ${elapsed}`);
  }

  fail(error: string): void {
    const prefix = chalk.red.bold("✘");
    this.clearLine();
    console.error(`  ${prefix}  ${chalk.bold(this.label)}${dim(` — ${error}`)}`);
  }

  private draw(): void {
    const pct = this.total > 0 ? this.current / this.total : 0;
    const filled = Math.round(pct * BAR_WIDTH);
    const empty = BAR_WIDTH - filled;
    const bar =
      chalk.hex("#818cf8")(FILL.repeat(filled)) +
      dim(EMPTY.repeat(empty));
    const pctStr = chalk.hex("#94a3b8")(`${(pct * 100).toFixed(0)}%`);
    const idx = dim(`[${this.current}/${this.total}]`);
    const spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    const spin = spinners[this.current % spinners.length];
    process.stdout.write(`  ${accent(spin)}  ${bar}  ${pctStr}  ${idx}`);
  }

  private clearLine(): void {
    const cols = process.stdout.columns || 80;
    process.stdout.write("\r" + " ".repeat(cols) + "\r");
  }
}
