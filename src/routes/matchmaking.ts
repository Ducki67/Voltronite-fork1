import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { v4 as uuid } from "uuid";
import qs from "qs";
import { sendError } from "../utils/senderror";

export default (app: Hono) => {
  app.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/*", (c) => {
    const bucketId = c.req.query("bucketId");
    if (bucketId) setCookie(c, "buildUniqueId", bucketId.split(":")[0] || "");

    const mmCode = qs.parse(c.req.url.split("?")[1]!, {
      ignoreQueryPrefix: true,
    })["player.option.customKey"];

    if (!mmCode || typeof mmCode !== "string") {
      return sendError(
        c,
        "errors.common.voltronite.missing_matchmaking_code",
        "Missing IP and port in matchmaking code. Example: 192.168.1.10:7777",
        [],
        400,
        undefined,
        404
      );
    }

    const ipPortRegex = /^(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
    if (!ipPortRegex.test(mmCode)) {
      return sendError(
        c,
        "errors.common.voltronite.invalid_matchmaking_code",
        "Invalid matchmaking code format. Expected something like 192.168.1.69:7777.",
        [],
        400,
        undefined,
        404
      );
    }

    const [ip, portStr] = mmCode.split(":");
    const validIP = ip?.split(".").every((n) => {
      const num = Number(n);
      return num >= 0 && num <= 255;
    });
    const port = Number(portStr);
    const validPort = port > 0 && port <= 65535;

    if (!validIP || !validPort) {
      return sendError(
        c,
        "errors.common.voltronite.invalid_matchmaking_code",
        "Invalid IP or port range in matchmaking code.",
        [],
        400,
        undefined,
        404
      );
    }

    setCookie(c, "gameserver_ip", mmCode);

    return c.json({
      serviceUrl: process.env.MATCHMAKER_IP,
      ticketType: "mms-player",
      payload: uuid().replace(/-/g, ""),
      signature: "razersig",
    });
  });

  app.get("/fortnite/api/matchmaking/session/:sessionId", (c) => {
    const mmCode = getCookie(c, "gameserver_ip");
    const [ip, portStr] = (mmCode || "").split(":");
    const serverAddress = ip || "";
    const serverPort = Number(portStr) || 0;

    return c.json({
      id: c.req.param("sessionId"),
      ownerId: uuid().replace(/-/g, ""),
      ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
      serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
      serverAddress,
      serverPort,
      maxPublicPlayers: 220,
      openPublicPlayers: 175,
      maxPrivatePlayers: 0,
      openPrivatePlayers: 0,
      attributes: {
        REGION_s: "EU",
        GAMEMODE_s: "FORTATHENA",
        ALLOWBROADCASTING_b: true,
        SUBREGION_s: "GB",
        DCID_s: "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
        tenant_s: "Fortnite",
        MATCHMAKINGPOOL_s: "Any",
        STORMSHIELDDEFENSETYPE_i: 0,
        HOTFIXVERSION_i: 0,
        PLAYLISTNAME_s: "Playlist_DefaultSolo",
        SESSIONKEY_s: uuid().replace(/-/g, ""),
        TENANT_s: "Fortnite",
        BEACONPORT_i: 15009,
      },
      publicPlayers: [],
      privatePlayers: [],
      totalPlayers: 45,
      allowJoinInProgress: false,
      shouldAdvertise: false,
      isDedicated: false,
      usesStats: false,
      allowInvites: false,
      usesPresence: false,
      allowJoinViaPresence: true,
      allowJoinViaPresenceFriendsOnly: false,
      buildUniqueId: getCookie(c, "buildUniqueId") || "0",
      lastUpdated: new Date().toISOString(),
      started: false,
    });
  });

  app.get(
    "/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId",
    (c) => {
      return c.json({
        accountId: c.req.param("accountId"),
        sessionId: c.req.param("sessionId"),
        key: uuid().replace(/-/g, ""),
      });
    }
  );

  app.get("/fortnite/api/matchmaking/session/findPlayer/*", (c) =>
    c.body(null, 204)
  );

  app.post("/fortnite/api/matchmaking/session/:sessionId/join", (c) =>
    c.body(null, 204)
  );

  app.post("/fortnite/api/matchmaking/session/matchMakingRequest", (c) =>
    c.json([])
  );
};
