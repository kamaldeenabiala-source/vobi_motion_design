import React from "react";
import { DECOR } from "../config/palette";
import { Bed, Fan, Suitcase } from "../props/Objects";

/** Petite chambre de location : ventilateur, valise ouverte, moustiquaire. */
export const RoomSet: React.FC<{ fanSpin: number; doorOpen?: number; dawn?: number }> = ({ fanSpin, doorOpen = 0, dawn = 0.4 }) => (
  <g>
    <defs>
      <linearGradient id="roomWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E9DBC2" />
        <stop offset="1" stopColor={DECOR.roomWall} />
      </linearGradient>
      <radialGradient id="doorLight" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#FFF6DD" />
        <stop offset="1" stopColor="#FFD68A" />
      </radialGradient>
    </defs>
    <rect x={-200} y={0} width={1480} height={1400} fill="url(#roomWall)" />
    {/* plinthe et sol */}
    <rect x={-200} y={1380} width={1480} height={560} fill={DECOR.roomFloor} />
    <rect x={-200} y={1380} width={1480} height={20} fill="#9C7049" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-200 + i * 180} y={1400} width={4} height={540} fill="#A57B53" opacity={0.6} />
    ))}
    {/* fenêtre (aube) */}
    <g transform="translate(90 330)">
      <rect width={300} height={360} rx={10} fill="#6F7F9A" />
      <rect x={14} y={14} width={272} height={332} rx={6} fill={dawn > 0.5 ? "#F5C98F" : "#9DB2D0"} opacity={0.9} />
      <rect x={14} y={14} width={272} height={332} rx={6} fill="#F5C98F" opacity={dawn} />
      <rect x={145} y={14} width={10} height={332} fill="#6F7F9A" />
      <rect x={14} y={175} width={272} height={10} fill="#6F7F9A" />
      <path d="M -20 -20 L 320 -20 L 300 380 L 250 380 Q 200 180 160 -20 Z" fill="#C8584A" opacity={0.85} />
    </g>
    {/* calendrier / poster */}
    <g transform="translate(470 420) rotate(2)">
      <rect width={150} height={200} rx={6} fill="#FFFFFF" />
      <rect x={14} y={14} width={122} height={70} rx={4} fill="#4E7A4B" />
      {[0, 1, 2, 3].map((r) => (
        <rect key={r} x={14} y={100 + r * 24} width={122} height={12} rx={4} fill="#E3DACB" />
      ))}
    </g>
    {/* porte */}
    <g transform="translate(790 700)">
      <rect x={-14} y={-14} width={278} height={712} fill="#8C6A4E" />
      <rect x={0} y={0} width={250} height={690} fill="url(#doorLight)" opacity={doorOpen} />
      <g transform={`translate(250 0) scale(${1 - doorOpen * 0.85} 1) translate(-250 0)`}>
        <rect x={0} y={0} width={250} height={690} fill="#A57B53" />
        <rect x={26} y={30} width={198} height={280} rx={8} fill="#B88B60" />
        <rect x={26} y={350} width={198} height={300} rx={8} fill="#B88B60" />
        <circle cx={40} cy={360} r={12} fill="#E8C35A" />
      </g>
    </g>
    <Bed x={120} y={1500} w={620} />
    <Suitcase x={850} y={1720} />
    <Fan x={-10} y={1700} scale={0.95} spin={fanSpin} />
  </g>
);
