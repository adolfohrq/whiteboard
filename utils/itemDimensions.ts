import { BoardItem, ItemType } from '../types';

/**
 * Get the default dimensions for a board item.
 * Returns the actual width and height based on item type and state.
 * This ensures consistent dimension calculations across the app.
 */
export function getItemDimensions(item: BoardItem): { width: number; height: number | 'auto' } {
  // Container when collapsed has fixed height
  if (item.type === ItemType.CONTAINER && item.collapsed) {
    return { width: item.width || 500, height: 48 };
  }

  // Kanban columns have their own default dimensions
  if (item.type === ItemType.KANBAN) {
    return { width: item.width || 300, height: item.height || 400 };
  }

  // Default dimensions for all other item types
  return {
    width: item.width || 240,
    height: item.height || (item.type === ItemType.NOTE ? 200 : 'auto'),
  };
}
