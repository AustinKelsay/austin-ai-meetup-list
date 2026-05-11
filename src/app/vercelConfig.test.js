import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../..");

function readVercelConfig() {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, "vercel.json"), "utf8"));
}

describe("Vercel SPA rewrites", () => {
  it("serves wiki routes through the React app on direct visits", () => {
    const config = readVercelConfig();

    expect(config.rewrites).toEqual(
      expect.arrayContaining([
        { source: "/wiki", destination: "/index.html" },
        { source: "/wiki/:id", destination: "/index.html" },
      ]),
    );
  });
});
