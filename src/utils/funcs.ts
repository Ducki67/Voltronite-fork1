import type { HonoRequest } from "hono";
import { logger } from "hono/logger";
import { Logger } from "../utils/logger";


// just for test for now
export function GetNewsImage(version: { season: number }) {
  if (version.season <= 4) {
    return {
      image: "https://i.imgur.com/oCmiePS.png",
      tileImage: "https://i.imgur.com/oCmiePS.png",
    };
  }
// s5+ image (lager)
  return {
    image: "https://i.imgur.com/0SJtgwA.png",
    tileImage: "https://i.imgur.com/0SJtgwA.png",
  };
}

export function GetVersionInfo(req: HonoRequest) {
  const memory = {
    season: 0,
    build: 0,
    CL: "",
    lobby: "",
  };

  const ua = req.header("user-agent");
  if (!ua) return memory;

  try {
    const buildStr = ua.split("Release-")[1]?.split("-")[0] ?? "";
    const parts = buildStr.split(".");
    memory.season = Number(parts[0]);
    memory.build = Number(buildStr);
    memory.lobby = `LobbySeason${memory.season}`;
  } catch (e) {
    console.error("Error parsing version info:", e);
  }
Logger.backend(`Parsed version info: Season ${memory.season}, Build ${memory.build}, Lobby ${memory.lobby}`);
Logger.season(`Player is on Season ${memory.season} with Build ${memory.build}`);


  return memory;
}
