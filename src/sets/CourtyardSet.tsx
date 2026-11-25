import React from "react";

/**
 * Cour commune avec corde à linge et portes voisines (nouveau décor V2).
 */
export const CourtyardSet: React.FC<{ sway?: number }> = ({ sway = 0 }) => (
  <g>
    <rect width={1080} height={1920} fill="#FDE68A" />
    {/* Façades voisines */}
    <rect x={40} y={640} width={450} height={720} fill="#F5E6CC" stroke="#D4B483" strokeWidth={6} />
    <rect x={590} y={640} width={450} height={720} fill="#EED9C4" stroke="#D4B483" strokeWidth={6} />
    {/* Toits */}
    <polygon points="20,640 265,480 510,640" fill="#B45309" />
    <polygon points="570,640 815,480 1060,640" fill="#9A3412" />
    {/* Portes */}
    <rect x={190} y={960} width={150} height={400} rx={8} fill="#475569" />
    <rect x={740} y={960} width={150} height={400} rx={8} fill="#0B6B4F" />

    {/* Corde à linge entre les deux maisons */}
    <path d="M 340 820 Q 540 890 740 820" fill="none" stroke="#475569" strokeWidth={5} />
    <g transform={`translate(0, ${sway * 1.4})`}>
      <rect x={430} y={845} width={64} height={90} rx={8} fill="#EF4444" />
      <rect x={520} y={855} width={64} height={95} rx={8} fill="#3B82F6" />
      <rect x={605} y={842} width={58} height={82} rx={8} fill="#F59E0B" />
    </g>

    {/* Sol de la cour */}
    <rect y={1360} width={1080} height={560} fill="#D99B66" />
    <line x1={0} y1={1360} x2={1080} y2={1360} stroke="#B47644" strokeWidth={6} />
  </g>
);
