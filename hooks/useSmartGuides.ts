import { useState, useCallback } from 'react';
import { BoardItem, Position, Guideline } from '../types';

const SNAP_THRESHOLD = 5;

export const useSmartGuides = () => {
  const [guides, setGuides] = useState<Guideline[]>([]);

  const clearGuides = useCallback(() => setGuides([]), []);

  const getSnapPosition = useCallback(
    (
      activeItem: BoardItem,
      currentPos: Position, // The position calculated from drag delta
      otherItems: BoardItem[],
      zoom: number
    ): { x: number; y: number } => {
      const activeW = activeItem.width || 240;
      const activeH = activeItem.height || 200;

      // Edges of the active item
      const activeLeft = currentPos.x;
      const activeCenterX = currentPos.x + activeW / 2;
      const activeRight = currentPos.x + activeW;

      const activeTop = currentPos.y;
      const activeCenterY = currentPos.y + activeH / 2;
      const activeBottom = currentPos.y + activeH;

      let newX = currentPos.x;
      let newY = currentPos.y;

      const newGuides: Guideline[] = [];

      let snappedX = false;
      let snappedY = false;

      // We only snap to the closest item to avoid chaos, or iterate all and find closest snap
      // Simplified: Check all items, prioritize closest snap

      let minDistX = SNAP_THRESHOLD / zoom;
      let minDistY = SNAP_THRESHOLD / zoom;

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
