export function gridToAscii(grid: boolean[][]): string {
  const cols = grid[0]?.length ?? 0;
  const headerTens =
    '   ' + Array.from({ length: cols }, (_, i) => Math.floor(i / 10)).join('');
  const headerOnes =
    '   ' + Array.from({ length: cols }, (_, i) => i % 10).join('');
  const rows = grid.map((row, r) => {
    const label = r.toString().padStart(2, ' ');
    const cells = row.map((c) => (c ? '#' : '.')).join('');
    return `${label} ${cells}`;
  });
  return [headerTens, headerOnes, ...rows].join('\n');
}
