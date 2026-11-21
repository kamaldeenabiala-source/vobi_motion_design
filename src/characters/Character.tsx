import React, { useId } from "react";
import type { CharacterSpec, Outfit } from "./bible";
import type { Face } from "./expressions";
import { EXPRESSIONS } from "./expressions";

/**
 * RIG UNIQUE pour tous les personnages (vectoriel, 2D flat premium).
 *
 * Repère local : pieds au point (0,0), le haut de la tête vers y ≈ −640.
 * Bras/jambes = 2 segments articulés. Angles en degrés :
 *  - `a` : bras/jambe écarté vers l'extérieur (+) ou vers l'intérieur (−)
 *  - `b` : coude/genou plié vers le centre du corps (+)
 * L = côté gauche de l'écran, R = côté droit de l'écran.
 */
export type Limb = { a: number; b: number };
export type HandProp =
  | "none"
  | "fist"
  | "open"
  | "point"
  | "thumbUp"
  | "phone"
  | "wallet"
  | "walletOpen"
  | "mug"
  | "key"
  | "bill";

export type Pose = {
  face: Face;
  lean?: number;
  bob?: number;
  squash?: number;
  headTilt?: number;
  headTurn?: number;
  headNod?: number;
  armL?: Limb;
  armR?: Limb;
  legL?: Limb;
  legR?: Limb;
  thighScale?: number;
  handL?: HandProp;
  handR?: HandProp;
  handLTilt?: number;
  handRTilt?: number;
  blink?: number;
  wrinkle?: number;
  sweat?: number;
  outfit?: string;
  phoneGlow?: number;
  mouthTalk?: number;
};

export const DEFAULT_POSE: Pose = {
  face: EXPRESSIONS.neutre,
  armL: { a: 8, b: 6 },
  armR: { a: 8, b: 6 },
  legL: { a: 3, b: 0 },
  legR: { a: 3, b: 0 },
};

const UPPER_ARM = 104;
const FOREARM = 98;

export const Character: React.FC<{
  spec: CharacterSpec;
  pose: Pose;
  x: number; // position écran (px) du point entre les pieds
  y: number;
  scale?: number;
  flip?: boolean; // miroir horizontal
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({ spec, pose, x, y, scale = 1, flip = false, shadow = true, style }) => {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const outfit: Outfit = { ...spec.outfit, ...(pose.outfit ? spec.outfits?.[pose.outfit] : {}) };
  const W = 600;
  const H = 820;
  return (
    <svg
      width={W * scale}
      height={H * scale}
      viewBox={`${-W / 2} ${-H + 60} ${W} ${H}`}
      style={{
        position: "absolute",
        left: x - (W * scale) / 2,
        top: y - (H - 60) * scale,
        overflow: "visible",
        ...style,
      }}
    >
      <g transform={flip ? "scale(-1,1)" : undefined}>
        {shadow ? <ellipse cx={0} cy={4} rx={spec.shoulderHalf + spec.belly * 0.6 + 30} ry={16} fill="rgba(40,20,10,0.18)" /> : null}
        <Body spec={spec} pose={pose} outfit={outfit} uid={rawId} />
      </g>
    </svg>
  );
};

/** Version <g> à insérer dans un SVG existant (décors en SVG). */
export const CharacterG: React.FC<{
  spec: CharacterSpec;
  pose: Pose;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  shadow?: boolean;
}> = ({ spec, pose, x, y, scale = 1, flip = false, shadow = true }) => {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const outfit: Outfit = { ...spec.outfit, ...(pose.outfit ? spec.outfits?.[pose.outfit] : {}) };
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {shadow ? <ellipse cx={0} cy={4} rx={spec.shoulderHalf + spec.belly * 0.6 + 30} ry={16} fill="rgba(40,20,10,0.18)" /> : null}
      <Body spec={spec} pose={pose} outfit={outfit} uid={rawId} />
    </g>
  );
};

