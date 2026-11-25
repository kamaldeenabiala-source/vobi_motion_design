import React from "react";

/**
 * Salon moderne lumineux (nouveau décor intérieur V2).
 */
export const ModernSalonSet: React.FC<{ sway?: number }> = ({ sway = 0 }) => (
  <g>
    {/* Mur & sol parquet clair */}
    <rect width={1080} height={1440} fill="#F4EFE6" />
    <rect y={1440} width={1080} height={480} fill="#D6B994" />
    <line x1={0} y1={1440} x2={1080} y2={1440} stroke="#B8966E" strokeWidth={6} />

    {/* Grande baie vitrée */}
    <rect x={80} y={240} width={440} height={580} rx={18} fill="#BAE6FD" stroke="#64748B" strokeWidth={12} />
    <line x1={300} y1={240} x2={300} y2={820} stroke="#64748B" strokeWidth={10} />
    <line x1={80} y1={530} x2={520} y2={530} stroke="#64748B" strokeWidth={10} />
    <circle cx={430} cy={340} r={44} fill="#FDE047" opacity={0.85} />

    {/* Tableau décoratif */}
    <rect x={640} y={320} width={320} height={240} rx={16} fill="#FFFFFF" stroke="#94A3B8" strokeWidth={8} />
    <circle cx={750} cy={430} r={54} fill="#A7E3C6" />
    <rect x={810} y={390} width={90} height={110} rx={14} fill="#0B6B4F" opacity={0.85} />

    {/* Canapé moderne */}
    <g transform={`translate(0, ${sway * 0.2})`}>
      <rect x={140} y={1140} width={800} height={220} rx={36} fill="#0B6B4F" />
      <rect x={120} y={1240} width={840} height={150} rx={28} fill="#0A3D2E" />
      <rect x={190} y={1175} width={140} height={95} rx={20} fill="#F2C14E" />
      <rect x={750} y={1175} width={140} height={95} rx={20} fill="#A7E3C6" />
      <rect x={170} y={1390} width={22} height={50} rx={6} fill="#475569" />
      <rect x={888} y={1390} width={22} height={50} rx={6} fill="#475569" />
    </g>

    {/* Plante verte en pot */}
    <g transform={`translate(930, 1440) rotate(${sway * 0.6})`}>
      <polygon points="-42,-90 42,-90 30,0 -30,0" fill="#E07A2E" />
      <ellipse cx={-26} cy={-155} rx={22} ry={68} transform="rotate(-24 -26 -155)" fill="#059669" />
      <ellipse cx={26} cy={-155} rx={22} ry={68} transform="rotate(24 26 -155)" fill="#10B981" />
      <ellipse cx={0} cy={-185} rx={20} ry={76} fill="#0B6B4F" />
    </g>
  </g>
);
