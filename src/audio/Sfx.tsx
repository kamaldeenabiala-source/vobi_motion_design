import React from "react";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

export type SfxName =
  | "pop" | "tick" | "tap" | "whoosh" | "whip" | "swoosh" | "riser" | "cashout" | "impact"
  | "glass" | "cymbal" | "deflate" | "ding" | "check" | "notif" | "stamp" | "horn" | "engine"
  | "paper" | "goat" | "keylock" | "sparkle" | "signature" | "roll" | "rumble" | "flash"
  | "bubble" | "squeak";

/** Effet sonore calé sur une frame (relative à la scène). Sons provisoires. */
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number; label?: string }> = ({ name, at, volume = 0.6, label }) => (
  <Audio name={label ?? `SFX ${name}`} src={staticFile(`audio/sfx/${name}.wav`)} from={Math.max(0, Math.round(at))} volume={volume} />
);
