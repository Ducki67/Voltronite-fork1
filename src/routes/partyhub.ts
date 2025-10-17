import { Hono } from "hono";
import { decodeToken } from "../utils/tokens";

export default (app: Hono) => {
  app.post("/partyhub/graphql", async (c) => {
    let body: { operationName?: string } = {};
    try {
      body = await c.req.json();
    } catch {}

    const op = body.operationName || "";

    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.body(null, 401);

    const tokenStr = authHeader.replace(/^Bearer\s+/i, "");
    const tokenData = decodeToken(tokenStr);

    if (!tokenData || !tokenData.accountId || !tokenData.username) {
      return c.body(null, 401);
    }

    const { accountId, username } = tokenData;

    switch (op) {
      case "GetStatusPerService":
        return c.json({
          data: {
            ContentControl: {
              __typename: "ContentControlQuery",
              namespace: {
                __typename: "ContentControlNamespace",
                result: {
                  __typename: "ContentControlRules",
                  canUseVoiceChat: true,
                },
              },
            },
            LightSwitch: {
              __typename: "LightSwitchQuery",
              fortniteStatus: {
                __typename: "LightSwitchServiceStatus",
                banned: false,
                status: "UP",
              },
              kairosStatus: {
                __typename: "LightSwitchServiceStatus",
                status: "DOWN",
              },
            },
            SocialBan: {
              __typename: "SocialBanQuery",
              summary: {
                __typename: "SocialBanSummary",
                bans: [],
              },
            },
          },
          extensions: {},
        });

      case "GetMyAccount":
        return c.json({
          data: {
            Account: {
              __typename: "AccountQuery",
              myAccount: {
                __typename: "Account",
                id: accountId,
                displayName: username,
                email: `${username}@voltronite.com`,
                country: "MA",
                externalAuths: [],
              },
            },
            Fortnite: {
              __typename: "FortniteQuery",
              myProfile: {
                __typename: "FortniteProfile",
                id: accountId,
              },
            },
          },
        });

      case "UpdateUserSetting":
        return c.json({
          data: {
            UserSettings: {
              __typename: "UserSettingsMutation",
              updateSetting: {
                __typename: "UserSettingMutationStatus",
                success: true,
              },
            },
          },
        });

      case "GetMySetting":
        return c.json({
          data: {
            UserSettings: {
              __typename: "UserSettingsQuery",
              mySetting: null,
            },
          },
        });

      case "GetAccountSettings":
        return c.json({
          data: {
            UserSettings: {
              __typename: "UserSettingsQuery",
              setting: [],
            },
          },
        });

      case "EulaAccepted":
        return c.json({
          data: {
            Eula: {
              __typename: "EulaQuery",
              hasAccountAccepted: {
                __typename: "Eula",
                accepted: true,
              },
            },
          },
        });

      case "getMySocialBanSummary":
        return c.json({
          data: {
            SocialBan: {
              __typename: "SocialBanQuery",
              summary: {
                __typename: "SocialBanSummary",
                warnings: [],
                bans: [],
              },
            },
          },
        });

      case "GetNotificationSettings":
        return c.json({
          data: {
            Friends: {
              __typename: "FriendsQuery",
              notificationSettings: {
                __typename: "NotificationSettingsResponse",
                offline: null,
                success: false,
                message: "errors.com.voltro.common.not_found",
              },
            },
            PartySettings: {
              __typename: "PartySettingsQuery",
              notificationSettings: {
                __typename: "NotificationSettingsResponse",
                offline: null,
                success: true,
                message: null,
              },
            },
          },
        });

      default:
        return c.json(
          {
            [op ?? "unknownOperation"]: {
              __typename: op,
              myAccount: null,
              error: "errors.com.voltro.common.not_found",
            },
          },
          404
        );
    }
  });
};
