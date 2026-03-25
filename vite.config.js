import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function githubIssueDevApiPlugin() {
  return {
    name: "github-issue-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/github-issue", async (request, response, next) => {
        if (request.method !== "POST") {
          next();
          return;
        }

        let rawBody = "";
        try {
          rawBody = await new Promise((resolve, reject) => {
            request.on("data", (chunk) => {
              rawBody += chunk;
            });
            request.on("end", () => resolve(rawBody));
            request.on("error", reject);
          });
        } catch (error) {
          response.statusCode = 400;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "Failed to read request body.", details: error.message }));
          return;
        }

        let parsedBody = {};
        if (rawBody) {
          try {
            parsedBody = JSON.parse(rawBody);
          } catch {
            response.statusCode = 400;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ error: "Request body must be valid JSON." }));
            return;
          }
        }

        const requestShim = {
          method: request.method,
          headers: request.headers,
          body: parsedBody,
        };

        const responseShim = {
          status(code) {
            response.statusCode = code;
            return responseShim;
          },
          json(payload) {
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify(payload));
          },
        };

        try {
          const module = await import("./api/github-issue.js");
          await module.default(requestShim, responseShim);
        } catch (error) {
          response.statusCode = 500;
          response.setHeader("Content-Type", "application/json");
          response.end(
            JSON.stringify({
              error: "Local API handler failed.",
              details: error instanceof Error ? error.message : String(error),
            }),
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), githubIssueDevApiPlugin()],
  };
});
