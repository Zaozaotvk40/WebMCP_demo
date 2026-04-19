import { useState } from 'react';
import { DotGrid } from './DotGrid';
import { useGrid } from './useGrid';
import { useWebMCPTools } from './useWebMCPTools';
import './App.css';

function App() {
  const { grid, gridRef, setDot, setDots, clear } = useGrid();

  const [mcpAvailable] = useState<boolean>(
    () => typeof navigator !== 'undefined' && !!navigator.modelContext,
  );

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

      <DotGrid
        grid={grid}
        onToggle={(r, c, current) => setDot(r, c, !current)}
      />

      <div className="controls">
        <button type="button" onClick={clear}>
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
