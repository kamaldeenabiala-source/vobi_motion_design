import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1MaisonModerne } from "./Scene1MaisonModerne";
import { Scene2Realite } from "./Scene2Realite";
import { Scene3QuestionPrix } from "./Scene3QuestionPrix";
import { Scene4OffresLimitees } from "./Scene4OffresLimitees";
import { Scene5Demo } from "./Scene5Demo";
import { Scene6PlusOblige } from "./Scene6PlusOblige";
import { Scene7Conclusion } from "./Scene7Conclusion";
import { MusicBed } from "./Music";
import { sceneFrames } from "./timeline";

/**
 * PUB COMPLÈTE — Script 7 « La maison moderne dont tu rêves »
 */
export const VobiAdScript7: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence name="Scène 1 — Maison moderne" durationInFrames={sceneFrames("S1-MaisonModerne")}>
        <Scene1MaisonModerne style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 2 — Réalité du marché" durationInFrames={sceneFrames("S2-Realite")}>
        <Scene2Realite style={{ backgroundColor: "#F3D9A0" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 3 — Faut-il dépenser beaucoup ?" durationInFrames={sceneFrames("S3-QuestionPrix")}>
        <Scene3QuestionPrix style={{ backgroundColor: "#3A2A20" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 4 — Offres limitées" durationInFrames={sceneFrames("S4-OffresLimitees")}>
        <Scene4OffresLimitees style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 5 — Démonstration VOBI" durationInFrames={sceneFrames("S5-Demo")}>
        <Scene5Demo style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 6 — Plus obligé" durationInFrames={sceneFrames("S6-PlusOblige")}>
        <Scene6PlusOblige style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
      <Series.Sequence name="Scène 7 — Conclusion" durationInFrames={sceneFrames("S7-Conclusion")}>
        <Scene7Conclusion style={{ backgroundColor: "#F8FAFB" }} />
      </Series.Sequence>
    </Series>
    <MusicBed />
  </AbsoluteFill>
);
