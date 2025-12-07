import { Hono } from "hono";
import { getConnInfo } from "hono/bun";
import { v4 as uuid } from "uuid";
import qs from "qs";
import { sendError } from "../utils/senderror";

const matchmakingMap = new Map<string, [string, number, number]>();

export default (app: Hono) => {
  app.get(
    "/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId",
    (c) => {
      const bucketId = c.req.query("bucketId");
      let userIp = getConnInfo(c).remote.address!;
      if (userIp.startsWith("::ffff:")) userIp = userIp.replace("::ffff:", "");

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

      matchmakingMap.set(userIp, [
        ip!,
        port,
        parseInt(bucketId!.split(":")[0]!),
      ]);
      return c.json({
        serviceUrl: process.env.MATCHMAKER_IP,
        ticketType: "mms-player",
        payload: Buffer.from(bucketId!.split(":")[0]!).toString("hex"),
        signature: "razersig",
      });
    }
  );

  app.get("/fortnite/api/matchmaking/session/:sessionId", (c) => {
    const sessionId = c.req.param("sessionId");
    let userIp = getConnInfo(c).remote.address!;
    if (userIp.startsWith("::ffff:")) userIp = userIp.replace("::ffff:", "");
    const matchmakingSave = matchmakingMap.get(userIp);
    if (!matchmakingSave)
      return sendError(
        c,
        "errors.voltronite.matchmaking.invalid_save_data",
        "invalid matchmaking data",
        [],
        2032,
        undefined,
        400
      );
    const [serverAddress, serverPort, buildUniqueId] = matchmakingSave;

    return c.json({
      id: sessionId,
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
        ALLOWMIGRATION_s: "false",
        REJOINAFTERKICK_s: "OPEN",
        CHECKSANCTIONS_s: "false",
        BUCKET_s: "",
        DEPLOYMENT_s: "Fortnite",
        LASTUPDATED_s: new Date().toISOString(),
        LINKID_s: "playlist_defaultsolo?v=95",
        allowMigration_s: false,
        ALLOWREADBYID_s: "false",
        SERVERADDRESS_s: serverAddress,
        NETWORKMODULE_b: true,
        lastUpdated_s: new Date().toISOString(),
        allowReadById_s: false,
        serverAddress_s: serverAddress,
        LINKTYPE_s: "BR:Playlist",
        deployment_s: "Fortnite",
        ADDRESS_s: serverAddress,
        bucket_s: "",
        checkSanctions_s: false,
        rejoinAfterKick_s: "OPEN",
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
      buildUniqueId,
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
    c.json([])
  );

  app.post("/fortnite/api/matchmaking/session/matchMakingRequest", (c) =>
    c.json([])
  );
};
