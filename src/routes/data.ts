import { Hono } from "hono";
import fs from "fs";
import path from "path";
import axios from "axios";
import crypto from "crypto";
import { GetVersionInfo } from "../utils/funcs";
import { Logger } from "../utils/logger";

/*import { GetVersionInfo, GetNewsImage } from "../utils/funcs";

const version = GetVersionInfo(c.req);
const newsImages = GetNewsImage(version);

async function handleFortniteGame(c: any) {
  const version = GetVersionInfo(c.req);
  const newsImages = GetNewsImage(version);

  const game = await axios.get(
    "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game"
  );
};*/

export default (app: Hono) => {
  // ts is js for mobile ig
  app.get("/launcher/api/public/distributionpoints", (c) =>
    c.json({
      distributions: [
        "https://epicgames-download1.akamaized.net/",
        "https://download.epicgames.com/",
        "https://download2.epicgames.com/",
        "https://download3.epicgames.com/",
        "https://download4.epicgames.com/",
        "https://fastly-download.epicgames.com/",
      ],
    })
  );

  app.get("/launcher/api/public/distributionpoints/", (c) =>
    c.json({
      distributions: [
        "https://epicgames-download1.akamaized.net/",
        "https://download.epicgames.com/",
        "https://download2.epicgames.com/",
        "https://download3.epicgames.com/",
        "https://download4.epicgames.com/",
        "https://fastly-download.epicgames.com/",
      ],
    })
  );

  app.get(
    "/launcher/api/public/assets/:platform/:catalogItemId/:appName",
    (c) => {
      const platform = c.req.param("platform");
      if (platform !== "Android") {
        return c.json({
          appName: c.req.param("appName"),
          labelName: c.req.query("label"),
          buildVersion: "Voltronite",
          catalogItemId: c.req.param("catalogItemId"),
          expires: "9999-12-31T23:59:59.999Z",
          items: {
            MANIFEST: {
              signature: "Voltronite",
              distribution: "https://voltronite.ol.epicgames.com/",
              path: "Builds/Fortnite/Content/CloudDir/manifest.manifest",
              additionalDistributions: [],
            },
          },
          assetId: c.req.param("appName"),
        });
      }

      return c.json({
        appName: c.req.param("appName"),
        labelName: c.req.query("label"),
        buildVersion: "Voltronite",
        catalogItemId: c.req.param("catalogItemId"),
        expires: "9999-12-31T23:59:59.999Z",
        items: {
          MANIFEST: {
            signature: "Voltronite",
            distribution: "https://epicgames-download1.akamaized.net/",
            path: "Builds/Fortnite/Content/CloudDir/s3Z2Diebae5FbF5cHUqo1-SsTk_FzQ.manifest", // replace *.manifest with a valid manifest (e.g: RxwT9fhXyJWzLl0WXky5X98eJx9XfQ.manifest)
            additionalDistributions: [],
          },
        },
        assetId: c.req.param("appName"),
      });
    }
  );

  app.get("/Builds/Fortnite/Content/CloudDir/:file.manifest", async (c) => {
    const filePath = "./public/clouddir/manifest.manifest";
    const data = await fs.promises.readFile(filePath);

    return new Response(data, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  });

  app.get("/Builds/Fortnite/Content/CloudDir/manifest/:file.ini", async (c) => {
    const filePath = "./public/clouddir/Full.ini";
    const data = await fs.promises.readFile(filePath);

    return new Response(data, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  });

  app.get("/Builds/Fortnite/Content/CloudDir/:file.chunk", async (c) => {
    const filePath = "./public/clouddir/manifest.chunk";
    const data = await fs.promises.readFile(filePath);

    return new Response(data, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  });

  // ContentPages/MOTD stuff
  app.get("/content/api/pages/fortnite-game/spark-tracks", async (c) => {
    try {
      const sparkTracks: any = await axios.get(
        "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/spark-tracks"
      );

      return c.json(sparkTracks.data);
    } catch {
      c.text("Failed to fetch tracks.", 500);
    }
  });

  async function handleFortniteGame(c: any) {
    const version = GetVersionInfo(c.req);

    const game = await axios.get(
      "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game"
    );
    let contentpages = game.data;

    contentpages = Object.assign(contentpages, {
      emergencynotice: {
        news: {
          platform_messages: [],
          _type: "Battle Royale News",
          messages: [
            {
              hidden: false,
              _type: "CommonUI Simple Message Base",
              body: "Made by Razer. \nDiscord: https://discord.gg/e3ggRHrtrc",
              title: "Voltronite",
              spotlight: false,
            }
          ],
        },
        "jcr:isCheckedOut": true,
        _title: "emergencynotice",
        _noIndex: false,
        alwaysShow: true,
        _activeDate: "2018-08-06T19:00:26.217Z",
        lastModified: "2020-10-30T04:50:59.198Z",
        _locale: "en-US",
      },
      emergencynoticev2: {
        "jcr:isCheckedOut": true,
        _title: "emergencynoticev2",
        _noIndex: false,
        emergencynotices: {
          _type: "Emergency Notices",
          emergencynotices: [
            {
              hidden: false,
              _type: "CommonUI Emergency Notice Base",
              title: "Voltronite",
              body: "Made by Razer. \nDiscord: https://discord.gg/e3ggRHrtrc",
            },
          ],
        },
        _activeDate: "2018-08-06T19:00:26.217Z",
        lastModified: "2021-03-17T15:07:27.924Z",
        _locale: "en-US",
      },

/// ======== TODO =========
/// - Add more news items to battleroyalenews and battleroyalenewsv2
/// - Make it so S4 and below uses a 256x256 image and S6+ ues a normal sized image for the news items (like the one in the MOTD) (if possible)

      battleroyalenews: {
        _type: "Battle Royale News",
        news: {
          motds: [
            {
              entryType: "Website",
              image: "https://i.imgur.com/lJVudDn.png",
              tileImage: "https://i.imgur.com/1N6teHV.png",
              videoMute: false,
              hidden: false,
              tabTitleOverride: "VoltroNite",
              _type: "CommonUI Simple Message MOTD",
              title: "Voltronite",
              body: "Made by Razer. \nDiscord: https://discord.gg/e3ggRHrtrc",
              videoLoop: false,
              videoStreamingEnabled: false,
              sortingPriority: 0,
              id: "VoltMOTD",
              videoAutoplay: false,
              videoFullscreen: false,
              spotlight: false,
              websiteURL: "https://discord.gg/e3ggRHrtrc",
              websiteButtonText: "Join our discord",
            },
          ],
          messages: [  // we need the images here
            {
              image: "https://i.imgur.com/lJVudDn.png",
              hidden: false,
              messagetype: "normal",
              _type: "CommonUI Simple Message Base",
              title: "Voltronite",
              body: "Made by Razer.\nDiscord: https://discord.gg/e3ggRHrtrc",
              spotlight: false,
             },
             {
              image: "https://i.imgur.com/lJVudDn.png",
              hidden: false,
              messagetype: "normal",
              _type: "CommonUI Simple Message Base",
              title: "Voltronite",
              body: "Made by Razer.\nDiscord: https://discord.gg/e3ggRHrtrc",
              spotlight: false,
            },
             {
              image: "https://i.imgur.com/lJVudDn.png",
              hidden: false,
              messagetype: "normal",
              _type: "CommonUI Simple Message Base",
              title: "Voltronite",
              body: "Made by Razer.\nDiscord: https://discord.gg/e3ggRHrtrc",
              spotlight: false,
            }
          ],
        },
        _title: "battleroyalenews",
        header: "",
        style: "SpecialEvent",
        _noIndex: false,
        alwaysShow: false,
        _activeDate: "2018-08-17T16:00:00.000Z",
        lastModified: "2019-10-31T20:29:39.334Z",
        _locale: "en-US",
      },
      battleroyalenewsv2: {
        news: [
          {
            entryType: "Website",
            image: "https://i.imgur.com/lJVudDn.png",
            tileImage: "https://i.imgur.com/1N6teHV.png",
            videoMute: false,
            hidden: false,
            tabTitleOverride: "VoltroNite",
            _type: "CommonUI Simple Message MOTD",
            title: "Voltronite",
            body: "Made by Razer. \nDiscord: https://discord.gg/e3ggRHrtrc",
            videoLoop: false,
            videoStreamingEnabled: false,
            sortingPriority: 0,
            id: "VoltMOTD",
            videoAutoplay: false,
            videoFullscreen: false,
            spotlight: false,
            websiteURL: "https://discord.gg/e3ggRHrtrc",
            websiteButtonText: "Join our discord",
          },
        ],
        "jcr:isCheckedOut": true,
        _title: "battleroyalenewsv2",
        header: "",
        style: "None",
        _noIndex: false,
        alwaysShow: false,
        _activeDate: "2020-01-21T14:00:00.000Z",
        lastModified: "2021-02-10T23:57:48.837Z",
        _locale: "en-US",
      },
    });

    const playlist = contentpages.playlistinformation?.playlist_info?.playlists;
    if (playlist) {
      for (const pl of playlist) {
        if (
          pl.image ===
            "https://cdn2.unrealengine.com/Fortnite/fortnite-game/playlistinformation/v12/12BR_Cyclone_Astronomical_PlaylistTile_Main-1024x512-ab95f8d30d0742ba1759403320a08e4ea6f0faa0.jpg" &&
          pl.playlist_name === "Playlist_Music_High" &&
          pl.description ===
            "Drop into Sweaty Sands for the ride of your life. (Photosensitivity Warning)"
        ) {
          if (version.build === 8.51) {
            pl.image =
              "https://static.wikia.nocookie.net/fortnite/images/1/1b/Breakthrough_%28Full%29_-_Loading_Screen_-_Fortnite.png/revision/latest/scale-to-width-down/1000?cb=20211112181350";
            pl.description = "The choice is yours!";
            pl.display_name = "The Unvaulting";
          } else if (version.build === 9.4 || version.build === 9.41) {
            pl.image =
              "https://i.kinja-img.com/image/upload/c_fit,q_60,w_1315/c0wwjgqh8weurqve8zkb.jpg0";
            pl.description =
              "Initiate Island Defense Protocol. Emergency hyperfuel jetpacks have been granted. Take to the skies and find cover on sky platforms.";
            pl.display_name = "The Final Showdown";
          }
        }
      }
    }

    if (contentpages.dynamicbackgrounds?.backgrounds?.backgrounds?.[0]) {
      const bg = contentpages.dynamicbackgrounds.backgrounds.backgrounds[0];
      bg.stage = "";
      bg.backgroundimage = "";

      switch (version.season) {
        case 7:
          bg.stage = "season7";
          break;
        case 8:
          bg.stage = "season8";
          break;
         case 9:
          bg.stage = "season9";
          break;


        case 10:
          bg.stage = "seasonx";
          bg.stage =
          version.build === 10.31 || version.build === 10.4
              ? "blackmonday"
              : "blackmonday";
          break;
        case 11:
          bg.stage =
            version.build === 11.31 || version.build === 11.4
              ? "Winter19"
              : "season11";
          break;
        case 12:
          bg.stage = "season12";
          break;
        case 13:
          bg.stage = "season13";
          break;
        case 14:
          bg.stage = "season14";
          break;
        case 15:
          bg.stage = "season15";
          if (version.build === 15.1) {
            bg.stage = "season15xmas";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage =
              "XmasStore2020";
          }
          break;
        case 16:
          bg.stage = "season16";
          break;
        case 17:
          bg.stage = "season17";
          break;
        case 18:
          bg.stage = "season18";
          break;
        case 19:
          bg.stage = version.build === 19.01 ? "winter2021" : "season19";
          bg.backgroundimage =
            version.build === 19.01
              ? "https://cdn2.unrealengine.com/t-bp19-lobby-xmas-2048x1024-f85d2684b4af.png"
              : "";
          break;
        case 20:
          bg.stage = "season20";
          bg.backgroundimage =
            version.build === 20.4
              ? "https://cdn2.unrealengine.com/t-bp20-40-armadillo-glowup-lobby-2048x2048-2048x2048-3b83b887cc7f.jpg"
              : "https://cdn2.unrealengine.com/s20-landscapev4-2048x1024-2494a103ae6c.png";
          break;
        case 21:
          bg.stage = version.build === 21.3 ? "season2130" : "season2100";
          bg.backgroundimage =
            version.build === 21.3
              ? "https://cdn2.unrealengine.com/nss-lobbybackground-2048x1024-f74a14565061.jpg"
              : "https://cdn2.unrealengine.com/s21-lobby-background-2048x1024-2e7112b25dc3.jpg";
          break;
        case 22:
          bg.backgroundimage =
            "https://cdn2.unrealengine.com/t-bp22-lobby-square-2048x2048-2048x2048-e4e90c6e8018.jpg";
          break;
        case 23:
          if (version.build === 23.1) {
            bg.backgroundimage =
              "https://cdn2.unrealengine.com/t-bp23-winterfest-lobby-square-2048x2048-2048x2048-277a476e5ca6.png";
          } else {
            bg.stage = "defaultnotris";
            bg.backgroundimage =
              "https://cdn2.unrealengine.com/t-bp23-lobby-2048x1024-2048x1024-26f2c1b27f63.png";
          }
          break;
        case 24:
          bg.stage = "defaultnotris";
          bg.backgroundimage =
            "https://static.wikia.nocookie.net/fortnite/images/e/e7/Chapter_4_Season_2_-_Lobby_Background_-_Fortnite.png";
          break;
        case 25:
          bg.stage = "defaultnotris";
          bg.backgroundimage =
            "https://static.wikia.nocookie.net/fortnite/images/c/ca/Chapter_4_Season_3_-_Lobby_Background_-_Fortnite.png";
          break;
        case 26:
          if (version.build === 26.3) {
            bg.stage = "season2630";
            bg.backgroundimage =
              "https://cdn2.unrealengine.com/s26-lobby-timemachine-final-2560x1440-a3ce0018e3fa.jpg";
          } else {
            bg.stage = "season2600";
            bg.backgroundimage =
              "https://cdn2.unrealengine.com/0814-ch4s4-lobby-2048x1024-2048x1024-e3c2cf8d342d.png";
          }
          break;
        case 27:
          if (version.build === 27.11) {
            bg.stage = "defaultnotris";
            bg.backgroundimage =
              "https://cdn2.unrealengine.com/durianlobby2-4096x2048-242a51b6a8ee.jpg";
          } else {
            bg.stage = "season2700";
          }
          break;
        case 28:
          if (version.build === 28.2) {
            bg.stage = "defaultnotris";
            bg.backgroundimage =
              "https://cdn2.unrealengine.com/s28-tmnt-lobby-4096x2048-e6c06a310c05.jpg";
          } else {
            bg.stage = "defaultnotris";
            bg.backgroundimage =
              "https://cdn2.unrealengine.com/ch5s1-lobbybg-3640x2048-0974e0c3333c.jpg";
          }
          break;
        default:
          bg.stage = "defaultnotris";
          break;
      }
    }
    if (process.env.USE_LOGGER === "true") {
      Logger.season("Modified FortniteGame content page.");
      // log the season and build and background stage
      Logger.season(
        `Season: ${version.season}, Build: ${version.build}, Background Stage: ${contentpages.dynamicbackgrounds?.backgrounds?.backgrounds?.[0]?.stage} \n`
      );
    };


    contentpages.shopSections = {
      _title: "shop-sections",
      sectionList: {
        _type: "ShopSectionList",
        sections: [
          {
            bSortOffersByOwnership: false,
            bShowIneligibleOffersIfGiftable: false,
            bEnableToastNotification: true,
            background: {
              stage: "default",
              _type: "DynamicBackground",
              key: "vault",
            },
            _type: "ShopSection",
            landingPriority: 0,
            bHidden: false,
            sectionId: "Section1",
            bShowTimer: true,
            sectionDisplayName: "Wonder Woman",
            bShowIneligibleOffers: true,
          },
          {
            bSortOffersByOwnership: false,
            bShowIneligibleOffersIfGiftable: false,
            bEnableToastNotification: true,
            background: {
              stage: "default",
              _type: "DynamicBackground",
              key: "vault",
            },
            _type: "ShopSection",
            landingPriority: 1,
            bHidden: false,
            sectionId: "Section3",
            bShowTimer: true,
            sectionDisplayName: "Featured",
            bShowIneligibleOffers: true,
          },
          {
            bSortOffersByOwnership: false,
            bShowIneligibleOffersIfGiftable: false,
            bEnableToastNotification: true,
            background: {
              stage: "default",
              _type: "DynamicBackground",
              key: "vault",
            },
            _type: "ShopSection",
            landingPriority: 2,
            bHidden: false,
            sectionId: "Section2",
            bShowTimer: true,
            sectionDisplayName: "Daily",
            bShowIneligibleOffers: true,
          },
        ],
      },
      _noIndex: false,
      _activeDate: "2022-12-01T23:45:00.000Z",
      lastModified: "2022-12-01T21:50:44.089Z",
      _locale: "en-US",
      _templateName: "FortniteGameShopSections",
      _suggestedPrefetch: [],
    };

    return c.json(contentpages);
  }

  app.get("/content/api/pages/fortnite-game", handleFortniteGame);
  app.get("/content/api/pages/fortnite-game/", handleFortniteGame);

  app.post("/api/v1/fortnite-br/surfaces/*/target", async (c) => {
    return c.json({
      contentType: "collection",
      contentId: "fortnite-br-br-motd-collection",
      tcId: "8784961a-44e7-4fd5-82a6-8ef11e8c211d",
      contentMeta:
        '{"c93adbc7a8a9f94a916de62aa443e2d6":["93eff180-1465-496e-9be4-c02ef810ad82"]}',
      contentItems: [
        {
          contentType: "content-item",
          contentId: "93eff180-1465-496e-9be4-c02ef810ad82",
          tcId: "5085a6fa-108c-4f0c-abdd-3259c6406890",
          contentFields: {
            Buttons: [
              {
                Action: {
                  _type: "MotdDiscoveryAction",
                  category: "set_br_playlists",
                  islandCode: "set_br_playlists",
                  shouldOpen: true,
                },
                Style: "0",
                Text: "Play Now",
                _type: "Button",
              },
            ],
            FullScreenBackground: {
              Image: [
                {
                  width: 1920,
                  height: 1080,
                  url: "https://i.imgur.com/lJVudDn.png",
                },
                {
                  width: 960,
                  height: 540,
                  url: "https://i.imgur.com/lJVudDn.png",
                },
              ],
              _type: "FullScreenBackground",
            },
            FullScreenBody:
              "Made by Razer\nDiscord: https://discord.gg/e3ggRHrtrc",
            FullScreenTitle: "Voltronite",
            TeaserBackground: {
              Image: [
                {
                  width: 1024,
                  height: 512,
                  url: "https://i.imgur.com/lJVudDn.png",
                },
              ],
              _type: "TeaserBackground",
            },
            TeaserTitle: "Voltronite",
            VerticalTextLayout: false,
          },
          contentSchemaName: "DynamicMotd",
          contentHash: "c93adbc7a8a9f94a916de62aa443e2d6",
        },
      ],
    });
  });

  // Cloudstorage
  app.get("/fortnite/api/cloudstorage/system", (c) => {
    const csDir = path.join(__dirname, "../../public/responses/patches");
    let csFiles: any[] = [];

    fs.readdirSync(csDir).forEach((name) => {
      const fullPath = path.join(csDir, name);
      const stats = fs.statSync(fullPath);

      if (!name.toLowerCase().endsWith(".ini")) return;

      const file = fs.readFileSync(fullPath, "latin1");

      csFiles.push({
        uniqueFilename: name,
        filename: name,
        hash: crypto.createHash("sha1").update(file).digest("hex"),
        hash256: crypto.createHash("sha256").update(file).digest("hex"),
        length: Buffer.byteLength(file),
        contentType: "application/octet-stream",
        uploaded: stats.mtime,
        storageType: "S3",
        storageIds: {},
        doNotCache: true,
      });
    });

    return c.json(csFiles);
  });

  app.get("/fortnite/api/cloudstorage/system/config", (c) => {
    const csDir = path.join(__dirname, "../../public/responses/patches");
    let csFiles: any[] = [];

    fs.readdirSync(csDir).forEach((name) => {
      const fullPath = path.join(csDir, name);
      const stats = fs.statSync(fullPath);

      if (!name.toLowerCase().endsWith(".ini")) return;

      const file = fs.readFileSync(fullPath, "latin1");

      csFiles.push({
        uniqueFilename: name,
        filename: name,
        hash: crypto.createHash("sha1").update(file).digest("hex"),
        hash256: crypto.createHash("sha256").update(file).digest("hex"),
        length: Buffer.byteLength(file),
        contentType: "application/octet-stream",
        uploaded: stats.mtime,
        storageType: "S3",
        storageIds: {},
        doNotCache: true,
      });
    });

    return c.json(csFiles);
  });

  app.get("/fortnite/api/cloudstorage/system/:file", (c) => {
    const filePath = path.join(
      __dirname,
      "../../public/responses/patches",
      c.req.param("file")
    );
    try {
      const file = fs.readFileSync(filePath, { encoding: "utf8" });
      return c.text(file);
    } catch {
      return c.text("File not found", 404);
    }
  });

  app.get("/fortnite/api/cloudstorage/user/:accountId", (c) => c.json([]));
  app.put("/fortnite/api/cloudstorage/user/:accountId/:file", (c) =>
    c.body(null, 204)
  );

  // lightswitch
  app.get("/lightswitch/api/service/Fortnite/status", (c) =>
    c.json({
      serviceInstanceId: c.req.query("serviceId") || "fortnite",
      status: "UP",
      message: "Fortnite is online",
      maintenanceUri: null,
      overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
      allowedActions: [],
      banned: false,
      launcherInfoDTO: {
        appName: c.req.query("serviceId") || "Fortnite",
        catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
        namespace: "fn",
      },
    })
  );

  app.get("/lightswitch/api/service/bulk/status", (c) =>
    c.json([
      {
        serviceInstanceId: c.req.query("serviceId") || "fortnite",
        status: "UP",
        message: "fortnite is up.",
        maintenanceUri: null,
        overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
        allowedActions: ["PLAY", "DOWNLOAD"],
        banned: false,
        launcherInfoDTO: {
          appName: c.req.query("serviceId") || "Fortnite",
          catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
          namespace: "fn",
        },
      },
    ])
  );
};
