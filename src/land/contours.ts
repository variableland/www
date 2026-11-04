export type HeightField = (x: number, y: number) => number;

export type Point = { x: number; y: number };

export type Peak = Point & { height: number };

export type Hill = Peak & { radius: number };

export type Terrain = { hills: Hill[]; noise: number; seed: number };

export type Area = { width: number; height: number; step: number };

export type Tracing = Area & { levels: number[]; indexEvery: number; epsilon: number };

export type Contour = { isIndex: boolean; d: string };

const NOISE_SIZE = 64;
const SMOOTHING_ROUNDS = 2;
const MIN_LINE_POINTS = 6;

type EdgePoint = Point & { edge: string };

type Segment = [EdgePoint, EdgePoint];

type Line = EdgePoint[];

type Grid = { columns: number; rows: number; values: Float64Array };

function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function valueNoise(seed: number): HeightField {
  const grid = Array.from({ length: NOISE_SIZE * NOISE_SIZE }, random(seed));
  const wrap = (n: number) => ((n % NOISE_SIZE) + NOISE_SIZE) % NOISE_SIZE;
  const at = (x: number, y: number) => grid[wrap(y) * NOISE_SIZE + wrap(x)] ?? 0;
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (x, y) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const sx = smooth(x - x0);
    const sy = smooth(y - y0);
    const a = at(x0, y0);
    const b = at(x0 + 1, y0);
    const c = at(x0, y0 + 1);
    const d = at(x0 + 1, y0 + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  };
}

export function field({ hills, noise, seed }: Terrain): HeightField {
  const coarse = valueNoise(seed);
  const fine = valueNoise(seed + 1);
  return (x, y) => {
    let height = 0;
    for (const hill of hills) {
      const dx = x - hill.x;
      const dy = y - hill.y;
      height += hill.height * Math.exp(-(dx * dx + dy * dy) / (2 * hill.radius * hill.radius));
    }
    height += noise * (coarse(x / 140, y / 140) - 0.5) + noise * 0.5 * (fine(x / 55, y / 55) - 0.5);
    return height;
  };
}

function sample(heightAt: HeightField, { width, height, step }: Area): Grid {
  const columns = Math.ceil(width / step) + 1;
  const rows = Math.ceil(height / step) + 1;
  const values = new Float64Array(columns * rows);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) values[j * columns + i] = heightAt(i * step, j * step);
  }
  return { columns, rows, values };
}

function segments({ columns, rows, values }: Grid, step: number, level: number): Segment[] {
  const found: Segment[] = [];
  const at = (i: number, j: number) => values[j * columns + i] ?? 0;
  const crossing = (from: number, to: number) => (level - from) / (to - from);
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < columns - 1; i++) {
      const a = at(i, j);
      const b = at(i + 1, j);
      const c = at(i + 1, j + 1);
      const d = at(i, j + 1);
      const corners = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (corners === 0 || corners === 15) continue;
      const x = i * step;
      const y = j * step;
      const top = (): EdgePoint => ({ edge: `h${i},${j}`, x: x + crossing(a, b) * step, y });
      const right = (): EdgePoint => ({ edge: `v${i + 1},${j}`, x: x + step, y: y + crossing(b, c) * step });
      const bottom = (): EdgePoint => ({ edge: `h${i},${j + 1}`, x: x + crossing(d, c) * step, y: y + step });
      const left = (): EdgePoint => ({ edge: `v${i},${j}`, x, y: y + crossing(a, d) * step });
      const centerAbove = (a + b + c + d) / 4 > level;
      switch (corners) {
        case 1:
        case 14:
          found.push([left(), bottom()]);
          break;
        case 2:
        case 13:
          found.push([bottom(), right()]);
          break;
        case 3:
        case 12:
          found.push([left(), right()]);
          break;
        case 4:
        case 11:
          found.push([top(), right()]);
          break;
        case 6:
        case 9:
          found.push([top(), bottom()]);
          break;
        case 7:
        case 8:
          found.push([left(), top()]);
          break;
        case 5:
          if (centerAbove) found.push([left(), top()], [bottom(), right()]);
          else found.push([left(), bottom()], [top(), right()]);
          break;
        case 10:
          if (centerAbove) found.push([left(), bottom()], [top(), right()]);
          else found.push([left(), top()], [bottom(), right()]);
          break;
      }
    }
  }
  return found;
}

