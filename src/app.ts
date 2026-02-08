import { Hono } from "hono";
import { Logger } from "./utils/logger";
import { sendError } from "./utils/senderror";
import { loadRoutes } from "./utils/loadroutes";



// initialize app

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
import { info } from "console";
import update from "./routes/update";
import { $ } from "bun";
import { match } from "assert";
import { url } from "inspector";
import type { uptime } from "process";
import { text } from "stream/consumers";
Logger.backend("Loading external modules...");

// settings pannel route
if (process.env.USE_SETTINGS_PANNEL === 'true') {
  import("./utils/Services/settings");
}
// log everything here!! Using  USE_LOGGER env var
if (process.env.USE_LOGGER === "true") {
  app.use("*", logger());
  console.log("Logger enabled!!");
  
  // simple root route for testing / showing backend infos (LATER)
  app.get("/", (c) => c.text(`Voltronite, Made by Razer! \n\n Other dev info at: http://localhost:${port}/devInfo \n Status at: http://localhost:${port}/status \n Ping at: http://localhost:${port}/ping  \n\n\n Warning: More nonsense coming soon...`));
  app.get ("/status", (c) => {
    return c.json({ 
      status: "online",
      uptime: process.uptime(),
      timestamp: Date.now(),
     });
  });

  app.get("/devInfo", (c) => {
    return c.json({
      Backend:{

      status: "online",
      port: `Running on port: ${port}`,
      matchmakerPort : process.env.MATCHMAKER_PORT || "9989",
      matchmakerIp : process.env.MATCHMAKER_IP || "Nothing",
      gameserverIp : process.env.GAMESERVER_IP || "Nothing",
      },
      
      Admin:{
      adminpannel: process.env.USE_SETTINGS_PANNEL === 'true' ? "enabled" : "disabled",
      logger: process.env.USE_LOGGER === "true" ? "enabled" : "disabled",
      url : `http://localhost:${port}/settings`,
      devInfoUrl : `http://localhost:${port}/devInfo`,
      },

      System:{
      platformVersion: process.version,
      bunVersion: Bun.version,
      platform: process.platform,
      uptime: process.uptime(),
      timestamp: Date.now(),
      },
      

    });
  });
// "/ping" keeps openimng the same url in a loop to test communication + show secondary infos
// show stats of the ms between requests? maybe later
  app.get("/ping", (c) => {
    return c.json({
      message: "pong",
      timestamp: Date.now(),
    });
  });





// unknown route handler
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

Logger.backend("External modules loaded.");
}