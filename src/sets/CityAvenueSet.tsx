import React from "react";

/**
 * Avenue moderne goudronnée (nouveau décor extérieur V2).
 */
export const CityAvenueSet: React.FC<{ pan?: number; sway?: number }> = ({ pan = 0, sway = 0 }) => {
  const shift = -((pan % 540 + 540) % 540);
  return (
    <g>
      <defs>
        <linearGradient id="avenueSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#avenueSky)" />

      {/* Immeubles en arrière-plan */}
      <g transform={`translate(${shift}, 0)`}>
        {[0, 540, 1080].map((bx) => (
          <g key={bx} transform={`translate(${bx}, 0)`}>
            <rect x={30} y={520} width={220} height={820} rx={12} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={4} />
            <rect x={280} y={620} width={230} height={720} rx={12} fill="#E2E8F0" stroke="#CBD5E1" strokeWidth={4} />
            {[0, 1, 2, 3, 4].map((r) => (
              <g key={r}>
                <rect x={65} y={580 + r * 110} width={60} height={60} rx={8} fill="#93C5FD" />
                <rect x={150} y={580 + r * 110} width={60} height={60} rx={8} fill="#93C5FD" />
                <rect x={315} y={670 + r * 105} width={65} height={55} rx={8} fill="#A7E3C6" />
                <rect x={410} y={670 + r * 105} width={65} height={55} rx={8} fill="#A7E3C6" />
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* Trottoir & route goudronnée */}
      <rect y={1340} width={1080} height={140} fill="#CBD5E1" />
      <rect y={1480} width={1080} height={440} fill="#334155" />
      <g transform={`translate(${shift}, 0)`}>
        {[0, 270, 540, 810, 1080, 1350].map((dx) => (
          <rect key={dx} x={dx} y={1680} width={140} height={18} rx={9} fill="#F8FAFC" opacity={0.85} />
        ))}
      </g>

      {/* Arbres urbains */}
      {[180, 900].map((tx) => (
        <g key={tx} transform={`translate(${tx}, 1340) rotate(${sway * 0.5})`}>
          <rect x={-12} y={-220} width={24} height={220} fill="#78350F" />
          <circle cx={0} cy={-260} r={88} fill="#059669" opacity={0.92} />
          <circle cx={-45} cy={-225} r={62} fill="#10B981" opacity={0.9} />
          <circle cx={45} cy={-225} r={62} fill="#0B6B4F" opacity={0.9} />
        </g>
      ))}
    </g>
  );
};
