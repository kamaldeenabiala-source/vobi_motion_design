import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1Augmentation } from "./Scene1Augmentation";
import { Scene2LoyerTropCher } from "./Scene2LoyerTropCher";
import { Scene3EmploiDuTemps } from "./Scene3EmploiDuTemps";
import { Scene4Imagine } from "./Scene4Imagine";
import { Scene5DepuisTonLit } from "./Scene5DepuisTonLit";
import { Scene6Demo } from "./Scene6Demo";
import { Scene7Conclusion } from "./Scene7Conclusion";
import { MusicBed } from "./Music";
import { sceneFrames } from "./timeline";

/**
 * PUB COMPLÈTE V2 — Script 2 « Les logements viennent à toi »
 * Personnage : Koffi · Nouveaux décors · Rythme posé · Fin « VOBI bientôt disponible »
 */
export const VobiAdScript2V2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Scène 1 — Augmentation" durationInFrames={sceneFrames("S1-Augmentation")}>
        <Scene1Augmentation style={{ backgroundColor: "#F4EFE6" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 2 — Loyers trop chers" durationInFrames={sceneFrames("S2-LoyerTropCher")}>
        <Scene2LoyerTropCher style={{ backgroundColor: "#E0F2FE" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 3 — Emploi du temps" durationInFrames={sceneFrames("S3-EmploiDuTemps")}>
        <Scene3EmploiDuTemps style={{ backgroundColor: "#E0F2FE" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 4 — Imagine" durationInFrames={sceneFrames("S4-Imagine")}>
        <Scene4Imagine style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 5 — Depuis chez soi" durationInFrames={sceneFrames("S5-DepuisTonLit")}>
        <Scene5DepuisTonLit style={{ backgroundColor: "#F4EFE6" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 6 — Démonstration VOBI" durationInFrames={sceneFrames("S6-Demo")}>
        <Scene6Demo style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 7 — VOBI bientôt disponible" durationInFrames={sceneFrames("S7-Conclusion")}>
        <Scene7Conclusion style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
    </Series>
    <MusicBed />
  </AbsoluteFill>
);
