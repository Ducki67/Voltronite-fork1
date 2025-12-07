import { Hono } from "hono";
import Crypto from "crypto";
import { GetVersionInfo } from "../utils/funcs";
import v1 from "../../public/discovery/mnemonic/v1.json";
import v2 from "../../public/discovery/mnemonic/v2.json";

export default (app: Hono) => {
  app.post("/api/v1/assets/Fortnite/*", (c) =>
    c.json({
      FortCreativeDiscoverySurface: {
        meta: {
          promotion: 1,
        },
        assets: {
          CreativeDiscoverySurface_Frontend: {
            meta: {
              revision: 1,
              headRevision: 1,
              revisedAt: "2022-04-11T16:34:03.517Z",
              promotion: 1,
              promotedAt: "2022-04-11T16:34:49.510Z",
            },
            assetData: {
              AnalyticsId: "t412",
              TestCohorts: [
                {
                  AnalyticsId: "c522715413",
                  CohortSelector: "PlayerDeterministic",
                  PlatformBlacklist: [],
                  ContentPanels: [
                    {
                      NumPages: 1,
                      AnalyticsId: "p536",
                      PanelType: "AnalyticsList",
                      AnalyticsListName: "ByEpicWoven",
                      CuratedListOfLinkCodes: [],
                      ModelName: "",
                      PageSize: 7,
                      PlatformBlacklist: [],
                      PanelName: "ByEpicWoven",
                      MetricInterval: "",
                      SkippedEntriesCount: 0,
                      SkippedEntriesPercent: 0,
                      SplicedEntries: [],
                      PlatformWhitelist: [],
                      EntrySkippingMethod: "None",
                      PanelDisplayName: {
                        Category: "Game",
                        NativeCulture: "",
                        Namespace: "CreativeDiscoverySurface_Frontend",
                        LocalizedStrings: [
                          {
                            key: "ar",
                            value: "العب بأسلوبك",
                          },
                          {
                            key: "de",
                            value: "Spiele auf deine Weise",
                          },
                          {
                            key: "en",
                            value: "Play Your Way",
                          },
                          {
                            key: "es",
                            value: "Juega como quieras",
                          },
                          {
                            key: "fr",
                            value: "Jouez à votre façon",
                          },
                          {
                            key: "it",
                            value: "Gioca a modo tuo",
                          },
                          {
                            key: "ja",
                            value: "好きにプレイしよう",
                          },
                          {
                            key: "ko",
                            value: "나만의 플레이",
                          },
                          {
                            key: "pl",
                            value: "Graj po swojemu",
                          },
                          {
                            key: "ru",
                            value: "Играйте как нравится",
                          },
                          {
                            key: "tr",
                            value: "İstediğin Gibi Oyna",
                          },
                          {
                            key: "pt-BR",
                            value: "Jogue do Seu Jeito",
                          },
                          {
                            key: "es-419",
                            value: "Juega a tu manera",
                          },
                        ],
                        bIsMinimalPatch: false,
                        NativeString: "Play Your Way",
                        Key: "ByEpicWoven",
                      },
                      PlayHistoryType: "RecentlyPlayed",
                      bLowestToHighest: false,
                      PanelLinkCodeBlacklist: [],
                      PanelLinkCodeWhitelist: [],
                      FeatureTags: [],
                      MetricName: "",
                    },
                  ],
                  PlatformWhitelist: [],
                  SelectionChance: 0.1,
                  TestName: "Voltronite",
                },
              ],
              GlobalLinkCodeBlacklist: [],
              SurfaceName: "CreativeDiscoverySurface_Frontend",
              TestName: "20.10_4/11/2022_hero_combat_popularConsole",
              primaryAssetId:
                "FortCreativeDiscoverySurface:CreativeDiscoverySurface_Frontend",
              GlobalLinkCodeWhitelist: [],
            },
          },
        },
      },
    })
  );

  app.post("/fortnite/api/game/v2/creative/discovery/surface/:accountId", (c) =>
    c.json({
      Panels: [
        {
          PanelName: "ByEpicWoven",
          Pages: [
            {
              results: [
                {
                  linkData: {
                    namespace: "fn",
                    mnemonic: "playlist_defaultsolo",
                    linkType: "BR:Playlist",
                    active: true,
                    disabled: false,
                    version: 95,
                    moderationStatus: "Unmoderated",
                    accountId: "epic",
                    creatorName: "Epic",
                    descriptionTags: [],
                    metadata: {
                      image_url:
                        "https://cdn2.unrealengine.com/solo-1920x1080-1920x1080-bc0a5455ce20.jpg",
                      matchmaking: {
                        override_playlist: "playlist_defaultsolo",
                      },
                    },
                  },
                  lastVisited: null,
                  linkCode: "playlist_defaultsolo",
                  isFavorite: false,
                },
                {
                  linkData: {
                    namespace: "fn",
                    mnemonic: "playlist_defaultduo",
                    linkType: "BR:Playlist",
                    active: true,
                    disabled: false,
                    version: 95,
                    moderationStatus: "Unmoderated",
                    accountId: "epic",
                    creatorName: "Epic",
                    descriptionTags: [],
                    metadata: {
                      image_url:
                        "https://cdn2.unrealengine.com/duos-1920x1080-1920x1080-5a411fe07b21.jpg",
                      matchmaking: {
                        override_playlist: "playlist_defaultduo",
                      },
                    },
                  },
                  lastVisited: null,
                  linkCode: "playlist_defaultduo",
                  isFavorite: false,
                },
                {
                  linkData: {
                    namespace: "fn",
                    mnemonic: "playlist_trios",
                    linkType: "BR:Playlist",
                    active: true,
                    disabled: false,
                    version: 95,
                    moderationStatus: "Unmoderated",
                    accountId: "epic",
                    creatorName: "Epic",
                    descriptionTags: [],
                    metadata: {
                      image_url:
                        "https://cdn2.unrealengine.com/trios-1920x1080-1920x1080-d5054bb9691a.jpg",
                      matchmaking: {
                        override_playlist: "playlist_trios",
                      },
                    },
                  },
                  lastVisited: null,
                  linkCode: "playlist_trios",
                  isFavorite: false,
                },
                {
                  linkData: {
                    namespace: "fn",
                    mnemonic: "playlist_defaultsquad",
                    linkType: "BR:Playlist",
                    active: true,
                    disabled: false,
                    version: 95,
                    moderationStatus: "Unmoderated",
                    accountId: "epic",
                    creatorName: "Epic",
                    descriptionTags: [],
                    metadata: {
                      image_url:
                        "https://cdn2.unrealengine.com/squads-1920x1080-1920x1080-095c0732502e.jpg",
                      matchmaking: {
                        override_playlist: "playlist_defaultsquad",
                      },
                    },
                  },
                  lastVisited: null,
                  linkCode: "playlist_defaultsquad",
                  isFavorite: false,
                },
              ],
              hasMore: false,
            },
          ],
        },
      ],
      TestCohorts: ["Voltronite"],
      ModeSets: {},
    })
  );

  app.get("/fortnite/api/game/v2/creative/favorites/:accountId", (c) =>
    c.json({
      results: [],
      hasMore: false,
    })
  );

  app.get("/fortnite/api/game/v2/creative/history/:accountId", (c) =>
    c.json({
      results: [],
      hasMore: false,
    })
  );

  app.get("/links/api/fn/mnemonic/:playlist", (c) =>
    c.json({
      namespace: "fn",
      accountId: "epic",
      creatorName: "Epic",
      mnemonic: c.req.param("playlist"),
      linkType: "BR:Playlist",
      metadata: {
        matchmaking: {
          override_playlist: c.req.param("playlist"),
        },
      },
      version: 93,
      active: true,
      disabled: false,
      created: "2021-08-16T16:43:18.268Z",
      published: "2021-08-03T15:27:17.540Z",
      descriptionTags: [],
    })
  );

  app.post("/api/v1/discovery/surface/:accountId", (c) =>
    c.json({
      Panels: [
        {
          PanelName: "ByEpicWoven",
          Pages: [
            {
              results: [
                {
                  linkData: {
                    namespace: "fn",
                    mnemonic: "playlist_defaultsolo",
                    linkType: "BR:Playlist",
                    active: true,
                    disabled: false,
                    version: 95,
                    moderationStatus: "Unmoderated",
                    accountId: "epic",
                    creatorName: "Epic",
                    descriptionTags: [],
                    metadata: {
                      image_url:
                        "https://cdn2.unrealengine.com/solo-1920x1080-1920x1080-bc0a5455ce20.jpg",
                      matchmaking: {
                        override_playlist: "playlist_defaultsolo",
                      },
                    },
                  },
                  lastVisited: null,
                  linkCode: "playlist_defaultsolo",
                  isFavorite: false,
                },
                {
                  linkData: {
                    namespace: "fn",
                    mnemonic: "playlist_defaultduo",
                    linkType: "BR:Playlist",
                    active: true,
                    disabled: false,
                    version: 95,
                    moderationStatus: "Unmoderated",
                    accountId: "epic",
                    creatorName: "Epic",
                    descriptionTags: [],
                    metadata: {
                      image_url:
                        "https://cdn2.unrealengine.com/duos-1920x1080-1920x1080-5a411fe07b21.jpg",
                      matchmaking: {
                        override_playlist: "playlist_defaultduo",
                      },
                    },
                  },
                  lastVisited: null,
                  linkCode: "playlist_defaultduo",
                  isFavorite: false,
                },
                {
                  linkData: {
                    namespace: "fn",
                    mnemonic: "playlist_trios",
                    linkType: "BR:Playlist",
                    active: true,
                    disabled: false,
                    version: 95,
                    moderationStatus: "Unmoderated",
                    accountId: "epic",
                    creatorName: "Epic",
                    descriptionTags: [],
                    metadata: {
                      image_url:
                        "https://cdn2.unrealengine.com/trios-1920x1080-1920x1080-d5054bb9691a.jpg",
                      matchmaking: {
                        override_playlist: "playlist_trios",
                      },
                    },
                  },
                  lastVisited: null,
                  linkCode: "playlist_trios",
                  isFavorite: false,
                },
                {
                  linkData: {
                    namespace: "fn",
                    mnemonic: "playlist_defaultsquad",
                    linkType: "BR:Playlist",
                    active: true,
                    disabled: false,
                    version: 95,
                    moderationStatus: "Unmoderated",
                    accountId: "epic",
                    creatorName: "Epic",
                    descriptionTags: [],
                    metadata: {
                      image_url:
                        "https://cdn2.unrealengine.com/squads-1920x1080-1920x1080-095c0732502e.jpg",
                      matchmaking: {
                        override_playlist: "playlist_defaultsquad",
                      },
                    },
                  },
                  lastVisited: null,
                  linkCode: "playlist_defaultsquad",
                  isFavorite: false,
                },
              ],
              hasMore: false,
            },
          ],
        },
      ],
      TestCohorts: ["Voltronite"],
      ModeSets: {},
    })
  );

  app.post("/links/api/fn/mnemonic", (c) => {
    const verInfo = GetVersionInfo(c.req);

    if (verInfo.build <= 23.5) {
      return c.json(v1);
    } else {
      return c.json(v2);
    }
  });

  app.get("/fortnite/api/discovery/accessToken/:branch", (c) =>
    c.json({
      branchName: c.req.param("branch"),
      appId: "Fortnite",
      token: `${Crypto.randomBytes(10).toString("hex")}=`,
    })
  );

  app.post("/api/v2/discovery/surface/:surface", (c) =>
    c.json({
      panels: [
        {
          panelName: "Homebar_V3",
          panelDisplayName: "Test_EpicsPicksHomebar",
          featureTags: ["col:5", "homebar"],
          firstPage: {
            results: [
              {
                lastVisited: null,
                linkCode: "reference_byepicnocompetitive_5",
                isFavorite: false,
                globalCCU: 1,
              },
            ],
            hasMore: false,
            panelTargetName: null,
          },
          panelType: "CuratedList",
          playHistoryType: null,
        },
        {
          panelName: "ByEpicNoCompetitive",
          panelDisplayName: "By Epic",
          featureTags: ["col:5"],
          firstPage: {
            results: [
              {
                lastVisited: null,
                linkCode: "set_br_playlists",
                isFavorite: false,
                globalCCU: 1,
              },
              {
                lastVisited: null,
                linkCode: "playlist_durian",
                isFavorite: false,
                globalCCU: 1,
              },
              {
                lastVisited: null,
                linkCode: "playlist_papaya",
                isFavorite: false,
                globalCCU: 1,
              },
              {
                lastVisited: null,
                linkCode: "playlist_juno",
                isFavorite: false,
                globalCCU: 1,
              },
            ],
            hasMore: true,
            panelTargetName: null,
          },
          panelType: "AnalyticsList",
          playHistoryType: null,
        },
      ],
    })
  );

  app.post("/api/v1/links/lock-status/:accountId/check", async (c) => {
    const accountId = c.req.param("accountId");
    const data = await c.req.json();
    const codes = Array.isArray(data?.linkCodes) ? data.linkCodes : [];

    const items = codes.map((code: string) => ({
      playerId: accountId,
      linkCode: code,
      lockStatus: "UNLOCKED",
      lockStatusReason: "NONE",
      isVisible: true,
    }));

    return c.json({
      results: items,
      hasMore: false,
    });
  });

  app.get("/links/api/fn/mnemonic/:playlistId/related", async (c) => {
    const playlistId = c.req.param("playlistId");
    return c.json({
      parentLinks: [],
      links: {
        [playlistId]: {
          namespace: "fn",
          accountId: "epic",
          creatorName: "Epic",
          mnemonic: playlistId,
          linkType: "BR:Playlist",
          metadata: {
            image_url: "",
            image_urls: {
              url_s: "",
              url_xs: "",
              url_m: "",
              url: "",
            },
            matchmaking: {
              override_playlist: playlistId,
            },
          },
          version: 95,
          active: true,
          disabled: false,
          created: "2021-10-01T00:56:45.010Z",
          published: "2021-08-03T15:27:20.251Z",
          descriptionTags: [],
          moderationStatus: "Approved",
        },
      },
    });
  });

  app.post("/api/v1/links/favorites/:accountId/check", (c) =>
    c.json({
      results: [],
      hasMore: false,
    })
  );
};
