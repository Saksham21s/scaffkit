import fs from "fs-extra";
import path from "path";
import { DocifyError, ErrorCode } from "../errors";

export interface FileToWrite {
  path: string;
  content: string;
}

/**
 * Atomic file writer with temp directory staging.
 * 1. Writes all files to temp dir in parallel
 * 2. Moves them to target atomically
 * 3. On failure: rollback (deletes temp dir)
 */
export class FileWriter {
  async write(targetDir: string, files: FileToWrite[]): Promise<void> {
    if (files.length === 0) return;

    const tempDir = path.join(targetDir, ".docify-temp");

    try {
      await Promise.all(
        files.map(async (file) => {
          const fullPath = path.join(tempDir, file.path);
          await fs.ensureDir(path.dirname(fullPath));
          await fs.writeFile(fullPath, file.content, "utf-8");
        }),
      );

      for (const file of files) {
        const src = path.join(tempDir, file.path);
        const dest = path.join(targetDir, file.path);
        await fs.ensureDir(path.dirname(dest));
        await fs.move(src, dest, { overwrite: true });
      }
    } catch (error) {
      await fs.remove(tempDir).catch(() => {});
      throw new DocifyError(
        `Failed to write files: ${(error as Error).message}`,
        ErrorCode.FILE_WRITE_FAILED,
        "Check disk space and permissions",
      );
    } finally {
      await fs.remove(tempDir).catch(() => {});
    }
  }

  /** Merge new JSON content into an existing JSON file */
  async mergeJson(
    targetDir: string,
    filePath: string,
    additions: Record<string, unknown>,
  ): Promise<void> {
    const fullPath = path.join(targetDir, filePath);
    const existing = JSON.parse(await fs.readFile(fullPath, "utf-8"));
    const merged = deepMerge(existing, additions);
    await fs.writeFile(fullPath, JSON.stringify(merged, null, 2), "utf-8");
  }
}

/** Deep merge two objects. Arrays are replaced (not concatenated). */
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value === null || value === undefined) {
      continue;
    }

    const targetValue = result[key];

    if (Array.isArray(value)) {
      // Replace arrays (don't concat — avoids duplicate deps)
      result[key] = [...value];
    } else if (isPlainObject(value) && isPlainObject(targetValue)) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      result[key] = value;
    }
  }

  return result;
}

function isPlainObject(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}
