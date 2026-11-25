import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1CoupDeCoeur } from "../script3/Scene1CoupDeCoeur";
import { Scene2Calculs } from "../script3/Scene2Calculs";
import { Scene3Dilemme } from "../script3/Scene3Dilemme";
import { Scene4ManqueDeChoix } from "./Scene4ManqueDeChoix";
import { Scene5Demo } from "../script3/Scene5Demo";
import { Scene6PlusDOffres } from "./Scene6PlusDOffres";
import { Scene7Conclusion } from "../script3/Scene7Conclusion";
import { MusicBed } from "./Music";
import { sceneFrames } from "./timeline";

/**
 * PUB COMPLÈTE V2 — Script 4 « La maison qui plaît, le loyer qui pèse (vB) »
 * Réutilise S1, S2, S3, S5 et S7 du Script 3 V2.
 */
export const VobiAdScript4V2: React.FC = () => (
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
      <Series.Sequence name="Scène 4 — Manque de choix" durationInFrames={sceneFrames("S4-ManqueDeChoix")}>
        <Scene4ManqueDeChoix style={{ backgroundColor: "#FDE68A" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 5 — Démonstration VOBI" durationInFrames={sceneFrames("S5-Demo")}>
        <Scene5Demo style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 6 — Plus d'offres" durationInFrames={sceneFrames("S6-PlusDOffres")}>
        <Scene6PlusDOffres style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 7 — VOBI bientôt disponible" durationInFrames={sceneFrames("S7-Conclusion")}>
        <Scene7Conclusion style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
    </Series>
    <MusicBed />
  </AbsoluteFill>
);
