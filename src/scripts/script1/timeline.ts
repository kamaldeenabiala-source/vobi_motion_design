import voTimings from "./vo-timings.generated.json";
import { VIDEO } from "../../config/video";
import type { GenericVoLine } from "../../audio/VoiceOver";

/**
 * SOURCE UNIQUE DE TIMING — Script 1 « Zéro temps perdu, zéro dépense inutile »
 *
 * 7 scènes bout à bout (format 1080 × 1920, 30 fps).
 */
export const SCENES = [
  { id: "S1-Criteres", title: "Budget & critères", seconds: 7.5 },
  { id: "S2-Inadaptees", title: "Offres hors budget ou inadaptées", seconds: 8.5 },
  { id: "S3-Boucle", title: "Visites & dépenses sans résultat", seconds: 10.5 },
  { id: "S4-Probleme", title: "Le manque d'informations", seconds: 9.5 },
  { id: "S5-Imagine", title: "Imagine depuis chez toi", seconds: 17.0 },
  { id: "S6-Demo", title: "Zéro temps perdu — Démo VOBI", seconds: 14.5 },
  { id: "S7-Conclusion", title: "Conclusion & appel à l'action", seconds: 8.5 },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const sceneFrames = (id: SceneId) =>
  Math.round(SCENES.find((s) => s.id === id)!.seconds * VIDEO.fps);

export const sceneStart = (id: SceneId) => {
  let f = 0;
  for (const s of SCENES) {
    if (s.id === id) return f;
    f += Math.round(s.seconds * VIDEO.fps);
  }
  throw new Error(`Scène inconnue ${id}`);
};

export const TOTAL_FRAMES = SCENES.reduce(
  (acc, s) => acc + Math.round(s.seconds * VIDEO.fps),
  0,
);

export type VoLine = GenericVoLine & {
  id: keyof typeof voTimings;
  scene: SceneId;
};

export const VO_LINES: VoLine[] = [
  {
    id: "vo01",
    scene: "S1-Criteres",
    at: 0.3,
    text: "Tu as prévu un budget pour louer une maison. Tu sais également à peu près ce que tu recherches : le nombre de chambres, l’environnement idéal…",
    subs: [
      "Tu as prévu un budget pour louer une maison.",
      "Tu sais ce que tu recherches :",
      "le nombre de chambres, l’environnement idéal…",
    ],
  },
  {
    id: "vo02",
    scene: "S2-Inadaptees",
    at: 0.3,
    text: "Pourtant, lorsque tu commences tes recherches, tu trouves des maisons dont le loyer dépasse ton budget. D’autres correspondent à ton budget, mais ne répondent pas à tes attentes.",
    subs: [
      "Pourtant, tu trouves des maisons",
      "dont le loyer dépasse ton budget.",
      "D’autres correspondent à ton budget,",
      "mais ne répondent pas à tes attentes.",
    ],
  },
  {
    id: "vo03",
    scene: "S3-Boucle",
    at: 0.3,
    text: "Alors, tu continues de chercher. Tu contactes des démarcheurs, tu visites des logements, tu dépenses de l’argent pour te déplacer, tu paies les démarches… et tout ça, parfois, sans aucun résultat.",
    subs: [
      "Alors, tu continues de chercher.",
      "Tu contactes des démarcheurs,",
      "tu visites des logements,",
      "tu paies transports et démarches…",
      "parfois, sans aucun résultat.",
    ],
  },
  {
    id: "vo04",
    scene: "S4-Probleme",
    at: 0.3,
    text: "Le problème, ce n’est pas forcément que le logement que tu recherches n’existe pas. C’est surtout que tu ne disposes pas de suffisamment d’informations pour bien orienter tes recherches.",
    subs: [
      "Le problème, ce n’est pas",
      "que le logement n’existe pas.",
      "C’est que tu manques d’informations",
      "pour bien orienter tes recherches.",
    ],
  },
  {
    id: "vo05",
    scene: "S5-Imagine",
    at: 0.4,
    text: "Imagine que tu puisses, depuis chez toi, avoir accès à plusieurs logements disponibles, dans le quartier que tu souhaites, la ville que tu préfères et l’environnement qui te convient.",
    subs: [
      "Imagine avoir accès depuis chez toi",
      "à plusieurs logements disponibles,",
      "dans le quartier, la ville",
      "et l’environnement qui te convient.",
    ],
  },
  {
    id: "vo06",
    scene: "S5-Imagine",
    at: 8.3,
    text: "Imagine que tu n’aies plus besoin de payer un démarcheur pour chaque recherche et que tu puisses même inspecter un logement, vérifier s’il te convient, avant de te déplacer pour le visiter.",
    subs: [
      "Plus besoin de payer un démarcheur",
      "pour chaque recherche :",
      "tu peux inspecter et vérifier",
      "avant de te déplacer.",
    ],
  },
  {
    id: "vo07",
    scene: "S6-Demo",
    at: 0.2,
    text: "Zéro temps perdu. Zéro dépense inutile.",
    subs: ["Zéro temps perdu.", "Zéro dépense inutile."],
  },
  {
    id: "vo08",
    scene: "S6-Demo",
    at: 3.6,
    text: "C’est dans cette logique que VOBI a été conçue.",
    subs: ["C’est dans cette logique que VOBI a été conçue."],
  },
  {
    id: "vo09",
    scene: "S6-Demo",
    at: 6.2,
    text: "Avec VOBI, tu peux découvrir plusieurs possibilités de logement, consulter les offres et choisir selon tes critères, notamment ton budget et tes attentes.",
    subs: [
      "Avec VOBI, découvre plusieurs offres,",
      "consulte les logements et choisis",
      "selon ton budget et tes attentes.",
    ],
  },
  {
    id: "vo10",
    scene: "S7-Conclusion",
    at: 0.4,
    text: "Avec VOBI, tu peux enfin chercher ton logement plus facilement, sans multiplier les déplacements inutiles.",
    subs: [
      "Avec VOBI, cherche plus facilement,",
      "sans multiplier les déplacements inutiles.",
    ],
  },
];

/** Fenêtre [startFrame, endFrame] absolue d'une réplique (pour le ducking). */
export const voSpeechWindow = (l: VoLine) => {
  const s0 = sceneStart(l.scene);
  const t = voTimings[l.id];
  return {
    start: s0 + Math.round((l.at + t.speechStartSec) * VIDEO.fps),
    end: s0 + Math.round((l.at + t.speechEndSec) * VIDEO.fps),
  };
};
