import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { z } from "zod";
import { SCENE_COMPONENTS } from "../scenes";
import { FONT } from "../theme/fonts";

export const contactSheetSchema = z.object({
  scene: z.string(),
  frames: z.array(z.number()),
});

/** Planche contact : 9 images figées d'une scène, pour vérifier vite. */
export const ContactSheet: React.FC<z.infer<typeof contactSheetSchema>> = ({ scene, frames }) => {
  const Comp = SCENE_COMPONENTS[scene as keyof typeof SCENE_COMPONENTS];
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {frames.slice(0, 9).map((f, i) => (
        <div key={i} style={{ position: "absolute", left: (i % 3) * 360, top: Math.floor(i / 3) * 640, width: 360, height: 640, overflow: "hidden" }}>
          <div style={{ width: 1080, height: 1920, scale: String(1 / 3), transformOrigin: "0 0", position: "absolute" }}>
            <Freeze frame={f}>
              <AbsoluteFill>
                <Comp />
              </AbsoluteFill>
            </Freeze>
          </div>
          <div style={{ position: "absolute", left: 8, top: 8, background: "rgba(0,0,0,0.6)", color: "#fff", fontFamily: FONT, fontSize: 22, padding: "2px 8px", borderRadius: 6 }}>{f}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
