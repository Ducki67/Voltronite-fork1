import { promises as fs } from "fs";
import path from "path";

export const ATHENA_DIR = path.join(
  process.cwd(),
  "public/profiles/user_athena"
);

export async function handleAthena(accountId: string, profile: any) {
  const accountDir = path.join(ATHENA_DIR, accountId);
  await fs.mkdir(accountDir, { recursive: true });

  const athenaPath = path.join(accountDir, "athena.json");
  const loadoutPath = path.join(accountDir, "ch5", "loadout.json");

  let athenaData: any = {};
  let loadoutData: any = {};

  try {
    const rawAthena = await fs.readFile(athenaPath, "utf8");
    athenaData = JSON.parse(rawAthena);
  } catch {}

  try {
    const rawLoadout = await fs.readFile(loadoutPath, "utf8");
    loadoutData = JSON.parse(rawLoadout);
  } catch {}

  if (athenaData.stats) {
    profile.stats = {
      ...profile.stats,
      ...athenaData.stats,
    };
  }

  if (athenaData.items?.["Voltro-loadout"]) {
    profile.items = profile.items || {};
    profile.items["Voltro-loadout"] = athenaData.items["Voltro-loadout"];
  }

  if (loadoutData.items) {
    profile.items = profile.items || {};
    for (const loadoutId of Object.keys(loadoutData.items)) {
      profile.items[loadoutId] = loadoutData.items[loadoutId];
    }
  }

  profile.rvn = Math.max(
    profile.rvn || 0,
    athenaData.rvn || 0,
    loadoutData.rvn || 0
  );
  profile.commandRevision = Math.max(
    profile.commandRevision || 0,
    athenaData.commandRevision || 0,
    loadoutData.commandRevision || 0
  );

  return profile;
}

export async function saveAthena(accountId: string, profile: any) {
  const accountDir = path.join(ATHENA_DIR, accountId);
  await fs.mkdir(accountDir, { recursive: true });
  const profilePath = path.join(accountDir, "athena.json");

  const toSave = {
    stats: profile.stats,
    items: {
      "Voltro-loadout": profile.items?.["Voltro-loadout"] || null,
    },
    rvn: profile.rvn,
    commandRevision: profile.commandRevision,
  };

  await fs.writeFile(profilePath, JSON.stringify(toSave, null, 2), "utf8");
}

export async function saveLoadout(accountId: string, profile: any) {
  const saveDir = path.join(ATHENA_DIR, accountId, "ch5");
  await fs.mkdir(saveDir, { recursive: true });
  const filePath = path.join(saveDir, "loadout.json");

  const loadoutsToSave: Record<string, any> = {};

  const presets = profile.stats.attributes.loadout_presets || {};
  for (const type of Object.keys(presets)) {
    for (const presetId of Object.keys(presets[type])) {
      const loadoutId = presets[type][presetId];
      if (profile.items[loadoutId]) {
        loadoutsToSave[loadoutId] = profile.items[loadoutId];
      }
    }
  }

  const save = {
    stats: {
      attributes: {
        loadout_presets: profile.stats.attributes.loadout_presets,
      },
    },
    items: loadoutsToSave,
    rvn: profile.rvn,
    commandRevision: profile.commandRevision,
  };

  await fs.writeFile(filePath, JSON.stringify(save, null, 2), "utf8");
}
