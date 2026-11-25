import voTimings from "./vo-timings.generated.json";
import { VIDEO } from "../../config/video";
import type { GenericVoLine } from "../../audio/VoiceOver";

/**
 * SOURCE UNIQUE DE TIMING — Script 7 « La maison moderne dont tu rêves »
 * 7 scènes bout à bout (format 1080 × 1920, 30 fps).
 */
export const SCENES = [
  { id: "S1-MaisonModerne", title: "Le rêve d'une maison moderne", seconds: 15.5 },
  { id: "S2-Realite", title: "Trop chères ou loin du rêve", seconds: 11.0 },
  { id: "S3-QuestionPrix", title: "Faut-il dépenser beaucoup ?", seconds: 6.0 },
  { id: "S4-OffresLimitees", title: "Pas forcément : offres limitées", seconds: 12.0 },
  { id: "S5-Demo", title: "Démonstration VOBI", seconds: 13.5 },
  { id: "S6-PlusOblige", title: "Comparer goûts & moyens", seconds: 5.0 },
  { id: "S7-Conclusion", title: "Conclusion & clôture", seconds: 9.5 },
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
    scene: "S1-MaisonModerne",
    at: 0.3,
    text: "Tu rêves d’une maison moderne, avec un beau salon, une cuisine bien aménagée, de belles chambres et un cadre agréable où tu prends plaisir à rentrer chaque soir.",
    subs: [
      "Tu rêves d’une maison moderne :",
      "beau salon, cuisine aménagée,",
      "belles chambres et cadre agréable.",
    ],
  },
  {
    id: "vo02",
    scene: "S1-MaisonModerne",
    at: 7.7,
    text: "Tu as déjà quelques idées de la maison dans laquelle tu aimerais vivre. Peut-être même que tu as enregistré quelques photos de maisons qui te plaisent sur ton téléphone.",
    subs: [
      "Tu as déjà des idées",
      "et même enregistré quelques photos",
      "sur ton téléphone.",
    ],
  },
  {
    id: "vo03",
    scene: "S2-Realite",
    at: 0.3,
    text: "Mais quand tu commences à chercher, la réalité est parfois différente.",
    subs: ["Mais quand tu cherches,", "la réalité est parfois différente."],
  },
  {
    id: "vo04",
    scene: "S2-Realite",
    at: 4.0,
    text: "Les maisons qui correspondent à tes goûts sont souvent trop chères. Et celles qui entrent dans ton budget ne ressemblent pas vraiment à ce que tu recherches.",
    subs: [
      "Celles qui te plaisent sont trop chères.",
      "Celles de ton budget ne ressemblent pas",
      "à ce que tu recherches.",
    ],
  },
  {
    id: "vo05",
    scene: "S3-QuestionPrix",
    at: 0.3,
    text: "Tu finis alors par te demander : est-ce qu’il faut forcément dépenser beaucoup d’argent pour avoir une maison qui me plaît ?",
    subs: [
      "Faut-il forcément dépenser beaucoup",
      "pour avoir une maison qui plaît ?",
    ],
  },
  {
    id: "vo06",
    scene: "S4-OffresLimitees",
    at: 0.3,
    text: "Pas forcément ! Le problème, c’est que tes offres sont limitées.",
    subs: ["Pas forcément !", "Le problème : tes offres sont limitées."],
  },
  {
    id: "vo07",
    scene: "S4-OffresLimitees",
    at: 4.4,
    text: "Tu cherches entre tes proches, entre des annonces, entre des on-dit. Pourtant, le marché compte plusieurs logements, dont certains adaptés à tes besoins.",
    subs: [
      "Proches, annonces, on-dit…",
      "Pourtant le marché compte",
      "des logements adaptés à tes besoins.",
    ],
  },
  {
    id: "vo08",
    scene: "S5-Demo",
    at: 0.3,
    text: "Avec VOBI, tu peux consulter plusieurs offres de logement, choisir ton budget, la ville, le quartier et le nombre de chambres que tu souhaites.",
    subs: [
      "Avec VOBI, consulte plusieurs offres :",
      "budget, ville, quartier et chambres.",
    ],
  },
  {
    id: "vo09",
    scene: "S5-Demo",
    at: 7.0,
    text: "Tu peux prendre le temps de regarder les maisons, comparer les offres et découvrir celles qui correspondent le mieux à tes goûts et à tes moyens.",
    subs: [
      "Compare et découvre celles qui collent",
      "à tes goûts et à tes moyens.",
    ],
  },
  {
    id: "vo10",
    scene: "S6-PlusOblige",
    at: 0.3,
    text: "Tu n’es plus obligé de choisir parmi les quelques maisons que tu as eu l’occasion de voir.",
    subs: [
      "Ne te limite plus aux quelques maisons",
      "que tu as eu l’occasion de voir.",
    ],
  },
  {
    id: "vo11",
    scene: "S7-Conclusion",
    at: 0.3,
    text: "Ta maison idéale existe peut-être déjà. Encore faut-il pouvoir la trouver ! Découvre plus de logements avec VOBI.",
    subs: [
      "Ta maison idéale existe peut-être déjà.",
      "Découvre plus de logements avec VOBI.",
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
