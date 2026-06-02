import ora, { type Ora } from "ora";
import chalk from "chalk";

const STEP_ICONS = [
  "📦", "🎨", "🔗", "⚙️", "🔐", "📝", "🧪", "📖", "🔌", "🗂️", "✨",
];

const STEP_COLORS = [
  "cyan", "magenta", "blue", "yellow", "red", "green", "cyan", "magenta", "blue", "yellow", "green",
] as const;

export class ProgressEngine {
  private spinner: Ora | null = null;
  private stepIndex = 0;
  private startTime = Date.now();

  constructor(
    private totalSteps: number,
    private currentStep: number,
    private label: string,
  ) {}

  get elapsed(): string {
    return ((Date.now() - this.startTime) / 1000).toFixed(1);
  }

  start(): void {
    const icon = STEP_ICONS[this.stepIndex % STEP_ICONS.length] || "⚡";
    const colorName = STEP_COLORS[this.stepIndex % STEP_COLORS.length] || "cyan";
    this.stepIndex++;

    const stepTag = chalk.dim(`[${this.currentStep}/${this.totalSteps}]`);
    const iconStr = chalk.hex(this.getColorHex(colorName))(icon);

    this.spinner = ora({
      text: `${iconStr}  ${chalk.bold(this.label)}  ${stepTag}`,
      color: colorName as Ora["color"],
      spinner: {
        interval: 80,
        frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      },
    }).start();
  }

  succeed(detail?: string): void {
    if (this.spinner) {
      const check = chalk.green.bold("✔");
      const elapsed = chalk.dim(`(${this.elapsed}s)`);
      const info = detail ? chalk.dim(` — ${detail}`) : "";
      this.spinner.succeed(`${check}  ${chalk.bold(this.label)}${info} ${elapsed}`);
    }
  }

  fail(error: string): void {
    if (this.spinner) {
      const cross = chalk.red.bold("✘");
      this.spinner.fail(`${cross}  ${chalk.bold(this.label)}${chalk.dim(` — ${error}`)}`);
    }
  }

  private getColorHex(color: string): string {
    const map: Record<string, string> = {
      cyan: "#06b6d4",
      magenta: "#d946ef",
      blue: "#3b82f6",
      yellow: "#eab308",
      red: "#ef4444",
      green: "#22c55e",
    };
    return map[color] || "#06b6d4";
  }
}

export function printSummary(name: string, elapsed: string, dirCount: number, fileCount: number): void {
  const accent = chalk.hex("#818cf8");
  const dim = chalk.dim.hex("#475569");
  const subtle = chalk.hex("#94a3b8");

  console.log();
  console.log(`  ${dim("╭─")}${dim("─".repeat(38))}${dim("─╮")}`);
  console.log(`  ${dim("│")}  ${accent("✦")}  ${chalk.bold(`Project ${chalk.hex("#a78bfa")(`"${name}"`)} created`)}  ${dim("│")}`);
  console.log(`  ${dim("│")}  ${dim("─".repeat(36))}  ${dim("│")}`);
  console.log(`  ${dim("│")}  ${subtle("  Directories:")}  ${chalk.bold(String(dirCount).padStart(4))}              ${dim("│")}`);
  console.log(`  ${dim("│")}  ${subtle("  Files:")}        ${chalk.bold(String(fileCount).padStart(4))}              ${dim("│")}`);
  console.log(`  ${dim("│")}  ${subtle("  Duration:")}     ${chalk.bold(`${elapsed}s`.padStart(4))}              ${dim("│")}`);
  console.log(`  ${dim("│")}  ${dim("─".repeat(36))}  ${dim("│")}`);
  console.log(`  ${dim("│")}  ${accent.bold("  cd ")}${chalk.bold(name)}  ${accent("→")}  ${accent.bold("npm run dev")}  ${dim("│")}`);
  console.log(`  ${dim("╰─")}${dim("─".repeat(38))}${dim("─╯")}`);
  console.log();
}
