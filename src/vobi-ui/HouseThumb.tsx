import React from "react";

/**
 * Vignettes de logement illustrées (vectoriel) — remplacent les photos de
 * villas des maquettes, incohérentes avec un loyer de 50 000 FCFA.
 * À remplacer par de vraies photos d'annonces si VOBI les fournit.
 */
export type ThumbVariant = "chambreSalon" | "studio" | "entreeCouche" | "maisonBasse";

const V: Record<ThumbVariant, { wall: string; roof: string; door: string; sky: string; ground: string }> = {
  chambreSalon: { wall: "#F1E3C6", roof: "#B95C3C", door: "#3E6E8E", sky: "#BFE3F5", ground: "#C8734A" },
  studio: { wall: "#E9EEF2", roof: "#5E6E7A", door: "#0B6B4F", sky: "#CBE7F7", ground: "#B9A58A" },
  entreeCouche: { wall: "#F3D6C2", roof: "#8E4A32", door: "#4F7F62", sky: "#BFE3F5", ground: "#C8734A" },
  maisonBasse: { wall: "#EFE6D0", roof: "#A2553A", door: "#3E6E8E", sky: "#D2ECF8", ground: "#9DB57E" },
};

export const HouseThumb: React.FC<{ variant: ThumbVariant; width: number; height: number; radius?: number }> = ({ variant, width, height, radius = 0 }) => {
  const c = V[variant];
  return (
    <svg width={width} height={height} viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" style={{ borderRadius: radius, display: "block" }}>
      <rect width={160} height={110} fill={c.sky} />
      <circle cx={130} cy={22} r={12} fill="#FFE29A" />
      <path d="M -10 74 Q 40 64 90 72 T 170 70 L 170 110 L -10 110 Z" fill={c.ground} />
      <g transform="translate(10 0)">
        <path d="M 6 54 L 30 20 L 30 54 Z" fill="#6E9A60" />
        <rect x={26} y={30} width={4} height={30} fill="#7A5A3E" />
      </g>
      {variant === "studio" ? (
        <g>
          <rect x={48} y={22} width={74} height={62} fill={c.wall} />
          <rect x={44} y={18} width={82} height={8} fill={c.roof} />
          {[0, 1].map((r) =>
            [0, 1, 2].map((k) => <rect key={`${r}${k}`} x={54 + k * 22} y={32 + r * 20} width={14} height={12} fill="#9CC9E6" />),
          )}
          <rect x={78} y={70} width={14} height={14} fill={c.door} />
        </g>
      ) : (
        <g>
          <rect x={40} y={46} width={90} height={38} fill={c.wall} />
          <path d={variant === "maisonBasse" ? "M 34 48 L 85 26 L 136 48 Z" : "M 36 48 L 134 48 L 128 38 L 42 38 Z"} fill={c.roof} />
          <rect x={52} y={56} width={16} height={14} fill="#9CC9E6" />
          {variant !== "entreeCouche" ? <rect x={102} y={56} width={16} height={14} fill="#9CC9E6" /> : null}
          <rect x={78} y={60} width={14} height={24} fill={c.door} />
          <rect x={30} y={70} width={110} height={14} fill="#E3D6BC" opacity={variant === "chambreSalon" ? 1 : 0} />
          <rect x={30} y={66} width={110} height={4} fill="#C9B998" opacity={variant === "chambreSalon" ? 1 : 0} />
        </g>
      )}
    </svg>
  );
};
