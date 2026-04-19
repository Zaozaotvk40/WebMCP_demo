import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeEmptyGrid } from './grid';
import type { Grid } from './grid';
import { useWebMCPTools } from './useWebMCPTools';
import type { RegisterToolOptions, WebMCPTool } from './webmcp';

interface ToolStore {
  registered: Map<string, WebMCPTool>;
  registerCalls: number;
}

/**
 * Fake implementation mimicking Chrome 149+ behavior:
 * - registerTool throws on duplicate names
 * - AbortSignal in options removes the tool when aborted
 * - unregisterTool method is absent (removed in 149)
 */
function installFakeModelContext(): ToolStore {
  const store: ToolStore = { registered: new Map(), registerCalls: 0 };
  Object.defineProperty(navigator, 'modelContext', {
    configurable: true,
    value: {
      registerTool: (t: WebMCPTool, options?: RegisterToolOptions) => {
        store.registerCalls++;
        if (store.registered.has(t.name)) {
          throw new Error(`Duplicate tool name: ${t.name}`);
        }
        store.registered.set(t.name, t);
        options?.signal?.addEventListener('abort', () => {
          store.registered.delete(t.name);
        });
      },
      provideContext: ({ tools }: { tools: WebMCPTool[] }) => {
        store.registered.clear();
        for (const t of tools) store.registered.set(t.name, t);
      },
      // Note: no unregisterTool method (matches Chrome 149).
    },
  });
  return store;
}

function uninstallModelContext() {
  Object.defineProperty(navigator, 'modelContext', {
    configurable: true,
    value: undefined,
  });
}

describe('useWebMCPTools', () => {
  let store: ToolStore;

  beforeEach(() => {
    store = installFakeModelContext();
  });

  afterEach(() => {
    uninstallModelContext();
    vi.restoreAllMocks();
  });

  function setupHook(initial?: Grid) {
    const gridRef = { current: initial ?? makeEmptyGrid() };
    const setDot = vi.fn<(row: number, col: number, on: boolean) => void>();
    const setDots = vi.fn<(dots: { row: number; col: number; on: boolean }[]) => void>();
    const hook = renderHook(() =>
      useWebMCPTools({ gridRef, setDot, setDots }),
    );
    return { gridRef, setDot, setDots, hook };
  }

  it('registers all three tools on mount', () => {
    setupHook();
    expect(store.registered.has('set_dot')).toBe(true);
    expect(store.registered.has('set_dots')).toBe(true);
    expect(store.registered.has('get_grid')).toBe(true);
  });

  it('unregisters all tools on unmount via AbortSignal', () => {
    const { hook } = setupHook();
    expect(store.registered.size).toBe(3);
    hook.unmount();
    expect(store.registered.size).toBe(0);
  });

  it('can re-mount without throwing Duplicate tool name', () => {
    const { hook } = setupHook();
    hook.unmount();
    expect(() => setupHook()).not.toThrow();
    expect(store.registered.size).toBe(3);
  });

  it('set_dot handler delegates to setDot and returns a confirmation message', async () => {
    const { setDot } = setupHook();
    const tool = store.registered.get('set_dot')!;
    const result = await tool.execute({ row: 3, col: 5, on: true });
    expect(setDot).toHaveBeenCalledWith(3, 5, true);
    expect(result.content?.[0]).toEqual({ type: 'text', text: 'dot (3,5) = true' });
  });

  it('set_dots handler delegates to setDots and reports the count', async () => {
    const { setDots } = setupHook();
    const tool = store.registered.get('set_dots')!;
    const dots = [
      { row: 0, col: 0, on: true },
      { row: 1, col: 1, on: true },
    ];
    const result = await tool.execute({ dots });
    expect(setDots).toHaveBeenCalledWith(dots);
    expect(result.content?.[0].text).toBe('updated 2 dots');
  });

  it('get_grid handler returns ASCII art in content and raw grid in structuredContent', async () => {
    const initial = makeEmptyGrid();
    initial[0][0] = true;
    const { gridRef } = setupHook(initial);
    const tool = store.registered.get('get_grid')!;
    const result = await tool.execute({});
    const text = result.content?.[0].text ?? '';
    expect(text).toContain('0000000000111111');
    expect(text).toContain('0123456789012345');
    expect(text.split('\n')[2]).toBe(' 0 #...............');
    expect(result.structuredContent).toEqual({
      grid: gridRef.current,
      rows: 16,
      cols: 16,
    });
  });

  it('get_grid reads the current gridRef value (not a snapshot from registration time)', async () => {
    const { gridRef } = setupHook();
    const tool = store.registered.get('get_grid')!;

    gridRef.current[5][5] = true;
    const result = await tool.execute({});
    const rowFive = result.content![0].text.split('\n')[2 + 5];
    expect(rowFive.slice(3)).toBe('.....#..........');
  });

  it('warns and does nothing when navigator.modelContext is missing', () => {
    uninstallModelContext();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    setupHook();
    expect(warn).toHaveBeenCalled();
  });
});
