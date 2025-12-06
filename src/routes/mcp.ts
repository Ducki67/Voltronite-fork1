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
      if (!profileId) return c.json({}, 400);

      let profile: any;
      const changes: any[] = [];

      try {
        const athenaSave = await handleAthena(accountId);

        switch (operation) {
          case "QueryProfile":
          case "SetMtxPlatform":
          case "ClientQuestLogin": {
            const profileModule = await import(
              `../../public/profiles/${profileId}.json`
            );
            profile = profileModule.default;

            if (profile.stats?.attributes && athenaSave.athena) {
              for (const [key, val] of Object.entries(athenaSave.athena)) {
                if (key.startsWith("favorite_")) {
                  profile.stats.attributes[key] = val;
                }
              }
            }

            changes.push({ changeType: "fullProfileUpdate", profile });
            break;
          }

          case "SetCosmeticLockerSlot": {
            const body = await c.req.json<{
              category: string;
              lockerItem: string;
              itemToSlot?: string;
              slotIndex?: number;
              variantUpdates?: { channel: string; active: string }[];
            }>();

            if (!profile) {
              const mod = await import(
                `../../public/profiles/${profileId}.json`
              );
              profile = mod.default;
            }

            if (!body.category || !body.lockerItem) {
              return c.json({ error: "invalid request" }, 400);
            }

            const favKey = "favorite_" + body.category.toLowerCase();

            if (!profile.items) profile.items = {};
            const lockerItemObj = profile.items[body.lockerItem];
            if (!lockerItemObj) {
              return c.json({ error: "locker item not found" }, 400);
            }

            if (
              lockerItemObj.templateId.toLowerCase() !==
              "cosmeticlocker:cosmeticlocker_athena"
            ) {
              return c.json({ error: "locker item invalid" }, 400);
            }

            let itemToSlotID = "";
            if (body.itemToSlot) {
              for (const itemId in profile.items) {
                if (
                  profile.items[itemId].templateId.toLowerCase() ===
                  body.itemToSlot.toLowerCase()
                ) {
                  itemToSlotID = itemId;
                  break;
                }
              }
            }

            profile.stats.attributes[favKey] =
              itemToSlotID || body.itemToSlot || "";
            athenaSave.athena[favKey] = profile.stats.attributes[favKey];

            const slot =
              lockerItemObj.attributes.locker_slots_data.slots[body.category];
            if (slot) {
              if (!slot.items) slot.items = [];
              const idx =
                body.slotIndex !== undefined && body.slotIndex >= 0
                  ? body.slotIndex
                  : 0;
              slot.items[idx] = itemToSlotID || body.itemToSlot || "";

              if (Array.isArray(body.variantUpdates)) {
                slot.activeVariants = slot.activeVariants || [];
                slot.activeVariants[idx] = {
                  variants: body.variantUpdates.map((v) => ({
                    channel: v.channel,
                    active: v.active,
                  })),
                };
              }
            }

            await saveAthena(accountId, athenaSave);
            profile.rvn = (profile.rvn || 0) + 1;
            profile.commandRevision = (profile.commandRevision || 0) + 1;
            profile.updated = new Date().toISOString();

            changes.push({ changeType: "fullProfileUpdate", profile });
            break;
          }

          default:
            return sendError(
              c,
              "errors.voltronite.mcp.operation_not_supported",
              `Operation ${operation} is not supported`,
              [operation],
              1931,
              "invalid_operation",
              400
            );
        }

        const responseBody = {
          profileRevision: profile.rvn,
          profileId,
          profileChangesBaseRevision: profile.rvn,
          profileChanges: changes,
          profileCommandRevision: profile.commandRevision,
          serverTime: new Date().toISOString(),
          responseVersion: 1,
        };

        return c.json(responseBody);
      } catch (err) {
        Logger.error("Error in mcp: " + err);
        return c.text("Internal Server Error", 500);
      }
    }
  );
};
