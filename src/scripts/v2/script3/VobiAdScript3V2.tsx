import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1CoupDeCoeur } from "./Scene1CoupDeCoeur";
import { Scene2Calculs } from "./Scene2Calculs";
import { Scene3Dilemme } from "./Scene3Dilemme";
import { Scene4Visibilite } from "./Scene4Visibilite";
import { Scene5Demo } from "./Scene5Demo";
import { Scene6Comparer } from "./Scene6Comparer";
import { Scene7Conclusion } from "./Scene7Conclusion";
import { MusicBed } from "./Music";
import { sceneFrames } from "./timeline";

/**
 * PUB COMPLÈTE V2 — Script 3 « La maison qui plaît, le loyer qui pèse (vA) »
 * Personnage : Aïcha · Nouveaux décors · Rythme posé · Fin « VOBI bientôt disponible »
 */
export const VobiAdScript3V2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Scène 1 — Coup de cœur" durationInFrames={sceneFrames("S1-CoupDeCoeur")}>
        <Scene1CoupDeCoeur style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 2 — Calculs du mois" durationInFrames={sceneFrames("S2-Calculs")}>
        <Scene2Calculs style={{ backgroundColor: "#F4EFE6" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 3 — Le dilemme" durationInFrames={sceneFrames("S3-Dilemme")}>
        <Scene3Dilemme style={{ backgroundColor: "#E0F2FE" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 4 — Visibilité" durationInFrames={sceneFrames("S4-Visibilite")}>
        <Scene4Visibilite style={{ backgroundColor: "#FDE68A" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 5 — Démonstration VOBI" durationInFrames={sceneFrames("S5-Demo")}>
        <Scene5Demo style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 6 — Comparer" durationInFrames={sceneFrames("S6-Comparer")}>
        <Scene6Comparer style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 7 — VOBI bientôt disponible" durationInFrames={sceneFrames("S7-Conclusion")}>
        <Scene7Conclusion style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
    </Series>
    <MusicBed />
  </AbsoluteFill>
);
