import { Hono } from "hono";

export default (app: Hono) => {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/:operation",
    async (c) => {
      const profileId = c.req.query("profileId");
      if (!profileId) return c.json({});

      try {
        const profileModule = await import(
          `../../public/profiles/${profileId}.json`
        );
        const profile = profileModule.default;

        return c.json({
          profileRevision: profile.rvn || 0,
          profileId: profileId,
          profileChangesBaseRevision: profile.rvn || 0,
          profileChanges: [
            {
              changeType: "fullProfileUpdate",
              profile,
            },
          ],
          profileCommandRevision: profile.commandRevision || 0,
          serverTime: new Date().toISOString(),
          responseVersion: 1,
        });
      } catch {
        return c.text("Internal Server Error", 500);
      }
    }
  );
};
