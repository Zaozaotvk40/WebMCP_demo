# WebMCP 16×16 Dot Grid Demo

[**Live Demo**](https://zaozaotvk40.github.io/WebMCP_demo/)

16×16 のドットグリッドを React で描画し、AI エージェントが [WebMCP](https://webmachinelearning.github.io/webmcp/) (`navigator.modelContext`) 経由でドットを操作・確認できるデモです。

---

## デモの目的

単なる API 動作確認ではなく、**「AI が自分の出力を視覚的に検証して修正する」フィードバックループ**を可視化することが目的です。

1. AI が `set_dots` で絵（例: 笑顔）を一括描画
2. AI が `get_grid` で結果を ASCII art として確認
3. AI が誤りを空間的に認識し、`set_dot` で修正
4. 再度 `get_grid` で確認

人間は画面上のセルをクリックして手動トグルでき、AI 操作とリアルタイムに混在します。

---

## 公開ツール (MCP Tools)

| ツール | 説明 |
|--------|------|
| `set_dot` | 1 つのセル `(row, col)` を on/off |
| `set_dots` | 複数セルを一括更新（主要な描画手段） |
| `get_grid` | グリッドを ASCII art + 生配列の二重表現で返す |

---

## 動作確認方法

### ~~方法 A: chrome-devtools-mcp を使う（Chrome 149+）~~

~~1. **Chrome 149 以上**で起動。起動オプションに `--remote-debugging-port=9222` を追加。~~
~~2. 以下のフラグを **Enabled** にする:~~
   - ~~`chrome://flags/#devtools-webmcp-support`~~
   - ~~`chrome://flags/#enable-webmcp-testing`~~
~~3. MCP クライアントの設定は [.mcp.json](.mcp.json) を参照。~~

> ~~`chrome-devtools-mcp` は現在のリリースではまだ動作しません。**0.22.0 以降**での対応を見込んでいます。~~

### 方法 B: WebMCP - Model Context Tool Inspector 拡張を使う

Chrome 拡張 **WebMCP - Model Context Tool Inspector** をインストールし、以下のいずれかで実行:

- ツールと入力を手動で設定して呼び出す
- Gemini の API キーを使って動作確認

> Inspector 拡張は `chrome://flags/#enable-webmcp-testing` を有効にした **Chrome 146** でも動作します。

---

## ローカル開発

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # ユニットテスト (vitest)
npm run build    # 本番ビルド
```

---

## 技術スタック

- Vite 8 + React 19 + TypeScript
- `navigator.modelContext` を直接使用（追加依存ゼロ）
- Vitest + @testing-library/react

---

## 参考

- [W3C WebMCP Community Group](https://webmachinelearning.github.io/webmcp/)
- [Chrome 早期プレビュー告知](https://developer.chrome.com/blog/webmcp-epp)
- [Scalekit 解説記事](https://www.scalekit.com/blog/webmcp-the-missing-bridge-between-ai-agents-and-the-web)
- [Qiita 日本語解説](https://qiita.com/ho-rai/items/443a037674ec028b1524)
