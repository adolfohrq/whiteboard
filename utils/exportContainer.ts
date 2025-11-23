import { BoardItem, ItemType } from '../types';

export const exportContainer = (
  containerId: string,
  items: BoardItem[],
  boardTitle: string
) => {
  const container = items.find((i) => i.id === containerId);
  if (!container || container.type !== ItemType.CONTAINER) {
    console.error('Container not found or invalid type');
    return;
  }

  // Find all children items
  const parentW = container.width || 500;
  const parentH = container.height || 400;
  const childrenItems: BoardItem[] = [];

  items.forEach((child) => {
    if (child.id === containerId) return;
    const cx = child.position.x + (child.width || 240) / 2;
    const cy = child.position.y + (child.height || 200) / 2;

    if (
      cx > container.position.x &&
      cx < container.position.x + parentW &&
      cy > container.position.y &&
      cy < container.position.y + parentH
    ) {
      childrenItems.push(child);
    }
  });

  // Create export object
  const exportData = {
    containerTitle: container.content || 'Untitled Container',
    boardTitle,
    exportDate: new Date().toISOString(),
    container: container,
    children: childrenItems,
    itemCount: childrenItems.length,
  };

  // Convert to JSON
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${container.content || 'container'}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
