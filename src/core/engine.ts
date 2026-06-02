import path from "path";
import fs from "fs-extra";
import { exec } from "child_process";
import { promisify } from "util";
import { ProgressEngine, printSummary } from "./progress";
import type { PromptAnswers } from "../prompts";
import { ScaffkitError, ErrorCode } from "../errors";

const execAsync = promisify(exec);

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface Generator {
  name: string;
  priority: number;
  generate(answers: PromptAnswers): Promise<GeneratedFile[]>;
}

export class GeneratorEngine {
  private generators: Generator[] = [];
  private stepIndex = 0;

  constructor(private answers: PromptAnswers) {}

  register(generator: Generator): void {
    this.generators.push(generator);
    this.generators.sort((a, b) => a.priority - b.priority);
  }

  async generate(targetDir: string): Promise<void> {
    const totalSteps = this.generators.length + 2; // dirs + generators + install
    const startTime = Date.now();
    let totalDirs = 0;
    let totalFiles = 0;

    // 1 — Create directory structure
    this.stepIndex++;
    const dirProgress = new ProgressEngine(totalSteps, this.stepIndex, "Creating project structure");
    dirProgress.start();
    const dirs = this.buildDirectories();
    for (const dir of dirs) {
      await fs.ensureDir(path.join(targetDir, dir));
    }
    totalDirs = dirs.length;
    dirProgress.succeed(`${totalDirs} directories`);

    // 2+ — Run all generators in priority order
    for (const gen of this.generators) {
      this.stepIndex++;
      const genProgress = new ProgressEngine(totalSteps, this.stepIndex, gen.name);
      genProgress.start();
      try {
        const files = await gen.generate(this.answers);
        for (const file of files) {
          const fullPath = path.join(targetDir, file.path);
          await fs.ensureDir(path.dirname(fullPath));
          await fs.writeFile(fullPath, file.content, "utf-8");
        }
        totalFiles += files.length;
        genProgress.succeed(`${files.length} files`);
      } catch (err) {
        genProgress.fail((err as Error).message);
        throw new ScaffkitError(
          `Generator "${gen.name}" failed`,
          ErrorCode.GENERATION_FAILED,
          (err as Error).message,
        );
      }
    }

    // Last — Install dependencies (async so spinner keeps animating)
    this.stepIndex++;
    const installProgress = new ProgressEngine(totalSteps, this.stepIndex, "Installing dependencies");
    installProgress.start();
    try {
      await execAsync("npm install", {
        cwd: targetDir,
        timeout: 120_000,
      });
      installProgress.succeed();
    } catch {
      installProgress.fail("Run 'npm install' manually");
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    printSummary(this.answers.project.name, elapsed, totalDirs, totalFiles);
  }

  private buildDirectories(): string[] {
    const { features } = this.answers;
    const dirs = [
      // ── App structure (flat, no unnecessary nesting) ──
      "src/components/ui",
      "src/components/layout",
      "src/lib/api",
      "src/lib/routes",
      "src/styles",
      "public",
      // ── Feature modules ──
      ...features.flatMap((f) => [
        `src/features/${f}/components`,
        `src/features/${f}/hooks`,
        `src/features/${f}/pages`,
        `src/features/${f}/services`,
        `src/features/${f}/types`,
      ]),
    ];
    return [...new Set(dirs)];
  }
}
