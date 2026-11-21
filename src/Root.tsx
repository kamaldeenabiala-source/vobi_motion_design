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
      <Folder name="References">
        <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="ContactSheet" component={ContactSheet} schema={contactSheetSchema} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={{ scene: "S1-Objectif", frames: [0, 15, 30, 45, 60, 75, 90, 105, 118] }} />
      </Folder>
    </>
  );
};
