import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1Criteres } from "./Scene1Criteres";
import { Scene2Inadaptees } from "./Scene2Inadaptees";
import { Scene3Boucle } from "./Scene3Boucle";
import { Scene4Probleme } from "./Scene4Probleme";
import { Scene5Imagine } from "./Scene5Imagine";
import { Scene6Demo } from "./Scene6Demo";
import { Scene7Conclusion } from "./Scene7Conclusion";
import { MusicBed } from "./Music";
import { sceneFrames } from "./timeline";

/**
 * PUB COMPLÈTE — Script 1 « Zéro temps perdu, zéro dépense inutile »
 */
export const VobiAdScript1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Scène 1 — Critères & budget" durationInFrames={sceneFrames("S1-Criteres")}>
        <Scene1Criteres style={{ backgroundColor: "#14100C" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 2 — Offres inadaptées" durationInFrames={sceneFrames("S2-Inadaptees")}>
        <Scene2Inadaptees style={{ backgroundColor: "#F3D9A0" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 3 — Boucle sans résultat" durationInFrames={sceneFrames("S3-Boucle")}>
        <Scene3Boucle style={{ backgroundColor: "#F3D9A0" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 4 — Manque d'informations" durationInFrames={sceneFrames("S4-Probleme")}>
        <Scene4Probleme style={{ backgroundColor: "#3A2A20" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 5 — Imagine depuis chez toi" durationInFrames={sceneFrames("S5-Imagine")}>
        <Scene5Imagine style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 6 — Zéro temps perdu & Démo" durationInFrames={sceneFrames("S6-Demo")}>
        <Scene6Demo style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 7 — Conclusion" durationInFrames={sceneFrames("S7-Conclusion")}>
        <Scene7Conclusion style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
    </Series>
    <MusicBed />
  </AbsoluteFill>
);
