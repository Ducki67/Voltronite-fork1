import { Hono } from "hono";
import { sendError } from "../utils/senderror";
import { v4 as uuid } from "uuid";
import sdk from "../../public/responses/sdk.json";
import fs from "fs";
import path from "path";
import { Logger } from "../utils/logger";
import { encodeToken, decodeToken } from "../utils/tokens";

const exchangeCodes: any[] = [];

export default (app: Hono) => {
  app.post("/account/api/oauth/token", async (c) => {
    const contentType = c.req.header("content-type") || "";
    let body: Record<string, any> = {};

    if (contentType.includes("application/json")) {
      body = await c.req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await c.req.formData();
      formData.forEach((value, key) => (body[key] = value));
    } else {
      return c.text("Unsupported content type", 415);
    }

    let username: string;
    let accountId: string;

    switch (body.grant_type) {
      case "client_credentials":
        return c.json({
          access_token: encodeToken({ client: true }),
          expires_in: 2069,
          expires_at: "2069-01-01T00:00:00.000Z",
          token_type: "bearer",
          client_id: "clientidfr",
          internal_client: true,
          client_service: "fortnite",
        });

      case "password":
        if (!body.username) return c.status(400);
        username = body.username;
        accountId = uuid().replace(/-/g, "");
        break;

      case "authorization_code":
        if (!body.code) return c.status(400);
        username = body.code;
        accountId = uuid().replace(/-/g, "");
        break;

      case "exchange_code":
        if (!body.exchange_code) return c.status(400);

        const record = exchangeCodes.find((c) => c.code === body.exchange_code);
        if (!record) {
          Logger.error(`Exchange code ${body.exchange_code} not found`);
          return c.status(404);
        }

        username = record.username;
        accountId = record.accountId;
        break;

      default:
        return sendError(
          c,
          "com.voltronite.oauth.invalid_grant_type",
          `Sorry but the grant type ${body.grant_type} is unsupported`,
          [body.grant_type],
          403,
          "invalid_grant",
          403
        );
    }

    const accessToken = encodeToken({
      username,
      accountId,
      createdAt: Date.now(),
    });

    return c.json({
      access_token: accessToken,
      expires_in: 2067,
      expires_at: "2067-01-01T00:00:00.000Z",
      token_type: "bearer",
      refresh_token: "wowrefreshtoken",
      refresh_expires: 2069,
      refresh_expires_at: "2069-01-01T00:00:00.000Z",
      account_id: accountId,
      client_id: "wowclientid",
      internal_client: true,
      client_service: "fortnite",
      displayName: username,
      app: "fortnite",
      in_app_id: accountId,
      device_id: "wowdeviceid",
    });
  });

  app.get("/account/api/oauth/verify", (c) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.body(null, 401);

    const tokenStr = authHeader.replace(/^Bearer\s+/i, "");
    const data = decodeToken(tokenStr);
    if (!data || !data.accountId) return c.body(null, 401);

    const { accountId, username } = data;

    return c.json({
      token: tokenStr,
      session_id: "wowsessionid",
      token_type: "bearer",
      client_id: "wowclientid",
      internal_client: true,
      client_service: "fortnite",
      account_id: accountId,
      expires_in: 2069,
      expires_at: "2069-01-01T00:00:00.000Z",
      auth_method: "idfk",
      display_name: username,
      app: "fortnite",
      in_app_id: accountId,
      device_id: "wowdeviceid",
    });
  });

  app.delete("/account/api/oauth/sessions/kill/*", (c) => c.body(null, 204));

  app.get("/account/api/public/account", (c) => {
    const response: any[] = [];

    const accountId = c.req.query("accountId");
    if (typeof accountId === "string") {
      response.push({
        id: accountId,
        displayName: `user-${accountId}`,
        externalAuths: {},
      });
    }

    const accountIds = c.req.queries("accountId");
    if (accountIds) {
      for (const id of accountIds) {
        response.push({
          id,
          displayName: `user-${id}`,
          externalAuths: {},
        });
      }
    }

    return c.json(response);
  });

  app.get("/account/api/public/account/:accountId", (c) => {
    const accountId = c.req.param("accountId");
    return c.json({
      id: accountId,
      displayName: `user-${accountId}`,
      name: "Voltro",
      email: `user-${accountId}@voltronite.com`,
      failedLoginAttempts: 0,
      lastLogin: new Date().toISOString(),
      numberOfDisplayNameChanges: 0,
      ageGroup: "UNKNOWN",
      headless: false,
      country: "MA",
      lastName: "Nite",
      preferredLanguage: "en",
      canUpdateDisplayName: false,
      tfaEnabled: false,
      emailVerified: true,
      minorVerified: false,
      minorExpected: false,
      minorStatus: "NOT_MINOR",
      cabinedMode: false,
      hasHashedEmail: false,
    });
  });

  app.get("/account/api/public/account/:accountId/externalAuths", (c) =>
    c.json([])
  );

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

  app.post("/epic/oauth/v2/token", (c) => {
    const accountId = uuid().replace(/-/g, "");
    return c.json({
      scope: "basic_profile friends_list openid presence",
      token_type: "bearer",
      access_token: encodeToken({ accountId }),
      expires_in: 2069,
      expires_at: "2069-01-01T00:00:00.000Z",
      refresh_token: "wowrefreshtoken",
      refresh_expires_in: 2067,
      refresh_expires_at: "2067-01-01T00:00:00.000Z",
      accountId,
      client_id: "wowclientid",
      application_id: "wowappid",
      selected_account_id: accountId,
      id_token: "wowidtoken",
    });
  });

  app.get("/account/api/epicdomains/ssodomains", (c) =>
    c.json([
      "unrealengine.com",
      "unrealtournament.com",
      "fortnite.com",
      "epicgames.com",
    ])
  );

  app.post(
    "/fortnite/api/game/v2/tryPlayOnPlatform/account/:accountIdprobably",
    (c) => c.text("true")
  );

  app.get("/account/api/oauth/exchange", (c) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.body(null, 401);

    const tokenStr = authHeader.replace(/^Bearer\s+/i, "");
    const data = decodeToken(tokenStr);
    if (!data || !data.accountId) return c.body(null, 401);

    const { accountId, username } = data;
    const code = uuid().replace(/-/g, "");
    const createdAt = new Date();
    const expiresInSeconds = 300;
    const expiresAt = new Date(createdAt.getTime() + expiresInSeconds * 1000);

    exchangeCodes.push({
      code,
      accountId,
      username,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    setTimeout(() => {
      const index = exchangeCodes.findIndex((i) => i.code === code);
      if (index !== -1) exchangeCodes.splice(index, 1);
    }, expiresInSeconds * 1000);

    return c.json({ code, accountId, expiresInSeconds });
  });

  app.get("/sdk/v1/*", (c) => c.json(sdk));

  app.get("/login", async (c) => {
    const filePath = path.join(__dirname, "../../public/auth/MobileLogin.html");
    try {
      const html = await fs.promises.readFile(filePath, "utf-8");
      return c.html(html);
    } catch {
      return c.text("File not found", 404);
    }
  });

  app.get("/account/api/public/account/:accountId/deviceAuth", (c) =>
    c.json([])
  );

  app.post("/account/api/public/account/:accountId/deviceAuth", (c) =>
    c.json({
      accountId: c.req.param("accountId"),
      deviceId: "null",
      secret: "null",
    })
  );

  app.delete("/account/api/public/account/:accountId/deviceAuth/*", (c) =>
    c.body(null, 204)
  );
};
