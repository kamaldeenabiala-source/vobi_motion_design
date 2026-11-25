import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile } from "remotion";
import { VO_LINES, sceneStart, voSpeechWindow } from "../config/timeline";
import { VIDEO } from "../config/video";

/**
 * Musique de la vidéo complète (pistes PROVISOIRES synthétisées, 102 BPM).
 *  - « tension » : de l'ouverture jusqu'au choc, coupée pendant le choc et la
 *    rêverie, reprend sur « Mais sérieusement », coupée net à l'arrêt sur image.
 *  - « positive » : entre sur l'onde verte VOBI, jusqu'au carton final.
 * Ducking automatique : la musique baisse sous la voix off.
 */
const fps = VIDEO.fps;
const S3 = sceneStart("S3-Choc");
const S4 = sceneStart("S4-Reverie");
const S5 = sceneStart("S5-Stop");
const S7 = sceneStart("S7-Conclusion");
const TENSION_CUT = S3 + 22; // cymbale du compteur
const TENSION_RESUME = S4 + 138; // « Mais sérieusement »
const FREEZE = S5 + 30; // arrêt sur image
const POSITIVE_IN = S5 + 74; // onde verte
const END = S7 + 375;

const windows = VO_LINES.map(voSpeechWindow);

/** 1 hors voix, `duck` pendant la voix (avec rampes de 6 images). */
const duckAt = (absFrame: number, duck: number) => {
  let g = 1;
  for (const w of windows) {
    const k = interpolate(absFrame, [w.start - 6, w.start, w.end, w.end + 8], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    g = Math.min(g, 1 - (1 - duck) * k);
  }
  return g;
};

export const MusicBed: React.FC = () => (
  <>
    <Audio
      name="Musique tension (1)"
      src={staticFile("audio/music/tension.wav")}
      durationInFrames={TENSION_CUT + 6}
      volume={(f) => 0.3 * duckAt(f, 0.28) * interpolate(f, [0, 10, TENSION_CUT, TENSION_CUT + 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
    <Audio
      name="Musique tension (reprise)"
      src={staticFile("audio/music/tension.wav")}
      from={TENSION_RESUME}
      trimBefore={Math.round(8 * fps)}
      durationInFrames={FREEZE - TENSION_RESUME + 2}
      volume={(f) => 0.3 * duckAt(f + TENSION_RESUME, 0.28) * interpolate(f, [0, 20], [0.3, 1], { extrapolateRight: "clamp" })}
    />
    <Audio
      name="Musique positive"
      src={staticFile("audio/music/positive.wav")}
      from={POSITIVE_IN}
      durationInFrames={END - POSITIVE_IN}
      volume={(f) => 0.3 * duckAt(f + POSITIVE_IN, 0.28) * interpolate(f, [0, 8, END - POSITIVE_IN - 20, END - POSITIVE_IN], [0, 1, 1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  </>
);
