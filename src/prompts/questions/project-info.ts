import { input } from "@inquirer/prompts";

export async function askProjectName(): Promise<string> {
  return input({
    message: "Project name:",
    required: true,
    validate: (value: string) => {
      if (!value.trim()) return "Project name is required";
      if (!/^[a-z0-9-]+$/.test(value)) return "Use lowercase letters, numbers, and hyphens";
      return true;
    },
  });
}

export async function askDescription(): Promise<string> {
  return input({
    message: "Short description (optional):",
  });
}

export async function askAuthor(): Promise<string> {
  return input({
    message: "Author (optional):",
  });
}
