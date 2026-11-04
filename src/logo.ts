import logo from "@variableland/brand/assets/logo.svg?raw";

const [, width = "1", height = "1"] = logo.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) ?? [];

export const LOGO_RATIO = Number(height) / Number(width);
export const MARK_WIDTH = 64;

export function logoSvg(attributes: Record<string, string | number> = {}): string {
  const extra = Object.entries(attributes)
    .map(([name, value]) => ` ${name}="${value}"`)
    .join("");
  return logo.replace("<svg", `<svg${extra}`);
}
