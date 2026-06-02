import chalk from "chalk";
import { askProjectName, askDescription, askAuthor } from "./questions/project-info";
import { askTypeScript, askStyling, askPlatforms, askStateManagement } from "./questions/tech-stack";
import { askIncludeAuth, askIncludeRouting, askIncludeTesting, askIncludeDocs, askFeatures, askCustomFeatures } from "./questions/modules";

export interface PromptAnswers {
  project: { name: string; description: string; author: string };
  tech: { typescript: boolean; styling: string; platforms: string[]; state: string };
  modules: { auth: boolean; routing: boolean; testing: boolean; docs: boolean };
  features: string[];
}

// ── Styling helpers ──
const accent = chalk.hex("#818cf8");
const dim = chalk.dim.hex("#475569");
const subtle = chalk.hex("#94a3b8");

function sectionHeader(title: string): void {
  const padding = 34 - title.length;
  const line = dim("─").repeat(Math.max(padding, 2));
  console.log(`\n  ${accent("╭─")} ${accent.bold(title)} ${line}${accent("─╮")}`);
}

function sectionFooter(): void {
  const line = dim("─").repeat(38);
  console.log(`  ${accent("╰─")}${line}${accent("─╯")}`);
}

export async function runPrompts(skip: boolean): Promise<PromptAnswers> {
  if (skip) {
    return {
      project: { name: "my-app", description: "", author: "" },
      tech: { typescript: true, styling: "tailwind", platforms: ["web"], state: "zustand-query" },
      modules: { auth: true, routing: true, testing: true, docs: true },
      features: ["auth", "dashboard", "users"],
    };
  }

  // ── Header ──
  console.log(`\n  ${accent("◆")}  ${chalk.bold("scaffkit")}  ${subtle("— interactive project generator")}`);
  console.log(`  ${dim("─").repeat(42)}`);

  // ── Project section ──
  sectionHeader("Project");
  const name = await askProjectName();
  const description = await askDescription();
  const author = await askAuthor();
  sectionFooter();

  // ── Tech Stack section ──
  sectionHeader("Tech Stack");
  const typescript = await askTypeScript();
  const styling = await askStyling();
  const platforms = await askPlatforms();
  const stateMgmt = await askStateManagement();
  sectionFooter();

  // ── Modules section ──
  sectionHeader("Modules");
  const auth = await askIncludeAuth();
  const routing = await askIncludeRouting();
  const testing = await askIncludeTesting();
  const docs = await askIncludeDocs();
  sectionFooter();

  // ── Features section ──
  sectionHeader("Features");
  const selectedFeatures = await askFeatures();
  const customFeatures = await askCustomFeatures();
  const features = [...new Set([...selectedFeatures, ...customFeatures])];
  sectionFooter();

  console.log();

  return {
    project: { name, description, author },
    tech: { typescript, styling, platforms, state: stateMgmt },
    modules: { auth, routing, testing, docs },
    features,
  };
}
