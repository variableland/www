import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { create, type Font } from "fontkit";
import { decompress } from "woff2-encoder";
import tokens from "../brand/tokens.json";

export type PlaceName = { paths: string; width: number; capHeight: number; ascent: number; descent: number };

const require = createRequire(import.meta.url);
const fontFile = "@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2";

async function newsreader(): Promise<Font> {
  const woff2 = await readFile(require.resolve(fontFile));
  return create(Buffer.from(await decompress(woff2))) as Font;
}

export async function placeName(text: string, size: number): Promise<PlaceName> {
  const step = tokens.type.place;
  const font = (await newsreader()).getVariation({ wght: Number(step.weight), opsz: size });
  const scale = size / font.unitsPerEm;
  const tracking = Number.parseFloat(step.tracking) * size;
  const run = font.layout(text);
  const paths: string[] = [];
  let x = 0;
  run.glyphs.forEach((glyph, i) => {
    const position = run.positions[i];
    if (!position) return;
    const left = (x + position.xOffset * scale).toFixed(2);
    const top = (-position.yOffset * scale).toFixed(2);
    paths.push(`<path transform="translate(${left} ${top}) scale(${scale} ${-scale})" d="${glyph.path.toSVG()}"/>`);
    x += position.xAdvance * scale + tracking;
  });
  return {
    paths: paths.join(""),
    width: x,
    capHeight: font.capHeight * scale,
    ascent: font.ascent * scale,
    descent: -font.descent * scale,
  };
}
