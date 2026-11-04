import type { APIRoute } from "astro";
import sharp from "sharp";
import tokens from "../brand/tokens.json";
import { LOGO_RATIO, logoSvg } from "../logo.ts";

const SIDE = 180;
const LOGO_HEIGHT = (SIDE * 3) / 4;
const LOGO_WIDTH = LOGO_HEIGHT / LOGO_RATIO;

export const GET: APIRoute = async () => {
  const paper = tokens.color.paper.light;
  const logo = logoSvg({ x: (SIDE - LOGO_WIDTH) / 2, y: (SIDE - LOGO_HEIGHT) / 2, width: LOGO_WIDTH });
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIDE}" height="${SIDE}" viewBox="0 0 ${SIDE} ${SIDE}"><rect width="${SIDE}" height="${SIDE}" fill="${paper}"/>${logo}</svg>`;
  const png = await sharp(Buffer.from(icon)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
