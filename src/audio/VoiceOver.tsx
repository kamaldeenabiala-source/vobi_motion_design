import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { VO_LINES, type SceneId } from "../config/timeline";
import voTimings from "./vo-timings.generated.json";
import { Subtitle } from "../captions/Subtitles";

/**
 * Voix off + sous-titres d'une scène. Les répliques appartiennent au script 5
 * (src/config/timeline.ts). Les sous-titres sont découpés en segments et
 * répartis sur la durée réelle de parole mesurée dans chaque fichier.
 */
export const VoiceOver: React.FC<{ scene: SceneId; subtitles?: boolean; subtitleY?: number; dark?: boolean }> = ({
  scene,
  subtitles = true,
  subtitleY,
  dark = false,
}) => {
  const { fps } = useVideoConfig();
  const lines = VO_LINES.filter((l) => l.scene === scene);
  return (
    <>
      {lines.map((l) => (
        <Audio key={l.id} name={`Voix off ${l.id}`} src={staticFile(`audio/vo/${l.id}.wav`)} from={Math.round(l.at * fps)} volume={1} />
      ))}
      {subtitles ? <SubtitleTrack scene={scene} y={subtitleY} dark={dark} /> : null}
    </>
  );
};

const SubtitleTrack: React.FC<{ scene: SceneId; y?: number; dark: boolean }> = ({ scene, y, dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = VO_LINES.filter((l) => l.scene === scene);
  for (const l of lines) {
    const t = voTimings[l.id];
    const start = Math.round((l.at + t.speechStartSec) * fps);
    const end = Math.round((l.at + t.speechEndSec) * fps);
    if (frame < start - 2 || frame > end + 10) continue;
    // répartition proportionnelle au nombre de caractères
    const weights = l.subs.map((s) => s.length + 6);
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = start;
    for (let i = 0; i < l.subs.length; i++) {
      const dur = ((end - start) * weights[i]) / total;
      const segStart = Math.round(acc);
      const segEnd = Math.round(acc + dur);
      acc += dur;
      const isLast = i === l.subs.length - 1;
      if (frame >= segStart - 2 && (frame < segEnd || (isLast && frame <= end + 10))) {
        return (
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            <Subtitle key={`${l.id}-${i}`} text={l.subs[i]} localFrame={frame - segStart} y={y} dark={dark} />
          </AbsoluteFill>
        );
      }
    }
  }
  return null;
};