const Body: React.FC<{ spec: CharacterSpec; pose: Pose; outfit: Outfit; uid: string }> = ({ spec, pose, outfit, uid }) => {
  const p = { ...DEFAULT_POSE, ...pose };
  const legLen = spec.legLength;
  const thighScale = p.thighScale ?? 1;
  const thigh = legLen * 0.5 * thighScale;
  const shin = legLen * 0.5;
  const sit = legLen * 0.5 * (1 - thighScale);
  const hipY = -legLen + sit * 0.9;
  const torsoH = 220;
  const shoulderY = hipY - torsoH;
  const sh = spec.shoulderHalf;
  const wh = spec.waistHalf;
  const bel = spec.belly;
  const squash = p.squash ?? 1;
  const bob = p.bob ?? 0;

  const torsoPath = `M ${-sh} ${shoulderY + 10}
    C ${-sh - 10} ${shoulderY + 70}, ${-wh - bel} ${hipY - 120}, ${-wh - bel * 0.9} ${hipY - 60}
    C ${-wh - bel * 0.6} ${hipY - 20}, ${-wh} ${hipY - 4}, ${-wh + 4} ${hipY + 14}
    L ${wh - 4} ${hipY + 14}
    C ${wh} ${hipY - 4}, ${wh + bel * 0.6} ${hipY - 20}, ${wh + bel * 0.9} ${hipY - 60}
    C ${wh + bel} ${hipY - 120}, ${sh + 10} ${shoulderY + 70}, ${sh} ${shoulderY + 10}
    Q ${sh - 6} ${shoulderY - 6}, ${sh - 30} ${shoulderY - 8}
    L ${-sh + 30} ${shoulderY - 8}
    Q ${-sh + 6} ${shoulderY - 6}, ${-sh} ${shoulderY + 10} Z`;

  const patId = `pat${uid}`;
  const clipId = `clip${uid}`;

  return (
    <g transform={`translate(0 ${bob}) rotate(${p.lean ?? 0} 0 ${hipY}) translate(0 ${hipY}) scale(1 ${squash}) translate(0 ${-hipY})`}>
      <defs>
        <Pattern id={patId} outfit={outfit} />
        <clipPath id={clipId}>
          <path d={torsoPath} />
        </clipPath>
      </defs>

      {/* JAMBES */}
      <Leg x={-wh * 0.48} y={hipY} limb={p.legL!} side={1} thigh={thigh} shin={shin} outfit={outfit} />
      <Leg x={wh * 0.48} y={hipY} limb={p.legR!} side={-1} thigh={thigh} shin={shin} outfit={outfit} />
      {/* bassin */}
      <rect x={-wh + 2} y={hipY - 10} width={wh * 2 - 4} height={44} rx={20} fill={outfit.pants} />
      {thighScale < 0.8 ? (
        <ellipse cx={0} cy={hipY + 18} rx={wh + 14} ry={30} fill={outfit.pants} />
      ) : null}
      {outfit.skirt ? (
        <g>
          <path d={`M ${-wh - 4} ${hipY - 10} L ${wh + 4} ${hipY - 10} L ${wh + 30} ${-26} Q 0 ${-14} ${-wh - 30} ${-26} Z`} fill={outfit.pants} />
          <path d={`M ${-wh + 6} ${hipY + 40} L ${wh + 14} ${hipY + 60} M ${-wh + 2} ${hipY + 120} L ${wh + 20} ${hipY + 140}`} stroke="#F4C430" strokeWidth={8} opacity={0.75} />
        </g>
      ) : null}

      {/* COU */}
      <rect x={-17} y={shoulderY - 40} width={34} height={52} rx={12} fill={spec.skinShade} />

      {/* TORSE */}
      <path d={torsoPath} fill={outfit.top} />
      {outfit.topPattern && outfit.topPattern !== "none" ? (
        <path d={torsoPath} fill={`url(#${patId})`} />
      ) : null}
      <g clipPath={`url(#${clipId})`}>
        {/* ombre latérale douce */}
        <path d={`M ${sh * 0.35} ${shoulderY} L ${sh + 40} ${shoulderY} L ${wh + bel + 40} ${hipY + 20} L ${wh * 0.4} ${hipY + 20} Z`} fill={outfit.topShade} opacity={0.55} />
        {/* plis de fatigue */}
        {(p.wrinkle ?? 0) > 0.01 ? (
          <g stroke={outfit.topShade} strokeWidth={5} fill="none" strokeLinecap="round" opacity={Math.min(1, p.wrinkle ?? 0)}>
            <path d={`M ${-wh + 8} ${hipY - 70} q 22 -8 34 6`} />
            <path d={`M ${wh - 50} ${hipY - 40} q 18 -12 36 -2`} />
            <path d={`M ${-20} ${shoulderY + 90} q 14 10 30 4`} />
            <path d={`M ${-sh + 18} ${shoulderY + 40} q 16 6 22 22`} />
          </g>
        ) : null}
        {/* boutons */}
        {outfit.collar ? (
          <g fill={outfit.topShade}>
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={2} cy={shoulderY + 44 + i * 42} r={4} />
            ))}
          </g>
        ) : null}
      </g>
      {/* col */}
      {outfit.collar ? (
        <g>
          <path d={`M -26 ${shoulderY - 8} L 0 ${shoulderY + 30} L -6 ${shoulderY + 38} L -34 ${shoulderY + 4} Z`} fill={outfit.topShade} />
          <path d={`M 26 ${shoulderY - 8} L 0 ${shoulderY + 30} L 6 ${shoulderY + 38} L 34 ${shoulderY + 4} Z`} fill={outfit.topShade} />
          <path d={`M -20 ${shoulderY - 8} L 0 ${shoulderY + 26} L 20 ${shoulderY - 8} Z`} fill={spec.skinShade} />
        </g>
      ) : null}
      {/* numéro de zémidjan */}
      {outfit.number ? (
        <g transform={`translate(${-sh * 0.62} ${shoulderY + 58})`}>
          <rect x={0} y={0} width={64} height={30} rx={6} fill="#FFFFFF" opacity={0.92} />
          <text x={32} y={22} textAnchor="middle" fontSize={20} fontWeight={800} fill="#1A1A1A" fontFamily="sans-serif">
            {outfit.number}
          </text>
        </g>
      ) : null}
      {spec.accessories.includes("chain") ? (
        <path d={`M -24 ${shoulderY - 4} Q 0 ${shoulderY + 56} 24 ${shoulderY - 4}`} stroke="#E8B93A" strokeWidth={5} fill="none" strokeDasharray="7 3" />
      ) : null}
      {spec.accessories.includes("satchel") ? (
        <g>
          <path d={`M ${sh - 16} ${shoulderY + 4} L ${-wh - 6} ${hipY - 30}`} stroke="#5E3E24" strokeWidth={11} strokeLinecap="round" />
          <rect x={-wh - 36} y={hipY - 52} width={58} height={50} rx={10} fill="#7A5232" />
          <rect x={-wh - 36} y={hipY - 52} width={58} height={22} rx={10} fill="#8E6440" />
          <circle cx={-wh - 7} cy={hipY - 30} r={4} fill="#E8B93A" />
        </g>
      ) : null}

      {/* TÊTE */}
      <g transform={`translate(0 ${shoulderY - 18}) rotate(${p.headTilt ?? 0}) translate(0 ${(p.headNod ?? 0) * 6})`}>
        <Head spec={spec} pose={p} uid={uid} />
      </g>

      {/* BRAS (devant le torse) */}
      <Arm x={-sh + 10} y={shoulderY + 14} limb={p.armL!} side={1} spec={spec} outfit={outfit} hand={p.handL ?? "none"} tilt={p.handLTilt ?? 0} glow={p.phoneGlow ?? 0} />
      <Arm x={sh - 10} y={shoulderY + 14} limb={p.armR!} side={-1} spec={spec} outfit={outfit} hand={p.handR ?? "none"} tilt={p.handRTilt ?? 0} glow={p.phoneGlow ?? 0} />
    </g>
  );
};

