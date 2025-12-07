import { Hono } from "hono";
import { sendError } from "../utils/senderror";
import { Logger } from "../utils/logger";
import { handleAthena, saveAthena } from "../utils/mcp";

export default (app: Hono) => {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/:type/:operation",
    async (c) => {
      const accountId = c.req.param("accountId");
      const operation = c.req.param("operation");
      const profileId = c.req.query("profileId");
      const rvn = c.req.query("rvn");

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
        const attributes: any = await handleAthena(accountId);

        const profileModule = await import(
          `../../public/profiles/${profileId}.json`
        );
        profile = profileModule.default;

        switch (operation) {
          case "QueryProfile":
          case "SetMtxPlatform":
          case "ClientQuestLogin":
          case "SetHardcoreModifier":
          case "RedeemRealMoneyPurchases":
            profile.stats.attributes = {
              ...profile.stats.attributes,
              ...attributes,
            };

            if (attributes["Voltro-loadout"]) {
              profile.items["Voltro-loadout"] = JSON.parse(
                JSON.stringify(attributes["Voltro-loadout"])
              );
            }

            if (profile.items && profile.items["Voltro-loadout"]) {
              const locker = profile.items["Voltro-loadout"];
              locker.attributes.banner_icon_template =
                attributes.banner_icon || "";
              locker.attributes.banner_color_template =
                attributes.banner_color || "";
            }

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

            if (!lockerSlot) {
              lockerSlot = slots[body.category] = {
                items: new Array(expectedCapacity),
                activeVariants: new Array(expectedCapacity),
              };
            }

            const itemsArray = lockerSlot.items;
            const startIndex = body.slotIndex! < 0 ? 0 : body.slotIndex;
            const endIndex =
              body.slotIndex! < 0 ? expectedCapacity : startIndex! + 1;

            for (let index = startIndex; index! < endIndex; index!++) {
              for (let i = itemsArray.length; i < index!; i++) {
                itemsArray.push("");
              }

              if (index === itemsArray.length) {
                itemsArray.push(body.itemToSlot || "");
              } else if (index! < itemsArray.length) {
                itemsArray[index!] = body.itemToSlot || "";
              }
            }

            if (body.variantUpdates && body.variantUpdates.length > 0) {
              lockerSlot.activeVariants = [{ variants: [] }];
              body.variantUpdates.forEach((variant) => {
                lockerSlot.activeVariants[0].variants.push({
                  channel: variant.channel,
                  active: variant.active,
                });
              });
            }

            changes.push({
              changeType: "itemAttrChanged",
              itemId: body.lockerItem,
              attributeName: "locker_slots_data",
              attributeValue: lockerItemObj.attributes.locker_slots_data,
            });

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

                if (body.slotIndex === -1) {
                  itemToSlotValue = new Array(expectedCapacity).fill(
                    body.itemToSlot || ""
                  );
                } else {
                  const newArr = [...arr];
                  newArr[body.slotIndex || 0] = body.itemToSlot || "";
                  itemToSlotValue = newArr;
                }
              } else {
                itemToSlotValue = body.itemToSlot || "";
              }

              changes.push({
                changeType: "statModified",
                name: statName,
                value: itemToSlotValue,
              });

              profile.stats.attributes[statName] = itemToSlotValue;
              attributes[statName] = itemToSlotValue;
            }

            attributes["Voltro-loadout"] = JSON.parse(
              JSON.stringify(lockerItemObj)
            );
            await saveAthena(
              accountId,
              attributes,
              attributes["Voltro-loadout"]
            );

            profile.rvn = (profile.rvn || 0) + 1;
            profile.commandRevision = (profile.commandRevision || 0) + 1;
            profile.updated = new Date().toISOString();
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

            changes.push({
              changeType: "itemAttrChanged",
              itemId: body.lockerItem,
              attributeName: "banner_icon_template",
              attributeValue: body.bannerIconTemplateName,
            });

            changes.push({
              changeType: "itemAttrChanged",
              itemId: body.lockerItem,
              attributeName: "banner_color_template",
              attributeValue: body.bannerColorTemplateName,
            });

            changes.push({
              changeType: "statModified",
              name: "banner_icon",
              value: body.bannerIconTemplateName,
            });

            changes.push({
              changeType: "statModified",
              name: "banner_color",
              value: body.bannerColorTemplateName,
            });

            profile.stats.attributes.banner_icon = body.bannerIconTemplateName;
            profile.stats.attributes.banner_color =
              body.bannerColorTemplateName;
            attributes.banner_icon = body.bannerIconTemplateName;
            attributes.banner_color = body.bannerColorTemplateName;
            attributes["Voltro-loadout"] = JSON.parse(JSON.stringify(item));
            await saveAthena(
              accountId,
              attributes,
              attributes["Voltro-loadout"]
            );

            profile.rvn = (profile.rvn || 0) + 1;
            profile.commandRevision = (profile.commandRevision || 0) + 1;
            profile.updated = new Date().toISOString();
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

        const baseRevision = rvn
          ? parseInt(rvn)
          : profile.rvn - (changes.length > 0 ? 1 : 0);

        if (parseInt(rvn!) !== profile.rvn) {
          changes.length = 0;
          changes.push({ changeType: "fullProfileUpdate", profile });
        }

        return c.json({
          profileRevision: profile.rvn,
          profileId,
          profileChangesBaseRevision: baseRevision,
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
