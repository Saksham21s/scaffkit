import type { DocifyConfig, CLIOptions } from "./schema";
import { DocifyConfigSchema } from "./schema";

const DOCIFY_VERSION = "0.1.0";

export class ConfigBuilder {
  getDefaults(): DocifyConfig {
    return {
      project: {
        name: "my-app",
        description: "",
        author: "",
        version: "1.0.0",
      },
      tech: {
        typescript: true,
        styling: "tailwind-custom",
        platforms: ["web"],
        state: "zustand-query",
        packageManager: "npm",
        apiClient: "axios",
      },
      structure: {
        type: "feature",
        features: ["auth", "dashboard", "users"],
      },
      modules: {
        auth: true,
        routing: true,
        testing: true,
        docs: true,
      },
      generated: {
        date: new Date().toISOString(),
        docifyVersion: DOCIFY_VERSION,
      },
    };
  }

  buildFromAnswers(
    answers: Partial<DocifyConfig>,
    options: CLIOptions,
  ): DocifyConfig {
    const defaults = this.getDefaults();

    const merged: DocifyConfig = {
      project: { ...defaults.project, ...answers.project },
      tech: { ...defaults.tech, ...answers.tech },
      structure: { ...defaults.structure, ...answers.structure },
      modules: { ...defaults.modules, ...answers.modules },
      generated: {
        date: new Date().toISOString(),
        docifyVersion: DOCIFY_VERSION,
      },
    };

    if (options.output) {
      const dirName = options.output.split(/[/\\]/).pop();
      if (dirName) {
        merged.project.name = dirName;
      }
    }

    return DocifyConfigSchema.parse(merged);
  }
}
