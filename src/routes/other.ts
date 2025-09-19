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

  app.post("/datarouter/api/v1/public/data", (c) => c.body(null, 204));

  app.get("/fortnite/api/game/v2/enabled_features", (c) => c.json([]));

  app.post("/fortnite/api/game/v2/chat/*/*/*/*", (c) => c.json({}));

  app.get("/waitingroom/api/waitingroom", (c) => c.body(null, 204));

  app.post("/*/api/statsv2/query", (c) => c.json([]));

  app.get("/fortnite/api/game/v2/world/info", (c) => c.json({}));

  app.post("/api/v1/user/setting", (c) => c.json({}));

  app.all("/api/v1/:accountId/device/:deviceId/channel/:channel", (c) =>
    c.body(null, 204)
  );
};
