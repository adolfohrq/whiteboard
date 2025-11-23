import React, { useState, useCallback } from 'react';
import { Position } from '../types';

export const useCanvasControls = () => {
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState<Position>({ x: 0, y: 0 });

  const startPan = useCallback((e: React.MouseEvent) => {
    setIsPanning(true);
    setLastPanPos({ x: e.clientX, y: e.clientY });
  }, []);

  const updatePan = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - lastPanPos.x;
      const dy = e.clientY - lastPanPos.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPos({ x: e.clientX, y: e.clientY });
    },
    [isPanning, lastPanPos]
  );

  const endPan = useCallback(() => {
    setIsPanning(false);
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.1, 2)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.1, 0.2)), []);

  // Reset Viewport to center (optional utility)
  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  return {
    pan,
    setPan, // Exposed if manual override needed
    zoom,
    setZoom, // Exposed if manual override needed
    isPanning,
    startPan,
    updatePan,
    endPan,
    zoomIn,
    zoomOut,
    resetView,
  };
};