function chain(found: Segment[]): Line[] {
  const byEdge = new Map<string, Segment[]>();
  const add = (edge: string, segment: Segment) => {
    const list = byEdge.get(edge);
    if (list) list.push(segment);
    else byEdge.set(edge, [segment]);
  };
  for (const segment of found) {
    add(segment[0].edge, segment);
    add(segment[1].edge, segment);
  }
  const used = new Set<Segment>();
  const lines: Line[] = [];
  for (const segment of found) {
    if (used.has(segment)) continue;
    used.add(segment);
    const line: Line = [segment[0], segment[1]];
    for (const forward of [true, false]) {
      for (;;) {
        const tip = forward ? line[line.length - 1] : line[0];
        if (!tip) break;
        const next = byEdge.get(tip.edge)?.find((candidate) => !used.has(candidate));
        if (!next) break;
        used.add(next);
        const point = next[0].edge === tip.edge ? next[1] : next[0];
        if (forward) line.push(point);
        else line.unshift(point);
      }
    }
    lines.push(line);
  }
  return lines;
}

function chaikin(points: Point[], closed: boolean): Point[] {
  let current = points;
  for (let round = 0; round < SMOOTHING_ROUNDS; round++) {
    const first = current[0];
    const last = current[current.length - 1];
    const next: Point[] = closed || !first ? [] : [first];
    const count = closed ? current.length : current.length - 1;
    for (let i = 0; i < count; i++) {
      const a = current[i];
      const b = current[(i + 1) % current.length];
      if (!a || !b) continue;
      next.push(
        { x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 },
        { x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 },
      );
    }
    if (!closed && last) next.push(last);
    current = next;
  }
  return current;
}

function simplify<T extends Point>(points: T[], epsilon: number): T[] {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];
  for (let span = stack.pop(); span; span = stack.pop()) {
    const [from, to] = span;
    const start = points[from];
    const end = points[to];
    if (!start || !end) continue;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    let farthest = -1;
    let max = epsilon;
    for (let i = from + 1; i < to; i++) {
      const point = points[i];
      if (!point) continue;
      const distance = Math.abs(dy * point.x - dx * point.y + end.x * start.y - end.y * start.x) / length;
      if (distance > max) {
        max = distance;
        farthest = i;
      }
    }
    if (farthest >= 0) {
      keep[farthest] = 1;
      stack.push([from, farthest], [farthest, to]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function toPath(line: Line, epsilon: number): string {
  const closed = line.length > 3 && line[0]?.edge === line[line.length - 1]?.edge;
  const points = chaikin(simplify(closed ? line.slice(0, -1) : line, epsilon), closed);
  const commands: string[] = [];
  for (const point of points) {
    const command = `${Math.round(point.x)} ${Math.round(point.y)}`;
    if (command !== commands[commands.length - 1]) commands.push(command);
  }
  return `M${commands.join("L")}${closed ? "Z" : ""}`;
}

export function contours(heightAt: HeightField, { levels, indexEvery, epsilon, ...area }: Tracing): Contour[] {
  const grid = sample(heightAt, area);
  return levels.map((level, n) => {
    const lines = chain(segments(grid, area.step, level)).filter((line) => line.length >= MIN_LINE_POINTS);
    return { isIndex: n % indexEvery === indexEvery - 1, d: lines.map((line) => toPath(line, epsilon)).join("") };
  });
}

export function summit(heightAt: HeightField, { width, height, step }: Area): Peak {
  let peak: Peak = { x: 0, y: 0, height: Number.NEGATIVE_INFINITY };
  for (let y = 0; y <= height; y += step) {
    for (let x = 0; x <= width; x += step) {
      const here = heightAt(x, y);
      if (here > peak.height) peak = { x, y, height: here };
    }
  }
  return peak;
}
