import React from "react";
import { Composition, Folder } from "remotion";
import { CharacterSheet } from "./sheets/CharacterSheet";
import { ContactSheet, contactSheetSchema } from "./sheets/ContactSheet";
import { Scene1Objectif } from "./scenes/Scene1Objectif";
import { Scene2Depenses } from "./scenes/Scene2Depenses";
import { Scene3Choc } from "./scenes/Scene3Choc";
import { Scene4Reverie } from "./scenes/Scene4Reverie";
import { Scene5Stop } from "./scenes/Scene5Stop";
import { Scene6Demo } from "./scenes/Scene6Demo";
import { Scene7Conclusion } from "./scenes/Scene7Conclusion";
import { VobiAd } from "./VobiAd";
import { TOTAL_FRAMES, sceneFrames } from "./config/timeline";
import { VobiAdScript1 } from "./scripts/script1/VobiAdScript1";
import { Scene1Criteres } from "./scripts/script1/Scene1Criteres";
import { Scene2Inadaptees } from "./scripts/script1/Scene2Inadaptees";
import { Scene3Boucle } from "./scripts/script1/Scene3Boucle";
import { Scene4Probleme } from "./scripts/script1/Scene4Probleme";
import { Scene5Imagine } from "./scripts/script1/Scene5Imagine";
import { Scene6Demo as Script1Scene6Demo } from "./scripts/script1/Scene6Demo";
import { Scene7Conclusion as Script1Scene7Conclusion } from "./scripts/script1/Scene7Conclusion";
import { TOTAL_FRAMES as S1_TOTAL_FRAMES, sceneFrames as s1SceneFrames } from "./scripts/script1/timeline";
import { VobiAdScript2 } from "./scripts/script2/VobiAdScript2";
import { Scene1Augmentation } from "./scripts/script2/Scene1Augmentation";
import { Scene2LoyerTropCher } from "./scripts/script2/Scene2LoyerTropCher";
import { Scene3EmploiDuTemps } from "./scripts/script2/Scene3EmploiDuTemps";
import { Scene4Imagine as Script2Scene4Imagine } from "./scripts/script2/Scene4Imagine";
import { Scene5DepuisTonLit } from "./scripts/script2/Scene5DepuisTonLit";
import { Scene6Demo as Script2Scene6Demo } from "./scripts/script2/Scene6Demo";
import { Scene7Conclusion as Script2Scene7Conclusion } from "./scripts/script2/Scene7Conclusion";
import { TOTAL_FRAMES as S2_TOTAL_FRAMES, sceneFrames as s2SceneFrames } from "./scripts/script2/timeline";
import { VobiAdScript3 } from "./scripts/script3/VobiAdScript3";
import { Scene1CoupDeCoeur } from "./scripts/script3/Scene1CoupDeCoeur";
import { Scene2Calculs } from "./scripts/script3/Scene2Calculs";
import { Scene3Dilemme } from "./scripts/script3/Scene3Dilemme";
import { Scene4Visibilite } from "./scripts/script3/Scene4Visibilite";
import { Scene5Demo as Script3Scene5Demo } from "./scripts/script3/Scene5Demo";
import { Scene6Comparer } from "./scripts/script3/Scene6Comparer";
import { Scene7Conclusion as Script3Scene7Conclusion } from "./scripts/script3/Scene7Conclusion";
import { TOTAL_FRAMES as S3_TOTAL_FRAMES, sceneFrames as s3SceneFrames } from "./scripts/script3/timeline";
import { VobiAdScript4 } from "./scripts/script4/VobiAdScript4";
import { Scene4ManqueDeChoix } from "./scripts/script4/Scene4ManqueDeChoix";
import { Scene6PlusDOffres } from "./scripts/script4/Scene6PlusDOffres";
import { TOTAL_FRAMES as S4_TOTAL_FRAMES, sceneFrames as s4SceneFrames } from "./scripts/script4/timeline";
import { VobiAdScript6 } from "./scripts/script6/VobiAdScript6";
import { Scene1CourPartagee } from "./scripts/script6/Scene1CourPartagee";
import { Scene2ConflitsCour } from "./scripts/script6/Scene2ConflitsCour";
import { Scene3BruitSommeil } from "./scripts/script6/Scene3BruitSommeil";
import { Scene4CourPrivee } from "./scripts/script6/Scene4CourPrivee";
import { Scene5TropEloignees } from "./scripts/script6/Scene5TropEloignees";
import { Scene6Demo as Script6Scene6Demo } from "./scripts/script6/Scene6Demo";
import { Scene7Conclusion as Script6Scene7Conclusion } from "./scripts/script6/Scene7Conclusion";
import { TOTAL_FRAMES as S6_TOTAL_FRAMES, sceneFrames as s6SceneFrames } from "./scripts/script6/timeline";
import { VobiAdScript7 } from "./scripts/script7/VobiAdScript7";
import { Scene1MaisonModerne } from "./scripts/script7/Scene1MaisonModerne";
import { Scene2Realite } from "./scripts/script7/Scene2Realite";
import { Scene3QuestionPrix } from "./scripts/script7/Scene3QuestionPrix";
import { Scene4OffresLimitees } from "./scripts/script7/Scene4OffresLimitees";
import { Scene5Demo as Script7Scene5Demo } from "./scripts/script7/Scene5Demo";
import { Scene6PlusOblige } from "./scripts/script7/Scene6PlusOblige";
import { Scene7Conclusion as Script7Scene7Conclusion } from "./scripts/script7/Scene7Conclusion";
import { TOTAL_FRAMES as S7_TOTAL_FRAMES, sceneFrames as s7SceneFrames } from "./scripts/script7/timeline";
import { VobiAdScript1V2 } from "./scripts/v2/script1/VobiAdScript1V2";
import { TOTAL_FRAMES as V2_S1_TOTAL_FRAMES } from "./scripts/v2/script1/timeline";
import { VobiAdScript2V2 } from "./scripts/v2/script2/VobiAdScript2V2";
import { TOTAL_FRAMES as V2_S2_TOTAL_FRAMES } from "./scripts/v2/script2/timeline";
import { VobiAdScript3V2 } from "./scripts/v2/script3/VobiAdScript3V2";
import { TOTAL_FRAMES as V2_S3_TOTAL_FRAMES } from "./scripts/v2/script3/timeline";
import { VobiAdScript4V2 } from "./scripts/v2/script4/VobiAdScript4V2";
import { TOTAL_FRAMES as V2_S4_TOTAL_FRAMES } from "./scripts/v2/script4/timeline";
import { VobiAdScript6V2 } from "./scripts/v2/script6/VobiAdScript6V2";
import { TOTAL_FRAMES as V2_S6_TOTAL_FRAMES } from "./scripts/v2/script6/timeline";