const Pattern: React.FC<{ id: string; outfit: Outfit }> = ({ id, outfit }) => {
  const c = outfit.patternColor ?? outfit.topShade;
  if (outfit.topPattern === "wax")
    return (
      <pattern id={id} width={34} height={34} patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
        <path d="M17 4 L24 17 L17 30 L10 17 Z" fill="none" stroke={c} strokeWidth={2.4} opacity={0.75} />
        <circle cx={17} cy={17} r={3} fill={c} opacity={0.8} />
        <circle cx={0} cy={0} r={2.4} fill={c} opacity={0.7} />
        <circle cx={34} cy={34} r={2.4} fill={c} opacity={0.7} />
      </pattern>
    );
  if (outfit.topPattern === "flowers")
    return (
      <pattern id={id} width={56} height={56} patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx={18} cy={10} rx={5} ry={9} fill={c} transform={`rotate(${r} 18 18)`} opacity={0.95} />
        ))}
        <circle cx={18} cy={18} r={4.5} fill="#F4C430" />
        <path d="M40 40 q8 -10 14 0 q-6 8 -14 0" fill="#3E7D4F" opacity={0.85} />
      </pattern>
    );
  if (outfit.topPattern === "stripes")
    return (
      <pattern id={id} width={22} height={22} patternUnits="userSpaceOnUse">
        <rect x={0} y={0} width={7} height={22} fill={c} opacity={0.8} />
      </pattern>
    );
  return null;
};

