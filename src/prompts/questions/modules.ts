import { confirm, checkbox, input } from "@inquirer/prompts";

export async function askIncludeAuth(): Promise<boolean> {
  return confirm({
    message: "Include authentication?",
    default: true,
  });
}

export async function askIncludeRouting(): Promise<boolean> {
  return confirm({
    message: "Include routing (React Router)?",
    default: true,
  });
}

export async function askIncludeTesting(): Promise<boolean> {
  return confirm({
    message: "Include testing (Vitest + Testing Library)?",
    default: true,
  });
}

export async function askIncludeDocs(): Promise<boolean> {
  return confirm({
    message: "Include auto-generated docs?",
    default: true,
  });
}

export async function askFeatures(): Promise<string[]> {
  return checkbox({
    message: "Select features:",
    instructions: false,
    choices: [
      { name: "Authentication (login, register, sessions)", value: "auth", checked: true },
      { name: "Dashboard", value: "dashboard", checked: true },
      { name: "Settings", value: "settings" },
      { name: "Notifications", value: "notifications" },
    ],
    required: true,
  });
}

export async function askCustomFeatures(): Promise<string[]> {
  const features = await input({
    message: "Custom features (comma-separated, optional):",
  });
  if (!features.trim()) return [];
  return features.split(",").map((f) => f.trim().toLowerCase()).filter(Boolean);
}
