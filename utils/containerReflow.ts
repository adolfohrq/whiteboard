import { BoardItem, ItemType } from '@/types';

/**
 * Get all items that are visually inside a container
 */
export function getItemsInContainer(
  container: BoardItem,
  allItems: BoardItem[]
): BoardItem[] {
  const containerLeft = container.position.x;
  const containerRight = containerLeft + (container.width || 400);
  const containerTop = container.position.y;
  const containerBottom = containerTop + (container.height || 300);

  return allItems.filter((item) => {
    if (item.id === container.id) return false;
    if (item.type === ItemType.DRAWING) return false; // Skip drawings

    const itemCenterX = item.position.x + (item.width || 200) / 2;
    const itemCenterY = item.position.y + (item.height || 100) / 2;

    return (
      itemCenterX >= containerLeft &&
      itemCenterX <= containerRight &&
      itemCenterY >= containerTop &&
      itemCenterY <= containerBottom
    );
  });
}

/**
 * Reflow items inside a container based on its layout mode
 * Returns updated items with new positions
 */
export function reflowContainer(
  container: BoardItem,
  allItems: BoardItem[]
): BoardItem[] {
  const layoutMode = container.layoutMode || 'free';

  // No reflow for free mode
  if (layoutMode === 'free') {
    return allItems;
  }

  const childItems = getItemsInContainer(container, allItems);
  if (childItems.length === 0) {
    return allItems;
  }

  const padding = container.padding || 20;
  const gap = container.gap || 10;
  const containerWidth = container.width || 400;

  // Sort items by position (top to bottom, left to right)
  const sortedItems = [...childItems].sort((a, b) => {
    if (Math.abs(a.position.y - b.position.y) < 10) {
      return a.position.x - b.position.x;
    }
    return a.position.y - b.position.y;
  });

  const updatedItems = [...allItems];
  let currentY = container.position.y + padding;

  if (layoutMode === 'list') {
    // List mode: Stack items vertically
    sortedItems.forEach((item) => {
      const itemIndex = updatedItems.findIndex((i) => i.id === item.id);
      if (itemIndex === -1) return;

      const itemHeight = item.height || 100;

      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        position: {
          x: container.position.x + padding,
          y: currentY,
        },
        // Optional: Stretch width to fill container
        width: containerWidth - padding * 2,
      };

      currentY += itemHeight + gap;
    });

    // Auto-resize container height if enabled
    if (container.autoResize) {
      const containerIndex = updatedItems.findIndex((i) => i.id === container.id);
      if (containerIndex !== -1) {
        const totalHeight = currentY - container.position.y + padding - gap;
        updatedItems[containerIndex] = {
          ...updatedItems[containerIndex],
          height: Math.max(totalHeight, 100),
        };
      }
    }
  } else if (layoutMode === 'grid') {
    // Grid mode: Arrange items in rows and columns
    let currentX = container.position.x + padding;
    let maxHeightInRow = 0;

    sortedItems.forEach((item, index) => {
      const itemIndex = updatedItems.findIndex((i) => i.id === item.id);
      if (itemIndex === -1) return;

      const itemWidth = item.width || 200;
      const itemHeight = item.height || 100;

      // Check if item fits in current row
      if (currentX + itemWidth > container.position.x + containerWidth - padding) {
        // Move to next row
        currentY += maxHeightInRow + gap;
        currentX = container.position.x + padding;
        maxHeightInRow = 0;
      }

      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        position: {
          x: currentX,
          y: currentY,
        },
      };

      currentX += itemWidth + gap;
      maxHeightInRow = Math.max(maxHeightInRow, itemHeight);
    });

    // Auto-resize container height if enabled
    if (container.autoResize) {
      const containerIndex = updatedItems.findIndex((i) => i.id === container.id);
      if (containerIndex !== -1) {
        const totalHeight = currentY + maxHeightInRow - container.position.y + padding;
        updatedItems[containerIndex] = {
          ...updatedItems[containerIndex],
          height: Math.max(totalHeight, 100),
        };
      }
    }
  }

  return updatedItems;
}

/**
 * Check if an item was dropped inside a container
 * Returns the container if found, null otherwise
 */
export function findContainerForItem(
  item: BoardItem,
  allItems: BoardItem[]
): BoardItem | null {
  const itemCenterX = item.position.x + (item.width || 200) / 2;
  const itemCenterY = item.position.y + (item.height || 100) / 2;

  // Find all containers, prioritize those with smart layout
  const containers = allItems
    .filter((i) => i.type === ItemType.CONTAINER && i.id !== item.id)
    .sort((a, b) => {
      // Prioritize containers with layout mode set
      const aHasLayout = (a.layoutMode && a.layoutMode !== 'free') ? 1 : 0;
      const bHasLayout = (b.layoutMode && b.layoutMode !== 'free') ? 1 : 0;
      return bHasLayout - aHasLayout;
    });

  for (const container of containers) {
    const containerLeft = container.position.x;
    const containerRight = containerLeft + (container.width || 400);
    const containerTop = container.position.y;
    const containerBottom = containerTop + (container.height || 300);

    if (
      itemCenterX >= containerLeft &&
      itemCenterX <= containerRight &&
      itemCenterY >= containerTop &&
      itemCenterY <= containerBottom
    ) {
      return container;
    }
  }

  return null;
}