const Leg: React.FC<{ x: number; y: number; limb: Limb; side: 1 | -1; thigh: number; shin: number; outfit: Outfit }> = ({ x, y, limb, side, thigh, shin, outfit }) => {
  const a1 = side * limb.a;
  const a2 = side * -limb.b;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a1})`}>
      <line x1={0} y1={0} x2={0} y2={thigh} stroke={outfit.pants} strokeWidth={44} strokeLinecap="round" />
      <g transform={`translate(0 ${thigh}) rotate(${a2})`}>
        <line x1={0} y1={0} x2={0} y2={shin - 6} stroke={outfit.pants} strokeWidth={38} strokeLinecap="round" />
        <line x1={-side * 12} y1={8} x2={-side * 12} y2={shin - 30} stroke={outfit.pantsShade} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
        <g transform={`translate(0 ${shin}) rotate(${-a1 - a2})`}>
          <ellipse cx={-side * 12} cy={0} rx={30} ry={13} fill={outfit.shoes} />
          <ellipse cx={-side * 16} cy={-3} rx={16} ry={6} fill="#FFFFFF" opacity={0.12} />
        </g>
      </g>
    </g>
  );
};

const Arm: React.FC<{
  x: number;
  y: number;
  limb: Limb;
  side: 1 | -1;
  spec: CharacterSpec;
  outfit: Outfit;
  hand: HandProp;
  tilt: number;
  glow: number;
}> = ({ x, y, limb, side, spec, outfit, hand, tilt, glow }) => {
  const a1 = side * limb.a;
  const a2 = side * -limb.b;
  const longSleeve = outfit.sleeves === "long";
  return (
    <g transform={`translate(${x} ${y}) rotate(${a1})`}>
      <line x1={0} y1={0} x2={0} y2={UPPER_ARM} stroke={spec.skin} strokeWidth={30} strokeLinecap="round" />
      <line x1={0} y1={-4} x2={0} y2={longSleeve ? UPPER_ARM : 52} stroke={outfit.top} strokeWidth={42} strokeLinecap="round" />
      <line x1={side * 10} y1={6} x2={side * 10} y2={longSleeve ? UPPER_ARM - 10 : 44} stroke={outfit.topShade} strokeWidth={8} strokeLinecap="round" opacity={0.5} />
      <g transform={`translate(0 ${UPPER_ARM}) rotate(${a2})`}>
        <line x1={0} y1={0} x2={0} y2={FOREARM} stroke={spec.skin} strokeWidth={27} strokeLinecap="round" />
        {longSleeve ? <line x1={0} y1={0} x2={0} y2={FOREARM - 18} stroke={outfit.top} strokeWidth={36} strokeLinecap="round" /> : null}
        {spec.accessories.includes("watch") && side === 1 ? (
          <rect x={-16} y={FOREARM - 26} width={32} height={11} rx={4} fill="#2B2B2B" />
        ) : null}
        <g transform={`translate(0 ${FOREARM + 8}) rotate(${-a1 - a2 + tilt})`}>
          <Hand kind={hand} side={side} skin={spec.skin} shade={spec.skinShade} glow={glow} />
        </g>
      </g>
    </g>
  );
};

const Hand: React.FC<{ kind: HandProp; side: 1 | -1; skin: string; shade: string; glow: number }> = ({ kind, side, skin, shade, glow }) => {
  const fist = <circle cx={0} cy={0} r={18} fill={skin} />;
  switch (kind) {
    case "phone":
      return (
        <g>
          <rect x={-22} y={-50} width={44} height={80} rx={9} fill="#1C232E" />
          <rect x={-18} y={-45} width={36} height={68} rx={6} fill={glow > 0 ? "#DFF7EC" : "#2E3A4A"} />
          {glow > 0 ? <rect x={-18} y={-45} width={36} height={68} rx={6} fill="#A7E3C6" opacity={0.5 * glow} /> : null}
          <ellipse cx={side * 16} cy={6} rx={13} ry={17} fill={skin} />
          <ellipse cx={-side * 20} cy={-4} rx={7} ry={11} fill={skin} />
        </g>
      );
    case "wallet":
    case "walletOpen":
      return (
        <g>
          <rect x={-30} y={-22} width={60} height={42} rx={7} fill="#6B4226" />
          {kind === "walletOpen" ? (
            <>
              <rect x={-30} y={-46} width={60} height={28} rx={6} fill="#83552F" />
              <rect x={-24} y={-40} width={48} height={16} rx={3} fill="#5A361E" />
            </>
          ) : (
            <rect x={-30} y={-22} width={60} height={16} rx={6} fill="#83552F" />
          )}
          <ellipse cx={side * 26} cy={4} rx={14} ry={16} fill={skin} />
        </g>
      );
    case "mug":
      return (
        <g>
          <rect x={-18} y={-34} width={36} height={40} rx={7} fill="#FFFFFF" />
          <path d="M18 -26 q16 0 16 12 q0 12 -16 12" stroke="#FFFFFF" strokeWidth={6} fill="none" />
          <rect x={-18} y={-34} width={36} height={8} rx={4} fill="#E2E8F0" />
          <path d="M-6 -44 q6 -8 0 -16 M6 -44 q6 -8 0 -16" stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.7} />
          <ellipse cx={-side * 4} cy={4} rx={16} ry={15} fill={skin} />
        </g>
      );
    case "key":
      return (
        <g>
          <circle cx={0} cy={-44} r={16} fill="none" stroke="#F4C430" strokeWidth={8} />
          <rect x={-4} y={-30} width={8} height={36} fill="#F4C430" />
          <rect x={4} y={-6} width={10} height={6} fill="#F4C430" />
          <rect x={4} y={-16} width={7} height={5} fill="#F4C430" />
          {fist}
        </g>
      );
    case "bill":
      return (
        <g>
          <rect x={-34} y={-46} width={68} height={38} rx={4} fill="#9FD3C0" stroke="#5E9E86" strokeWidth={2} />
          <circle cx={0} cy={-27} r={9} fill="#5E9E86" opacity={0.6} />
          {fist}
        </g>
      );
    case "open":
      return (
        <g>
          <rect x={-17} y={-6} width={34} height={44} rx={15} fill={skin} />
          <rect x={-side * 14 - 6} y={-14} width={12} height={28} rx={6} fill={skin} transform={`rotate(${side * 38} ${-side * 14} 0)`} />
          <path d="M -6 18 L -6 34 M 4 18 L 4 34" stroke={shade} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
          <ellipse cx={0} cy={6} rx={10} ry={9} fill={shade} opacity={0.22} />
        </g>
      );
    case "point":
      return (
        <g>
          {fist}
          <rect x={-5} y={-48} width={10} height={36} rx={5} fill={skin} />
        </g>
      );
    case "thumbUp":
      return (
        <g>
          <rect x={-16} y={-14} width={32} height={30} rx={11} fill={skin} />
          <rect x={-side * 10 - 5} y={-40} width={11} height={32} rx={5.5} fill={skin} />
        </g>
      );
    case "fist":
      return <circle cx={0} cy={0} r={20} fill={skin} />;
    default:
      return fist;
  }
};

const Head: React.FC<{ spec: CharacterSpec; pose: Pose; uid: string }> = ({ spec, pose, uid }) => {
  const f = pose.face;
  const rx = spec.headRx;
  const ry = spec.headRy;
  const turn = pose.headTurn ?? 0;
  const fx = turn * 14;
  const cy = -ry + 6; // centre de la tête au-dessus du cou
  const blinkK = 1 - (pose.blink ?? 0);
  const openL = Math.max(0, f.eyeOpen * blinkK);
  const openR = Math.max(0, (f.eyeOpenR ?? f.eyeOpen) * blinkK);
  const mouthOpen = Math.max(0, f.mouthOpen + (pose.mouthTalk ?? 0));
  const headClip = `head${uid}`;
  const sunglasses = spec.accessories.includes("sunglasses");

  return (
    <g transform={`translate(0 ${cy})`}>
      <defs>
        <clipPath id={headClip}>
          <ellipse cx={0} cy={0} rx={rx} ry={ry} />
        </clipPath>
      </defs>
      {/* oreilles */}
      <ellipse cx={-rx + 2 + Math.max(0, turn) * 10} cy={8} rx={13} ry={17} fill={spec.skinShade} />
      <ellipse cx={rx - 2 + Math.min(0, turn) * 10} cy={8} rx={13} ry={17} fill={spec.skinShade} />
      {/* crâne */}
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={spec.skin} />
      <g clipPath={`url(#${headClip})`}>
        <ellipse cx={rx * 1.08 - turn * 16} cy={14} rx={rx * 0.42} ry={ry * 1.15} fill={spec.skinShade} opacity={0.4} />
        <ellipse cx={-rx * 0.35 + fx} cy={-ry * 0.45} rx={rx * 0.35} ry={ry * 0.2} fill="#FFFFFF" opacity={0.06} />
        {/* barbe légère : contour de mâchoire + moustache fine */}
        {spec.beard === "light" ? (
          <g fill={spec.hairColor} opacity={0.38}>
            <path
              d={`M ${-rx * 0.97} ${ry * 0.18} Q ${-rx * 0.82} ${ry * 1.0} ${fx} ${ry * 1.02} Q ${rx * 0.82} ${ry * 1.0} ${rx * 0.97} ${ry * 0.18} L ${rx * 0.9} ${ry * 0.24} Q ${rx * 0.66} ${ry * 0.86} ${fx} ${ry * 0.88} Q ${-rx * 0.66} ${ry * 0.86} ${-rx * 0.9} ${ry * 0.24} Z`}
            />
            <ellipse cx={fx} cy={ry * 0.82} rx={12} ry={7} />
            <path d={`M ${fx - 16} 37 Q ${fx} 31 ${fx + 16} 37 Q ${fx} 35 ${fx - 16} 37 Z`} />
          </g>
        ) : null}
      </g>
      {spec.beard === "goatee" ? (
        <ellipse cx={fx} cy={ry * 0.86} rx={15} ry={10} fill={spec.hairColor} opacity={0.85} />
      ) : null}

      {/* cheveux */}
      <Hair spec={spec} rx={rx} ry={ry} turn={turn} />

      {/* joues */}
      {f.cheeks > 0.01 ? (
        <g opacity={0.3 * f.cheeks} fill="#D9866A">
          <ellipse cx={fx - 36} cy={30} rx={13} ry={8} />
          <ellipse cx={fx + 36} cy={30} rx={13} ry={8} />
        </g>
      ) : null}

      {/* yeux */}
      {!sunglasses ? (
        <>
          <Eye x={fx - 25} y={4} open={openL} f={f} />
          <Eye x={fx + 25} y={4} open={openR} f={f} />
        </>
      ) : (
        <g>
          <rect x={fx - 50} y={-10} width={42} height={28} rx={10} fill="#141A22" />
          <rect x={fx + 8} y={-10} width={42} height={28} rx={10} fill="#141A22" />
          <rect x={fx - 10} y={-4} width={20} height={5} rx={2} fill="#141A22" />
          <path d={`M ${fx - 44} ${-4} l 12 0`} stroke="#FFFFFF" strokeWidth={4} opacity={0.55} strokeLinecap="round" />
          <path d={`M ${fx + 14} ${-4} l 12 0`} stroke="#FFFFFF" strokeWidth={4} opacity={0.55} strokeLinecap="round" />
        </g>
      )}

      {/* sourcils */}
      <g stroke={spec.hairColor} strokeWidth={7.5} strokeLinecap="round">
        <line x1={-13} y1={0} x2={13} y2={0} transform={`translate(${fx - 25} ${(sunglasses ? -24 : -22) + f.browY}) rotate(${-f.browAngle})`} />
        <line x1={-13} y1={0} x2={13} y2={0} transform={`translate(${fx + 25} ${(sunglasses ? -24 : -22) + f.browY}) rotate(${f.browAngleR ?? f.browAngle})`} />
      </g>

      {/* nez */}
      <path d={`M ${fx - 7} ${24} q ${7} ${8} ${14} 0`} stroke={spec.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />

      {/* bouche */}
      <Mouth x={fx} y={46} w={f.mouthW} curve={f.mouthCurve} open={mouthOpen} teeth={f.teeth} />

      {/* sueur */}
      {(pose.sweat ?? 0) > 0.02 ? (
        <g opacity={Math.min(1, pose.sweat ?? 0)}>
          <path d={`M ${rx - 8} ${-40} q 8 14 0 20 q -8 -6 0 -20`} fill="#BFE6FF" stroke="#7CC4EE" strokeWidth={2} />
          <path d={`M ${-rx + 4} ${-26} q 6 11 0 16 q -6 -5 0 -16`} fill="#BFE6FF" stroke="#7CC4EE" strokeWidth={2} />
        </g>
      ) : null}
    </g>
  );
};

