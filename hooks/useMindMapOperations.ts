import { useCallback } from 'react';
import { BoardItem, Connection, ItemType, Position, ItemStyle } from '../types';
import { useStore } from '../store/useStore';
import { showSuccess, showError } from '../utils/toast';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const MINDMAP_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

const LAYOUT_CONFIG = {
  HORIZONTAL_SPACING: 280, // Space between parent and child
  VERTICAL_SPACING: 120, // Space between siblings
  MIN_VERTICAL_GAP: 20, // Minimum gap to prevent overlap
  NODE_WIDTH: 240, // Estimated node width for collision detection
  NODE_HEIGHT: 80, // Estimated node height for collision detection
  STAR_BURST_RADIUS: 350, // Radius for root children (star burst layout)
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutNode {
  item: BoardItem;
  children: LayoutNode[];
  depth: number;
  branchIndex: number; // Index among siblings of the root node
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate the depth of a node in the tree
 */
export const getNodeDepth = (
  itemId: string,
  connections: Connection[],
  items: BoardItem[]
): number => {
  const visited = new Set<string>();

  const calculateDepth = (id: string): number => {
    if (visited.has(id)) return 0; // Prevent infinite loops
    visited.add(id);

    const parentConnection = connections.find(conn => conn.toId === id);
    if (!parentConnection) return 0; // Root node

    return 1 + calculateDepth(parentConnection.fromId);
  };

  return calculateDepth(itemId);
};

/**
 * Get the root node (node with no parent)
 */
const findRootNode = (items: BoardItem[], connections: Connection[]): BoardItem | null => {
  const childIds = new Set(connections.map(c => c.toId));
  return items.find(item => !childIds.has(item.id)) || null;
};

/**
 * Find the main branch index (which child of root this node belongs to)
 */
const getMainBranchIndex = (
  itemId: string,
  connections: Connection[],
  items: BoardItem[]
): number => {
  const root = findRootNode(items, connections);
  if (!root) return 0;

  // If this is the root, return 0
  if (itemId === root.id) return 0;

  // Find all direct children of root
  const rootChildren = connections
    .filter(c => c.fromId === root.id)
    .map(c => c.toId);

  // If this is a direct child of root, return its index
  const directChildIndex = rootChildren.indexOf(itemId);
  if (directChildIndex !== -1) return directChildIndex;

  // Otherwise, traverse up to find which root child this belongs to
  const visited = new Set<string>();

  const findBranch = (id: string): number => {
    if (visited.has(id)) return 0;
    visited.add(id);

    const parentConn = connections.find(c => c.toId === id);
    if (!parentConn) return 0;

    const parentId = parentConn.fromId;
    const index = rootChildren.indexOf(parentId);
    if (index !== -1) return index;

    return findBranch(parentId);
  };

  return findBranch(itemId);
};

/**
 * Get branch color based on index
 */
export const getBranchColor = (branchIndex: number): string => {
  return MINDMAP_COLORS[branchIndex % MINDMAP_COLORS.length];
};

/**
 * Calculate bounding box for an item
 */
const getBoundingBox = (item: BoardItem): BoundingBox => {
  return {
    x: item.position.x,
    y: item.position.y,
    width: item.width || LAYOUT_CONFIG.NODE_WIDTH,
    height: item.height || LAYOUT_CONFIG.NODE_HEIGHT,
  };
};

/**
 * Check if two bounding boxes overlap
 */
const doBoxesOverlap = (box1: BoundingBox, box2: BoundingBox): boolean => {
  return !(
    box1.x + box1.width < box2.x ||
    box2.x + box2.width < box1.x ||
    box1.y + box1.height < box2.y ||
    box2.y + box2.height < box1.y
  );
};

/**
 * Find all siblings of a node (nodes with the same parent)
 */
const findSiblings = (
  itemId: string,
  items: BoardItem[],
  connections: Connection[]
): BoardItem[] => {
  const parentConnection = connections.find(c => c.toId === itemId);
  if (!parentConnection) return [];

  const parentId = parentConnection.fromId;
  const siblingIds = connections
    .filter(c => c.fromId === parentId && c.toId !== itemId)
    .map(c => c.toId);

  return items.filter(item => siblingIds.includes(item.id));
};

/**
 * Calculate optimal position for a new child node using intelligent layout
 */
const calculateChildPosition = (
  parentItem: BoardItem,
  siblings: BoardItem[],
  isRootChild: boolean,
  rootChildIndex: number,
  totalRootChildren: number
): Position => {
  if (isRootChild) {
    // Star burst layout for root children
    const angle = (rootChildIndex / totalRootChildren) * 2 * Math.PI;
    const radius = LAYOUT_CONFIG.STAR_BURST_RADIUS;

    return {
      x: parentItem.position.x + Math.cos(angle) * radius,
      y: parentItem.position.y + Math.sin(angle) * radius,
    };
  }

  // Hierarchical layout (to the right of parent)
  const baseX = parentItem.position.x + LAYOUT_CONFIG.HORIZONTAL_SPACING;

  if (siblings.length === 0) {
    // First child: align with parent vertically
    return {
      x: baseX,
      y: parentItem.position.y,
    };
  }

  // Find the lowest sibling position
  const siblingBoxes = siblings.map(getBoundingBox);
  const lowestSibling = siblingBoxes.reduce((lowest, box) =>
    box.y + box.height > lowest.y + lowest.height ? box : lowest
  );

  // Position below the lowest sibling with proper spacing
  let candidateY = lowestSibling.y + lowestSibling.height + LAYOUT_CONFIG.VERTICAL_SPACING;

  // Check for collisions and adjust if necessary
  const candidateBox: BoundingBox = {
    x: baseX,
    y: candidateY,
    width: LAYOUT_CONFIG.NODE_WIDTH,
    height: LAYOUT_CONFIG.NODE_HEIGHT,
  };

  // Keep moving down until we find a clear spot
  while (siblingBoxes.some(box => doBoxesOverlap(candidateBox, box))) {
    candidateY += LAYOUT_CONFIG.MIN_VERTICAL_GAP;
    candidateBox.y = candidateY;
  }

  return {
    x: baseX,
    y: candidateY,
  };
};

/**
 * Calculate optimal position for a new sibling node
 */
const calculateSiblingPosition = (
  currentItem: BoardItem,
  allSiblings: BoardItem[],
  parentItem: BoardItem | null,
  isRootSibling: boolean,
  rootChildIndex: number,
  totalRootChildren: number
): Position => {
  if (isRootSibling && parentItem) {
    // Star burst layout for root siblings
    const angle = ((rootChildIndex + 1) / (totalRootChildren + 1)) * 2 * Math.PI;
    const radius = LAYOUT_CONFIG.STAR_BURST_RADIUS;

    return {
      x: parentItem.position.x + Math.cos(angle) * radius,
      y: parentItem.position.y + Math.sin(angle) * radius,
    };
  }

  // Position below current node
  const currentBox = getBoundingBox(currentItem);
  let candidateY = currentBox.y + currentBox.height + LAYOUT_CONFIG.VERTICAL_SPACING;

  // Get all sibling boxes for collision detection
  const siblingBoxes = allSiblings.map(getBoundingBox);

  const candidateBox: BoundingBox = {
    x: currentItem.position.x,
    y: candidateY,
    width: LAYOUT_CONFIG.NODE_WIDTH,
    height: LAYOUT_CONFIG.NODE_HEIGHT,
  };

  // Keep moving down until we find a clear spot
  while (siblingBoxes.some(box => doBoxesOverlap(candidateBox, box))) {
    candidateY += LAYOUT_CONFIG.MIN_VERTICAL_GAP;
    candidateBox.y = candidateY;
  }

  return {
    x: currentItem.position.x,
    y: candidateY,
  };
};

/**
 * Get style configuration based on node depth
 */
export const getNodeStyle = (
  depth: number,
  branchColor: string
): { style: ItemStyle; color: string } => {
  switch (depth) {
    case 0: // Root
      return {
        style: {
          fontSize: 'xl',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        color: '#1F2937', // Dark gray
      };
    case 1: // Main branches
      return {
        style: {
          fontSize: 'lg',
          fontWeight: 'bold',
          textAlign: 'left',
        },
        color: branchColor,
      };
    default: // Leaves
      return {
        style: {
          fontSize: 'md',
          fontWeight: 'normal',
          textAlign: 'left',
        },
        color: branchColor,
      };
  }
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useMindMapOperations = () => {
  const currentBoardId = useStore(state => state.currentBoardId);
  const updateBoard = useStore(state => state.updateBoard);
  const pushHistory = useStore(state => state.pushHistory);
  const boards = useStore(state => state.boards);
  const currentBoard = boards[currentBoardId];

  /**
   * Create the root node for a new mind map
   */
  const createRootNode = useCallback((position: Position) => {
    pushHistory();

    const rootId = `mindmap-root-${Date.now()}`;
    const rootNode: BoardItem = {
      id: rootId,
      type: ItemType.NOTE,
      position,
      content: 'Central Idea',
      color: '#FFFFFF',
      width: 300,
      height: 100,
      style: {
        fontSize: 'xl',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    };

    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: [...board.items, rootNode],
    }));

    showSuccess('Mind Map created! Press TAB to add branches.');

    return rootId;
  }, [currentBoardId, pushHistory, updateBoard]);

  /**
   * Add a child node to the selected parent
   */
  const addChildNode = useCallback((
    parentId: string,
    items: BoardItem[],
    connections: Connection[]
  ): string | null => {
    const parentItem = items.find(item => item.id === parentId);
    if (!parentItem) return null;

    pushHistory();

    const root = findRootNode(items, connections);
    const isRootChild = parentItem.id === root?.id;

    // Find existing children to determine position
    const existingChildren = connections
      .filter(c => c.fromId === parentId)
      .map(c => items.find(item => item.id === c.toId))
      .filter((item): item is BoardItem => item !== undefined);

    const totalRootChildren = root
      ? connections.filter(c => c.fromId === root.id).length
      : 0;

    const position = calculateChildPosition(
      parentItem,
      existingChildren,
      isRootChild,
      existingChildren.length,
      totalRootChildren + 1
    );

    // Calculate depth and style
    const depth = getNodeDepth(parentId, connections, items) + 1;
    const branchIndex = getMainBranchIndex(parentId, connections, items);
    const branchColor = getBranchColor(branchIndex);
    const { style, color } = getNodeStyle(depth, branchColor);

    const childId = `mindmap-${Date.now()}`;
    const childNode: BoardItem = {
      id: childId,
      type: ItemType.NOTE,
      position,
      content: 'New Idea',
      color,
      width: 240,
      height: 80,
      style,
    };

    const connection: Connection = {
      id: `conn-${Date.now()}`,
      fromId: parentId,
      toId: childId,
    };

    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: [...board.items, childNode],
      connections: [...board.connections, connection],
    }));

    return childId;
  }, [currentBoardId, pushHistory, updateBoard]);

  /**
   * Add a sibling node (same level as current node)
   */
  const addSiblingNode = useCallback((
    currentId: string,
    items: BoardItem[],
    connections: Connection[]
  ): string | null => {
    const currentItem = items.find(item => item.id === currentId);
    if (!currentItem) return null;

    // Find parent
    const parentConnection = connections.find(c => c.toId === currentId);
    if (!parentConnection) {
      showError('Cannot add sibling to root node. Press TAB to add a child instead.');
      return null;
    }

    pushHistory();

    const parentId = parentConnection.fromId;
    const parentItem = items.find(item => item.id === parentId);

    const root = findRootNode(items, connections);
    const isRootSibling = parentItem?.id === root?.id;

    // Find all siblings
    const allSiblings = findSiblings(currentId, items, connections);

    const totalRootChildren = root
      ? connections.filter(c => c.fromId === root.id).length
      : 0;

    const branchIndex = getMainBranchIndex(currentId, connections, items);

    const position = calculateSiblingPosition(
      currentItem,
      allSiblings,
      parentItem || null,
      isRootSibling,
      branchIndex,
      totalRootChildren
    );

    // Calculate depth and style
    const depth = getNodeDepth(currentId, connections, items);
    const branchColor = getBranchColor(branchIndex);
    const { style, color } = getNodeStyle(depth, branchColor);

    const siblingId = `mindmap-${Date.now()}`;
    const siblingNode: BoardItem = {
      id: siblingId,
      type: ItemType.NOTE,
      position,
      content: 'New Idea',
      color,
      width: 240,
      height: 80,
      style,
    };

    const connection: Connection = {
      id: `conn-${Date.now()}`,
      fromId: parentId,
      toId: siblingId,
    };

    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: [...board.items, siblingNode],
      connections: [...board.connections, connection],
    }));

    return siblingId;
  }, [currentBoardId, pushHistory, updateBoard]);

  /**
   * Handle keyboard navigation and node creation
   */
  const handleKeyDown = useCallback((
    e: KeyboardEvent,
    selectedIds: string[],
    items: BoardItem[],
    connections: Connection[],
    setEditingId: (id: string | null) => void
  ) => {
    // Only handle if exactly one item is selected
    if (selectedIds.length !== 1) return;

    const selectedId = selectedIds[0];
    const selectedItem = items.find(item => item.id === selectedId);

    // Only work with NOTE items in mind map context
    if (!selectedItem || selectedItem.type !== ItemType.NOTE) return;

    // Don't interfere if user is editing
    const isEditing = document.activeElement?.tagName === 'TEXTAREA' ||
                      document.activeElement?.tagName === 'INPUT';

    if (e.key === 'Tab' && !isEditing) {
      e.preventDefault();
      const newId = addChildNode(selectedId, items, connections);
      if (newId) {
        // Auto-focus the new node after a short delay
        setTimeout(() => setEditingId(newId), 100);
      }
    } else if (e.key === 'Enter' && !isEditing) {
      e.preventDefault();
      const newId = addSiblingNode(selectedId, items, connections);
      if (newId) {
        // Auto-focus the new node after a short delay
        setTimeout(() => setEditingId(newId), 100);
      }
    }
  }, [addChildNode, addSiblingNode]);

  /**
   * Navigate between nodes using arrow keys
   */
  const handleArrowNavigation = useCallback((
    e: KeyboardEvent,
    selectedIds: string[],
    items: BoardItem[],
    connections: Connection[],
    setSelectedIds: (ids: string[]) => void
  ) => {
    if (selectedIds.length !== 1) return;

    const selectedId = selectedIds[0];
    const isEditing = document.activeElement?.tagName === 'TEXTAREA' ||
                      document.activeElement?.tagName === 'INPUT';

    if (isEditing) return;

    let targetId: string | null = null;

    switch (e.key) {
      case 'ArrowRight': {
        // Navigate to first child
        const childConnection = connections.find(c => c.fromId === selectedId);
        if (childConnection) targetId = childConnection.toId;
        break;
      }
      case 'ArrowLeft': {
        // Navigate to parent
        const parentConnection = connections.find(c => c.toId === selectedId);
        if (parentConnection) targetId = parentConnection.fromId;
        break;
      }
      case 'ArrowDown': {
        // Navigate to next sibling
        const parentConnection = connections.find(c => c.toId === selectedId);
        if (parentConnection) {
          const siblings = connections
            .filter(c => c.fromId === parentConnection.fromId)
            .map(c => c.toId);
          const currentIndex = siblings.indexOf(selectedId);
          if (currentIndex !== -1 && currentIndex < siblings.length - 1) {
            targetId = siblings[currentIndex + 1];
          }
        }
        break;
      }
      case 'ArrowUp': {
        // Navigate to previous sibling
        const parentConnection = connections.find(c => c.toId === selectedId);
        if (parentConnection) {
          const siblings = connections
            .filter(c => c.fromId === parentConnection.fromId)
            .map(c => c.toId);
          const currentIndex = siblings.indexOf(selectedId);
          if (currentIndex > 0) {
            targetId = siblings[currentIndex - 1];
          }
        }
        break;
      }
    }

    if (targetId) {
      e.preventDefault();
      setSelectedIds([targetId]);
    }
  }, []);

  return {
    createRootNode,
    addChildNode,
    addSiblingNode,
    handleKeyDown,
    handleArrowNavigation,
    getNodeDepth: (itemId: string) =>
      getNodeDepth(itemId, currentBoard?.connections || [], currentBoard?.items || []),
    getBranchColor: (itemId: string) =>
      getBranchColor(
        getMainBranchIndex(itemId, currentBoard?.connections || [], currentBoard?.items || [])
      ),
  };
};
