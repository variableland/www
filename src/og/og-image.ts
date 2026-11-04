import sharp from "sharp";
import tokens from "../brand/tokens.json";
import { content } from "../content.ts";
import { clearingTransform, contourLines, peak } from "../land/land.ts";
import { LOGO_RATIO, logoHull, logoSvg, MARK_WIDTH } from "../logo.ts";
import { placeName } from "./place-name.ts";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const SCALE = 1.3;
const PLACE_GAP = 20;
const PLATE = { top: 0.06, side: 0.16, bottom: 0.1 };
const LINE_WIDTH = { line: 1, index: 1.25 };

const color = (name: keyof typeof tokens.color) => tokens.color[name].light;

export async function ogImage(): Promise<Uint8Array<ArrayBuffer>> {
  const mark = MARK_WIDTH * SCALE;
  const gap = PLACE_GAP * SCALE;
  const size = Number.parseFloat(tokens.type.place.size) * SCALE;
  const lineHeight = Number(tokens.type.place["line-height"]) * size;
  const name = await placeName(content.name, size);

  const left = (OG_WIDTH - (mark + gap + name.width)) / 2;
  const summit = { x: left + mark / 2, y: OG_HEIGHT / 2 };
  const textX = left + mark + gap;
  const baseline = summit.y + name.capHeight / 2;
  const lineTop = baseline - name.ascent - (lineHeight - name.ascent - name.descent) / 2;

  const map = `<g transform="translate(${summit.x - peak.x * SCALE} ${summit.y - peak.y * SCALE}) scale(${SCALE})" fill="none" stroke-linejoin="round">${contourLines
    .map(
      (line) =>
        `<path d="${line.d}" stroke="${color(line.isIndex ? "line-index" : "line")}" stroke-width="${(line.isIndex ? LINE_WIDTH.index : LINE_WIDTH.line) / SCALE}"/>`,
    )
    .join("")}<path transform="${clearingTransform}" d="${logoHull}" fill="${color("paper")}"/></g>`;
  const plate = `<rect x="${textX - PLATE.side * size}" y="${lineTop - PLATE.top * size}" width="${name.width + 2 * PLATE.side * size}" height="${lineHeight + (PLATE.top + PLATE.bottom) * size}" fill="${color("paper")}"/>`;
  const logo = logoSvg({ x: summit.x - mark / 2, y: summit.y - (mark * LOGO_RATIO) / 2, width: mark });
  const text = `<g transform="translate(${textX} ${baseline})" fill="${color("ink")}">${name.paths}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}"><rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${color("paper")}"/>${map}${plate}${logo}${text}</svg>`;
  return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer());
}
