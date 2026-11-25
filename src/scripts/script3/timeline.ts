import voTimings from "./vo-timings.generated.json";
import { VIDEO } from "../../config/video";
import type { GenericVoLine } from "../../audio/VoiceOver";

/**
 * SOURCE UNIQUE DE TIMING — Script 3 « La maison qui plaît, le loyer qui pèse (version A) »
 * 7 scènes bout à bout (format 1080 × 1920, 30 fps).
 */
export const SCENES = [
  { id: "S1-CoupDeCoeur", title: "La maison plaît, le loyer pèse", seconds: 6.5 },
  { id: "S2-Calculs", title: "Faire des calculs tout le mois", seconds: 12.5 },
  { id: "S3-Dilemme", title: "Le dilemme : accepter ou chercher", seconds: 13.5 },
  { id: "S4-Visibilite", title: "Pas encore découvert — s'informer", seconds: 16.5 },
  { id: "S5-Demo", title: "Découvrir & voir les loyers sur VOBI", seconds: 11.5 },
  { id: "S6-Comparer", title: "Comparer sans sacrifier ses dépenses", seconds: 7.5 },
  { id: "S7-Conclusion", title: "Conclusion & signature", seconds: 7.0 },
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
    scene: "S1-CoupDeCoeur",
    at: 0.3,
    text: "Tu as trouvé une maison qui te plaît, mais son loyer risque de peser sur ton budget à la fin du mois. Que faire ?",
    subs: [
      "Une maison te plaît,",
      "mais son loyer pèse sur ton budget.",
      "Que faire ?",
    ],
  },
  {
    id: "vo02",
    scene: "S2-Calculs",
    at: 0.3,
    text: "C’est vrai, la maison te plaît. Tu as envie de t’y installer, mais tu sais aussi que tu as d’autres dépenses à gérer.",
    subs: [
      "Tu as envie de t’y installer,",
      "mais tu as d’autres dépenses à gérer.",
    ],
  },
  {
    id: "vo03",
    scene: "S2-Calculs",
    at: 6.4,
    text: "Tu ne veux pas passer tout ton mois à payer le loyer et te retrouver à faire des calculs chaque fois que tu dois acheter quelque chose.",
    subs: [
      "Tu ne veux pas faire des calculs",
      "chaque fois que tu dois acheter quelque chose.",
    ],
  },
  {
    id: "vo04",
    scene: "S3-Dilemme",
    at: 0.3,
    text: "D’un autre côté, tu n’as pas envie de choisir une maison qui ne te plaît pas simplement parce qu’elle coûte moins cher.",
    subs: [
      "Tu n’as pas envie d’une maison",
      "qui ne te plaît pas juste par prix.",
    ],
  },
  {
    id: "vo05",
    scene: "S3-Dilemme",
    at: 5.9,
    text: "Alors, tu hésites. Est-ce que tu dois accepter cette maison et réduire certaines dépenses ? Ou continuer à chercher en espérant trouver mieux ?",
    subs: [
      "Alors, tu hésites :",
      "réduire tes dépenses ou continuer à chercher ?",
    ],
  },
  {
    id: "vo06",
    scene: "S4-Visibilite",
    at: 0.3,
    text: "Le plus difficile, c’est que tu ne sais pas toujours quelles autres maisons sont disponibles. Peut-être qu’il existe un logement qui te plaît autant, avec un loyer plus adapté à ton budget, mais tu ne l’as tout simplement pas encore découvert.",
    subs: [
      "Tu ne sais pas quelles autres maisons existent.",
      "Le bon logement existe peut-être,",
      "mais tu ne l’as pas encore découvert.",
    ],
  },
  {
    id: "vo07",
    scene: "S4-Visibilite",
    at: 11.1,
    text: "C’est justement pour avoir plus de choix qu’il est important de bien s’informer avant de prendre une décision.",
    subs: [
      "Pour avoir plus de choix,",
      "informe-toi avant de décider.",
    ],
  },
  {
    id: "vo08",
    scene: "S5-Demo",
    at: 0.3,
    text: "Avec VOBI, tu peux découvrir différentes offres de logement, voir les loyers et comparer les maisons avant de faire ton choix.",
    subs: [
      "Avec VOBI, découvre les offres,",
      "vois les loyers et compare avant de choisir.",
    ],
  },
  {
    id: "vo09",
    scene: "S5-Demo",
    at: 6.2,
    text: "Tu n’es donc plus obligé de te limiter aux quelques maisons qu’on t’a proposées ou que tu as eu l’occasion de visiter.",
    subs: [
      "Ne te limite plus aux quelques maisons",
      "qu’on t’a proposées ou visitées.",
    ],
  },
  {
    id: "vo10",
    scene: "S6-Comparer",
    at: 0.3,
    text: "Prends le temps de regarder les possibilités, de comparer et de choisir une maison dans laquelle tu te sentiras bien, sans mettre toutes tes dépenses de côté.",
    subs: [
      "Compare et choisis une maison",
      "où tu te sentiras bien,",
      "sans mettre tes dépenses de côté.",
    ],
  },
  {
    id: "vo11",
    scene: "S7-Conclusion",
    at: 0.3,
    text: "Avec VOBI, tu peux trouver une maison qui te plaît sans laisser son loyer vider tes poches.",
    subs: [
      "Avec VOBI, trouve une maison qui te plaît",
      "sans laisser son loyer vider tes poches.",
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
