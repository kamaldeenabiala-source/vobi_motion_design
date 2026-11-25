import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile } from "remotion";
import { TOTAL_FRAMES, VO_LINES, sceneStart, voSpeechWindow } from "./timeline";

const S4 = sceneStart("S4-Visibilite");
const S5 = sceneStart("S5-Demo");
const END = TOTAL_FRAMES;

const windows = VO_LINES.map(voSpeechWindow);

const duckAt = (absFrame: number, duck: number) => {
  let g = 1;
  for (const w of windows) {
    const k = interpolate(absFrame, [w.start - 6, w.start, w.end, w.end + 8], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    g = Math.min(g, 1 - (1 - duck) * k);
  }
  return g;
};

export const MusicBed: React.FC = () => (
  <>
    <Audio
      name="Musique tension (S1-S3)"
      src={staticFile("audio/music/tension.wav")}
      loop
      durationInFrames={S4 + 10}
      volume={(f) =>
        0.24 *
        duckAt(f, 0.28) *
        interpolate(f, [0, 14, S4 - 12, S4 + 10], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Audio
      name="Musique rêverie (S4)"
      src={staticFile("audio/music/reverie.wav")}
      loop
      from={S4}
      durationInFrames={S5 - S4 + 6}
      volume={(f) =>
        0.26 *
        duckAt(f + S4, 0.28) *
        interpolate(f, [0, 14, S5 - S4 - 12, S5 - S4 + 6], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Audio
      name="Musique positive (S5-S7)"
      src={staticFile("audio/music/positive.wav")}
      loop
      from={S5}
      durationInFrames={END - S5}
      volume={(f) =>
        0.28 *
        duckAt(f + S5, 0.28) *
        interpolate(f, [0, 12, END - S5 - 24, END - S5], [0, 1, 1, 0.5], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  </>
);
