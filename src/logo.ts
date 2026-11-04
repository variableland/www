import tokens from "./brand/tokens.json";

export const LOGO_WIDTH = 402.02;
const LOGO_HEIGHT = 468.12;
export const LOGO_RATIO = LOGO_HEIGHT / LOGO_WIDTH;
export const MARK_WIDTH = 64;

export const logoViewBox = `0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`;

const ring =
  "M0,111.67v244.78l201.01,111.67,201.01-111.67V111.67L201.01,0,0,111.67ZM362.46,333.18l-161.45,89.7-161.45-89.7v-198.23L201.01,45.25l161.45,89.7v198.23Z";
const letterV =
  "125.54 280.66 125.54 194.77 83.64 171.49 83.64 305.31 201.01 370.51 318.37 305.31 318.37 171.5 276.48 194.77 276.48 280.66 201.01 322.58 125.54 280.66";

export const logoShapes = `<path d="${ring}"/><polygon points="${letterV}"/>`;

export const logoHull = "M0,111.67v244.78l201.01,111.67,201.01-111.67V111.67L201.01,0Z";

type Placement = { x: number; y: number; width: number };

export function logoSvg(placement?: Placement): string {
  const box = placement
    ? ` x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.width * LOGO_RATIO}"`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg"${box} viewBox="${logoViewBox}" fill="${tokens.color.logo.light}">${logoShapes}</svg>`;
}
