import { z } from "zod";

/**
 * Zod schema for DocifyConfig.
 * Validates all user inputs and prompt answers.
 */
export const DocifyConfigSchema = z.object({
  project: z.object({
    name: z
      .string()
      .min(1, "Project name is required")
      .max(50, "Project name must be ≤ 50 characters")
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
    description: z.string().max(200).default(""),
    author: z.string().max(100).default(""),
    version: z.string().default("1.0.0"),
  }),
  tech: z.object({
    typescript: z.literal(true),
    styling: z.literal("tailwind-custom"),
    platforms: z.array(z.enum(["web", "mobile"])).default(["web"]),
    state: z.literal("zustand-query"),
    packageManager: z.enum(["npm", "yarn", "pnpm"]).default("npm"),
    apiClient: z.literal("axios"),
  }),
  structure: z.object({
    type: z.enum(["feature", "flat"]).default("feature"),
    features: z
      .array(z.string().regex(/^[a-z][a-z0-9-]*$/))
      .default(["auth", "dashboard", "users"]),
  }),
  modules: z.object({
    auth: z.boolean().default(true),
    routing: z.boolean().default(true),
    testing: z.boolean().default(true),
    docs: z.boolean().default(true),
  }),
  generated: z.object({
    date: z.string(),
    scaffkitVersion: z.string(),
  }),
});

export type DocifyConfig = z.infer<typeof DocifyConfigSchema>;

export interface CLIOptions {
  yes?: boolean;
  output?: string;
  verbose?: boolean;
}
