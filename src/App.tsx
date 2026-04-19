import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebMCPTools, type DotUpdate } from './useWebMCPTools';
import './App.css';

const SIZE = 16;

function makeEmptyGrid(): boolean[][] {
  return Array.from({ length: SIZE }, () => Array<boolean>(SIZE).fill(false));
}

function App() {
  const [grid, setGrid] = useState<boolean[][]>(makeEmptyGrid);
  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const [mcpAvailable] = useState<boolean>(
    () => typeof navigator !== 'undefined' && !!navigator.modelContext,
  );

  const setDot = useCallback((row: number, col: number, on: boolean) => {
    setGrid((prev) => {
      if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return prev;
      if (prev[row][col] === on) return prev;
      const next = prev.map((r) => r.slice());
      next[row][col] = on;
      return next;
    });
  }, []);

  const setDots = useCallback((dots: DotUpdate[]) => {
    setGrid((prev) => {
      const next = prev.map((r) => r.slice());
      for (const d of dots) {
        if (d.row < 0 || d.row >= SIZE || d.col < 0 || d.col >= SIZE) continue;
        next[d.row][d.col] = d.on;
      }
      return next;
    });
  }, []);

  const clearGrid = useCallback(() => setGrid(makeEmptyGrid()), []);

  useWebMCPTools({ gridRef, setDot, setDots });

  return (
    <div className="app">
      <header>
        <h1>WebMCP 16×16 Dot Grid Demo</h1>
        <p className="subtitle">
          AIがWebMCP経由でドットを操作・確認できるデモ。クリックで手動トグルも可能。
        </p>
        <p className={`status ${mcpAvailable ? 'ok' : 'warn'}`}>
          {mcpAvailable
            ? '✓ navigator.modelContext detected — WebMCP tools are registered.'
            : '⚠ navigator.modelContext not found. Open in Chrome 146+ with WebMCP enabled.'}
        </p>
      </header>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 32px)` }}
        role="grid"
        aria-label="16 by 16 dot grid"
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              className={`cell ${cell ? 'on' : 'off'}`}
              role="gridcell"
              aria-label={`row ${r} col ${c} ${cell ? 'on' : 'off'}`}
              onClick={() => setDot(r, c, !cell)}
            />
          )),
        )}
      </div>

      <div className="controls">
        <button type="button" onClick={clearGrid}>
          Clear
        </button>
        <span className="hint">
          Tools: <code>set_dot</code>, <code>set_dots</code>, <code>get_grid</code>
        </span>
      </div>
    </div>
  );
}

export default App;
