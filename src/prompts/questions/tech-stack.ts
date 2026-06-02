import { select, checkbox, confirm } from "@inquirer/prompts";

export async function askTypeScript(): Promise<boolean> {
  return confirm({
    message: "Use TypeScript?",
    default: true,
  });
}

export async function askStyling(): Promise<string> {
  return select({
    message: "Styling system:",
    choices: [
      { name: "Tailwind CSS", value: "tailwind" },
      { name: "Custom CSS with design tokens", value: "custom-css" },
      { name: "CSS Modules", value: "css-modules" },
    ],
    default: "tailwind",
  });
}

export async function askPlatforms(): Promise<string[]> {
  return checkbox({
    message: "Target platforms:",
    instructions: false,
    choices: [
      { name: "Web", value: "web", checked: true },
      { name: "Mobile (React Native)", value: "mobile" },
    ],
    required: true,
  });
}

export async function askStateManagement(): Promise<string> {
  return select({
    message: "State management:",
    choices: [
      { name: "Zustand + TanStack Query", value: "zustand-query" },
      { name: "Redux Toolkit", value: "redux" },
      { name: "React Context only", value: "context-only" },
    ],
    default: "zustand-query",
  });
}
