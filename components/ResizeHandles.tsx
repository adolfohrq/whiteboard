import React, { useEffect, useState, useCallback } from 'react';
import { Position } from '../types';

interface ResizeHandlesProps {
  width: number;
  height: number;
  onResize: (width: number, height: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  minWidth?: number;
  minHeight?: number;
  zoom?: number;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  width,
  height,
  onResize,
  onResizeStart,
  onResizeEnd,
  minWidth = 100,
  minHeight = 60,
  zoom = 1,
}) => {
  const [resizing, setResizing] = useState<string | null>(null);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [startDims, setStartDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection
    onResizeStart();
    setResizing(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartDims({ w: width, h: height });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing) return;
      e.preventDefault();

      // Calculate delta respecting zoom
      const dx = (e.clientX - startPos.x) / zoom;
      const dy = (e.clientY - startPos.y) / zoom;

      let newW = startDims.w;
      let newH = startDims.h;

      if (resizing.includes('e')) newW = startDims.w + dx;
      if (resizing.includes('w')) newW = startDims.w - dx; // Note: requires position update logic which is complex, sticking to SE/SW/NE/NW for sizing relative to top-left implies changing width only works right-wards visually unless we move x/y too.
      // For simplicity in V2, let's support resizing that expands to the Right and Bottom (SE),
      // or restricts to simple corner dragging that affects w/h.
      // Full resizing (moving x/y while resizing Left/Top) requires updating item.position too.

      // Let's implement standard SE (Bottom-Right) resizing first as it's the most common and doesn't require moving the item origin.
      // And E (Right) and S (Bottom).

      if (resizing === 'se') {
        newW = startDims.w + dx;
        newH = startDims.h + dy;
      } else if (resizing === 'e') {
        newW = startDims.w + dx;
      } else if (resizing === 's') {
        newH = startDims.h + dy;
      }

      // Enforce constraints
      newW = Math.max(minWidth, newW);
      newH = Math.max(minHeight, newH);

      onResize(newW, newH);
    },
    [resizing, startPos, startDims, minWidth, minHeight, onResize, zoom]
  );

  const handleMouseUp = useCallback(() => {
    if (resizing) {
      setResizing(null);
      onResizeEnd();
    }
  }, [resizing, onResizeEnd]);

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, handleMouseMove, handleMouseUp]);

  const handleStyle =
    'absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full z-50 pointer-events-auto hover:bg-blue-500 transition-colors';

  return (
    <>
      {/* Frame */}
      <div className="absolute inset-0 border border-blue-400 pointer-events-none opacity-50 rounded-lg" />

      {/* Corners */}
      {/* SE - Bottom Right */}
      <div
        className={`${handleStyle} cursor-nwse-resize -bottom-1.5 -right-1.5`}
        onMouseDown={(e) => handleMouseDown(e, 'se')}
      />

      {/* E - Right Middle */}
      <div
        className={`${handleStyle} cursor-ew-resize top-1/2 -translate-y-1/2 -right-1.5`}
        onMouseDown={(e) => handleMouseDown(e, 'e')}
      />

      {/* S - Bottom Middle */}
      <div
        className={`${handleStyle} cursor-ns-resize bottom-0 left-1/2 -translate-x-1/2 -mb-1.5`}
        onMouseDown={(e) => handleMouseDown(e, 's')}
      />
    </>
  );
};
