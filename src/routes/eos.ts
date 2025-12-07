import { Hono } from "hono";
import { v4 as uuid } from "uuid";
import sdk from "../../public/responses/sdk.json";
import { decodeToken, encodeToken } from "../utils/tokens";

export default (app: Hono) => {
  app.get("/sdk/v1/*", (c) => c.json(sdk));

  app.post("/auth/v1/oauth/token", (c) => {
    return c.json({
      access_token: encodeToken({ oauth: true }),
      token_type: "bearer",
      expires_in: 2069,
      expires_at: "2069-01-01T00:00:00.000Z",
      nonce: "Voltronite",
      features: ["AntiCheat", "Connect", "Ecom"],
      deployment_id: "wowdeployid",
      organization_id: "woworgid",
      organization_user_id: "woworguserid",
      product_id: "prod-fn",
      product_user_id: "wowproductuserid",
      product_user_id_created: false,
      id_token: "wowidtoken",
      sandbox_id: "fn",
    });
  });

  app.get("/epic/id/v2/sdk/accounts", (c) => {
    return c.json([
      {
        accountId: uuid().replace(/-/g, ""),
        displayName: uuid().replace(/-/g, ""),
        preferredLanguage: "en",
        cabinedMode: false,
        empty: false,
      },
    ]);
  });

  app.post("/epic/oauth/v2/token", async (c) => {
    const body = await c.req.formData();
    const refresh_token = body.get("refresh_token");
    if (!refresh_token) {
      return c.json({ error: "Missing refresh_token" }, 400);
    }
    const { accountId } = decodeToken(refresh_token.toString());

    return c.json({
      scope: "basic_profile friends_list openid presence",
      token_type: "bearer",
      access_token: encodeToken({ accountId }),
      expires_in: 2069,
      expires_at: "2069-01-01T00:00:00.000Z",
      refresh_token: "wowrefreshtoken",
      refresh_expires_in: 2067,
      refresh_expires_at: "2067-01-01T00:00:00.000Z",
      account_id: accountId,
      client_id: "wowclientid",
      application_id: "wowappid",
      selected_account_id: accountId,
      id_token: "wowidtoken",
    });
  });

  app.post("/telemetry/data/datarouter/api/v1/public/data", (c) =>
    c.body(null, 204)
  );

  app.all("/v1/epic-settings/public/users/:accountId/values", (c) =>
    c.json({
      response: {
        settings: [
          {
            namespace: "profile",
            settingName: "allow-non-squad-users-to-see-my-username",
            effectiveValue: true,
            effectiveSource: "preference",
            parentLimit: true,
          },
          {
            namespace: "profile",
            settingName: "can-see-player-usernames-from-other-squads",
            effectiveValue: true,
            effectiveSource: "preference",
            parentLimit: true,
          },
          {
            namespace: "chat",
            settingName: "filter-out-mature-language",
            effectiveValue: false,
            effectiveSource: "preference",
            parentLimit: false,
          },
          {
            namespace: "chat",
            settingName: "text",
            effectiveValue: "everybody",
            effectiveSource: "preference",
            parentLimit: "everybody",
          },
          {
            namespace: "chat",
            settingName: "voice",
            effectiveValue: "everybody",
            effectiveSource: "preference",
            parentLimit: "everybody",
          },
        ],
      },
      meta: {
        requestId: "",
        timestamp: new Date(),
      },
    })
  );

  app.post("/publickey/*/publickey/", (c) => c.json([]));
  app.post("/epic/oauth/v2/tokenInfo", (c) =>
    c.json({
      active: true,
      token_type: "bearer",
      expires_in: 2067,
      expires_at: "2069-01-01T00:00:00.000Z",
      client_id: "ec684b8c687f479fadea3cb2ad83f5c6",
      application_id: "fghi4567FNFBKFz3E4TROb0bmPS8h1GW",
    })
  );

  app.get("/epic/friends/v1/:accountId/blocklist", (c) => c.json([]));
  app.post("/epic/oauth/v2/revoke", (c) => c.body(null, 204));
};
