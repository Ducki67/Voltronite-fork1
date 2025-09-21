import { Hono } from "hono";
import { Logger } from "./utils/logger";
import { sendError } from "./utils/senderror";
import { loadRoutes } from "./utils/loadroutes";

const app = new Hono();
global.users ??= [];
global.accessTokens ??= [];

loadRoutes(app);

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

const port = Number(process.env.PORT);

Bun.serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

Logger.backend(`Voltronite successfully started on port ${port}`);

// load external stuff
import "./ws/matchmaker";
