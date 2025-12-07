import { Hono } from "hono";

export default (app: Hono) => {
  app.get("/region", (c) =>
    c.json({
      continent: {
        code: "EU",
        geoname_id: 6255148,
        names: {
          de: "Europa",
          en: "Europe",
          es: "Europa",
          it: "Europa",
          fr: "Europe",
          ja: "ヨーロッパ",
          "pt-BR": "Europa",
          ru: "Европа",
          "zh-CN": "欧洲",
        },
      },
      country: {
        geoname_id: 2635167,
        is_in_european_union: false,
        iso_code: "GB",
        names: {
          de: "UK",
          en: "United Kingdom",
          es: "RU",
          it: "Stati Uniti",
          fr: "Royaume Uni",
          ja: "英国",
          "pt-BR": "Reino Unido",
          ru: "Британия",
          "zh-CN": "英国",
        },
      },
      subdivisions: [
        {
          geoname_id: 6269131,
          iso_code: "ENG",
          names: {
            de: "England",
            en: "England",
            es: "Inglaterra",
            it: "Inghilterra",
            fr: "Angleterre",
            ja: "イングランド",
            "pt-BR": "Inglaterra",
            ru: "Англия",
            "zh-CN": "英格兰",
          },
        },
        {
          geoname_id: 3333157,
          iso_code: "KEC",
          names: {
            en: "Royal Kensington and Chelsea",
          },
        },
      ],
    })
  );

  app.post("/datarouter/api/v1/public/*", (c) => c.body(null, 204));

  app.get("/fortnite/api/game/v2/enabled_features", (c) => c.json([]));

  app.post("/fortnite/api/game/v2/chat/*/*/*/*", (c) => c.json({}));

  app.get("/waitingroom/api/waitingroom", (c) => c.body(null, 204));

  app.post("/*/api/statsv2/query", (c) => c.json([]));

  app.get("/fortnite/api/game/v2/world/info", (c) => c.json({}));

  app.post("/api/v1/user/setting", (c) => c.json({}));

  app.all("/api/v1/:accountId/device/:deviceId/channel/:channel", (c) =>
    c.body(null, 204)
  );

  app.get("/fortnite/api/game/v2/br-inventory/account/:accountId", (c) =>
    c.json({
      stash: {
        globalcash: 5000,
      },
    })
  );

  app.get("/fortnite/api/game/v2/privacy/account/:accountId", (c) =>
    c.json({
      accountId: c.req.param("accountId"),
      optOutOfPublicLeaderboards: false,
    })
  );

  app.get("/api/v1/events/Fortnite/download/:accountId", (c) =>
    c.json({
      player: {
        gameId: "Fortnite",
        accountId: c.req.param("accountId"),
        tokens: [],
        teams: {},
        pendingPayouts: [],
        pendingPenalties: {},
        persistentScores: {},
        groupIdentity: {},
      },
      events: [],
      templates: [],
      scores: [],
    })
  );

  app.get("/statsproxy/api/statsv2/account/:accountId", (c) =>
    c.json({
      startTime: 0,
      endTime: 999999999999999,
      stats: {},
      accountId: c.req.param("accountId"),
    })
  );

  app.get("/socialban/api/public/v1/:accountId", (c) => c.body(null, 204));
  app.get("/fortnite/api/receipts/v1/account/:accountId/receipts", (c) =>
    c.json([])
  );
  app.all("/friends/api/*", (c) => c.body(null, 204));

  app.get("/hotconfigs/v2/livefn.json", (c) =>
    c.json({
      HotConfigData: [
        {
          AppId: "livefn",
          EpicApp: "FortniteLivefn",
          Modules: [
            {
              ModuleName: "GameServiceMcp",
              Endpoints: {
                Android: "mcp-gc.live.fngw.ol.epicgames.com",
                DedicatedServer: "mcp-ds.live.fngw.ol.epicgames.com",
                Default: "mcp-gc.live.fngw.ol.epicgames.com",
                IOS: "mcp-gc.live.fngw.ol.epicgames.com",
                Linux: "mcp-gc.live.fngw.ol.epicgames.com",
                Mac: "mcp-gc.live.fngw.ol.epicgames.com",
                PS4: "mcp-gc.live.fngw.ol.epicgames.com",
                PS5: "mcp-gc.live.fngw.ol.epicgames.com",
                Switch: "mcp-gc.live.fngw.ol.epicgames.com",
                Windows: "mcp-gc.live.fngw.ol.epicgames.com",
                XB1: "mcp-gc.live.fngw.ol.epicgames.com",
                XSX: "mcp-gc.live.fngw.ol.epicgames.com",
                XboxOneGDK: "mcp-gc.live.fngw.ol.epicgames.com",
              },
            },
          ],
        },
      ],
    })
  );

  app.all("/api/content/v2/launch-data", (c) => c.body(null, 204));
  app.all("/fortnite/api/feedback/Error", (c) => c.body(null, 204));
  app.get("/api/v1/access/fortnite/*", (c) => c.body(null, 204));
};
