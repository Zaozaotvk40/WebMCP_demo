import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import {
  applyDotsToGrid,
  makeEmptyGrid,
  setDotInGrid,
  type DotUpdate,
  type Grid,
} from './grid';

export interface UseGridResult {
  grid: Grid;
  gridRef: RefObject<Grid>;
  setDot: (row: number, col: number, on: boolean) => void;
  setDots: (dots: DotUpdate[]) => void;
  clear: () => void;
}

export function useGrid(): UseGridResult {
  const [grid, setGrid] = useState<Grid>(makeEmptyGrid);

  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const setDot = useCallback((row: number, col: number, on: boolean) => {
    setGrid((prev) => setDotInGrid(prev, row, col, on));
  }, []);

  const setDots = useCallback((dots: DotUpdate[]) => {
    setGrid((prev) => applyDotsToGrid(prev, dots));
  }, []);

  const clear = useCallback(() => {
    setGrid(makeEmptyGrid());
  }, []);

  return { grid, gridRef, setDot, setDots, clear };
}
