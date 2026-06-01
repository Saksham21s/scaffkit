/**
 * Name conversion utilities.
 * Used across all generators for file naming, component names, etc.
 */

export function toPascalCase(name: string): string {
  if (!name) return "";
  return name
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function toCamelCase(name: string): string {
  if (!name) return "";
  const pascal = toPascalCase(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toKebabCase(name: string): string {
  if (!name) return "";
  return name
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "")
    .replace(/[-_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function toSnakeCase(name: string): string {
  return toKebabCase(name).replace(/-/g, "_");
}

export function toTitleCase(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const RESERVED_WORDS = new Set([
  "class", "const", "let", "var", "function", "return", "import",
  "export", "default", "if", "else", "for", "while", "do", "switch",
  "case", "break", "continue", "try", "catch", "finally", "throw",
  "new", "delete", "typeof", "instanceof", "void", "this", "super",
  "yield", "await", "async", "from", "of", "in", "true", "false",
]);

export function safeIdentifier(name: string): string {
  if (RESERVED_WORDS.has(name)) return `_${name}`;
  if (/^[0-9]/.test(name)) return `_${name}`;
  return name;
}

export function isValidFeatureName(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(name);
}
