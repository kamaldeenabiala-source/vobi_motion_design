import React from "react";

/** Icônes au trait (style Lucide, trait 2 px — charte §7.1), redessinées. */
const PATHS: Record<string, string[]> = {
  mapPin: ["M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z", "M12 12.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z"],
  building: ["M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16", "M15 9h4a1 1 0 0 1 1 1v11", "M3 21h18", "M8 8h3M8 12h3M8 16h3"],
  wallet: ["M3 7a2 2 0 0 1 2-2h13v4", "M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z", "M16 14.5h.01"],
  bed: ["M3 19V6", "M3 13h18v6", "M21 13v-2a3 3 0 0 0-3-3h-7v5", "M7 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"],
  search: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M20 20l-4-4"],
  heart: ["M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21a8 8 0 0 1 16 0"],
  menu: ["M4 7h16M4 12h16M4 17h16"],
  droplet: ["M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"],
  zap: ["M13 2L4 14h7l-1 8 9-12h-7l1-8z"],
  parking: ["M5 4h14v16H5z", "M10 16V8h3a2.5 2.5 0 0 1 0 5h-3"],
  wifi: ["M2 9a15 15 0 0 1 20 0", "M5.5 12.5a10 10 0 0 1 13 0", "M9 16a5 5 0 0 1 6 0", "M12 19.5h.01"],
  snow: ["M12 2v20M4.9 6l14.2 12M19.1 6L4.9 18", "M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5"],
  home: ["M3 11l9-7 9 7", "M5 10v10h14V10", "M10 20v-6h4v6"],
  message: ["M4 5h16v11H8l-4 4V5z"],
  shieldCheck: ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z", "M8.5 12l2.5 2.5 4.5-5"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  bath: ["M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z", "M6 12V6a2 2 0 0 1 4 0", "M7 19l-1 2M17 19l1 2"],
  maximize: ["M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"],
  chevronDown: ["M6 9l6 6 6-6"],
  chevronLeft: ["M15 6l-6 6 6 6"],
  sliders: ["M4 7h10M18 7h2M4 17h4M12 17h8", "M16 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM10 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  list: ["M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"],
  map: ["M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z", "M9 4v14M15 6v14"],
  x: ["M6 6l12 12M18 6L6 18"],
  bell: ["M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2z", "M10 20a2 2 0 0 0 4 0"],
  share: ["M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"],
};

export type IconName = keyof typeof PATHS;

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number; fill?: string; style?: React.CSSProperties }> = ({
  name,
  size = 18,
  color = "currentColor",
  stroke = 2,
  fill = "none",
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {PATHS[name].map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);