const Hair: React.FC<{ spec: CharacterSpec; rx: number; ry: number; turn: number }> = ({ spec, rx, ry, turn }) => {
  if (spec.hair === "fade")
    return (
      <g>
        {/* côtés dégradés (courts) */}
        <path d={`M ${-rx * 0.97} ${-ry * 0.02} Q ${-rx * 1.0} ${-ry * 0.4} ${-rx * 0.88} ${-ry * 0.5} L ${-rx * 0.8} ${-ry * 0.42} Q ${-rx * 0.86} ${-ry * 0.2} ${-rx * 0.86} ${ry * 0.02} Z`} fill={spec.hairColor} opacity={0.6} />
        <path d={`M ${rx * 0.97} ${-ry * 0.02} Q ${rx * 1.0} ${-ry * 0.4} ${rx * 0.88} ${-ry * 0.5} L ${rx * 0.8} ${-ry * 0.42} Q ${rx * 0.86} ${-ry * 0.2} ${rx * 0.86} ${ry * 0.02} Z`} fill={spec.hairColor} opacity={0.6} />
        {/* dessus plus fourni */}
        <path
          d={`M ${-rx * 0.9} ${-ry * 0.4} C ${-rx * 0.98} ${-ry * 1.18}, ${rx * 0.98} ${-ry * 1.18}, ${rx * 0.9} ${-ry * 0.4} C ${rx * 0.62} ${-ry * 0.66 + turn * 2}, ${rx * 0.2} ${-ry * 0.62}, ${turn * 8} ${-ry * 0.64} C ${-rx * 0.2} ${-ry * 0.62}, ${-rx * 0.62} ${-ry * 0.66}, ${-rx * 0.9} ${-ry * 0.4} Z`}
          fill={spec.hairColor}
        />
        {/* texture */}
        <g stroke="#3A2A24" strokeWidth={3} strokeLinecap="round" opacity={0.7}>
          <path d={`M ${-rx * 0.45} ${-ry * 0.92} q 8 -5 16 0`} />
          <path d={`M ${-rx * 0.05} ${-ry * 0.98} q 8 -5 16 0`} />
          <path d={`M ${rx * 0.35} ${-ry * 0.9} q 8 -5 16 0`} />
          <path d={`M ${-rx * 0.25} ${-ry * 0.8} q 8 -5 16 0`} />
          <path d={`M ${rx * 0.15} ${-ry * 0.78} q 8 -5 16 0`} />
        </g>
      </g>
    );
  if (spec.hair === "shortRound")
    return (
      <path
        d={`M ${-rx * 0.98} ${-ry * 0.25} C ${-rx * 1.0} ${-ry * 1.06}, ${rx * 1.0} ${-ry * 1.06}, ${rx * 0.98} ${-ry * 0.25} C ${rx * 0.7} ${-ry * 0.62}, ${-rx * 0.7} ${-ry * 0.62}, ${-rx * 0.98} ${-ry * 0.25} Z`}
        fill={spec.hairColor}
      />
    );
  if (spec.hair === "headwrap")
    return (
      <g>
        <path
          d={`M ${-rx * 1.05} ${-ry * 0.25} C ${-rx * 1.2} ${-ry * 1.5}, ${rx * 1.2} ${-ry * 1.5}, ${rx * 1.05} ${-ry * 0.25} C ${rx * 0.6} ${-ry * 0.5}, ${-rx * 0.6} ${-ry * 0.5}, ${-rx * 1.05} ${-ry * 0.25} Z`}
          fill={spec.wrapColor ?? "#E07A2E"}
        />
        <path d={`M ${-rx * 0.9} ${-ry * 0.55} Q 0 ${-ry * 0.95} ${rx * 0.9} ${-ry * 0.55}`} stroke="#F4C430" strokeWidth={8} fill="none" opacity={0.8} />
        <path d={`M ${rx * 0.4} ${-ry * 1.15} q ${rx * 0.5} ${-ry * 0.2} ${rx * 0.4} ${ry * 0.25} q ${-rx * 0.3} ${-ry * 0.05} ${-rx * 0.4} ${-ry * 0.25} Z`} fill="#C0621F" />
      </g>
    );
  // casquette du zémidjan
  return (
    <g>
      <path
        d={`M ${-rx * 1.04} ${-ry * 0.2} C ${-rx * 1.08} ${-ry * 1.22}, ${rx * 1.08} ${-ry * 1.22}, ${rx * 1.04} ${-ry * 0.2} Z`}
        fill="#2F3E46"
      />
      <path d={`M ${-rx * 0.2 + turn * 30} ${-ry * 0.24} q ${rx * 1.0} ${-14} ${rx * 1.5} ${10} q ${-rx * 0.7} ${16} ${-rx * 1.5} ${2} Z`} fill="#24323A" />
      <circle cx={0} cy={-ry * 0.98} r={6} fill="#24323A" />
      <path d={`M 0 ${-ry * 0.98} L 0 ${-ry * 0.25}`} stroke="#3C4E58" strokeWidth={3} />
    </g>
  );
};

