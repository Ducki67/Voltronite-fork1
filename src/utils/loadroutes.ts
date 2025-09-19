import { Hono } from "hono";
import fs from "fs";
import path from "path";
import url from "url";

export async function loadRoutes(app: Hono) {
  const routesPath = path.join(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "../routes"
  );
  const files = fs.readdirSync(routesPath);

  for (const file of files) {
    if (!file.endsWith(".ts")) continue;

    const modulePath = path.join(routesPath, file);
    const routeModule = await import(url.pathToFileURL(modulePath).toString());
    const route = routeModule.default;

    if (!route) continue;

    if (typeof route === "function") {
      route(app);
    } else if (route instanceof Hono) {
      app.route("/", route);
    }
  }
}
