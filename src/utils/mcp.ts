import { promises as fs } from "fs";
import path from "path";

const ATHENA_DIR = path.join(process.cwd(), "public/profiles/user_athena");

const DEFAULT_ATHENA = {
  athena: {
    favorite_victorypose: "",
    favorite_consumableemote: "",
    favorite_callingcard: "",
    favorite_character: "",
    favorite_spray: [],
    favorite_loadingscreen: "",
    favorite_hat: "",
    favorite_battlebus: "",
    favorite_mapmarker: "",
    favorite_vehicledeco: "",
    favorite_backpack: "",
    favorite_dance: ["AthenaDance:EID_DanceMoves", "", "", "", "", ""],
    favorite_skydivecontrail: "",
    favorite_pickaxe: "AthenaPickaxe:DefaultPickaxe",
    favorite_glider: "AthenaGlider:DefaultGlider",
    favorite_musicpack: "",
    favorite_itemwraps: ["", "", "", "", "", "", ""],
  },
  common_core: {},
};

export async function handleAthena(accountId: string) {
  const profilePath = path.join(ATHENA_DIR, `${accountId}.json`);

  try {
    const raw = await fs.readFile(profilePath, "utf8");
    const json = JSON.parse(raw);
    return json;
  } catch {
    await fs.mkdir(ATHENA_DIR, { recursive: true });
    await fs.writeFile(
      profilePath,
      JSON.stringify(DEFAULT_ATHENA, null, 2),
      "utf8"
    );

    return DEFAULT_ATHENA;
  }
}

export async function saveAthena(accountId: string, data: any) {
  const profilePath = path.join(ATHENA_DIR, `${accountId}.json`);
  fs.writeFile(profilePath, JSON.stringify(data, null, 2));
}
