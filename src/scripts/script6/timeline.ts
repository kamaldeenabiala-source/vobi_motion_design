import voTimings from "./vo-timings.generated.json";
import { VIDEO } from "../../config/video";
import type { GenericVoLine } from "../../audio/VoiceOver";

/**
 * SOURCE UNIQUE DE TIMING — Script 6 « La cour partagée »
 * 7 scènes bout à bout (format 1080 × 1920, 30 fps).
 */
export const SCENES = [
  { id: "S1-CourPartagee", title: "La cour partagée", seconds: 9.5 },
  { id: "S2-ConflitsCour", title: "Cris, linge, moto : cour encombrée", seconds: 19.5 },
  { id: "S3-BruitSommeil", title: "Le sommeil perturbé", seconds: 7.0 },
  { id: "S4-CourPrivee", title: "Le besoin d'une cour privée", seconds: 12.0 },
  { id: "S5-TropEloignees", title: "Maisons éloignées ou mauvais quartier", seconds: 12.5 },
  { id: "S6-Demo", title: "VOBI : découvrir plus de logements", seconds: 19.5 },
  { id: "S7-Conclusion", title: "Conclusion & signature", seconds: 6.5 },
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
    scene: "S1-CourPartagee",
    at: 0.3,
    text: "Tu vis dans une maison où la cour est partagée avec les voisins ?",
    subs: ["Tu vis dans une maison", "où la cour est partagée avec les voisins ?"],
  },
  {
    id: "vo02",
    scene: "S1-CourPartagee",
    at: 3.6,
    text: "Au début, tu te dis que ce n’est pas bien grave. Mais avec le temps, les petits problèmes commencent à s’accumuler.",
    subs: [
      "Au début, ce n’est pas bien grave.",
      "Mais avec le temps,",
      "les petits problèmes s’accumulent.",
    ],
  },
  {
    id: "vo03",
    scene: "S2-ConflitsCour",
    at: 0.3,
    text: "Les enfants des voisins jouent devant ta porte, les cris et les disputes entre enfants deviennent presque quotidiens. Tu veux laisser tes propres enfants jouer tranquillement, mais tu dois toujours faire attention à ne pas déranger les autres.",
    subs: [
      "Cris et disputes devant ta porte",
      "deviennent presque quotidiens.",
      "Toujours faire attention à ne pas déranger.",
    ],
  },
  {
    id: "vo04",
    scene: "S2-ConflitsCour",
    at: 10.7,
    text: "Parfois, tu ne peux même pas profiter tranquillement de la cour avec ta famille. Tu dois partager l’espace pour étendre ton linge, garer ta moto ou simplement t’asseoir un moment.",
    subs: [
      "Tu dois partager l’espace pour le linge,",
      "garer ta moto ou simplement t’asseoir.",
    ],
  },
  {
    id: "vo05",
    scene: "S3-BruitSommeil",
    at: 0.3,
    text: "Et quand tu veux te reposer, les bruits des voisins ne te facilitent pas toujours la tâche. Même les heures de sommeil ne sont pas épargnées !",
    subs: [
      "Les bruits des voisins ne facilitent rien.",
      "Même le sommeil n’est pas épargné !",
    ],
  },
  {
    id: "vo06",
    scene: "S4-CourPrivee",
    at: 0.3,
    text: "À force, tu commences à te dire qu’il est temps de trouver une maison avec une cour privée.",
    subs: ["Il est temps de trouver", "une maison avec une cour privée."],
  },
  {
    id: "vo07",
    scene: "S4-CourPrivee",
    at: 4.6,
    text: "Un espace où tes enfants pourront jouer librement, où tu pourras passer du temps avec ta famille et où chacun pourra profiter de son espace sans déranger les voisins.",
    subs: [
      "Un espace où tes enfants jouent librement",
      "et où chacun profite de son espace.",
    ],
  },
  {
    id: "vo08",
    scene: "S5-TropEloignees",
    at: 0.3,
    text: "Mais dans tes recherches, un autre problème se présente. Les maisons avec cour que tu trouves sont parfois trop éloignées de l’école des enfants, de ton lieu de travail ou des endroits que tu fréquentes. D’autres sont dans des quartiers qui ne te plaisent pas.",
    subs: [
      "Mais les maisons trouvées sont trop loin",
      "de l’école, du travail",
      "ou dans des quartiers qui ne plaisent pas.",
    ],
  },
  {
    id: "vo09",
    scene: "S6-Demo",
    at: 0.3,
    text: "VOBI te permet d’avoir la vie plus facile. Tu ne peux pas choisir une maison que tu ne connais même pas !",
    subs: [
      "VOBI te facilite la vie.",
      "On ne peut pas choisir une maison qu’on ne connaît pas !",
    ],
  },
  {
    id: "vo10",
    scene: "S6-Demo",
    at: 5.9,
    text: "Avec VOBI, tu peux découvrir davantage de logements disponibles, choisir la ville, le quartier, ton budget et les caractéristiques que tu recherches.",
    subs: [
      "Découvre davantage de logements :",
      "ville, quartier, budget et caractéristiques.",
    ],
  },
  {
    id: "vo11",
    scene: "S6-Demo",
    at: 13.2,
    text: "Tu as ainsi plus de possibilités de trouver une maison avec cour, bien située et adaptée aux besoins de toute ta famille.",
    subs: [
      "Trouve une maison avec cour,",
      "bien située pour toute ta famille.",
    ],
  },
  {
    id: "vo12",
    scene: "S7-Conclusion",
    at: 0.3,
    text: "Avec VOBI, découvre plus de logements pour trouver celui qui te convient vraiment.",
    subs: [
      "Avec VOBI, découvre plus de logements",
      "pour trouver celui qui te convient vraiment.",
    ],
  },
];

export const voSpeechWindow = (l: VoLine) => {
  const s0 = sceneStart(l.scene);
  const t = voTimings[l.id];
  return {
    start: s0 + Math.round((l.at + t.speechStartSec) * VIDEO.fps),
    end: s0 + Math.round((l.at + t.speechEndSec) * VIDEO.fps),
  };
};
