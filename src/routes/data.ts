import { Hono } from "hono";
import fs from "fs";
import path from "path";
import axios from "axios";
import crypto from "crypto";
import { GetVersionInfo } from "../utils/funcs";

export default (app: Hono) => {
  // ts is js for mobile ig
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
    (c) =>
      c.json({
        appName: c.req.param("appName"),
        labelName: c.req.query("label"),
        buildVersion: "Voltronite",
        catalogItemId: c.req.param("catalogItemId"),
        expires: "9999-12-31T23:59:59.999Z",
        items: {
          MANIFEST: {
            signature: "Voltronite",
            distribution: "https://epicgames-download1.akamaized.net/",
            path: "Builds/Fortnite/Content/CloudDir/Wk2JNYbyEYzjgRo8EUm95jnwsLgKOA.manifest", // replace *.manifest with a valid manifest (e.g: RxwT9fhXyJWzLl0WXky5X98eJx9XfQ.manifest)
            additionalDistributions: [],
          },
        },
        assetId: c.req.param("appName"),
      })
  );

  // ContentPages/MOTD stuff
  app.get("/content/api/pages/fortnite-game/*", async (c) => {
    const version = GetVersionInfo(c.req);
    const game: any = await axios.get(
      "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game"
    );
    let contentpages: any = game.data;

    contentpages = Object.assign(contentpages, {
      emergencynotice: {
        news: {
          platform_messages: [],
          _type: "Battle Royale News",
          messages: [
            {
              hidden: false,
              _type: "CommonUI Simple Message Base",
              body: "Made by Razer. \nDiscord: https://discord.gg/nz4sReTEWq",
              title: "Voltronite",
              spotlight: false,
            },
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
              body: "Made by Razer. \nDiscord: https://discord.gg/nz4sReTEWq",
            },
          ],
        },
        _activeDate: "2018-08-06T19:00:26.217Z",
        lastModified: "2021-03-17T15:07:27.924Z",
        _locale: "en-US",
      },
      battleroyalenews: {
        _type: "Battle Royale News",
        news: {
          motds: [
            {
              entryType: "Website",
              image: "http://192.168.1.69:8080/motd/images/motd.png",
              tileImage: "http://192.168.1.69:8080/motd/images/motd_tile.png",
              videoMute: false,
              hidden: false,
              tabTitleOverride: "VoltroNite",
              _type: "CommonUI Simple Message MOTD",
              title: "Voltronite",
              body: "Made by Razer. \nDiscord: https://discord.gg/nz4sReTEWq",
              videoLoop: false,
              videoStreamingEnabled: false,
              sortingPriority: 0,
              id: "VoltMOTD",
              videoAutoplay: false,
              videoFullscreen: false,
              spotlight: false,
              websiteURL: "https://discord.gg/nz4sReTEWq",
              websiteButtonText: "Join our discord",
            },
          ],
        },
        _title: "battleroyalenews",
        header: "",
        style: "None",
        _noIndex: false,
        alwaysShow: false,
        _activeDate: "2018-08-17T16:00:00.000Z",
        lastModified: "2019-10-31T20:29:39.334Z",
        _locale: "en-US",
      },
      battleroyalenewsv2: {
        news: {
          motds: [
            {
              entryType: "Website",
              image: "http://192.168.1.69:8080/motd/images/motd.png",
              tileImage: "http://192.168.1.69:8080/motd/images/motd_tile.png",
              videoMute: false,
              hidden: false,
              tabTitleOverride: "VoltroNite",
              _type: "CommonUI Simple Message MOTD",
              title: "Voltronite",
              body: "Made by Razer. \nDiscord: https://discord.gg/nz4sReTEWq",
              videoLoop: false,
              videoStreamingEnabled: false,
              sortingPriority: 0,
              id: "VoltMOTD",
              videoAutoplay: false,
              videoFullscreen: false,
              spotlight: false,
              websiteURL: "https://discord.gg/nz4sReTEWq",
              websiteButtonText: "Join our discord",
            },
          ],
        },
        "jcr:isCheckedOut": true,
        _title: "battleroyalenewsv2",
        header: "",
        style: "None",
        _noIndex: false,
        alwaysShow: false,
        "jcr:baseVersion": "a7ca237317f1e704b1a186-6846-4eaa-a542-c2c8ca7e7f29",
        _activeDate: "2020-01-21T14:00:00.000Z",
        lastModified: "2021-02-10T23:57:48.837Z",
        _locale: "en-US",
      },
    });

    const playlist = contentpages.playlistinformation?.playlist_info?.playlists;
    if (playlist) {
      for (let i = 0; i < playlist.length; i++) {
        const pl = playlist[i];
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
        case 10:
          bg.stage = "seasonx";
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
        default:
          bg.stage = "defaultnotris";
          break;
      }
    }

    return c.json(contentpages);
  });

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
                  url: "http://192.168.1.69:8080/motd/images/motd.png",
                },
                {
                  width: 960,
                  height: 540,
                  url: "http://192.168.1.69:8080/motd/images/motd.png",
                },
              ],
              _type: "FullScreenBackground",
            },
            FullScreenBody:
              "Made by Razer\nDiscord: https://discord.gg/nz4sReTEWq",
            FullScreenTitle: "Voltronite",
            TeaserBackground: {
              Image: [
                {
                  width: 1024,
                  height: 512,
                  url: "http://192.168.1.69:8080/motd/images/motd.png",
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

  app.get("/fortnite/api/cloudstorage/user/:accountId", (c) => {
    const accountId = c.req.param("accountId");

    try {
      const clientPath = path.join(
        __dirname,
        "../../public/usersettings/",
        accountId
      );
      if (!fs.existsSync(clientPath))
        fs.mkdirSync(clientPath, { recursive: true });

      let csFiles: any[] = [];

      fs.readdirSync(clientPath).forEach((name) => {
        if (!name.toLowerCase().includes("clientsettings")) return;

        const filePath = path.join(clientPath, name);
        const ParsedFile = fs.readFileSync(filePath, "latin1");
        const ParsedStats = fs.statSync(filePath);

        csFiles.push({
          uniqueFilename: name,
          filename: name,
          hash: crypto.createHash("sha1").update(ParsedFile).digest("hex"),
          hash256: crypto.createHash("sha256").update(ParsedFile).digest("hex"),
          length: Buffer.byteLength(ParsedFile),
          contentType: "application/octet-stream",
          uploaded: ParsedStats.mtime,
          storageType: "S3",
          storageIds: {},
          accountId: accountId,
          doNotCache: false,
        });
      });

      return c.json(csFiles);
    } catch (err) {
      return c.text("Internal Server Error", 500);
    }
  });

  app.put(
    "/fortnite/api/cloudstorage/user/:accountId/:file",

    async (c) => {
      const accountId = c.req.param("accountId");
      const fileParam = c.req.param("file");

      try {
        const clientPath = path.join(
          __dirname,
          "../../public/usersettings/",
          accountId
        );
        if (!fs.existsSync(clientPath))
          fs.mkdirSync(clientPath, { recursive: true });

        if (!fileParam.toLowerCase().includes("clientsettings"))
          return c.text("File is not a valid ClientSettings file", 400);

        const filePath = path.join(clientPath, fileParam);
        const body = await c.req.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(body), "latin1");

        return c.json([]);
      } catch (err) {
        return c.text("Internal Server Error", 500);
      }
    }
  );

  app.get("/fortnite/api/cloudstorage/user/:accountId/:file", (c) => {
    const accountId = c.req.param("accountId");
    const fileParam = c.req.param("file");

    const clientPath = path.join(
      __dirname,
      "../../public/usersettings/",
      accountId
    );
    if (!fs.existsSync(clientPath))
      fs.mkdirSync(clientPath, { recursive: true });

    if (!fileParam.toLowerCase().includes("clientsettings")) return c.json([]);

    const filePath = path.join(clientPath, fileParam);
    if (fs.existsSync(filePath))
      return c.body(fs.readFileSync(filePath) as any);

    return c.json([]);
  });

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

  // MOTD wow
  app.get("/motd/images/:filename", async (c) => {
    const filename = c.req.param("filename");
    const filePath = path.join("./public/motd/", filename);

    try {
      await fs.promises.access(filePath);
      return c.newResponse(fs.createReadStream(filePath) as any, {
        headers: {
          "Content-Type": "image/png",
        },
      });
    } catch {
      return c.text("Image not found", 404);
    }
  });
};
