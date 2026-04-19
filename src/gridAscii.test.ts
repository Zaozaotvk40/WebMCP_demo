import { describe, expect, it } from 'vitest';
import { gridToAscii } from './gridAscii';
import { applyDotsToGrid, makeEmptyGrid } from './grid';

describe('gridToAscii', () => {
  it('renders an empty 16x16 grid with all dots', () => {
    const out = gridToAscii(makeEmptyGrid());
    const lines = out.split('\n');
    // 2 header rows + 16 data rows
    expect(lines).toHaveLength(18);
    // Every data row contains exactly 16 "." and no "#"
    for (const line of lines.slice(2)) {
      const cellPart = line.slice(3);
      expect(cellPart).toBe('.'.repeat(16));
    }
  });

  it('prepends a two-line column number header (tens and ones)', () => {
    const lines = gridToAscii(makeEmptyGrid()).split('\n');
    expect(lines[0]).toBe('   0000000000111111');
    expect(lines[1]).toBe('   0123456789012345');
  });

  it('prefixes each data row with a right-aligned two-char row index', () => {
    const lines = gridToAscii(makeEmptyGrid()).split('\n').slice(2);
    expect(lines[0].slice(0, 3)).toBe(' 0 ');
    expect(lines[9].slice(0, 3)).toBe(' 9 ');
    expect(lines[10].slice(0, 3)).toBe('10 ');
    expect(lines[15].slice(0, 3)).toBe('15 ');
  });

  it('uses # for on and . for off', () => {
    const g = applyDotsToGrid(makeEmptyGrid(), [
      { row: 0, col: 0, on: true },
      { row: 0, col: 15, on: true },
      { row: 15, col: 0, on: true },
    ]);
    const lines = gridToAscii(g).split('\n');
    expect(lines[2].slice(3)).toBe('#..............#'); // row 0
    expect(lines[17].slice(3)).toBe('#...............'); // row 15
  });

  it('round-trips a smiley pattern into a readable shape', () => {
    const smiley = [
      { row: 3, col: 5, on: true }, // left eye
      { row: 3, col: 10, on: true }, // right eye
      { row: 7, col: 5, on: true }, // mouth corner
      { row: 7, col: 10, on: true },
      { row: 8, col: 6, on: true },
      { row: 8, col: 7, on: true },
      { row: 8, col: 8, on: true },
      { row: 8, col: 9, on: true },
    ];
    const out = gridToAscii(applyDotsToGrid(makeEmptyGrid(), smiley));
    expect(out).toContain('#....#'); // mouth corners separated
    expect(out).toContain('.####.'); // mouth bottom
  });

  it('handles non-square grids', () => {
    const g: boolean[][] = [
      [true, false, true],
      [false, true, false],
    ];
    const lines = gridToAscii(g).split('\n');
    expect(lines[1]).toBe('   012');
    expect(lines[2]).toBe(' 0 #.#');
    expect(lines[3]).toBe(' 1 .#.');
  });
});
