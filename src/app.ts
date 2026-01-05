import { Hono } from "hono";
import { Logger } from "./utils/logger";
import { sendError } from "./utils/senderror";
import { loadRoutes } from "./utils/loadroutes";

const app = new Hono();
global.users ??= [];
global.accessTokens ??= [];

loadRoutes(app);



const port = Number(process.env.PORT);

Bun.serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

Logger.backend(`Voltronite successfully started on port \x1b[33m${port}\x1b[0m`);
Logger.backend(`Dev Server running on \x1b[34mhttp://localhost:${port}\x1b[0m`);


// load external stuff
import "./ws/matchmaker";
import { logger } from "hono/logger";

if (process.env.USE_SETTINGS_PANNEL === 'true') {
  import("./utils/Services/settings");
}
// log everything here!! Using  USE_LOGGER env var
if (process.env.USE_LOGGER === "true") {
  app.use("*", logger());

  
app.get("/", (c) => c.text("Voltronite, Made by Razer!"));
app.get("/unknown", (c) => c.json({}));
app.notFound((c) => {
  const url = c.req.url;
  return sendError(
    c,
    "errors.voltronite.common.route_not_found",
    `No route found for ${url}.`,
    [url],
    404,
    "invalid_route",
    404
  );
});


}