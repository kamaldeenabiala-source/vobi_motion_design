import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile } from "remotion";
import { TOTAL_FRAMES, VO_LINES, sceneStart, voSpeechWindow } from "./timeline";

/**
 * Musique Script 7 :
 * - « reverie » : S1 (le rêve d'une maison moderne)
 * - « tension » : S2 à S3 (réalité & doute)
 * - « positive » : S4 à S7 (« Pas forcément ! » + démo VOBI + clôture)
 */
const S2 = sceneStart("S2-Realite");
const S4 = sceneStart("S4-OffresLimitees");
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
      name="Musique rêverie (S1)"
      src={staticFile("audio/music/reverie.wav")}
      loop
      durationInFrames={S2 + 8}
      volume={(f) =>
        0.28 *
        duckAt(f, 0.3) *
        interpolate(f, [0, 12, S2 - 10, S2 + 8], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Audio
      name="Musique tension (S2-S3)"
      src={staticFile("audio/music/tension.wav")}
      loop
      from={S2}
      durationInFrames={S4 - S2 + 8}
      volume={(f) =>
        0.26 *
        duckAt(f + S2, 0.3) *
        interpolate(f, [0, 12, S4 - S2 - 12, S4 - S2 + 8], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Audio
      name="Musique positive (S4-S7)"
      src={staticFile("audio/music/positive.wav")}
      loop
      from={S4}
      durationInFrames={END - S4}
      volume={(f) =>
        0.3 *
        duckAt(f + S4, 0.3) *
        interpolate(f, [0, 10, END - S4 - 20, END - S4], [0, 1, 1, 0.55], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  </>
);
