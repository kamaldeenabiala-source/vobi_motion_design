import voTimings from "./vo-timings.generated.json";
import { VIDEO } from "../../config/video";
import type { GenericVoLine } from "../../audio/VoiceOver";

/**
 * SOURCE UNIQUE DE TIMING — Script 2 « Les logements viennent à toi »
 * 7 scènes bout à bout (format 1080 × 1920, 30 fps).
 */
export const SCENES = [
  { id: "S1-Augmentation", title: "Salaire augmenté & attentes", seconds: 11.5 },
  { id: "S2-LoyerTropCher", title: "Loyers trop chers & budget", seconds: 21.5 },
  { id: "S3-EmploiDuTemps", title: "Heures de travail & repos sacrifiés", seconds: 10.5 },
  { id: "S4-Imagine", title: "Imagine chercher autrement", seconds: 13.0 },
  { id: "S5-DepuisTonLit", title: "Comparer depuis son lit", seconds: 13.0 },
  { id: "S6-Demo", title: "Démonstration VOBI", seconds: 10.5 },
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
    scene: "S1-Augmentation",
    at: 0.3,
    text: "Ton patron a augmenté ton salaire.",
    subs: ["Ton patron a augmenté ton salaire."],
  },
  {
    id: "vo02",
    scene: "S1-Augmentation",
    at: 2.6,
    text: "Tu souhaites louer une maison qui te plaît, dans un environnement agréable, avec une école pour les enfants, une route pratique pour te rendre au travail, des marchés et des commerces à proximité.",
    subs: [
      "Tu souhaites louer une maison qui te plaît,",
      "avec une école, une route pratique,",
      "des marchés et des commerces à proximité.",
    ],
  },
  {
    id: "vo03",
    scene: "S2-LoyerTropCher",
    at: 0.3,
    text: "Mais il y a un problème. Les maisons qu’on te propose ou que tu découvres sont souvent trop chères.",
    subs: [
      "Mais il y a un problème.",
      "Les maisons qu’on te propose sont trop chères.",
    ],
  },
  {
    id: "vo04",
    scene: "S2-LoyerTropCher",
    at: 5.4,
    text: "Bien sûr, tu pourrais prendre l’une d’elles. Mais après avoir payé le loyer, est-ce qu’il te restera assez pour les autres dépenses : l’eau, l’électricité, la nourriture, le transport et tout le reste ?",
    subs: [
      "Après avoir payé le loyer,",
      "te restera-t-il assez pour l’eau,",
      "l’électricité, la nourriture, le transport…",
    ],
  },
  {
    id: "vo05",
    scene: "S2-LoyerTropCher",
    at: 15.4,
    text: "Tu cherches une maison qui correspond à tes moyens et qui te permet de bien vivre sans avoir à compter chaque franc à la fin du mois.",
    subs: [
      "Tu cherches une maison selon tes moyens,",
      "sans compter chaque franc à la fin du mois.",
    ],
  },
  {
    id: "vo06",
    scene: "S3-EmploiDuTemps",
    at: 0.3,
    text: "Alors, tu demandes à tes proches, tu prends des heures de travail pour aller chercher des logements. Même tes jours de repos sont utilisés pour les visites. Et tout ça, parfois, sans aucun résultat.",
    subs: [
      "Tu prends sur tes heures de travail",
      "et même sur tes jours de repos…",
      "et tout ça, parfois, sans aucun résultat.",
    ],
  },
  {
    id: "vo07",
    scene: "S4-Imagine",
    at: 0.3,
    text: "Imagine pouvoir chercher autrement ! Trouver des logements selon ton budget, dans la ville ou le quartier que tu souhaites, tout ça depuis chez toi.",
    subs: [
      "Imagine pouvoir chercher autrement !",
      "Selon ton budget, ta ville, ton quartier,",
      "tout ça depuis chez toi.",
    ],
  },
  {
    id: "vo08",
    scene: "S4-Imagine",
    at: 7.4,
    text: "Plus besoin de demander des heures de permission au travail ou de sacrifier tes jours de repos pour chercher une maison.",
    subs: [
      "Plus besoin de permission au travail",
      "ni de sacrifier tes jours de repos.",
    ],
  },
  {
    id: "vo09",
    scene: "S5-DepuisTonLit",
    at: 0.3,
    text: "Tu peux simplement t’allonger dans ton lit après une longue journée de travail, consulter les logements disponibles, comparer les offres et voir ceux qui correspondent à tes besoins.",
    subs: [
      "Allongé dans ton lit après le travail,",
      "consulte, compare les offres",
      "et vois celles qui te correspondent.",
    ],
  },
  {
    id: "vo10",
    scene: "S5-DepuisTonLit",
    at: 8.0,
    text: "En quelques heures, tu peux déjà découvrir plusieurs possibilités sans avoir à te déplacer partout.",
    subs: [
      "En quelques heures, découvre plusieurs offres",
      "sans te déplacer partout.",
    ],
  },
  {
    id: "vo11",
    scene: "S6-Demo",
    at: 0.3,
    text: "C’est dans cette logique que VOBI a été conçue. Avec VOBI, tu as accès à plusieurs possibilités de logement et tu peux faire tes recherches selon ton budget et tes critères, sans bouleverser ton emploi du temps.",
    subs: [
      "Avec VOBI, cherche selon ton budget",
      "et tes critères,",
      "sans bouleverser ton emploi du temps.",
    ],
  },
  {
    id: "vo12",
    scene: "S7-Conclusion",
    at: 0.3,
    text: "Avec VOBI, les logements viennent à toi, pas le contraire.",
    subs: ["Avec VOBI, les logements viennent à toi,", "pas le contraire."],
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
