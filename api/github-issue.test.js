import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "..");

describe("GitHub issue API handler", () => {
  it("can be imported by plain Node outside Vite", () => {
    expect(() => {
      execFileSync(
        process.execPath,
        ["-e", "import('./api/github-issue.js')"],
        {
          cwd: repoRoot,
          env: {
            ...process.env,
            GITHUB_ISSUES_TOKEN: "",
          },
          stdio: "pipe",
        },
      );
    }).not.toThrow();
  });
});
