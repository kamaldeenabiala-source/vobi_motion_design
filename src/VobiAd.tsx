import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1Objectif } from "./scenes/Scene1Objectif";
import { Scene2Depenses } from "./scenes/Scene2Depenses";
import { Scene3Choc } from "./scenes/Scene3Choc";
import { Scene4Reverie } from "./scenes/Scene4Reverie";
import { Scene5Stop } from "./scenes/Scene5Stop";
import { Scene6Demo } from "./scenes/Scene6Demo";
import { Scene7Conclusion } from "./scenes/Scene7Conclusion";
import { MusicBed } from "./audio/Music";
import { sceneFrames } from "./config/timeline";

/**
 * PUB COMPLÈTE — Script 5 « 50 000 FCFA de loyer… et 10 000 FCFA déjà dépensés »
 * 7 scènes bout à bout (durées : src/config/timeline.ts). Chaque scène porte
 * sa voix off, ses sous-titres, ses effets et ses transitions internes ;
 * la musique est posée sur toute la durée.
 */
export const VobiAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Scène 1 — L'objectif" durationInFrames={sceneFrames("S1-Objectif")}>
        <Scene1Objectif style={{ backgroundColor: "#0A0E1F" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 2 — Les dépenses" durationInFrames={sceneFrames("S2-Depenses")}>
        <Scene2Depenses style={{ backgroundColor: "#F3D9A0" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 3 — Le choc" durationInFrames={sceneFrames("S3-Choc")}>
        <Scene3Choc style={{ backgroundColor: "#2A0A12" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 4 — La rêverie" durationInFrames={sceneFrames("S4-Reverie")}>
        <Scene4Reverie style={{ backgroundColor: "#3A2A20" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 5 — STOP" durationInFrames={sceneFrames("S5-Stop")}>
        <Scene5Stop style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 6 — Démonstration" durationInFrames={sceneFrames("S6-Demo")}>
        <Scene6Demo style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 7 — Conclusion" durationInFrames={sceneFrames("S7-Conclusion")}>
        <Scene7Conclusion style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
    </Series>
    <MusicBed />
  </AbsoluteFill>
);