const Eye: React.FC<{ x: number; y: number; open: number; f: Face }> = ({ x, y, open, f }) => {
  if (open < 0.12) {
    return <path d={`M ${x - 13} ${y + 2} q 13 8 26 0`} stroke="#1A1210" strokeWidth={5} fill="none" strokeLinecap="round" />;
  }
  const ry = 14 * open;
  const rx = 12 + (open > 1.15 ? 3 : 0);
  const pr = 7.5 * f.pupil * Math.min(1, open + 0.15);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#FFFFFF" />
      <circle cx={x + f.lookX * 4.5} cy={y + f.lookY * 5} r={Math.min(pr, ry)} fill="#1A1210" />
      <circle cx={x + f.lookX * 4.5 + 2.5} cy={y + f.lookY * 5 - 3} r={Math.min(2.4, ry / 3)} fill="#FFFFFF" />
      <path d={`M ${x - rx - 1} ${y - ry * 0.3} Q ${x} ${y - ry - 4} ${x + rx + 1} ${y - ry * 0.3}`} stroke="#1A1210" strokeWidth={3.5} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Mouth: React.FC<{ x: number; y: number; w: number; curve: number; open: number; teeth: number }> = ({ x, y, w, curve, open, teeth }) => {
  const hw = w / 2;
  if (open < 1.5) {
    return (
      <path
        d={`M ${x - hw} ${y - curve * 0.5} Q ${x} ${y + curve * 0.9} ${x + hw} ${y - curve * 0.5}`}
        stroke="#3A1E16"
        strokeWidth={5.5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  const top = `M ${x - hw} ${y - curve * 0.5} Q ${x} ${y + curve * 0.25 - open * 0.15} ${x + hw} ${y - curve * 0.5}`;
  const bottom = `Q ${x} ${y + curve * 0.9 + open} ${x - hw} ${y - curve * 0.5}`;
  return (
    <g>
      <path d={`${top} ${bottom} Z`} fill="#4A1E1A" />
      {teeth > 0.05 ? (
        <path d={`${top} L ${x + hw * 0.8} ${y - curve * 0.35 + 6 * teeth} Q ${x} ${y + curve * 0.4 + 6 * teeth} ${x - hw * 0.8} ${y - curve * 0.35 + 6 * teeth} Z`} fill="#FFFFFF" opacity={0.95} />
      ) : null}
      {open > 8 ? <ellipse cx={x} cy={y + curve * 0.6 + open * 0.6} rx={hw * 0.45} ry={open * 0.22} fill="#C2564F" /> : null}
      <path d={`${top} ${bottom} Z`} fill="none" stroke="#3A1E16" strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};
