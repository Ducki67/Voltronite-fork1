import { promises as fs } from "fs";
import path from "path";

export const ATHENA_DIR = path.join(
  process.cwd(),
  "public/profiles/user_athena"
);

export interface LockerSlot {
  items: (string | null)[];
  activeVariants?: ({ variants: string[] } | null)[];
}

export interface AthenaAttributes {
  favorite_victorypose: string;
  favorite_consumableemote: string;
  favorite_callingcard: string;
  favorite_character: string;
  favorite_spray: string[];
  favorite_loadingscreen: string;
  favorite_hat: string;
  favorite_battlebus: string;
  favorite_mapmarker: string;
  favorite_vehicledeco: string;
  favorite_backpack: string;
  favorite_dance: (string | null)[];
  favorite_skydivecontrail: string;
  favorite_pickaxe: string;
  favorite_glider: string;
  favorite_musicpack: string;
  favorite_itemwraps: (string | null)[];
  "Voltro-loadout": {
    templateId: string;
    attributes: {
      locker_slots_data: {
        slots: Record<string, LockerSlot>;
      };
      use_count: number;
      banner_icon_template: string;
      banner_color_template: string;
      locker_name: string;
      item_seen: boolean;
      favorite: boolean;
    };
    quantity: number;
  };
  banner_icon: string;
  banner_color: string;
}

export const DEFAULT_ATTRIBUTES: Omit<
  AthenaAttributes,
  "Voltro-loadout" | "banner_icon" | "banner_color"
> = {
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
  favorite_dance: ["AthenaDance:EID_DanceMoves", null, null, null, null, null],
  favorite_skydivecontrail: "",
  favorite_pickaxe: "AthenaPickaxe:DefaultPickaxe",
  favorite_glider: "AthenaGlider:DefaultGlider",
  favorite_musicpack: "",
  favorite_itemwraps: [null, null, null, null, null, null, null],
};

export const DEFAULT_LOADOUT: {
  templateId: string;
  attributes: {
    locker_slots_data: {
      slots: Record<string, LockerSlot>;
    };
    use_count: number;
    banner_icon_template: string;
    banner_color_template: string;
    locker_name: string;
    item_seen: boolean;
    favorite: boolean;
  };
  quantity: number;
} = {
  templateId: "CosmeticLocker:cosmeticlocker_athena",
  attributes: {
    locker_slots_data: {
      slots: {
        Pickaxe: {
          items: ["AthenaPickaxe:DefaultPickaxe"],
          activeVariants: [],
        },
        Dance: {
          items: ["AthenaDance:EID_DanceMoves", null, null, null, null, null],
        },
        Glider: { items: ["AthenaGlider:DefaultGlider"] },
        Character: { items: [""], activeVariants: [{ variants: [] }] },
        Backpack: { items: [""], activeVariants: [{ variants: [] }] },
        ItemWrap: {
          items: [null, null, null, null, null, null, null],
          activeVariants: [null, null, null, null, null, null, null],
        },
        LoadingScreen: { items: [""], activeVariants: [null] },
        MusicPack: { items: [""], activeVariants: [null] },
        SkyDiveContrail: { items: [""], activeVariants: [null] },
      },
    },
    use_count: 1,
    banner_icon_template: "",
    banner_color_template: "",
    locker_name: "",
    item_seen: true,
    favorite: false,
  },
  quantity: 1,
};

export async function handleAthena(
  accountId: string
): Promise<AthenaAttributes> {
  const profilePath = path.join(ATHENA_DIR, `${accountId}.json`);
  try {
    const raw = await fs.readFile(profilePath, "utf8");
    const json = JSON.parse(raw);

    if (!json["Voltro-loadout"])
      json["Voltro-loadout"] = JSON.parse(JSON.stringify(DEFAULT_LOADOUT));

    const attrs: AthenaAttributes = {
      favorite_victorypose: json.favorite_victorypose || "",
      favorite_consumableemote: json.favorite_consumableemote || "",
      favorite_callingcard: json.favorite_callingcard || "",
      favorite_character: json.favorite_character || "",
      favorite_spray: json.favorite_spray || [],
      favorite_loadingscreen: json.favorite_loadingscreen || "",
      favorite_hat: json.favorite_hat || "",
      favorite_battlebus: json.favorite_battlebus || "",
      favorite_mapmarker: json.favorite_mapmarker || "",
      favorite_vehicledeco: json.favorite_vehicledeco || "",
      favorite_backpack: json.favorite_backpack || "",
      favorite_dance: json.favorite_dance || [
        ...DEFAULT_ATTRIBUTES.favorite_dance,
      ],
      favorite_skydivecontrail: json.favorite_skydivecontrail || "",
      favorite_pickaxe:
        json.favorite_pickaxe || DEFAULT_ATTRIBUTES.favorite_pickaxe,
      favorite_glider:
        json.favorite_glider || DEFAULT_ATTRIBUTES.favorite_glider,
      favorite_musicpack: json.favorite_musicpack || "",
      favorite_itemwraps: json.favorite_itemwraps || [
        ...DEFAULT_ATTRIBUTES.favorite_itemwraps,
      ],
      "Voltro-loadout": json["Voltro-loadout"],
      banner_icon: json.banner_icon || "",
      banner_color: json.banner_color || "",
    };

    return attrs;
  } catch {
    await fs.mkdir(ATHENA_DIR, { recursive: true });
    const initialProfile: AthenaAttributes = {
      ...DEFAULT_ATTRIBUTES,
      "Voltro-loadout": JSON.parse(JSON.stringify(DEFAULT_LOADOUT)),
      banner_icon: "BRSeason01",
      banner_color: "DefaultColor1",
    };
    await fs.writeFile(
      profilePath,
      JSON.stringify(initialProfile, null, 2),
      "utf8"
    );
    return initialProfile;
  }
}

export async function saveAthena(
  accountId: string,
  attributes: AthenaAttributes,
  loadout?: {
    templateId: string;
    attributes: {
      locker_slots_data: {
        slots: Record<string, LockerSlot>;
      };
      use_count: number;
      banner_icon_template: string;
      banner_color_template: string;
      locker_name: string;
      item_seen: boolean;
      favorite: boolean;
    };
    quantity: number;
  }
) {
  const profilePath = path.join(ATHENA_DIR, `${accountId}.json`);
  let profile: AthenaAttributes | any = {};
  try {
    const raw = await fs.readFile(profilePath, "utf8");
    profile = JSON.parse(raw);
  } catch {}

  for (const key of Object.keys(attributes)) {
    if (key === "Voltro-loadout") continue;
    profile[key] = attributes[key as keyof AthenaAttributes];
  }

  profile["Voltro-loadout"] = {
    ...JSON.parse(JSON.stringify(DEFAULT_LOADOUT)),
    ...loadout,
    attributes: {
      ...JSON.parse(JSON.stringify(DEFAULT_LOADOUT.attributes)),
      ...loadout?.attributes,
    },
  };

  await fs.writeFile(profilePath, JSON.stringify(profile, null, 2), "utf8");
}
