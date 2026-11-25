import { BRAND } from "../config/brand";
import { DECOR } from "../config/palette";

/**
 * BIBLE DES PERSONNAGES — la seule définition de chaque personnage.
 * Les scènes ne dessinent jamais un personnage : elles choisissent une pose,
 * une expression et une tenue dans cette fiche. Résultat : aucun personnage
 * ne change d'une scène à l'autre.
 */
export type Outfit = {
  top: string;
  topShade: string;
  topPattern?: "wax" | "flowers" | "stripes" | "none";
  patternColor?: string;
  sleeves: "short" | "long";
  pants: string;
  pantsShade: string;
  shoes: string;
  collar?: boolean;
  number?: string; // numéro de zémidjan sur la poitrine
  skirt?: boolean; // pagne long (figurante)
};

export type CharacterSpec = {
  id: "senan" | "demarcheur" | "zem" | "vendeuse" | "aicha" | "koffi";
  label: string;
  skin: string;
  skinShade: string;
  hair: "fade" | "shortRound" | "cap" | "headwrap";
  wrapColor?: string;
  hairColor: string;
  beard: "light" | "none" | "goatee";
  shoulderHalf: number;
  waistHalf: number;
  belly: number; // rondeur du ventre
  headRx: number;
  headRy: number;
  legLength: number;
  accessories: Array<"satchel" | "sunglasses" | "chain" | "cap" | "watch">;
  outfit: Outfit;
  outfits?: Record<string, Partial<Outfit>>;
};

export const SENAN: CharacterSpec = {
  id: "senan",
  label: "Sènan — 27 ans, jeune salarié de Cotonou (héros)",
  skin: DECOR.skinSenan,
  skinShade: DECOR.skinSenanShade,
  hair: "fade",
  hairColor: DECOR.hair,
  beard: "light",
  shoulderHalf: 66,
  waistHalf: 52,
  belly: 0,
  headRx: 64,
  headRy: 74,
  legLength: 250,
  accessories: ["satchel", "watch"],
  outfit: {
    // Chemise vert clair VOBI (#A7E3C6) à motif wax discret (storyboard §4)
    top: BRAND.lightGreen,
    topShade: "#86CDAA",
    topPattern: "wax",
    patternColor: "#6FBF98",
    sleeves: "short",
    pants: DECOR.khaki,
    pantsShade: DECOR.khakiShade,
    shoes: DECOR.sandal,
    collar: true,
  },
  outfits: {
    pyjama: {
      top: DECOR.pajama,
      topShade: "#6A88B0",
      topPattern: "stripes",
      patternColor: DECOR.pajamaStripe,
      sleeves: "long",
      pants: DECOR.pajama,
      pantsShade: "#6A88B0",
      shoes: DECOR.sandal,
      collar: true,
    },
  },
};

export const DEMARCHEUR: CharacterSpec = {
  id: "demarcheur",
  label: "Le démarcheur — la quarantaine, rond, toujours souriant",
  skin: DECOR.skinDemarcheur,
  skinShade: DECOR.skinDemarcheurShade,
  hair: "shortRound",
  hairColor: DECOR.hair,
  beard: "goatee",
  shoulderHalf: 74,
  waistHalf: 66,
  belly: 34,
  headRx: 68,
  headRy: 72,
  legLength: 228,
  accessories: ["sunglasses", "chain"],
  outfit: {
    top: DECOR.flowerShirt,
    topShade: DECOR.flowerShirtShade,
    topPattern: "flowers",
    patternColor: "#F6D7A6",
    sleeves: "short",
    pants: "#3D4A5C",
    pantsShade: "#2E3947",
    shoes: "#2A1E16",
    collar: true,
  },
};

export const ZEM: CharacterSpec = {
  id: "zem",
  label: "Le zémidjan — 30 ans, chemise jaune réglementaire",
  skin: DECOR.skinZem,
  skinShade: DECOR.skinZemShade,
  hair: "cap",
  hairColor: DECOR.hair,
  beard: "none",
  shoulderHalf: 68,
  waistHalf: 54,
  belly: 0,
  headRx: 62,
  headRy: 72,
  legLength: 245,
  accessories: ["cap"],
  outfit: {
    top: DECOR.zemYellow,
    topShade: DECOR.zemYellowShade,
    topPattern: "none",
    sleeves: "short",
    pants: "#4A3B2E",
    pantsShade: "#3A2E24",
    shoes: "#2A1E16",
    collar: true,
    number: "0427",
  },
};

export const VENDEUSE: CharacterSpec = {
  id: "vendeuse",
  label: "La vendeuse de bouillie (figurante, rêverie)",
  skin: "#6E4129",
  skinShade: "#53301D",
  hair: "headwrap",
  wrapColor: "#E07A2E",
  hairColor: DECOR.hair,
  beard: "none",
  shoulderHalf: 62,
  waistHalf: 58,
  belly: 10,
  headRx: 60,
  headRy: 70,
  legLength: 235,
  accessories: [],
  outfit: {
    top: "#2E6FA8",
    topShade: "#245A8A",
    topPattern: "wax",
    patternColor: "#F2B23A",
    sleeves: "short",
    pants: "#E07A2E",
    pantsShade: "#C0621F",
    shoes: DECOR.sandal,
    collar: false,
    skirt: true,
  },
};

export const AICHA: CharacterSpec = {
  id: "aicha",
  label: "Aïcha — 28 ans, jeune active dynamique",
  skin: "#6A3E26",
  skinShade: "#4F2D1B",
  hair: "headwrap",
  wrapColor: BRAND.primary,
  hairColor: DECOR.hair,
  beard: "none",
  shoulderHalf: 60,
  waistHalf: 50,
  belly: 0,
  headRx: 60,
  headRy: 70,
  legLength: 242,
  accessories: ["watch"],
  outfit: {
    top: "#F2C14E",
    topShade: "#D9A434",
    topPattern: "wax",
    patternColor: "#E8743B",
    sleeves: "short",
    pants: "#1E293B",
    pantsShade: "#0F172A",
    shoes: DECOR.sandal,
    collar: false,
    skirt: true,
  },
};

export const KOFFI: CharacterSpec = {
  id: "koffi",
  label: "Koffi — 32 ans, jeune cadre souriant",
  skin: "#724329",
  skinShade: "#56311D",
  hair: "shortRound",
  hairColor: DECOR.hair,
  beard: "goatee",
  shoulderHalf: 68,
  waistHalf: 54,
  belly: 4,
  headRx: 64,
  headRy: 74,
  legLength: 248,
  accessories: ["watch"],
  outfit: {
    top: "#2563EB",
    topShade: "#1D4ED8",
    topPattern: "stripes",
    patternColor: "#60A5FA",
    sleeves: "long",
    pants: "#E2D5B8",
    pantsShade: "#C8B894",
    shoes: "#2A1E16",
    collar: true,
  },
  outfits: {
    pyjama: {
      top: "#0B6B4F",
      topShade: "#08523C",
      topPattern: "none",
      sleeves: "long",
      pants: "#1E293B",
      pantsShade: "#0F172A",
      shoes: DECOR.sandal,
      collar: true,
    },
  },
};

export const CAST = {
  senan: SENAN,
  demarcheur: DEMARCHEUR,
  zem: ZEM,
  vendeuse: VENDEUSE,
  aicha: AICHA,
  koffi: KOFFI,
} as const;
