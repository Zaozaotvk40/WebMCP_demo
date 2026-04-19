import { memo, useCallback } from 'react';
import type { Grid } from './grid';

interface CellProps {
  row: number;
  col: number;
  on: boolean;
  onToggle: (row: number, col: number, current: boolean) => void;
}

const Cell = memo(function Cell({ row, col, on, onToggle }: CellProps) {
  return (
    <button
      className={`cell ${on ? 'on' : 'off'}`}
      role="gridcell"
      aria-label={`row ${row} col ${col} ${on ? 'on' : 'off'}`}
      onClick={() => onToggle(row, col, on)}
    />
  );
});

interface DotGridProps {
  grid: Grid;
  cellPx?: number;
  onToggle: (row: number, col: number, current: boolean) => void;
}

export function DotGrid({ grid, cellPx = 32, onToggle }: DotGridProps) {
  const cols = grid[0]?.length ?? 0;

  const handleToggle = useCallback(
    (row: number, col: number, current: boolean) => onToggle(row, col, current),
    [onToggle],
  );

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${cols}, ${cellPx}px)` }}
      role="grid"
      aria-label={`${grid.length} by ${cols} dot grid`}
    >
      {grid.map((row, r) =>
        row.map((on, c) => (
          <Cell key={`${r}-${c}`} row={r} col={c} on={on} onToggle={handleToggle} />
        )),
      )}
    </div>
  );
}
