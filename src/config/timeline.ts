import voTimings from "../audio/vo-timings.generated.json";
import { VIDEO } from "./video";

/**
 * SOURCE UNIQUE DE TIMING — Script 5 « 50 000 FCFA de loyer… et 10 000 FCFA déjà dépensés »
 *
 * Les scènes s'enchaînent bout à bout (pas de chevauchement) : les transitions
 * sont jouées à l'intérieur des scènes ou en surcouche. Changer une durée ici
 * recale automatiquement la vidéo complète, l'audio et les sous-titres.
 */
export const SCENES = [
  { id: "S1-Objectif", title: "L'objectif : 50 000 FCFA", seconds: 4 },
  { id: "S2-Depenses", title: "Les dépenses s'accumulent", seconds: 10 },
  { id: "S3-Choc", title: "Le choc : 10 000 FCFA", seconds: 3 },
  { id: "S4-Reverie", title: "La rêverie", seconds: 10 },
  { id: "S5-Stop", title: "VOBI dit STOP", seconds: 4 },
  { id: "S6-Demo", title: "Démonstration VOBI", seconds: 20.5 },
  { id: "S7-Conclusion", title: "Conclusion & appel à l'action", seconds: 12.5 },
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

/**
 * Répliques de la voix off — texte du script 5, mot pour mot.
 * `at` = décalage (s) depuis le début de la scène.
 * `subs` = découpage des sous-titres (≤ 2 lignes courtes chacun).
 */
export type VoLine = {
  id: keyof typeof voTimings;
  scene: SceneId;
  at: number;
  text: string;
  subs: string[];
};

export const VO_LINES: VoLine[] = [
  {
    id: "vo01",
    scene: "S1-Objectif",
    at: 0.3,
    text: "Tu recherches une maison à 50 000 FCFA.",
    subs: ["Tu recherches une maison", "à 50 000 FCFA."],
  },
  {
    id: "vo02",
    scene: "S2-Depenses",
    at: 1.8,
    text: "Mais voilà, tu as déjà dépensé 10 000 FCFA entre les démarcheurs, les frais de transport pour les visites et les démarches…",
    subs: [
      "Mais voilà, tu as déjà dépensé",
      "10 000 FCFA",
      "entre les démarcheurs,",
      "les frais de transport",
      "pour les visites",
      "et les démarches…",
    ],
  },
  {
    id: "vo03",
    scene: "S3-Choc",
    at: 0.15,
    text: "Et toujours pas de maison !",
    subs: ["Et toujours pas de maison !"],
  },
  {
    id: "vo04",
    scene: "S4-Reverie",
    at: 0.3,
    text: "À ce rythme, on dirait que tu vas finir par vivre dans la rue !",
    subs: ["À ce rythme, on dirait que tu vas", "finir par vivre dans la rue !"],
  },
  {
    id: "vo05",
    scene: "S4-Reverie",
    at: 4.6,
    text: "Mais sérieusement, pourquoi dépenser autant d'argent juste pour chercher un logement ?",
    subs: [
      "Mais sérieusement,",
      "pourquoi dépenser autant d'argent",
      "juste pour chercher un logement ?",
    ],
  },
  {
    id: "vo06",
    scene: "S5-Stop",
    at: 0.5,
    text: "VOBI te dit STOP à tout ça !",
    subs: ["VOBI te dit STOP à tout ça !"],
  },
  {
    id: "vo07",
    scene: "S6-Demo",
    at: 0.2,
    text: "Découvre des milliers de possibilités de logement à travers le Bénin.",
    subs: ["Découvre des milliers", "de possibilités de logement", "à travers le Bénin."],
  },
  {
    id: "vo08",
    scene: "S6-Demo",
    at: 5.9,
    text: "Choisis la ville, le quartier, ton budget, le nombre de chambres et découvre les offres qui correspondent à tes recherches.",
    subs: [
      "Choisis la ville, le quartier,",
      "ton budget, le nombre de chambres",
      "et découvre les offres",
      "qui correspondent à tes recherches.",
    ],
  },
  {
    id: "vo09",
    scene: "S6-Demo",
    at: 13.2,
    text: "Avec VOBI, tu peux consulter les logements, comparer les offres et même vérifier certains détails avant de te déplacer pour une visite.",
    subs: [
      "Avec VOBI, tu peux",
      "consulter les logements,",
      "comparer les offres",
      "et même vérifier certains détails",
      "avant de te déplacer pour une visite.",
    ],
  },
  {
    id: "vo10",
    scene: "S7-Conclusion",
    at: 0.3,
    text: "Moins de déplacements inutiles, moins de dépenses et surtout, plus de possibilités de trouver la maison qu'il te faut.",
    subs: [
      "Moins de déplacements inutiles,",
      "moins de dépenses",
      "et surtout, plus de possibilités",
      "de trouver la maison qu'il te faut.",
    ],
  },
  {
    id: "vo11",
    scene: "S7-Conclusion",
    at: 7.9,
    text: "Alors, ça te tente ?",
    subs: ["Alors, ça te tente ?"],
  },
];

/** Début absolu (frame) d'une réplique dans la vidéo complète. */
export const voStartFrame = (l: VoLine) =>
  sceneStart(l.scene) + Math.round(l.at * VIDEO.fps);

/** Fenêtre de parole réelle (frames absolues) d'après la mesure du fichier. */
export const voSpeechWindow = (l: VoLine) => {
  const t = voTimings[l.id];
  const start = voStartFrame(l);
  return {
    start: start + Math.round(t.speechStartSec * VIDEO.fps),
    end: start + Math.round(t.speechEndSec * VIDEO.fps),
    fileFrames: Math.ceil(t.fileSec * VIDEO.fps),
  };
};
