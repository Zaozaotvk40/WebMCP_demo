import { useEffect } from 'react';
import type { RefObject } from 'react';
import { gridToAscii } from './gridAscii';
import type { DotUpdate, Grid } from './grid';

export type { DotUpdate } from './grid';

interface Params {
  gridRef: RefObject<Grid>;
  setDot: (row: number, col: number, on: boolean) => void;
  setDots: (dots: DotUpdate[]) => void;
}

export function useWebMCPTools({ gridRef, setDot, setDots }: Params) {
  useEffect(() => {
    const mc = navigator.modelContext;
    if (!mc) {
      console.warn(
        '[WebMCP] navigator.modelContext is not available. Requires Chrome 146+ with WebMCP enabled.',
      );
      return;
    }

    mc.registerTool({
      name: 'set_dot',
      description:
        'Set a single dot on/off in the 16x16 grid. Use this for small corrections after calling get_grid.',
      inputSchema: {
        type: 'object',
        properties: {
          row: { type: 'integer', minimum: 0, maximum: 15, description: 'Row index 0-15 (top to bottom)' },
          col: { type: 'integer', minimum: 0, maximum: 15, description: 'Column index 0-15 (left to right)' },
          on: { type: 'boolean', description: 'true to turn the dot on, false to turn it off' },
        },
        required: ['row', 'col', 'on'],
      },
      execute: (input) => {
        const { row, col, on } = input as { row: number; col: number; on: boolean };
        setDot(row, col, on);
        return {
          content: [{ type: 'text', text: `dot (${row},${col}) = ${on}` }],
        };
      },
    });

    mc.registerTool({
      name: 'set_dots',
      description:
        'Batch-update many dots in one call. Prefer this over repeated set_dot when drawing a shape (smiley, letter, pattern).',
      inputSchema: {
        type: 'object',
        properties: {
          dots: {
            type: 'array',
            description: 'List of dot updates. Each item: {row:0-15, col:0-15, on:boolean}.',
            items: {
              type: 'object',
              properties: {
                row: { type: 'integer', minimum: 0, maximum: 15 },
                col: { type: 'integer', minimum: 0, maximum: 15 },
                on: { type: 'boolean' },
              },
              required: ['row', 'col', 'on'],
            },
          },
        },
        required: ['dots'],
      },
      execute: (input) => {
        const { dots } = input as { dots: DotUpdate[] };
        setDots(dots);
        return {
          content: [{ type: 'text', text: `updated ${dots.length} dots` }],
        };
      },
    });

    mc.registerTool({
      name: 'get_grid',
      description:
        'Render the current 16x16 grid as an ASCII map with row/column number headers. "#" means on, "." means off. Use this to verify what you just drew and locate errors by coordinate.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => {
        const g = gridRef.current;
        return {
          content: [{ type: 'text', text: gridToAscii(g) }],
          structuredContent: { grid: g, rows: g.length, cols: g[0]?.length ?? 0 },
        };
      },
    });

    return () => {
      mc.unregisterTool('set_dot');
      mc.unregisterTool('set_dots');
      mc.unregisterTool('get_grid');
    };
  }, [gridRef, setDot, setDots]);
}
