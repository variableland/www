declare module "@variableland/brand/assets/land/land.mjs" {
  export const top: { x: number; y: number; v: number };
  export function mapPaths(options?: { step?: number; eps?: number; logo?: number }): string;
}
