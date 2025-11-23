import { useState, useCallback } from 'react';
import { BoardItem, Position, Guideline } from '../types';

const SNAP_THRESHOLD = 5;

interface SmartGuidesOptions {
  isGridEnabled?: boolean;
  gridSize?: number;
  canvasCenterX?: number;
  canvasCenterY?: number;
  onCenterGuidesChange?: (guides: Array<{ type: 'vertical' | 'horizontal'; position: number }>) => void;
  snapSensitivity?: number; // Configurable snap threshold
}

export const useSmartGuides = () => {
  const [guides, setGuides] = useState<Guideline[]>([]);

  const clearGuides = useCallback(() => setGuides([]), []);

  const getSnapPosition = useCallback(
    (
      activeItem: BoardItem,
      currentPos: Position, // The position calculated from drag delta
      otherItems: BoardItem[],
      zoom: number,
      options: SmartGuidesOptions = {}
    ): { x: number; y: number } => {
      const activeW = activeItem.width || 240;
      const activeH = activeItem.height || 200;

      let newX = currentPos.x;
      let newY = currentPos.y;

      // 1. Grid Snapping (Priority 1 - if enabled)
      if (options.isGridEnabled && options.gridSize) {
        const gridSize = options.gridSize;
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
        // If grid is enabled, skip other snapping and return early
        setGuides([]);
        if (options.onCenterGuidesChange) {
          options.onCenterGuidesChange([]);
        }
        return { x: newX, y: newY };
      }

      // 2. Center Canvas Guides (Priority 2 - if near center)
      const centerGuidesList: Array<{ type: 'vertical' | 'horizontal'; position: number }> = [];
      if (options.canvasCenterX !== undefined && options.canvasCenterY !== undefined) {
        const SNAP_THRESHOLD_CENTER = 10 / zoom;
        const itemCenterX = newX + activeW / 2;
        const itemCenterY = newY + activeH / 2;

        // Vertical center guide
        if (Math.abs(itemCenterX - options.canvasCenterX) < SNAP_THRESHOLD_CENTER) {
          newX = options.canvasCenterX - activeW / 2;
          centerGuidesList.push({ type: 'vertical', position: options.canvasCenterX });
        }

        // Horizontal center guide
        if (Math.abs(itemCenterY - options.canvasCenterY) < SNAP_THRESHOLD_CENTER) {
          newY = options.canvasCenterY - activeH / 2;
          centerGuidesList.push({ type: 'horizontal', position: options.canvasCenterY });
        }
      }

      if (options.onCenterGuidesChange) {
        options.onCenterGuidesChange(centerGuidesList);
      }

      // If snapped to center, skip item-to-item snapping
      if (centerGuidesList.length > 0) {
        setGuides([]);
        return { x: newX, y: newY };
      }

      // 3. Item-to-Item Snapping (Priority 3)
      // Edges of the active item
      const activeLeft = newX;
      const activeCenterX = newX + activeW / 2;
      const activeRight = newX + activeW;

      const activeTop = newY;
      const activeCenterY = newY + activeH / 2;
      const activeBottom = newY + activeH;

      const newGuides: Guideline[] = [];

      let snappedX = false;
      let snappedY = false;

      // We only snap to the closest item to avoid chaos, or iterate all and find closest snap
      // Simplified: Check all items, prioritize closest snap

      const effectiveThreshold = options.snapSensitivity !== undefined ? options.snapSensitivity : SNAP_THRESHOLD;
      let minDistX = effectiveThreshold / zoom;
      let minDistY = effectiveThreshold / zoom;

      let bestGuideX: Guideline | null = null;
      let bestGuideY: Guideline | null = null;

      otherItems.forEach((item) => {
        // Skip if item is hidden or container content logic (simplified here)
        if (item.id === activeItem.id) return;

        const targetW = item.width || 240;
        const targetH = item.height || 200;

        const targetLeft = item.position.x;
        const targetCenterX = item.position.x + targetW / 2;
        const targetRight = item.position.x + targetW;

        const targetTop = item.position.y;
        const targetCenterY = item.position.y + targetH / 2;
        const targetBottom = item.position.y + targetH;

        // --- X Alignment Checks ---

        // Left to Left
        if (Math.abs(activeLeft - targetLeft) < minDistX) {
          newX = targetLeft;
          minDistX = Math.abs(activeLeft - targetLeft);
          snappedX = true;
          bestGuideX = { type: 'vertical', pos: targetLeft, start: Math.min(activeTop, targetTop), end: Math.max(activeBottom, targetBottom) };
        }
        // Right to Right
        if (Math.abs(activeRight - targetRight) < minDistX) {
          newX = targetRight - activeW;
          minDistX = Math.abs(activeRight - targetRight);
          snappedX = true;
          bestGuideX = { type: 'vertical', pos: targetRight, start: Math.min(activeTop, targetTop), end: Math.max(activeBottom, targetBottom) };
        }
        // Left to Right
        if (Math.abs(activeLeft - targetRight) < minDistX) {
          newX = targetRight;
          minDistX = Math.abs(activeLeft - targetRight);
          snappedX = true;
          bestGuideX = { type: 'vertical', pos: targetRight, start: Math.min(activeTop, targetTop), end: Math.max(activeBottom, targetBottom) };
        }
        // Right to Left
        if (Math.abs(activeRight - targetLeft) < minDistX) {
          newX = targetLeft - activeW;
          minDistX = Math.abs(activeRight - targetLeft);
          snappedX = true;
          bestGuideX = { type: 'vertical', pos: targetLeft, start: Math.min(activeTop, targetTop), end: Math.max(activeBottom, targetBottom) };
        }
        // Center to Center
        if (Math.abs(activeCenterX - targetCenterX) < minDistX) {
          newX = targetCenterX - activeW / 2;
          minDistX = Math.abs(activeCenterX - targetCenterX);
          snappedX = true;
          bestGuideX = { type: 'vertical', pos: targetCenterX, start: Math.min(activeTop, targetTop), end: Math.max(activeBottom, targetBottom) };
        }

        // --- Y Alignment Checks ---

        // Top to Top
        if (Math.abs(activeTop - targetTop) < minDistY) {
          newY = targetTop;
          minDistY = Math.abs(activeTop - targetTop);
          snappedY = true;
          bestGuideY = { type: 'horizontal', pos: targetTop, start: Math.min(activeLeft, targetLeft), end: Math.max(activeRight, targetRight) };
        }
        // Bottom to Bottom
        if (Math.abs(activeBottom - targetBottom) < minDistY) {
          newY = targetBottom - activeH;
          minDistY = Math.abs(activeBottom - targetBottom);
          snappedY = true;
          bestGuideY = { type: 'horizontal', pos: targetBottom, start: Math.min(activeLeft, targetLeft), end: Math.max(activeRight, targetRight) };
        }
        // Top to Bottom
        if (Math.abs(activeTop - targetBottom) < minDistY) {
          newY = targetBottom;
          minDistY = Math.abs(activeTop - targetBottom);
          snappedY = true;
          bestGuideY = { type: 'horizontal', pos: targetBottom, start: Math.min(activeLeft, targetLeft), end: Math.max(activeRight, targetRight) };
        }
        // Bottom to Top
        if (Math.abs(activeBottom - targetTop) < minDistY) {
          newY = targetTop - activeH;
          minDistY = Math.abs(activeBottom - targetTop);
          snappedY = true;
          bestGuideY = { type: 'horizontal', pos: targetTop, start: Math.min(activeLeft, targetLeft), end: Math.max(activeRight, targetRight) };
        }
        // Center to Center
        if (Math.abs(activeCenterY - targetCenterY) < minDistY) {
          newY = targetCenterY - activeH / 2;
          minDistY = Math.abs(activeCenterY - targetCenterY);
          snappedY = true;
          bestGuideY = { type: 'horizontal', pos: targetCenterY, start: Math.min(activeLeft, targetLeft), end: Math.max(activeRight, targetRight) };
        }
      });

      if (bestGuideX) newGuides.push(bestGuideX);
      if (bestGuideY) newGuides.push(bestGuideY);

      setGuides(newGuides);
      return { x: newX, y: newY };
    },
    []
  );

  return { guides, getSnapPosition, clearGuides };
};
