import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1CourPartagee } from "./Scene1CourPartagee";
import { Scene2ConflitsCour } from "./Scene2ConflitsCour";
import { Scene3BruitSommeil } from "./Scene3BruitSommeil";
import { Scene4CourPrivee } from "./Scene4CourPrivee";
import { Scene5TropEloignees } from "./Scene5TropEloignees";
import { Scene6Demo } from "./Scene6Demo";
import { Scene7Conclusion } from "./Scene7Conclusion";
import { MusicBed } from "./Music";
import { sceneFrames } from "./timeline";

/**
 * PUB COMPLÈTE — Script 6 « La cour partagée »
 */
export const VobiAdScript6: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Scène 1 — Cour partagée" durationInFrames={sceneFrames("S1-CourPartagee")}>
        <Scene1CourPartagee style={{ backgroundColor: "#F3D9A0" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 2 — Conflits dans la cour" durationInFrames={sceneFrames("S2-ConflitsCour")}>
        <Scene2ConflitsCour style={{ backgroundColor: "#F3D9A0" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 3 — Bruit & sommeil" durationInFrames={sceneFrames("S3-BruitSommeil")}>
        <Scene3BruitSommeil style={{ backgroundColor: "#14100C" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 4 — Cour privée" durationInFrames={sceneFrames("S4-CourPrivee")}>
        <Scene4CourPrivee style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 5 — Trop éloignées" durationInFrames={sceneFrames("S5-TropEloignees")}>
        <Scene5TropEloignees style={{ backgroundColor: "#3A2A20" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 6 — Démonstration VOBI" durationInFrames={sceneFrames("S6-Demo")}>
        <Scene6Demo style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 7 — Conclusion" durationInFrames={sceneFrames("S7-Conclusion")}>
        <Scene7Conclusion style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
    </Series>
    <MusicBed />
  </AbsoluteFill>
);
