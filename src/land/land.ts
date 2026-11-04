import { LOGO_RATIO, LOGO_WIDTH, MARK_WIDTH } from "../logo.ts";
import { contours, field, summit } from "./contours.ts";

export const MAP_WIDTH = 2400;
export const MAP_HEIGHT = 2200;

const map = { width: MAP_WIDTH, height: MAP_HEIGHT };

const heightAt = field({
  seed: 11,
  noise: 0.2,
  hills: [
    { x: 1200, y: 700, height: 1.0, radius: 330 },
    { x: 1330, y: 830, height: 0.25, radius: 200 },
    { x: 520, y: 1140, height: 0.6, radius: 280 },
    { x: 1900, y: 260, height: 0.55, radius: 260 },
    { x: 2120, y: 1160, height: 0.45, radius: 240 },
    { x: 330, y: 180, height: 0.4, radius: 240 },
    { x: 1000, y: 1720, height: 0.5, radius: 270 },
    { x: 1820, y: 1900, height: 0.55, radius: 290 },
    { x: 260, y: 1980, height: 0.35, radius: 230 },
  ],
});

export const peak = summit(heightAt, { ...map, step: 4 });

const levels = Array.from({ length: 20 }, (_, i) => 0.05 + i * 0.06).filter((level) => level < peak.height - 0.03);

export const contourLines = contours(heightAt, { ...map, step: 7, levels, indexEvery: 5, epsilon: 1.4 });

const clearingWidth = MARK_WIDTH * 1.4;
const clearingHeight = clearingWidth * LOGO_RATIO;

export const clearingTransform = `translate(${(peak.x - clearingWidth / 2).toFixed(1)} ${(peak.y - clearingHeight / 2).toFixed(1)}) scale(${(clearingWidth / LOGO_WIDTH).toFixed(4)})`;