/**
 * Remotion Studio — Script 5 « 50 000 FCFA de loyer… et 10 000 FCFA déjà dépensés »
 * Format : 1080 × 1920 (9:16), 30 fps. Durées = src/config/timeline.ts.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vidéo finale à exporter : 1080 × 1920, 30 fps */}
      <Composition id="VobiAd-Script5" component={VobiAd} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      <Folder name="Scenes-Script5">
        <Composition id="S1-Objectif" component={Scene1Objectif} durationInFrames={sceneFrames("S1-Objectif")} fps={30} width={1080} height={1920} defaultProps={{ style: { backgroundColor: "#0A0E1F" } }} />
        <Composition id="S2-Depenses" component={Scene2Depenses} durationInFrames={sceneFrames("S2-Depenses")} fps={30} width={1080} height={1920} defaultProps={{ style: { backgroundColor: "#F3D9A0" } }} />
        <Composition id="S3-Choc" component={Scene3Choc} durationInFrames={sceneFrames("S3-Choc")} fps={30} width={1080} height={1920} defaultProps={{ style: { backgroundColor: "#2A0A12" } }} />
        <Composition id="S4-Reverie" component={Scene4Reverie} durationInFrames={sceneFrames("S4-Reverie")} fps={30} width={1080} height={1920} defaultProps={{ style: { backgroundColor: "#3A2A20" } }} />
        <Composition id="S5-Stop" component={Scene5Stop} durationInFrames={sceneFrames("S5-Stop")} fps={30} width={1080} height={1920} defaultProps={{ style: { backgroundColor: "#F8FAFB" } }} />
        <Composition id="S6-Demo" component={Scene6Demo} durationInFrames={sceneFrames("S6-Demo")} fps={30} width={1080} height={1920} defaultProps={{ style: { backgroundColor: "#F8FAFB" } }} />
        <Composition id="S7-Conclusion" component={Scene7Conclusion} durationInFrames={sceneFrames("S7-Conclusion")} fps={30} width={1080} height={1920} defaultProps={{ style: { backgroundColor: "#F8FAFB" } }} />
      </Folder>
      {/* Script 1 : Zéro temps perdu, zéro dépense inutile */}
      <Composition id="VobiAd-Script1" component={VobiAdScript1} durationInFrames={S1_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      <Folder name="Scenes-Script1">
        <Composition id="S1-Criteres" component={Scene1Criteres} durationInFrames={s1SceneFrames("S1-Criteres")} fps={30} width={1080} height={1920} />
        <Composition id="S2-Inadaptees" component={Scene2Inadaptees} durationInFrames={s1SceneFrames("S2-Inadaptees")} fps={30} width={1080} height={1920} />
        <Composition id="S3-Boucle" component={Scene3Boucle} durationInFrames={s1SceneFrames("S3-Boucle")} fps={30} width={1080} height={1920} />
        <Composition id="S4-Probleme" component={Scene4Probleme} durationInFrames={s1SceneFrames("S4-Probleme")} fps={30} width={1080} height={1920} />
        <Composition id="S5-Imagine" component={Scene5Imagine} durationInFrames={s1SceneFrames("S5-Imagine")} fps={30} width={1080} height={1920} />
        <Composition id="S6-Demo-S1" component={Script1Scene6Demo} durationInFrames={s1SceneFrames("S6-Demo")} fps={30} width={1080} height={1920} />
        <Composition id="S7-Conclusion-S1" component={Script1Scene7Conclusion} durationInFrames={s1SceneFrames("S7-Conclusion")} fps={30} width={1080} height={1920} />
      </Folder>
      {/* Script 2 : Les logements viennent à toi */}
      <Composition id="VobiAd-Script2" component={VobiAdScript2} durationInFrames={S2_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      <Folder name="Scenes-Script2">
        <Composition id="S1-Augmentation" component={Scene1Augmentation} durationInFrames={s2SceneFrames("S1-Augmentation")} fps={30} width={1080} height={1920} />
        <Composition id="S2-LoyerTropCher" component={Scene2LoyerTropCher} durationInFrames={s2SceneFrames("S2-LoyerTropCher")} fps={30} width={1080} height={1920} />
        <Composition id="S3-EmploiDuTemps" component={Scene3EmploiDuTemps} durationInFrames={s2SceneFrames("S3-EmploiDuTemps")} fps={30} width={1080} height={1920} />
        <Composition id="S4-Imagine-S2" component={Script2Scene4Imagine} durationInFrames={s2SceneFrames("S4-Imagine")} fps={30} width={1080} height={1920} />
        <Composition id="S5-DepuisTonLit" component={Scene5DepuisTonLit} durationInFrames={s2SceneFrames("S5-DepuisTonLit")} fps={30} width={1080} height={1920} />
        <Composition id="S6-Demo-S2" component={Script2Scene6Demo} durationInFrames={s2SceneFrames("S6-Demo")} fps={30} width={1080} height={1920} />
        <Composition id="S7-Conclusion-S2" component={Script2Scene7Conclusion} durationInFrames={s2SceneFrames("S7-Conclusion")} fps={30} width={1080} height={1920} />
      </Folder>
      {/* Script 3 : La maison qui plaît, le loyer qui pèse (version A) */}
      <Composition id="VobiAd-Script3" component={VobiAdScript3} durationInFrames={S3_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      <Folder name="Scenes-Script3">
        <Composition id="S1-CoupDeCoeur" component={Scene1CoupDeCoeur} durationInFrames={s3SceneFrames("S1-CoupDeCoeur")} fps={30} width={1080} height={1920} />
        <Composition id="S2-Calculs" component={Scene2Calculs} durationInFrames={s3SceneFrames("S2-Calculs")} fps={30} width={1080} height={1920} />
        <Composition id="S3-Dilemme" component={Scene3Dilemme} durationInFrames={s3SceneFrames("S3-Dilemme")} fps={30} width={1080} height={1920} />
        <Composition id="S4-Visibilite" component={Scene4Visibilite} durationInFrames={s3SceneFrames("S4-Visibilite")} fps={30} width={1080} height={1920} />
        <Composition id="S5-Demo-S3" component={Script3Scene5Demo} durationInFrames={s3SceneFrames("S5-Demo")} fps={30} width={1080} height={1920} />
        <Composition id="S6-Comparer" component={Scene6Comparer} durationInFrames={s3SceneFrames("S6-Comparer")} fps={30} width={1080} height={1920} />
        <Composition id="S7-Conclusion-S3" component={Script3Scene7Conclusion} durationInFrames={s3SceneFrames("S7-Conclusion")} fps={30} width={1080} height={1920} />
      </Folder>
      {/* Script 4 : La maison qui plaît, le loyer qui pèse (version B) */}
      <Composition id="VobiAd-Script4" component={VobiAdScript4} durationInFrames={S4_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      <Folder name="Scenes-Script4">
        <Composition id="S4-ManqueDeChoix" component={Scene4ManqueDeChoix} durationInFrames={s4SceneFrames("S4-ManqueDeChoix")} fps={30} width={1080} height={1920} />
        <Composition id="S6-PlusDOffres" component={Scene6PlusDOffres} durationInFrames={s4SceneFrames("S6-PlusDOffres")} fps={30} width={1080} height={1920} />
      </Folder>
      {/* Script 6 : La cour partagée */}
      <Composition id="VobiAd-Script6" component={VobiAdScript6} durationInFrames={S6_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      <Folder name="Scenes-Script6">
        <Composition id="S1-CourPartagee" component={Scene1CourPartagee} durationInFrames={s6SceneFrames("S1-CourPartagee")} fps={30} width={1080} height={1920} />
        <Composition id="S2-ConflitsCour" component={Scene2ConflitsCour} durationInFrames={s6SceneFrames("S2-ConflitsCour")} fps={30} width={1080} height={1920} />
        <Composition id="S3-BruitSommeil" component={Scene3BruitSommeil} durationInFrames={s6SceneFrames("S3-BruitSommeil")} fps={30} width={1080} height={1920} />
        <Composition id="S4-CourPrivee" component={Scene4CourPrivee} durationInFrames={s6SceneFrames("S4-CourPrivee")} fps={30} width={1080} height={1920} />
        <Composition id="S5-TropEloignees" component={Scene5TropEloignees} durationInFrames={s6SceneFrames("S5-TropEloignees")} fps={30} width={1080} height={1920} />
        <Composition id="S6-Demo-S6" component={Script6Scene6Demo} durationInFrames={s6SceneFrames("S6-Demo")} fps={30} width={1080} height={1920} />
        <Composition id="S7-Conclusion-S6" component={Script6Scene7Conclusion} durationInFrames={s6SceneFrames("S7-Conclusion")} fps={30} width={1080} height={1920} />
      </Folder>
      {/* Script 7 : La maison moderne dont tu rêves */}
      <Composition id="VobiAd-Script7" component={VobiAdScript7} durationInFrames={S7_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      <Folder name="Scenes-Script7">
        <Composition id="S1-MaisonModerne" component={Scene1MaisonModerne} durationInFrames={s7SceneFrames("S1-MaisonModerne")} fps={30} width={1080} height={1920} />
        <Composition id="S2-Realite" component={Scene2Realite} durationInFrames={s7SceneFrames("S2-Realite")} fps={30} width={1080} height={1920} />
        <Composition id="S3-QuestionPrix" component={Scene3QuestionPrix} durationInFrames={s7SceneFrames("S3-QuestionPrix")} fps={30} width={1080} height={1920} />
        <Composition id="S4-OffresLimitees" component={Scene4OffresLimitees} durationInFrames={s7SceneFrames("S4-OffresLimitees")} fps={30} width={1080} height={1920} />
        <Composition id="S5-Demo-S7" component={Script7Scene5Demo} durationInFrames={s7SceneFrames("S5-Demo")} fps={30} width={1080} height={1920} />
        <Composition id="S6-PlusOblige" component={Scene6PlusOblige} durationInFrames={s7SceneFrames("S6-PlusOblige")} fps={30} width={1080} height={1920} />
        <Composition id="S7-Conclusion-S7" component={Script7Scene7Conclusion} durationInFrames={s7SceneFrames("S7-Conclusion")} fps={30} width={1080} height={1920} />
      </Folder>
      {/* V2 — Nouveaux décors, nouveaux personnages, rythme posé, fin « VOBI bientôt disponible » */}
      <Folder name="V2">
        <Composition id="VobiAd-Script1-V2" component={VobiAdScript1V2} durationInFrames={V2_S1_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
        <Composition id="VobiAd-Script2-V2" component={VobiAdScript2V2} durationInFrames={V2_S2_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
        <Composition id="VobiAd-Script3-V2" component={VobiAdScript3V2} durationInFrames={V2_S3_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
        <Composition id="VobiAd-Script4-V2" component={VobiAdScript4V2} durationInFrames={V2_S4_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
        <Composition id="VobiAd-Script6-V2" component={VobiAdScript6V2} durationInFrames={V2_S6_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="References">
        <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="ContactSheet" component={ContactSheet} schema={contactSheetSchema} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={{ scene: "S1-Objectif", frames: [0, 15, 30, 45, 60, 75, 90, 105, 118] }} />
      </Folder>
    </>
  );
};
