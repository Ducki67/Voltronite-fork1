import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { v4 as uuid } from "uuid";

export default (app: Hono) => {
  app.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/*", (c) => {
    // thx lawin for the idea
    setCookie(c, "buildUniqueId", c.req.query("bucketId")!.split(":")[0] || "");

    return c.json({
      serviceUrl: process.env.MATCHMAKER_IP,
      ticketType: "mms-player",
      payload: uuid().replace(/-/g, ""),
      signature: "razersig",
    });
  });

  app.get("/fortnite/api/matchmaking/session/:sessionId", (c) => {
    return c.json({
      id: c.req.param("sessionId"),
      ownerId: uuid().replace(/-/g, ""),
      ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
      serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
      serverAddress: process.env.GAMESERVER_IP!.split(":")[0] || "",
      serverPort: Number(process.env.GAMESERVER_IP!.split(":")[1]),
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
