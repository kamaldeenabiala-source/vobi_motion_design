/**
 * Gamme « décor » (extension proposée dans le storyboard §4, à valider).
 * Utilisée UNIQUEMENT pour personnages et décors, surtout scènes 1 à 4.
 * Volontairement désaturée pour que le vert VOBI reste la seule couleur vive
 * de la marque.
 */
export const DECOR = {
  // Peaux
  skinSenan: "#7A4A2E",
  skinSenanShade: "#5E3721",
  skinDemarcheur: "#5B3A26",
  skinDemarcheurShade: "#432918",
  skinZem: "#8A5634",
  skinZemShade: "#6A3F24",
  hair: "#1B1210",
  // Rue de Cotonou
  laterite: "#C8734A",
  lateriteLight: "#DB9068",
  lateriteDark: "#A65A36",
  wallCream: "#EFE2C8",
  wallOchre: "#E3C48F",
  wallPink: "#E8B9A0",
  wallShade: "#D4C2A0",
  gateBlue: "#3E6E8E",
  gateGreen: "#4F7F62",
  skyNoon: "#F6E7C1",
  skyNoonTop: "#F3D9A0",
  skyEvening: "#F2B279",
  sun: "#FFD36B",
  palm: "#4E7A4B",
  palmDark: "#3A5E3A",
  trunk: "#8B6B4A",
  cable: "#3B3B3B",
  // Intérieur chambre
  roomWall: "#E7D7BC",
  roomWallShade: "#CDB896",
  roomFloor: "#B9875E",
  sheet: "#F1ECE2",
  mattress: "#DCCFB9",
  woodDark: "#6B4A33",
  metal: "#9AA3AD",
  // Zém
  zemYellow: "#F2C230",
  zemYellowShade: "#D6A51A",
  motoRed: "#B4352B",
  tire: "#262626",
  // Divers
  ink: "#1A1A1A",
  shadow: "rgba(40, 20, 10, 0.18)",
  white: "#FFFFFF",
  pajama: "#7E9CC4",
  pajamaStripe: "#A9C0DD",
  khaki: "#D8C7A0",
  khakiShade: "#BFAE86",
  flowerShirt: "#E2574C",
  flowerShirtShade: "#C2433A",
  chainGold: "#E8B93A",
  sandal: "#6B4A33",
  satchel: "#7A5232",
} as const;
