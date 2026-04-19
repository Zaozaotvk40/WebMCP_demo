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

      <footer className="notes">
        <h2>動作確認の前提</h2>
        <ol>
          <li>
            <strong>Chrome 149 以上</strong>が必要。起動時に
            <code>--remote-debugging-port=9222</code> オプションを付ける。
          </li>
          <li>
            以下の 2 つのフラグを <strong>Enabled</strong> にする:
            <ul>
              <li><code>chrome://flags/#devtools-webmcp-support</code></li>
              <li><code>chrome://flags/#enable-webmcp-testing</code></li>
            </ul>
          </li>
          <li>
            <code>chrome-devtools-mcp</code> 側は現在のリリースではまだ動作しない。
            <strong>0.22.0 以降</strong>での対応を見込み。
          </li>
          <li>
            現状、手軽に動作確認するには Chrome 拡張{' '}
            <strong>WebMCP - Model Context Tool Inspector</strong> を
            インストールし、以下のいずれかで実行:
            <ul>
              <li>ツールと入力を手動で設定して呼び出す</li>
              <li>Gemini の API キーを使って動作確認</li>
            </ul>
            なお Inspector 拡張については{' '}
            <code>chrome://flags/#enable-webmcp-testing</code> を有効にした
            <strong>Chrome 146</strong> でも動作する。
          </li>
        </ol>
      </footer>
    </div>
  );
}

export default App;
