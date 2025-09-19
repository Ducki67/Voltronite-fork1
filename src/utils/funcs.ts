import type { HonoRequest } from "hono";

export function GetVersionInfo(req: HonoRequest): {
  season: number;
  build: number;
  CL: string;
  lobby: string;
} {
  const memory = {
    season: 0,
    build: 0.0,
    CL: "0",
    lobby: "",
  };

  const userAgent = req.header("user-agent");
  if (!userAgent) return memory;

  let CL = "";

  try {
    let BuildID = userAgent.split("-")[3]?.split(",")[0];

    if (BuildID && !Number.isNaN(Number(BuildID))) {
      CL = BuildID;
    } else {
      BuildID = userAgent.split("-")[3]?.split(" ")[0];

      if (BuildID && !Number.isNaN(Number(BuildID))) CL = BuildID;
    }
  } catch {
    try {
      let BuildID = userAgent.split("-")[1]?.split("+")[0];

      if (BuildID && !Number.isNaN(Number(BuildID))) CL = BuildID;
    } catch {}
  }

  try {
    let Build = userAgent.split("Release-")[1]?.split("-")[0] ?? "";

    if (Build.split(".").length === 3) {
      const Value = Build.split(".");
      Build = `${Value[0]}.${Value[1]}${Value[2]}`;
    }

    memory.season = Number(Build.split(".")[0]);
    memory.build = Number(Build);
    memory.CL = CL;
    memory.lobby = `LobbySeason${memory.season}`;

    if (Number.isNaN(memory.season)) throw new Error();
  } catch {}

  return memory;
}
