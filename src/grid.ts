export const GRID_SIZE = 16;

export type Grid = boolean[][];

export interface DotUpdate {
  row: number;
  col: number;
  on: boolean;
}

export function makeEmptyGrid(size: number = GRID_SIZE): Grid {
  return Array.from({ length: size }, () => Array<boolean>(size).fill(false));
}

function inBounds(grid: Grid, row: number, col: number): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < (grid[0]?.length ?? 0);
}

export function setDotInGrid(grid: Grid, row: number, col: number, on: boolean): Grid {
  if (!inBounds(grid, row, col)) return grid;
  if (grid[row][col] === on) return grid;
  const next = grid.map((r) => r.slice());
  next[row][col] = on;
  return next;
}

export function applyDotsToGrid(grid: Grid, dots: DotUpdate[]): Grid {
  if (dots.length === 0) return grid;
  const next = grid.map((r) => r.slice());
  let mutated = false;
  for (const d of dots) {
    if (!inBounds(next, d.row, d.col)) continue;
    if (next[d.row][d.col] !== d.on) {
      next[d.row][d.col] = d.on;
      mutated = true;
    }
  }
  return mutated ? next : grid;
}
