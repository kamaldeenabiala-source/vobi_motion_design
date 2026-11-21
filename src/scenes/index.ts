import { Scene1Objectif } from "./Scene1Objectif";
import { Scene2Depenses } from "./Scene2Depenses";
import { Scene3Choc } from "./Scene3Choc";
import { Scene4Reverie } from "./Scene4Reverie";
import { Scene5Stop } from "./Scene5Stop";
import { Scene6Demo } from "./Scene6Demo";
import { Scene7Conclusion } from "./Scene7Conclusion";

/** Registre des scènes (utilisé par la planche contact). */
export const SCENE_COMPONENTS = {
  "S1-Objectif": Scene1Objectif,
  "S2-Depenses": Scene2Depenses,
  "S3-Choc": Scene3Choc,
  "S4-Reverie": Scene4Reverie,
  "S5-Stop": Scene5Stop,
  "S6-Demo": Scene6Demo,
  "S7-Conclusion": Scene7Conclusion,
} as const;
