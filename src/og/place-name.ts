import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import tokens from "@variableland/brand/tokens.json";
import { Blob, Face, Font, Buffer as GlyphBuffer, shape, Variation } from "harfbuzzjs";
import { decompress } from "woff2-encoder";

export type PlaceName = { paths: string; width: number; ascent: number; descent: number; unitsPerPixel: number };

const require = createRequire(import.meta.url);
const fontFile = "@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2";

export async function placeName(text: string, size: number): Promise<PlaceName> {
  const step = tokens.type.place;
  const face = new Face(new Blob(await decompress(await readFile(require.resolve(fontFile)))));
  const font = new Font(face);
  font.setVariations([new Variation("wght", Number(step.weight)), new Variation("opsz", size)]);

  const glyphs = new GlyphBuffer();
  glyphs.addText(text);
  glyphs.guessSegmentProperties();
  shape(font, glyphs);

  const scale = size / face.upem;
  const tracking = Number.parseFloat(step.tracking) * size;
  const positions = glyphs.getGlyphPositions();
  const paths: string[] = [];
  let x = 0;
  glyphs.getGlyphInfos().forEach((glyph, i) => {
    const position = positions[i];
    if (!position) return;
    const left = (x + position.xOffset * scale).toFixed(3);
    const top = (-position.yOffset * scale).toFixed(3);
    paths.push(
      `<path transform="translate(${left} ${top}) scale(${scale} ${-scale})" d="${font.glyphToPath(glyph.codepoint)}"/>`,
    );
    x += position.xAdvance * scale + tracking;
  });

  const extents = font.hExtents();
  return {
    paths: paths.join(""),
    width: x,
    ascent: extents.ascender * scale,
    descent: -extents.descender * scale,
    unitsPerPixel: 1 / scale,
  };
}
