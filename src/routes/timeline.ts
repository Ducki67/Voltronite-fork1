import { Hono } from "hono";
import { GetVersionInfo } from "../utils/funcs";

export default (app: Hono) => {
  app.get("/fortnite/api/calendar/v1/timeline", async (c) => {
    const version = GetVersionInfo(c.req);

    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const storeEnd = new Date(midnight.getTime() - 60000).toISOString();

    const events = [
      {
        eventType: `EventFlag.Season${version.season}`,
        activeSince: "0001-01-01T00:00:00.000Z",
        activeUntil: "9999-01-01T00:00:00.000Z",
      },
      {
        eventType: `EventFlag.${version.lobby}`,
        activeSince: "0001-01-01T00:00:00.000Z",
        activeUntil: "9999-01-01T00:00:00.000Z",
      },
    ];

    const state = {
      activeStorefronts: [],
      eventNamedWeights: {},
      seasonNumber: version.season,
      seasonTemplateId: `AthenaSeason:athenaseason${version.season}`,
      matchXpBonusPoints: 0,
      seasonBegin: "0001-01-01T00:00:00Z",
      seasonEnd: process.env.SEASON_END,
      seasonDisplayedEnd: process.env.SEASON_END,
      weeklyStoreEnd: storeEnd,
      sectionStoreEnds: { Featured: storeEnd },
      dailyStoreEnd: storeEnd,
    };

    const response = {
      channels: {
        "client-matchmaking": {
          states: [],
          cacheExpire: "9999-01-01T00:00:00.000Z",
        },
        "client-events": {
          states: [
            {
              validFrom: "0001-01-01T00:00:00.000Z",
              activeEvents: events,
              state,
            },
          ],
          cacheExpire: "9999-01-01T00:00:00.000Z",
        },
      },
      eventsTimeOffsetHrs: 0,
      cacheIntervalMins: 10,
      currentTime: now.toISOString(),
    };

    return c.json(response);
  });
};
