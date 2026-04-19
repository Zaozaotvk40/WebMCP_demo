import { describe, expect, it } from 'vitest';
import {
  applyDotsToGrid,
  GRID_SIZE,
  makeEmptyGrid,
  setDotInGrid,
} from './grid';

describe('makeEmptyGrid', () => {
  it('creates a 16x16 all-false grid by default', () => {
    const g = makeEmptyGrid();
    expect(g).toHaveLength(GRID_SIZE);
    expect(g.every((r) => r.length === GRID_SIZE)).toBe(true);
    expect(g.flat().every((c) => c === false)).toBe(true);
  });

  it('respects a custom size', () => {
    const g = makeEmptyGrid(4);
    expect(g).toHaveLength(4);
    expect(g[0]).toHaveLength(4);
  });

  it('returns independent row arrays', () => {
    const g = makeEmptyGrid(3);
    g[0][0] = true;
    expect(g[1][0]).toBe(false);
  });
});

describe('setDotInGrid', () => {
  it('sets a dot at the given coordinates', () => {
    const g = makeEmptyGrid();
    const next = setDotInGrid(g, 3, 5, true);
    expect(next[3][5]).toBe(true);
  });

  it('returns a new grid object (immutability)', () => {
    const g = makeEmptyGrid();
    const next = setDotInGrid(g, 3, 5, true);
    expect(next).not.toBe(g);
    expect(g[3][5]).toBe(false);
  });

  it('returns the same grid reference when value is unchanged', () => {
    const g = makeEmptyGrid();
    const next = setDotInGrid(g, 3, 5, false);
    expect(next).toBe(g);
  });

  it('ignores out-of-bounds coordinates', () => {
    const g = makeEmptyGrid();
    expect(setDotInGrid(g, -1, 0, true)).toBe(g);
    expect(setDotInGrid(g, 16, 0, true)).toBe(g);
    expect(setDotInGrid(g, 0, -1, true)).toBe(g);
    expect(setDotInGrid(g, 0, 16, true)).toBe(g);
  });

  it('only shallow-copies the mutated row (structural sharing)', () => {
    const g = makeEmptyGrid();
    const next = setDotInGrid(g, 3, 5, true);
    expect(next[3]).not.toBe(g[3]);
  });
});

describe('applyDotsToGrid', () => {
  it('applies multiple updates in one pass', () => {
    const g = makeEmptyGrid();
    const next = applyDotsToGrid(g, [
      { row: 0, col: 0, on: true },
      { row: 15, col: 15, on: true },
      { row: 7, col: 8, on: true },
    ]);
    expect(next[0][0]).toBe(true);
    expect(next[15][15]).toBe(true);
    expect(next[7][8]).toBe(true);
  });

  it('returns the same grid when dots array is empty', () => {
    const g = makeEmptyGrid();
    expect(applyDotsToGrid(g, [])).toBe(g);
  });

  it('returns the same grid when no dot actually changes', () => {
    const g = makeEmptyGrid();
    const result = applyDotsToGrid(g, [
      { row: 0, col: 0, on: false },
      { row: 1, col: 1, on: false },
    ]);
    expect(result).toBe(g);
  });

  it('skips out-of-bounds dots but still applies valid ones', () => {
    const g = makeEmptyGrid();
    const next = applyDotsToGrid(g, [
      { row: -1, col: 0, on: true },
      { row: 5, col: 5, on: true },
      { row: 99, col: 99, on: true },
    ]);
    expect(next[5][5]).toBe(true);
    expect(next).not.toBe(g);
  });

  it('does not mutate the input grid', () => {
    const g = makeEmptyGrid();
    applyDotsToGrid(g, [{ row: 0, col: 0, on: true }]);
    expect(g[0][0]).toBe(false);
  });

  it('supports mixed on/off updates', () => {
    const g = applyDotsToGrid(makeEmptyGrid(), [
      { row: 0, col: 0, on: true },
      { row: 0, col: 1, on: true },
    ]);
    const next = applyDotsToGrid(g, [
      { row: 0, col: 0, on: false },
      { row: 0, col: 2, on: true },
    ]);
    expect(next[0][0]).toBe(false);
    expect(next[0][1]).toBe(true);
    expect(next[0][2]).toBe(true);
  });
});
