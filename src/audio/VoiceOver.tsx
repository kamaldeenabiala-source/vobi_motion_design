import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { VO_LINES } from "../config/timeline";
import voTimings from "./vo-timings.generated.json";
import { Subtitle } from "../captions/Subtitles";

type VoTimingEntry = { fileSec: number; speechStartSec: number; speechEndSec: number };

export type GenericVoLine = {
  id: string;
  scene: string;
  at: number;
  text: string;
  subs: string[];
};

/**
 * Voix off + sous-titres d'une scène. Par défaut calé sur le script 5
 * (src/config/timeline.ts), mais paramétrable pour tout autre script.
 */
export const VoiceOver: React.FC<{
  scene: string;
  subtitles?: boolean;
  subtitleY?: number;
  dark?: boolean;
  lines?: GenericVoLine[];
  timings?: Record<string, VoTimingEntry>;
  voDir?: string;
}> = ({
  scene,
  subtitles = true,
  subtitleY,
  dark = false,
  lines: allLines = VO_LINES,
  timings = voTimings,
  voDir = "audio/vo",
}) => {
  const { fps } = useVideoConfig();
  const lines = allLines.filter((l) => l.scene === scene);
  return (
    <>
      {lines.map((l) => (
        <Audio key={l.id} name={`Voix off ${l.id}`} src={staticFile(`${voDir}/${l.id}.wav`)} from={Math.round(l.at * fps)} volume={1} />
      ))}
      {subtitles ? <SubtitleTrack lines={lines} timings={timings} y={subtitleY} dark={dark} /> : null}
    </>
  );
};

const SubtitleTrack: React.FC<{
  lines: GenericVoLine[];
  timings: Record<string, VoTimingEntry>;
  y?: number;
  dark: boolean;
}> = ({ lines, timings, y, dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  for (const l of lines) {
    const t = timings[l.id];
    if (!t) continue;
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
