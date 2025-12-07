import { Hono } from "hono";
import { sendError } from "../utils/senderror";
import { Logger } from "../utils/logger";
import { handleAthena, saveAthena, saveLoadout } from "../utils/mcp";
import { v4 as uuid } from "uuid";

export default (app: Hono) => {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/:type/:operation",
    async (c) => {
      const accountId = c.req.param("accountId");
      const operation = c.req.param("operation");
      const profileId = c.req.query("profileId");

      if (!profileId)
        return sendError(
          c,
          "errors.invalid_request",
          "profileId missing",
          [],
          400,
          "missing_profileId",
          400
        );

      let profile: any;
      const changes: any[] = [];

      try {
        const profileModule = await import(
          `../../public/profiles/${profileId}.json`
        );
        const defaultProfile = profileModule.default;
        profile = await handleAthena(accountId, defaultProfile);

        switch (operation) {
          case "QueryProfile":
          case "SetMtxPlatform":
          case "ClientQuestLogin":
          case "SetHardcoreModifier":
          case "RedeemRealMoneyPurchases":
          case "SetLoadoutShuffleEnabled":
            changes.push({ changeType: "fullProfileUpdate", profile });
            break;

          case "SetCosmeticLockerSlot": {
            const body = await c.req.json<{
              category: string;
              lockerItem: string;
              itemToSlot?: string;
              slotIndex?: number;
              variantUpdates?: { channel: string; active: string }[];
            }>();

            if (!body.category || !body.lockerItem)
              return sendError(
                c,
                "errors.invalid_request",
                "category or lockerItem missing",
                [],
                400,
                "invalid_request",
                400
              );

            const lockerItemObj = profile.items?.[body.lockerItem];
            if (
              !lockerItemObj ||
              lockerItemObj.templateId.toLowerCase() !==
                "cosmeticlocker:cosmeticlocker_athena"
            )
              return sendError(
                c,
                "errors.invalid_locker_item",
                "Locker item invalid",
                [],
                400,
                "invalid_locker_item",
                400
              );

            const slots = lockerItemObj.attributes.locker_slots_data.slots;
            const expectedCapacity =
              body.category === "Dance"
                ? 6
                : body.category === "ItemWrap"
                  ? 7
                  : 1;
            let lockerSlot = slots[body.category];
            if (!lockerSlot)
              lockerSlot = slots[body.category] = {
                items: new Array(expectedCapacity),
                activeVariants: new Array(expectedCapacity),
              };

            const itemsArray = lockerSlot.items;
            const startIndex = body.slotIndex! < 0 ? 0 : body.slotIndex;
            const endIndex =
              body.slotIndex! < 0 ? expectedCapacity : startIndex! + 1;

            while (itemsArray.length < endIndex) itemsArray.push("");
            for (let i: any = startIndex; i < endIndex; i++) {
              itemsArray[i] = body.itemToSlot || "";
            }

            if (body.variantUpdates?.length) {
              lockerSlot.activeVariants = [{ variants: [] }];
              for (const variant of body.variantUpdates) {
                lockerSlot.activeVariants[0].variants.push({
                  channel: variant.channel,
                  active: variant.active,
                });
              }
            }

            const statName =
              body.category === "Character"
                ? "favorite_character"
                : body.category === "Backpack"
                  ? "favorite_backpack"
                  : body.category === "Pickaxe"
                    ? "favorite_pickaxe"
                    : body.category === "Glider"
                      ? "favorite_glider"
                      : body.category === "SkyDiveContrail"
                        ? "favorite_skydivecontrail"
                        : body.category === "MusicPack"
                          ? "favorite_musicpack"
                          : body.category === "LoadingScreen"
                            ? "favorite_loadingscreen"
                            : body.category === "Dance"
                              ? "favorite_dance"
                              : body.category === "ItemWrap"
                                ? "favorite_itemwraps"
                                : null;

            if (statName) {
              let itemToSlotValue: any;
              if (body.category === "Dance" || body.category === "ItemWrap") {
                const arr = profile.stats.attributes[statName] || [];
                if (body.slotIndex === -1)
                  itemToSlotValue = new Array(expectedCapacity).fill(
                    body.itemToSlot || ""
                  );
                else {
                  const newArr = [...arr];
                  newArr[body.slotIndex || 0] = body.itemToSlot || "";
                  itemToSlotValue = newArr;
                }
              } else itemToSlotValue = body.itemToSlot || "";

              profile.stats.attributes[statName] = itemToSlotValue;
            }

            profile.items["Voltro-loadout"] = lockerItemObj;

            await saveAthena(accountId, profile);

            profile.rvn = (profile.rvn || 0) + 1;
            profile.commandRevision = (profile.commandRevision || 0) + 1;
            profile.updated = new Date().toISOString();

            changes.push({ changeType: "fullProfileUpdate", profile });
            break;
          }

          case "SetCosmeticLockerBanner": {
            const body = await c.req.json<{
              lockerItem: string;
              bannerIconTemplateName: string;
              bannerColorTemplateName: string;
            }>();
            const item = profile.items?.[body.lockerItem];
            if (
              !item ||
              item.templateId.toLowerCase() !==
                "cosmeticlocker:cosmeticlocker_athena"
            )
              return sendError(
                c,
                "errors.invalid_locker_item",
                "Locker item invalid",
                [],
                400,
                "invalid_locker_item",
                400
              );

            item.attributes.banner_icon_template = body.bannerIconTemplateName;
            item.attributes.banner_color_template =
              body.bannerColorTemplateName;
            profile.stats.attributes.banner_icon = body.bannerIconTemplateName;
            profile.stats.attributes.banner_color =
              body.bannerColorTemplateName;

            profile.items["Voltro-loadout"] = item;
            await saveAthena(accountId, profile);

            profile.rvn = (profile.rvn || 0) + 1;
            profile.commandRevision = (profile.commandRevision || 0) + 1;
            profile.updated = new Date().toISOString();
            changes.push({ changeType: "fullProfileUpdate", profile });
            break;
          }

          case "PutModularCosmeticLoadout": {
            const body = await c.req.json<{
              loadoutType: string;
              presetId: number;
              loadoutData: any;
            }>();
            if (!body.loadoutType || body.presetId == null || !body.loadoutData)
              return sendError(
                c,
                "errors.voltronite.mcp.invalid_request",
                "Missing fields",
                [],
                2023,
                undefined,
                400
              );

            let loadoutData = body.loadoutData;
            if (typeof loadoutData === "string")
              loadoutData = JSON.parse(loadoutData);

            profile.stats.attributes.loadout_presets ||= {};
            profile.stats.attributes.loadout_presets[body.loadoutType] ||= {};
            const presets =
              profile.stats.attributes.loadout_presets[body.loadoutType];

            let loadoutId = presets[body.presetId];
            if (!loadoutId)
              ((loadoutId = uuid().replace(/-/g, "")),
                (presets[body.presetId] = loadoutId));

            profile.items[loadoutId] = {
              templateId: body.loadoutType,
              attributes: loadoutData,
              quantity: 1,
            };
            for (const slot of loadoutData.slots || []) {
              if (!slot.equipped_item) continue;
              const exists = Object.values(profile.items).some(
                (item: any) =>
                  item.templateId.toLowerCase() ===
                  slot.equipped_item.toLowerCase()
              );
              if (!exists)
                profile.items[uuid().replace(/-/g, "")] = {
                  templateId: slot.equipped_item,
                  attributes: { variants: [] },
                  quantity: 1,
                };
            }

            profile.rvn = (profile.rvn || 0) + 1;
            profile.commandRevision = (profile.commandRevision || 0) + 1;

            await saveLoadout(accountId, profile);
            changes.push({ changeType: "fullProfileUpdate", profile });
            break;
          }

          default:
            return sendError(
              c,
              "errors.voltronite.mcp.operation_not_supported",
              `Operation ${operation} not supported`,
              [operation],
              1931,
              "invalid_operation",
              400
            );
        }

        return c.json({
          profileRevision: profile.rvn,
          profileId,
          profileChangesBaseRevision: parseInt(c.req.query("rvn") ?? "0"),
          profileChanges: changes,
          profileCommandRevision: profile.commandRevision,
          serverTime: new Date().toISOString(),
          responseVersion: 1,
        });
      } catch (err) {
        Logger.error("[MCP] Internal Error: " + err);
        return sendError(
          c,
          "errors.voltronite.internal_server_error",
          "Internal Server Error",
          [],
          500,
          "internal_error",
          500
        );
      }
    }
  );
};
