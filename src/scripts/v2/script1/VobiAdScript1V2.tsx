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
 * PUB COMPLÈTE V2 — Script 1 « Zéro temps perdu, zéro dépense inutile »
 * Personnage : Aïcha · Nouveaux décors · Rythme posé · Fin « VOBI bientôt disponible »
 */
export const VobiAdScript1V2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Scène 1 — Salon moderne" durationInFrames={sceneFrames("S1-Criteres")}>
        <Scene1Criteres style={{ backgroundColor: "#F4EFE6" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 2 — Offres inadaptées" durationInFrames={sceneFrames("S2-Inadaptees")}>
        <Scene2Inadaptees style={{ backgroundColor: "#E0F2FE" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 3 — Boucle sans résultat" durationInFrames={sceneFrames("S3-Boucle")}>
        <Scene3Boucle style={{ backgroundColor: "#E0F2FE" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 4 — Manque d'informations" durationInFrames={sceneFrames("S4-Probleme")}>
        <Scene4Probleme style={{ backgroundColor: "#FDE68A" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 5 — Imagine depuis chez toi" durationInFrames={sceneFrames("S5-Imagine")}>
        <Scene5Imagine style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 6 — Zéro temps perdu & Démo" durationInFrames={sceneFrames("S6-Demo")}>
        <Scene6Demo style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 7 — VOBI bientôt disponible" durationInFrames={sceneFrames("S7-Conclusion")}>
        <Scene7Conclusion style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
    </Series>
    <MusicBed />
  </AbsoluteFill>
);
