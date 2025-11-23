import { useState, useCallback } from 'react';
import { Position } from '../types';

interface SelectionBox {
  start: Position;
  current: Position;
}

export const useSelection = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  const selectItem = useCallback((id: string, multi: boolean = false) => {
    setSelectedIds((prev) => {
      if (multi) {
        return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      }
      return [id];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const startSelectionBox = useCallback((pos: Position) => {
    setSelectionBox({ start: pos, current: pos });
  }, []);

  const updateSelectionBox = useCallback((pos: Position) => {
    setSelectionBox((prev) => (prev ? { ...prev, current: pos } : null));
  }, []);

  const endSelectionBox = useCallback(() => {
    setSelectionBox(null);
  }, []);

  return {
    selectedIds,
    setSelectedIds,
    selectionBox,
    selectItem,
    clearSelection,
    startSelectionBox,
    updateSelectionBox,
    endSelectionBox,
  };
};
