import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DraggableItem } from './components/DraggableItem';
import { Toolbar } from './components/Toolbar';
import { ContextToolbar } from './components/ContextToolbar';
import { NavigationControls } from './components/NavigationControls';
import { EmptyState } from './components/EmptyState';
import { CommandPalette } from './components/CommandPalette';
import {
  BoardItem,
  ItemType,
  DragState,
  Position,
  COLORS,
  Connection,
  Todo,
  ItemStyle,
  BoardData,
} from './types';
import { generateIdeas } from './services/geminiService';
import { fetchLinkMetadata } from './services/linkPreview';
import { extractPaletteFromImage } from './services/colorUtils';
import {
  Loader2,
  Check,
  X,
  ChevronRight,
  Home,
  FilePlus,
  Moon,
  Sun,
  Palette,
  CheckSquare,
  Type,
  Link as LinkIcon,
  Upload,
  FolderKanban,
  Columns,
  Layout,
  Cable,
  Sparkles,
  Search,
  Download,
  Copy,
  StickyNote,
  X as XIcon,
} from 'lucide-react';
import { Toaster } from './utils/toast';
import { showError, showSuccess } from './utils/toast';
import { validateAndSanitizeUrl, validateBoardItem, sanitizeText } from './utils/validation';
import { exportBoardAsImage } from './utils/exportUtils';

// Hooks
import { useCanvasControls } from './hooks/useCanvasControls';
import { useSelection } from './hooks/useSelection';
import { useSmartGuides } from './hooks/useSmartGuides';
import { useDarkMode } from './hooks/useDarkMode';
import { templates, Template } from './templates';

// Store
import { useStore } from './store/useStore';

const App: React.FC = () => {
  // -- Global Store --
  const boards = useStore((state) => state.boards);
  const currentBoardId = useStore((state) => state.currentBoardId);
  const setCurrentBoardId = useStore((state) => state.setCurrentBoardId);
  const updateBoard = useStore((state) => state.updateBoard);
  const setBoards = useStore((state) => state.setBoards);
  const pushHistory = useStore((state) => state.pushHistory);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const past = useStore((state) => state.past);
  const future = useStore((state) => state.future);

  // Helpers
  // Safe fallback if currentBoardId is invalid
  const currentBoard = boards[currentBoardId] || Object.values(boards)[0];
  const items = currentBoard?.items || [];
  const connections = currentBoard?.connections || [];

  // -- Custom Hooks --
  const {
    pan,
    setPan,
    zoom,
    setZoom,
    isPanning,
    startPan,
    updatePan,
    endPan,
    zoomIn,
    zoomOut,
    resetView,
  } = useCanvasControls();

  const {
    selectedIds,
    setSelectedIds,
    selectionBox,
    selectItem,
    clearSelection,
    startSelectionBox,
    updateSelectionBox,
    endSelectionBox,
  } = useSelection();

  const { guides, getSnapPosition, clearGuides } = useSmartGuides();

  // -- Local UI State --
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isConnectionMode, setIsConnectionMode] = useState(false);
  const [connectionStartId, setConnectionStartId] = useState<string | null>(null);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    itemIds: [],
    startPos: { x: 0, y: 0 },
    initialPositions: {},
  });

  // Track if we are dragging OVER a board item (for visual feedback)
  const [dragOverBoardId, setDragOverBoardId] = useState<string | null>(null);
  // Track if we are dragging OVER a kanban column
  const [dragOverKanbanId, setDragOverKanbanId] = useState<string | null>(null);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<Position[]>([]);

  // Lasso Selection State
  const [isLassoMode, setIsLassoMode] = useState(false);
  const [lassoPath, setLassoPath] = useState<Position[]>([]);
  const [isDrawingLasso, setIsDrawingLasso] = useState(false);

  // Group Resize State
  const [isResizingGroup, setIsResizingGroup] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStartBounds, setResizeStartBounds] = useState<any>(null);
  const [resizeStartMouse, setResizeStartMouse] = useState<Position | null>(null);

  // Multi-selection drag ghost preview
  const [multiDragGhost, setMultiDragGhost] = useState<{
    items: Array<{ id: string; position: Position; width: number; height: number; type: ItemType }>;
  } | null>(null);

  // Ghost State for Kanban
  const [ghostPosition, setGhostPosition] = useState<Position | null>(null);
  const [ghostSize, setGhostSize] = useState<{ width: number; height: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -- Advanced Selection Helpers --
  const selectByType = (type: ItemType) => {
    const typeIds = items.filter((item) => item.type === type).map((item) => item.id);
    setSelectedIds(typeIds);
  };

  const selectSimilar = () => {
    if (selectedIds.length === 0) return;

    const firstSelected = items.find((item) => item.id === selectedIds[0]);
    if (!firstSelected) return;

    const similarIds = items
      .filter((item) => {
        // Same type
        if (item.type !== firstSelected.type) return false;
        // Same color (if applicable)
        if (firstSelected.color && item.color === firstSelected.color) return true;
        // Same type is enough for non-colored items
        return !firstSelected.color;
      })
      .map((item) => item.id);

    setSelectedIds(similarIds);
  };

  const inverseSelection = () => {
    const allIds = items.map((item) => item.id);
    const inverseIds = allIds.filter((id) => !selectedIds.includes(id));
    setSelectedIds(inverseIds);
  };

  // Point-in-polygon test for lasso selection
  const isPointInPolygon = (point: Position, polygon: Position[]): boolean => {
    if (polygon.length < 3) return false;

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;

      const intersect = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const selectByLasso = () => {
    if (lassoPath.length < 3) return;

    const selectedItemIds = items
      .filter((item) => {
        // Check if item center is inside lasso polygon
        const centerX = item.position.x + (item.width || 240) / 2;
        const centerY = item.position.y + (item.height || 200) / 2;
        return isPointInPolygon({ x: centerX, y: centerY }, lassoPath);
      })
      .map((item) => item.id);

    setSelectedIds(selectedItemIds);
    setLassoPath([]);
    setIsDrawingLasso(false);
    setIsLassoMode(false);
  };

  // Calculate bounding box for selected items
  const getSelectionBounds = () => {
    if (selectedIds.length === 0) return null;

    const selectedItems = items.filter((item) => selectedIds.includes(item.id));
    if (selectedItems.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedItems.forEach((item) => {
      const w = item.width || 240;
      const h = item.height || 200;
      minX = Math.min(minX, item.position.x);
      minY = Math.min(minY, item.position.y);
      maxX = Math.max(maxX, item.position.x + w);
      maxY = Math.max(maxY, item.position.y + h);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  // -- Navigation & Routing Logic --

  // 1. Sync State -> URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const boardParam = params.get('board');

    // Only push state if the URL is different to avoid history loop
    if (boardParam !== currentBoardId) {
      const url = new URL(window.location.href);
      url.searchParams.set('board', currentBoardId);
      window.history.pushState({}, '', url);
    }
  }, [currentBoardId]);

  // 2. Sync URL -> State (On Mount & PopState)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const boardId = params.get('board');
      if (boardId && boards[boardId]) {
        setCurrentBoardId(boardId);
      } else if (!boardId) {
        setCurrentBoardId('root');
      }
    };

    // Initial Check
    const params = new URLSearchParams(window.location.search);
    const initialBoardId = params.get('board');
    if (initialBoardId && boards[initialBoardId]) {
      setCurrentBoardId(initialBoardId);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [boards, setCurrentBoardId]);

  const navigateToBoard = (boardId: string) => {
    if (!boards[boardId]) return;

    // Reset view state
    clearSelection();
    resetView();
    setEditingId(null);

    setCurrentBoardId(boardId);
  };

  const getBreadcrumbs = () => {
    const crumbs: { id: string; title: string }[] = [];
    let currentId: string | null = currentBoardId;
    let attempts = 0;
    while (currentId && boards[currentId] && attempts < 50) {
      const b = boards[currentId];
      crumbs.unshift({ id: b.id, title: b.title });
      currentId = b.parentId;
      attempts++;
    }
    return crumbs;
  };

  const applyTemplate = (template: Template) => {
    if (items.length > 0) {
      if (!window.confirm('This will clear the current board. Are you sure?')) {
        return;
      }
    }

    pushHistory();

    const newItems: BoardItem[] = [];
    const PADDING = 20;
    const COLS = 3;
    let currentX = 0;
    let currentY = 0;
    let maxRowHeight = 0;

    template.items.forEach((templateItem, index) => {
      const itemWidth = templateItem.width || 240;
      const itemHeight = templateItem.height || 200;

      if (index > 0 && index % COLS === 0) {
        currentX = 0;
        currentY += maxRowHeight + PADDING;
        maxRowHeight = 0;
      }
      
      newItems.push({
        ...templateItem,
        id: crypto.randomUUID(),
        position: { x: currentX, y: currentY },
      });

      currentX += itemWidth + PADDING;
      if (itemHeight > maxRowHeight) {
        maxRowHeight = itemHeight;
      }
    });

    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: newItems,
      connections: [], // Clear connections too
    }));
  };

  // -- Helpers --

  const getViewportCenter = useCallback(() => {
    return {
      x: (-pan.x + window.innerWidth / 2) / zoom - 120,
      y: (-pan.y + window.innerHeight / 2) / zoom - 100,
    };
  }, [pan, zoom]);

  const getItemDimensions = useCallback((item: BoardItem) => {
    let width = item.width || 240;
    let height = item.height || 200;

    // Override logic matching DraggableItem
    if (item.type === ItemType.CONTAINER) {
      width = 500;
      height = item.collapsed ? 48 : item.height || 400;
    } else if (item.type === ItemType.KANBAN) {
      width = item.width || 300;
      height = item.height || 400;
    } else if (item.type === ItemType.TODO) {
      width = 280;
      if (!item.height) height = 300;
    } else if (item.type === ItemType.LINK) {
      width = 300;
      height = 280;
    } else if (item.type === ItemType.BOARD) {
      width = 200;
      height = 160;
    } else if (item.type === ItemType.SWATCH) {
      width = 80;
      height = 90;
    }

    return { width, height };
  }, []);

  // -- Actions --

  const addItem = useCallback(
    (type: ItemType, content: string, offset: Position = { x: 0, y: 0 }, color?: string) => {
      pushHistory(); // Save state before adding

      const id = crypto.randomUUID();

      if (type === ItemType.BOARD) {
        const newBoardId = crypto.randomUUID();
        const newBoard: BoardData = {
          id: newBoardId,
          title: content,
          items: [],
          connections: [],
          parentId: currentBoardId,
          createdAt: Date.now(),
        };

        const newBoards = { ...boards };
        newBoards[newBoardId] = newBoard;

        const current = newBoards[currentBoardId];
        newBoards[currentBoardId] = {
          ...current,
          items: [
            ...current.items,
            {
              id,
              type,
              position: {
                x: getViewportCenter().x + offset.x,
                y: getViewportCenter().y + offset.y,
              },
              content,
              linkedBoardId: newBoardId,
              width: 200,
              height: 160,
              style: { fontSize: 'md', fontWeight: 'bold', textAlign: 'center' },
            },
          ],
        };

        setBoards(newBoards);
        setTimeout(() => selectItem(id), 0);
        return;
      }

      updateBoard(currentBoardId, (board) => {
        const center = getViewportCenter();
        let width = 240;
        let height = 200;

        if (type === ItemType.TODO) {
          width = 280;
          height = 300;
        }
        if (type === ItemType.CONTAINER) {
          width = 500;
          height = 400;
        }
        if (type === ItemType.KANBAN) {
          width = 300;
          height = 500;
        }
        if (type === ItemType.LINK) {
          width = 300;
          height = 280;
        }
        if (type === ItemType.SWATCH) {
          width = 80;
          height = 90;
        }

        const newItem: BoardItem = {
          id,
          type,
          position: { x: center.x + offset.x, y: center.y + offset.y },
          content,
          color: color || COLORS.white,
          width,
          height,
          todos:
            type === ItemType.TODO
              ? [{ id: crypto.randomUUID(), text: '', done: false }]
              : undefined,
          style: { fontSize: 'md', fontWeight: 'normal', textAlign: 'left' },
          loading: type === ItemType.LINK,
        };

        const validation = validateBoardItem(newItem);
        if (!validation.success) {
          console.error('Validation error creating item:', validation.error);
          showError('Failed to create item due to invalid data.');
          return board; // Return original board state
        }

        return { ...board, items: [...board.items, newItem] };
      });

      setTimeout(() => selectItem(id), 0);

      if (type === ItemType.LINK) {
        fetchLinkMetadata(content).then((metadata) => {
          updateBoard(currentBoardId, (board) => ({
            ...board,
            items: board.items.map((item) => {
              if (item.id === id) {
                if (metadata) {
                  return {
                    ...item,
                    loading: false,
                    title: metadata.title,
                    description: metadata.description,
                    imageUrl: metadata.image,
                    faviconUrl: metadata.logo,
                    siteName: metadata.publisher,
                  };
                } else {
                  return { ...item, loading: false, title: content };
                }
              }
              return item;
            }),
          }));
        });
      }

      return id;
    },
    [getViewportCenter, currentBoardId, updateBoard, setBoards, boards, selectItem, pushHistory]
  );

  const handleAddNote = () => addItem(ItemType.NOTE, '');
  const handleAddTodo = () => addItem(ItemType.TODO, 'My Tasks');
  const handleAddContainer = () => addItem(ItemType.CONTAINER, 'New Group');
  const handleAddKanban = () => addItem(ItemType.KANBAN, 'To Do');
  const handleAddBoard = () => addItem(ItemType.BOARD, 'New Project');

  const handleAddLink = useCallback(() => {
    const url = prompt('Paste a URL:');
    if (!url) return;

    const sanitized = validateAndSanitizeUrl(url);
    if (!sanitized) {
      showError('Invalid URL. Please enter a valid web address.');
      return;
    }

    addItem(ItemType.LINK, sanitized);
  }, [addItem]);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        addItem(ItemType.IMAGE, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        return;

      const text = e.clipboardData?.getData('text');
      if (text) {
        const urlRegex =
          /^(http:\/\/|https:\/\/|www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        if (urlRegex.test(text.trim())) {
          e.preventDefault();
          addItem(ItemType.LINK, text.trim());
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addItem]);

  // -- Recursion & Deletion --

  const collectChildBoardIds = useCallback(
    (boardId: string, currentBoards: Record<string, BoardData>): string[] => {
      const directChildren =
        currentBoards[boardId]?.items
          .filter((i) => i.type === ItemType.BOARD && i.linkedBoardId)
          .map((i) => i.linkedBoardId!) || [];

      let allIds = [...directChildren];
      directChildren.forEach((childId) => {
        allIds = [...allIds, ...collectChildBoardIds(childId, currentBoards)];
      });
      return allIds;
    },
    []
  );

  const handleDelete = useCallback(
    (triggeredId?: string) => {
      pushHistory();
      const idsToDelete =
        triggeredId && selectedIds.includes(triggeredId)
          ? selectedIds
          : triggeredId
            ? [triggeredId]
            : selectedIds;

      const currentBoards = boards;
      const current = currentBoards[currentBoardId];
      if (!current) return;

      const itemsToDelete = current.items.filter((i) => idsToDelete.includes(i.id));
      const boardsToDelete: string[] = [];

      itemsToDelete.forEach((item) => {
        if (item.type === ItemType.BOARD && item.linkedBoardId) {
          boardsToDelete.push(item.linkedBoardId);
          boardsToDelete.push(...collectChildBoardIds(item.linkedBoardId, currentBoards));
        }
      });

      const newItems = current.items.filter((i) => !idsToDelete.includes(i.id));
      const newConnections = current.connections.filter(
        (c) => !idsToDelete.includes(c.fromId) && !idsToDelete.includes(c.toId)
      );

      const nextBoards = { ...currentBoards };
      nextBoards[currentBoardId] = { ...current, items: newItems, connections: newConnections };

      boardsToDelete.forEach((bid) => {
        delete nextBoards[bid];
      });

      setBoards(nextBoards);
      clearSelection();
    },
    [
      selectedIds,
      currentBoardId,
      boards,
      collectChildBoardIds,
      setBoards,
      clearSelection,
      pushHistory,
    ]
  );

  // -- Drag to Move Logic (Portal) --

  const moveItemsToBoard = useCallback((targetBoardId: string, itemIds: string[]) => {
    if (!boards[targetBoardId]) return;
    pushHistory();

    setBoards({
      ...boards,
      [currentBoardId]: {
        ...boards[currentBoardId],
        items: boards[currentBoardId].items.filter((i) => !itemIds.includes(i.id)),
        connections: boards[currentBoardId].connections.filter(
          (c) => !itemIds.includes(c.fromId) && !itemIds.includes(c.toId)
        ),
      },
      [targetBoardId]: {
        ...boards[targetBoardId],
        items: [
          ...boards[targetBoardId].items,
          ...boards[currentBoardId].items
            .filter((i) => itemIds.includes(i.id))
            .map((i) => ({ ...i, position: { x: 0, y: 0 } })),
        ],
      },
    });

    clearSelection();
  }, [boards, currentBoardId, setBoards, pushHistory, clearSelection]);

  // -- Kanban Snap Logic --
  const handleKanbanSnap = useCallback((droppedItemId: string, columnId: string) => {
    updateBoard(currentBoardId, (board) => {
      const items = board.items;
      const column = items.find((i) => i.id === columnId);
      const droppedItem = items.find((i) => i.id === droppedItemId);

      if (!column || !droppedItem || column.type !== ItemType.KANBAN) return board;

      const colX = column.position.x;
      const colY = column.position.y;
      const colW = column.width || 300;
      const HEADER_H = 60;
      const GAP = 12;

      const itemsInColumn = items.filter((i) => {
        if (i.id === columnId || i.id === droppedItemId) return false;
        if (i.type === ItemType.CONTAINER || i.type === ItemType.KANBAN) return false;

        const cx = i.position.x + (i.width || 240) / 2;
        const cy = i.position.y + (i.height || 200) / 2;
        return cx > colX && cx < colX + colW && cy > colY;
      });

      itemsInColumn.sort((a, b) => a.position.y - b.position.y);

      let insertIndex = itemsInColumn.length;
      for (let i = 0; i < itemsInColumn.length; i++) {
        const item = itemsInColumn[i];
        if (droppedItem.position.y < item.position.y + (item.height || 200) / 2) {
          insertIndex = i;
          break;
        }
      }

      itemsInColumn.splice(insertIndex, 0, droppedItem);

      let currentY = colY + HEADER_H;

      const newItems = items.map((existingItem) => {
        const stackIndex = itemsInColumn.findIndex((x) => x.id === existingItem.id);
        if (stackIndex !== -1) {
          const itemW = existingItem.width || 240;
          const newX = colX + (colW - itemW) / 2;
          const myY = currentY;
          currentY += (existingItem.height || 200) + GAP;
          return { ...existingItem, position: { x: newX, y: myY } };
        }
        return existingItem;
      });

      const minHeight = 400;
      const requiredHeight = Math.max(minHeight, currentY - colY + 50);

      const finalItems = newItems.map((i) => {
        if (i.id === columnId) {
          return { ...i, height: requiredHeight };
        }
        return i;
      });

      return { ...board, items: finalItems };
    });
  }, [currentBoardId, updateBoard]);

  // -- Kanban Quick Add --
  const handleKanbanQuickAdd = useCallback((columnId: string, type: ItemType) => {
    const column = items.find((i) => i.id === columnId);
    if (!column) return;

    const center = getViewportCenter();
    const offsetX = column.position.x - center.x;
    const offsetY = column.position.y - center.y;

    const newItemId = addItem(type, '', { x: offsetX + 20, y: offsetY + 20 });

    setTimeout(() => {
      handleKanbanSnap(newItemId, columnId);
    }, 50);
  }, [items, getViewportCenter, addItem, handleKanbanSnap]);

  // -- Kanban Helper for Preview --
  const calculateKanbanPreview = useCallback(
    (droppedItemId: string, columnId: string) => {
      const column = items.find((i) => i.id === columnId);
      const droppedItem = items.find((i) => i.id === droppedItemId);

      if (!column || !droppedItem || column.type !== ItemType.KANBAN) return null;

      const colX = column.position.x;
      const colY = column.position.y;
      const colW = column.width || 300;
      const HEADER_H = 60;
      const GAP = 12;

      const itemsInColumn = items.filter((i) => {
        if (i.id === columnId || i.id === droppedItemId) return false;
        if (i.type === ItemType.CONTAINER || i.type === ItemType.KANBAN) return false;

        const cx = i.position.x + (i.width || 240) / 2;
        const cy = i.position.y + (i.height || 200) / 2;
        return cx > colX && cx < colX + colW && cy > colY;
      });

      itemsInColumn.sort((a, b) => a.position.y - b.position.y);

      let insertIndex = itemsInColumn.length;
      for (let i = 0; i < itemsInColumn.length; i++) {
        const item = itemsInColumn[i];
        if (droppedItem.position.y < item.position.y + (item.height || 200) / 2) {
          insertIndex = i;
          break;
        }
      }

      // Calculate Y position for ghost
      let ghostY = colY + HEADER_H;
      for (let i = 0; i < insertIndex; i++) {
        ghostY += (itemsInColumn[i].height || 200) + GAP;
      }

      const itemW = droppedItem.width || 240;
      const ghostX = colX + (colW - itemW) / 2;

      return { x: ghostX, y: ghostY, width: itemW, height: droppedItem.height || 200 };
    },
    [items]
  );

  const handleDuplicate = useCallback((triggeredId?: string) => {
    pushHistory();
    const idsToDup =
      triggeredId && selectedIds.includes(triggeredId)
        ? selectedIds
        : triggeredId
          ? [triggeredId]
          : selectedIds;

    updateBoard(currentBoardId, (board) => {
      const newItems: BoardItem[] = [];
      const newSelection: string[] = [];

      idsToDup.forEach((id) => {
        const item = board.items.find((i) => i.id === id);
        if (item) {
          const newItem = {
            ...item,
            id: crypto.randomUUID(),
            position: { x: item.position.x + 30, y: item.position.y + 30 },
            todos: item.todos
              ? item.todos.map((t) => ({ ...t, id: crypto.randomUUID() }))
              : undefined,
            linkedBoardId: item.linkedBoardId,
          };
          newItems.push(newItem);
          newSelection.push(newItem.id);
        }
      });

      setTimeout(() => setSelectedIds(newSelection), 0);

      return { ...board, items: [...board.items, ...newItems] };
    });
  }, [pushHistory, selectedIds, currentBoardId, updateBoard, setSelectedIds]);

  const handleColorChange = useCallback((triggeredId: string, color: string) => {
    pushHistory();
    const idsToUpdate =
      triggeredId && selectedIds.includes(triggeredId) ? selectedIds : [triggeredId];
    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: board.items.map((i) => (idsToUpdate.includes(i.id) ? { ...i, color } : i)),
    }));
  }, [pushHistory, selectedIds, currentBoardId, updateBoard]);

  const handleStyleChange = useCallback((triggeredId: string, newStyle: Partial<ItemStyle>) => {
    pushHistory();
    const idsToUpdate =
      triggeredId && selectedIds.includes(triggeredId) ? selectedIds : [triggeredId];
    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: board.items.map((i) =>
        idsToUpdate.includes(i.id) ? { ...i, style: { ...i.style, ...newStyle } as ItemStyle } : i
      ),
    }));
  }, [pushHistory, selectedIds, currentBoardId, updateBoard]);

  const handleContentChange = useCallback((id: string, content: string) => {
    const sanitizedContent = sanitizeText(content);
    const item = items.find((i) => i.id === id);
    if (item?.type === ItemType.BOARD && item.linkedBoardId) {
      const newBoards = { ...boards };
      if (newBoards[item.linkedBoardId]) {
        newBoards[item.linkedBoardId] = { ...newBoards[item.linkedBoardId], title: sanitizedContent };
      }
      newBoards[currentBoardId] = {
        ...newBoards[currentBoardId],
        items: newBoards[currentBoardId].items.map((i) => (i.id === id ? { ...i, content: sanitizedContent } : i)),
      };
      setBoards(newBoards);
    } else {
      updateBoard(currentBoardId, (board) => ({
        ...board,
        items: board.items.map((i) => (i.id === id ? { ...i, content: sanitizedContent } : i)),
      }));
    }
  }, [items, boards, currentBoardId, setBoards, updateBoard]);

  const handleTodoChange = useCallback((id: string, todos: Todo[]) => {
    const sanitizedTodos = todos.map(todo => ({
      ...todo,
      text: sanitizeText(todo.text)
    }));
    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: board.items.map((i) => (i.id === id ? { ...i, todos: sanitizedTodos } : i)),
    }));
  }, [currentBoardId, updateBoard]);

  const handleResize = useCallback((id: string, width: number, height: number) => {
    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: board.items.map((i) => (i.id === id ? { ...i, width, height } : i)),
    }));
  }, [currentBoardId, updateBoard]);

  const handleToggleCollapse = useCallback((id: string) => {
    pushHistory();
    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: board.items.map((i) => (i.id === id ? { ...i, collapsed: !i.collapsed } : i)),
    }));
  }, [pushHistory, currentBoardId, updateBoard]);

  const handleConnect = useCallback((id: string) => {
    if (!isConnectionMode) return;

    if (!connectionStartId) {
      setConnectionStartId(id);
    } else {
      if (connectionStartId !== id) {
        pushHistory();
        updateBoard(currentBoardId, (board) => {
          const exists = board.connections.some(
            (c) =>
              (c.fromId === connectionStartId && c.toId === id) ||
              (c.fromId === id && c.toId === connectionStartId)
          );

          if (!exists) {
            return {
              ...board,
              connections: [
                ...board.connections,
                {
                  id: crypto.randomUUID(),
                  fromId: connectionStartId,
                  toId: id,
                },
              ],
            };
          }
          return board;
        });
      }
      setConnectionStartId(null);
      setIsConnectionMode(false);
    }
  }, [isConnectionMode, connectionStartId, pushHistory, currentBoardId, updateBoard]);

  const handleExtractPalette = useCallback(async (triggeredId?: string) => {
    const idToUse = triggeredId || (selectedIds.length === 1 ? selectedIds[0] : null);
    if (!idToUse) return;

    const activeItem = items.find((i) => i.id === idToUse);
    if (!activeItem || activeItem.type !== ItemType.IMAGE || !activeItem.content) return;

    try {
      const palette = await extractPaletteFromImage(activeItem.content, 5);
      if (palette.length > 0) {
        pushHistory();
        updateBoard(currentBoardId, (board) => {
          const newItems: BoardItem[] = [];
          const startX = activeItem.position.x;
          const startY = activeItem.position.y + (activeItem.height || 200) + 20;
          const SWATCH_W = 80;
          const GAP = 12;
          palette.forEach((hex, idx) => {
            newItems.push({
              id: crypto.randomUUID(),
              type: ItemType.SWATCH,
              content: 'Color',
              position: { x: startX + idx * (SWATCH_W + GAP), y: startY },
              width: SWATCH_W,
              height: 90,
              swatchColor: hex,
              color: COLORS.white,
            });
          });
          return { ...board, items: [...board.items, ...newItems] };
        });
        showSuccess(`Extracted ${palette.length} colors from image!`);
      }
    } catch (err) {
      if (err === 'CORS_ERROR') {
        showError(
          'Cannot extract colors from external images due to CORS restrictions. Try uploading the image instead.'
        );
      } else {
        showError('Could not extract colors from this image.');
      }
    }
  }, [selectedIds, items, currentBoardId, pushHistory, updateBoard]);

  const handleTidyUp = useCallback((layoutType: 'grid' | 'column' | 'row') => {
    if (selectedIds.length < 2) return;
    pushHistory();
    const selectedItems = items.filter((i) => selectedIds.includes(i.id));
    if (selectedItems.length === 0) return;

    let maxW = 0;
    let maxH = 0;

    selectedItems.forEach((i) => {
      const dims = getItemDimensions(i);
      if (dims.width > maxW) maxW = dims.width;
      if (dims.height > maxH) maxH = dims.height;
    });

    const GAP = 24;
    const count = selectedItems.length;

    let cols = 1;
    if (layoutType === 'grid') cols = Math.ceil(Math.sqrt(count));
    else if (layoutType === 'row') cols = count;
    else cols = 1;

    selectedItems.sort((a, b) => {
      if (layoutType === 'row') return a.position.x - b.position.x;
      if (layoutType === 'column') return a.position.y - b.position.y;
      const rowDiff = Math.abs(a.position.y - b.position.y);
      if (rowDiff > 50) return a.position.y - b.position.y;
      return a.position.x - b.position.x;
    });

    const minX = Math.min(...selectedItems.map((i) => i.position.x));
    const minY = Math.min(...selectedItems.map((i) => i.position.y));

    const newPositions: Record<string, Position> = {};
    selectedItems.forEach((item, index) => {
      const colIndex = index % cols;
      const rowIndex = Math.floor(index / cols);
      const newX = minX + colIndex * (maxW + GAP);
      const newY = minY + rowIndex * (maxH + GAP);
      newPositions[item.id] = { x: newX, y: newY };
    });

    updateBoard(currentBoardId, (board) => ({
      ...board,
      items: board.items.map((item) =>
        newPositions[item.id] ? { ...item, position: newPositions[item.id] } : item
      ),
    }));
  }, [selectedIds, items, getItemDimensions, updateBoard, currentBoardId, pushHistory]);

  // -- Keyboard Shortcuts --
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingId(null);
        clearSelection();
        setIsConnectionMode(false);
        setConnectionStartId(null);
        return;
      }

      // Undo / Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      const isInputActive =
        e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      if (!isInputActive) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          if (selectedIds.length > 0) handleDelete();
        }

        if ((e.key === 'c' || e.key === 'C') && e.shiftKey) {
          e.preventDefault();
          handleAddContainer();
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          if (e.metaKey || e.ctrlKey) {
            const containerIds = selectedIds.filter(
              (id) => items.find((i) => i.id === id)?.type === ItemType.CONTAINER
            );
            if (containerIds.length > 0) {
              pushHistory();
              updateBoard(currentBoardId, (board) => ({
                ...board,
                items: board.items.map((i) =>
                  containerIds.includes(i.id) ? { ...i, collapsed: !i.collapsed } : i
                ),
              }));
            }
          } else if (selectedIds.length === 1) {
            setEditingId(selectedIds[0]);
          }
        }
      } else {
        if (e.key === 'Enter' && !e.shiftKey) {
          const editingItem = items.find((i) => i.id === editingId);
          if (
            editingItem &&
            (editingItem.type === ItemType.CONTAINER ||
              editingItem.type === ItemType.BOARD ||
              editingItem.type === ItemType.KANBAN)
          ) {
            setEditingId(null);
            (e.target as HTMLElement).blur();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedIds,
    items,
    editingId,
    handleAddContainer,
    handleDelete,
    updateBoard,
    clearSelection,
    undo,
    redo,
    pushHistory,
  ]);

  // -- AI Logic --
  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    pushHistory();
    const ideas = await generateIdeas(aiPrompt);
    const center = getViewportCenter();
    updateBoard(currentBoardId, (board) => {
      const newItems: BoardItem[] = [];
      ideas.forEach((idea, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const offsetX = col * 260 - 260;
        const offsetY = row * 200;
        newItems.push({
          id: crypto.randomUUID(),
          type: ItemType.NOTE,
          position: { x: center.x + offsetX, y: center.y + offsetY },
          content: idea,
          color: COLORS.yellow,
          width: 240,
          height: 200,
          style: { fontSize: 'md', fontWeight: 'normal', textAlign: 'left' },
        });
      });
      return { ...board, items: [...board.items, ...newItems] };
    });
    setIsGenerating(false);
    setIsAiModalOpen(false);
    setAiPrompt('');
  };

  // -- Interaction Logic (Mouse Events) --

  const handleItemMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (isConnectionMode) return;
    e.stopPropagation();

    // Selection Logic in Hook
    if (e.shiftKey) {
      selectItem(id, true);
    } else {
      if (!selectedIds.includes(id)) {
        selectItem(id, false);
      }
    }

    if (e.button === 0) {
      // Recalculate selection for drag
      let finalDragIds: string[] = e.shiftKey
        ? selectedIds.includes(id)
          ? selectedIds.filter((x) => x !== id)
          : [...selectedIds, id]
        : selectedIds.includes(id)
          ? selectedIds
          : [id];

      if (!e.shiftKey && !selectedIds.includes(id)) finalDragIds = [id];

      const initialPositions: Record<string, Position> = {};
      const itemsToMoveIds = new Set<string>(finalDragIds);

      // Container Children Logic (If dragging container, drag children)
      finalDragIds.forEach((selId) => {
        const item = items.find((i) => i.id === selId);
        if (item?.type === ItemType.CONTAINER || item?.type === ItemType.KANBAN) {
          items.forEach((child) => {
            if (child.id === selId) return;
            const cx = child.position.x + (child.width || 240) / 2;
            const cy = child.position.y + (child.height || 200) / 2;
            const parentW = item.width || (item.type === ItemType.KANBAN ? 300 : 500);
            const parentH = item.height || 400;
            if (
              cx > item.position.x &&
              cx < item.position.x + parentW &&
              cy > item.position.y &&
              cy < item.position.y + parentH
            ) {
              itemsToMoveIds.add(child.id);
            }
          });
        }
      });

      itemsToMoveIds.forEach((moveId) => {
        const item = items.find((i) => i.id === moveId);
        if (item) initialPositions[moveId] = { ...item.position };
      });

      setDragState({
        isDragging: true,
        itemIds: Array.from(itemsToMoveIds),
        startPos: { x: e.clientX, y: e.clientY },
        initialPositions,
      });
    }
  }, [isConnectionMode, selectedIds, selectItem, items]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setEditingId(null);

    if (isLassoMode) {
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / zoom - pan.x / zoom;
        const y = (e.clientY - rect.top) / zoom - pan.y / zoom;
        setIsDrawingLasso(true);
        setLassoPath([{ x, y }]);
      }
      return;
    }

    if (isDrawingMode) {
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / zoom - pan.x / zoom;
        const y = (e.clientY - rect.top) / zoom - pan.y / zoom;
        setCurrentDrawing([{ x, y }]);
      }
      return;
    }

    if (isConnectionMode) {
      setIsConnectionMode(false);
      setConnectionStartId(null);
      return;
    }

    if (e.shiftKey) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / zoom - pan.x / zoom;
        const y = (e.clientY - rect.top) / zoom - pan.y / zoom;
        startSelectionBox({ x, y });
      }
    } else {
      clearSelection();
      startPan(e);
    }
  }, [isConnectionMode, zoom, pan, startSelectionBox, clearSelection, startPan, isDrawingMode, setCurrentDrawing, isLassoMode]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Handle group resize
      if (isResizingGroup && resizeStartBounds && resizeStartMouse && resizeHandle) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const currentX = (e.clientX - rect.left) / zoom - pan.x / zoom;
        const currentY = (e.clientY - rect.top) / zoom - pan.y / zoom;
        const dx = currentX - resizeStartMouse.x;
        const dy = currentY - resizeStartMouse.y;

        // Calculate scale factors based on handle
        let scaleX = 1;
        let scaleY = 1;

        if (resizeHandle.includes('e')) {
          scaleX = (resizeStartBounds.width + dx) / resizeStartBounds.width;
        } else if (resizeHandle.includes('w')) {
          scaleX = (resizeStartBounds.width - dx) / resizeStartBounds.width;
        }

        if (resizeHandle.includes('s')) {
          scaleY = (resizeStartBounds.height + dy) / resizeStartBounds.height;
        } else if (resizeHandle.includes('n')) {
          scaleY = (resizeStartBounds.height - dy) / resizeStartBounds.height;
        }

        // Apply proportional scaling to all selected items
        const selectedItems = items.filter((item) => selectedIds.includes(item.id));
        selectedItems.forEach((item) => {
          const relativeX = item.position.x - resizeStartBounds.x;
          const relativeY = item.position.y - resizeStartBounds.y;

          let newX = item.position.x;
          let newY = item.position.y;
          let newWidth = item.width || 240;
          let newHeight = item.height || 200;

          // Apply scaling
          if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
            newX = resizeStartBounds.x + relativeX * scaleX;
            newWidth = (item.width || 240) * scaleX;
          }
          if (resizeHandle.includes('s') || resizeHandle.includes('n')) {
            newY = resizeStartBounds.y + relativeY * scaleY;
            newHeight = (item.height || 200) * scaleY;
          }

          // Minimum size
          newWidth = Math.max(newWidth, 100);
          newHeight = Math.max(newHeight, 100);

          updateItem(item.id, {
            position: { x: newX, y: newY },
            width: newWidth,
            height: newHeight,
          });
        });

        return;
      }

      if (isDrawingLasso && lassoPath.length > 0) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left) / zoom - pan.x / zoom;
          const y = (e.clientY - rect.top) / zoom - pan.y / zoom;
          setLassoPath((prev) => [...prev, { x, y }]);
        }
        return;
      }

      if (isDrawingMode && currentDrawing.length > 0) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left) / zoom - pan.x / zoom;
          const y = (e.clientY - rect.top) / zoom - pan.y / zoom;
          setCurrentDrawing((prev) => [...prev, { x, y }]);
        }
        return;
      }

      if (dragState.isDragging) {
        const dx = (e.clientX - dragState.startPos.x) / zoom;
        const dy = (e.clientY - dragState.startPos.y) / zoom;

        // Smart Guides Logic (Only if dragging single item)
        let snapDelta = { x: 0, y: 0 };
        if (dragState.itemIds.length === 1) {
          const itemId = dragState.itemIds[0];
          const initial = dragState.initialPositions[itemId];
          const item = items.find((i) => i.id === itemId);
          if (item && initial) {
            const rawNewPos = { x: initial.x + dx, y: initial.y + dy };
            const snappedPos = getSnapPosition(item, rawNewPos, items, zoom);

            // Adjust Delta based on Snap
            snapDelta.x = snappedPos.x - rawNewPos.x;
            snapDelta.y = snappedPos.y - rawNewPos.y;
          }
        } else {
          clearGuides();

          // Create ghost preview for multiple items
          const ghostItems = dragState.itemIds.map((id) => {
            const item = items.find((i) => i.id === id);
            const initial = dragState.initialPositions[id];
            if (!item || !initial) return null;

            return {
              id: item.id,
              position: {
                x: initial.x + dx,
                y: initial.y + dy,
              },
              width: item.width || 240,
              height: item.height || 200,
              type: item.type,
            };
          }).filter(Boolean) as Array<{ id: string; position: Position; width: number; height: number; type: ItemType }>;

          setMultiDragGhost({ items: ghostItems });
        }

        updateBoard(currentBoardId, (board) => ({
          ...board,
          items: board.items.map((item) => {
            if (dragState.itemIds.includes(item.id)) {
              const initial = dragState.initialPositions[item.id];
              if (initial) {
                return {
                  ...item,
                  position: {
                    x: initial.x + dx + snapDelta.x,
                    y: initial.y + dy + snapDelta.y,
                  },
                };
              }
            }
            return item;
          }),
        }));

        // Over Board/Kanban Logic
        let foundBoardId: string | null = null;
        let foundKanbanId: string | null = null;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const worldX = (e.clientX - rect.left) / zoom - pan.x / zoom;
          const worldY = (e.clientY - rect.top) / zoom - pan.y / zoom;

          const boardItems = items.filter(
            (i) => i.type === ItemType.BOARD && !dragState.itemIds.includes(i.id)
          );
          for (const boardItem of boardItems) {
            if (
              worldX > boardItem.position.x &&
              worldX < boardItem.position.x + (boardItem.width || 200) &&
              worldY > boardItem.position.y &&
              worldY < boardItem.position.y + (boardItem.height || 160)
            ) {
              foundBoardId = boardItem.id;
              break;
            }
          }

          if (!foundBoardId) {
            const kanbanItems = items.filter(
              (i) => i.type === ItemType.KANBAN && !dragState.itemIds.includes(i.id)
            );
            for (const kanban of kanbanItems) {
              if (
                worldX > kanban.position.x &&
                worldX < kanban.position.x + (kanban.width || 300) &&
                worldY > kanban.position.y &&
                worldY < kanban.position.y + (kanban.height || 400)
              ) {
                foundKanbanId = kanban.id;
                break;
              }
            }
          }
        }
        setDragOverBoardId(foundBoardId);
        setDragOverKanbanId(foundKanbanId);

        // Ghost Preview
        if (foundKanbanId && dragState.itemIds.length === 1) {
          const preview = calculateKanbanPreview(dragState.itemIds[0], foundKanbanId);
          if (preview) {
            setGhostPosition({ x: preview.x, y: preview.y });
            setGhostSize({ width: preview.width, height: preview.height });
          } else {
            setGhostPosition(null);
          }
        } else {
          setGhostPosition(null);
        }
      } else if (isPanning) {
        updatePan(e);
      } else if (selectionBox && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom - pan.x / zoom;
        const y = (e.clientY - rect.top) / zoom - pan.y / zoom;
        updateSelectionBox({ x, y });

        const boxLeft = Math.min(selectionBox.start.x, x);
        const boxRight = Math.max(selectionBox.start.x, x);
        const boxTop = Math.min(selectionBox.start.y, y);
        const boxBottom = Math.max(selectionBox.start.y, y);

        const newSelection: string[] = [];
        items.forEach((item) => {
          let itemH = item.height || 200;
          if (item.type === ItemType.CONTAINER && item.collapsed) itemH = 48;
          if (item.type === ItemType.LINK || item.type === ItemType.BOARD)
            itemH = item.height || 160;
          if (item.type === ItemType.SWATCH) itemH = 90;
          if (item.type === ItemType.KANBAN) itemH = item.height || 400;
          const itemW = item.width || 240;

          if (
            item.position.x < boxRight &&
            item.position.x + itemW > boxLeft &&
            item.position.y < boxBottom &&
            item.position.y + itemH > boxTop
          ) {
            newSelection.push(item.id);
          }
        });
        setSelectedIds(newSelection);
      }
    },
    [
      dragState,
      isPanning,
      selectionBox,
      zoom,
      pan,
      items,
      updateBoard,
      updatePan,
      updateSelectionBox,
      setSelectedIds,
      currentBoardId,
      getSnapPosition,
      clearGuides,
      isDrawingMode,
      currentDrawing,
    ]
  );

  const handleMouseUp = useCallback(() => {
    // End group resize
    if (isResizingGroup) {
      setIsResizingGroup(false);
      setResizeHandle(null);
      setResizeStartBounds(null);
      setResizeStartMouse(null);
      pushHistory();
      return;
    }

    if (isDrawingLasso && lassoPath.length > 2) {
      selectByLasso();
      return;
    }

    if (isDrawingMode && currentDrawing.length > 1) {
      pushHistory();
      updateBoard(currentBoardId, (board) => ({
        ...board,
        items: [
          ...board.items,
          {
            id: crypto.randomUUID(),
            type: ItemType.DRAWING,
            position: currentDrawing[0], // Anchor position
            points: currentDrawing,
            content: '', // Not used for drawing
            strokeColor: isDarkMode ? '#E5E7EB' : '#374151',
          },
        ],
      }));
    }
    setCurrentDrawing([]);


    if (dragState.isDragging) {
      clearGuides();
    }

    if (dragState.isDragging && dragOverBoardId) {
      const targetBoardItem = items.find((i) => i.id === dragOverBoardId);
      if (targetBoardItem && targetBoardItem.linkedBoardId) {
        moveItemsToBoard(targetBoardItem.linkedBoardId, dragState.itemIds);
      }
    } else if (dragState.isDragging && dragOverKanbanId) {
      const hasContainer = dragState.itemIds.some((id) => {
        const it = items.find((i) => i.id === id);
        return it?.type === ItemType.CONTAINER || it?.type === ItemType.KANBAN;
      });
      if (!hasContainer) {
        dragState.itemIds.forEach((itemId) => {
          handleKanbanSnap(itemId, dragOverKanbanId);
        });
      }
    }

    setDragState({
      isDragging: false,
      itemIds: [],
      startPos: { x: 0, y: 0 },
      initialPositions: {},
    });
    setDragOverBoardId(null);
    setDragOverKanbanId(null);
    setGhostPosition(null);
    setMultiDragGhost(null);
    endPan();
    endSelectionBox();
  }, [
    dragState,
    dragOverBoardId,
    dragOverKanbanId,
    items,
    endPan,
    endSelectionBox,
    moveItemsToBoard,
    handleKanbanSnap,
    clearGuides,
    isDrawingMode,
    currentDrawing,
    pushHistory,
    updateBoard,
    currentBoardId,
    isDarkMode,
  ]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // -- Wheel Zoom Logic --
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only zoom if Ctrl or Meta (Cmd) is pressed
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Get mouse position relative to canvas
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate zoom delta (normalize for different browsers/OS)
        const delta = e.deltaY > 0 ? 0.9 : 1.1;

        // Apply zoom limits (10% to 500%)
        const newZoom = Math.min(Math.max(zoom * delta, 0.1), 5);

        // Calculate new pan to keep mouse point fixed
        // Formula: newPan = mousePos - (mousePos - oldPan) * (newZoom / oldZoom)
        const newPan = {
          x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
          y: mouseY - (mouseY - pan.y) * (newZoom / zoom),
        };

        setPan(newPan);
        setZoom(newZoom);
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      // Use passive: false to allow preventDefault
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
      };
    }
  }, [zoom, pan, setPan, setZoom]);

  // -- Keyboard Navigation --
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const [spacePanStart, setSpacePanStart] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Space key for temporary pan mode
      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
        document.body.style.cursor = 'grab';
      }

      // Arrow keys for panning
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();

        // Base movement speed
        const baseSpeed = 50;
        // Faster movement with Shift
        const speed = e.shiftKey ? baseSpeed * 3 : baseSpeed;

        let deltaX = 0;
        let deltaY = 0;

        switch (e.code) {
          case 'ArrowUp':
            deltaY = speed;
            break;
          case 'ArrowDown':
            deltaY = -speed;
            break;
          case 'ArrowLeft':
            deltaX = speed;
            break;
          case 'ArrowRight':
            deltaX = -speed;
            break;
        }

        setPan({
          x: pan.x + deltaX,
          y: pan.y + deltaY,
        });
      }

      // Home key to reset to origin
      if (e.code === 'Home') {
        e.preventDefault();
        setPan({ x: 0, y: 0 });
        setZoom(1);
      }

      // Ctrl+Shift+A to inverse selection (check first - more specific)
      if (e.code === 'KeyA' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        const allIds = items.map((item) => item.id);
        const inverseIds = allIds.filter((id) => !selectedIds.includes(id));
        setSelectedIds(inverseIds);
        return;
      }

      // Ctrl+A to select all items
      if (e.code === 'KeyA' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const allIds = items.map((item) => item.id);
        setSelectedIds(allIds);
      }

      // Escape to clear selection or exit lasso mode
      if (e.code === 'Escape') {
        if (isLassoMode) {
          setIsLassoMode(false);
          setLassoPath([]);
          setIsDrawingLasso(false);
        } else {
          clearSelection();
        }
      }

      // L key to toggle lasso mode
      if (e.code === 'KeyL' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsLassoMode(!isLassoMode);
        if (isLassoMode) {
          setLassoPath([]);
          setIsDrawingLasso(false);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsSpacePanning(false);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pan, setPan, setZoom, isSpacePressed]);

  // Space + Drag panning
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (isSpacePressed && !isSpacePanning) {
        e.preventDefault();
        setIsSpacePanning(true);
        setSpacePanStart({ x: e.clientX, y: e.clientY });
        document.body.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isSpacePanning) {
        e.preventDefault();
        const deltaX = e.clientX - spacePanStart.x;
        const deltaY = e.clientY - spacePanStart.y;

        setPan({
          x: pan.x + deltaX,
          y: pan.y + deltaY,
        });

        setSpacePanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      if (isSpacePanning) {
        setIsSpacePanning(false);
        document.body.style.cursor = isSpacePressed ? 'grab' : 'default';
      }
    };

    if (isSpacePressed) {
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isSpacePressed, isSpacePanning, spacePanStart, pan, setPan]);

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  // -- Render Helpers --

  // SVG path smoothing function
  const getSvgPathFromPoints = (points: Position[]): string => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length - 1; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];

      const cp1_x = (p0.x + p1.x) / 2;
      const cp1_y = (p0.y + p1.y) / 2;
      const cp2_x = (p1.x + p2.x) / 2;
      const cp2_y = (p1.y + p2.y) / 2;
      
      path += ` Q ${p1.x}, ${p1.y}, ${cp2_x}, ${cp2_y}`;
    }
    
    path += ` L ${points[points.length-1].x} ${points[points.length-1].y}`;
    
    return path;
  };


  const getItemCenter = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return { x: 0, y: 0 };
    let height = item.height || 200;
    if (item.type === ItemType.CONTAINER && item.collapsed) height = 48;
    return { x: item.position.x + (item.width || 240) / 2, y: item.position.y + height / 2 };
  };

  const isItemHidden = (item: BoardItem) => {
    if (item.type === ItemType.CONTAINER) return false;
    const collapsedContainers = items.filter((i) => i.type === ItemType.CONTAINER && i.collapsed);
    const cx = item.position.x + (item.width || 240) / 2;
    const cy = item.position.y + (item.height || 200) / 2;
    return collapsedContainers.some((container) => {
      return (
        cx > container.position.x &&
        cx < container.position.x + (container.width || 500) &&
        cy > container.position.y &&
        cy < container.position.y + (container.height || 400)
      );
    });
  };

  const activeItem =
    selectedIds.length > 0 ? items.find((i) => i.id === selectedIds[selectedIds.length - 1]) : null;
  const breadcrumbs = getBreadcrumbs();

  const commands = [
    {
      heading: 'Create',
      items: [
        {
          id: 'add-note',
          label: 'Add New Note',
          icon: <Type />,
          action: handleAddNote,
        },
        {
          id: 'add-todo',
          label: 'Add To-Do List',
          icon: <CheckSquare />,
          action: handleAddTodo,
        },
        {
          id: 'add-link',
          label: 'Paste Link',
          icon: <LinkIcon />,
          action: handleAddLink,
        },
        {
          id: 'upload-image',
          label: 'Upload Image',
          icon: <Upload />,
          action: handleUploadClick,
        },
        {
          id: 'add-board',
          label: 'Add New Board',
          icon: <FolderKanban />,
          action: handleAddBoard,
        },
        {
          id: 'add-kanban',
          label: 'Add Kanban Column',
          icon: <Columns />,
          action: handleAddKanban,
        },
        {
          id: 'add-group',
          label: 'Add Free Group',
          icon: <Layout />,
          action: handleAddContainer,
        },
      ],
    },
    {
      heading: 'Tools',
      items: [
        {
          id: 'toggle-connections',
          label: 'Toggle Connection Mode',
          icon: <Cable />,
          action: () => setIsConnectionMode(!isConnectionMode),
        },
        {
          id: 'ai-brainstorm',
          label: 'AI Brainstorm',
          icon: <Sparkles />,
          action: () => setIsAiModalOpen(true),
        },
      ],
    },
    {
      heading: 'Theme',
      items: [
        {
          id: 'toggle-dark-mode',
          label: 'Toggle Dark Mode',
          icon: isDarkMode ? <Sun /> : <Moon />,
          action: () => setIsDarkMode(!isDarkMode),
        },
      ],
    },
    {
      heading: 'Navigation',
      items: [
        {
          id: 'go-home',
          label: 'Go to Home Board',
          icon: <Home />,
          action: () => navigateToBoard('root'),
        },
      ],
    },
    {
      heading: 'Export',
      items: [
        {
          id: 'export-image',
          label: 'Export Board as Image (PNG)',
          icon: <Download />,
          action: () => exportBoardAsImage('canvas-area', currentBoard.title),
        },
      ],
    },
    {
      heading: 'Selection',
      items: [
        {
          id: 'select-all',
          label: 'Select All Items',
          icon: <CheckSquare />,
          action: () => {
            const allIds = items.map((item) => item.id);
            setSelectedIds(allIds);
          },
        },
        {
          id: 'inverse-selection',
          label: 'Inverse Selection',
          icon: <CheckSquare />,
          action: inverseSelection,
        },
        {
          id: 'select-similar',
          label: 'Select Similar Items',
          icon: <Copy />,
          action: selectSimilar,
        },
        {
          id: 'select-notes',
          label: 'Select All Notes',
          icon: <StickyNote />,
          action: () => selectByType(ItemType.NOTE),
        },
        {
          id: 'select-todos',
          label: 'Select All To-Do Lists',
          icon: <CheckSquare />,
          action: () => selectByType(ItemType.TODO),
        },
        {
          id: 'select-images',
          label: 'Select All Images',
          icon: <Upload />,
          action: () => selectByType(ItemType.IMAGE),
        },
        {
          id: 'select-links',
          label: 'Select All Links',
          icon: <LinkIcon />,
          action: () => selectByType(ItemType.LINK),
        },
        {
          id: 'select-containers',
          label: 'Select All Groups',
          icon: <Layout />,
          action: () => selectByType(ItemType.CONTAINER),
        },
        {
          id: 'toggle-lasso',
          label: isLassoMode ? 'Exit Lasso Selection' : 'Lasso Selection Tool',
          icon: <Cable />,
          action: () => {
            setIsLassoMode(!isLassoMode);
            if (isLassoMode) {
              setLassoPath([]);
              setIsDrawingLasso(false);
            }
          },
        },
        {
          id: 'clear-selection',
          label: 'Clear Selection',
          icon: <XIcon />,
          action: clearSelection,
        },
      ],
    },
  ];

  const templateCommands = {
    heading: 'Templates',
    items: templates.map(template => ({
      id: `template-${template.id}`,
      label: `Apply: ${template.name}`,
      icon: <FilePlus />,
      action: () => applyTemplate(template),
    })),
  };

  const allCommands = [...commands, templateCommands];


  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F7F9FA] relative text-gray-800 font-sans selection:bg-purple-100">
      <Toaster />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        commands={allCommands}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Header / Breadcrumbs */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-40 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                {index > 0 && <ChevronRight size={14} className="text-gray-300" />}
                <button
                  onClick={() => navigateToBoard(crumb.id)}
                  className={`hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-colors flex items-center gap-1 ${index === breadcrumbs.length - 1 ? 'text-black font-semibold bg-gray-50' : ''}`}
                >
                  {index === 0 && <Home size={14} className="mb-0.5" />}
                  {crumb.title}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Search size={14} />
            Search...
            <span className="text-xs bg-gray-200 text-gray-600 rounded px-1.5 py-0.5">Ctrl+K</span>
          </button>
        </div>
      </div>

      {/* Connection Mode Indicator */}
      {isConnectionMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-4">
          {connectionStartId
            ? 'Select second item to connect'
            : 'Select an item to start connection'}
        </div>
      )}

      {/* Infinite Canvas */}
      <div
        id="canvas-area"
        ref={canvasRef}
        className="w-full h-full dot-grid cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Drawings & Connections Layer */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0">
          {/* Render existing drawings */}
          {items.map((item) => {
            if (item.type === ItemType.DRAWING && item.points) {
              return (
                <path
                  key={item.id}
                  d={getSvgPathFromPoints(item.points)}
                  stroke={item.strokeColor || (isDarkMode ? '#E5E7EB' : '#374151')}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            }
            return null;
          })}

          {/* Render current drawing in real-time */}
          {currentDrawing.length > 1 && (
            <path
              d={getSvgPathFromPoints(currentDrawing)}
              stroke={isDarkMode ? '#60A5FA' : '#3B82F6'} // A different color for live drawing
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Render lasso selection path */}
          {lassoPath.length > 1 && (
            <>
              <path
                d={getSvgPathFromPoints(lassoPath)}
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="rgba(139, 92, 246, 0.1)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5,5"
              />
              {/* Closing line to show polygon */}
              {lassoPath.length > 2 && (
                <line
                  x1={lassoPath[lassoPath.length - 1].x}
                  y1={lassoPath[lassoPath.length - 1].y}
                  x2={lassoPath[0].x}
                  y2={lassoPath[0].y}
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </>
          )}

          {/* Render bounding box for multiple selected items */}
          {(() => {
            const bounds = getSelectionBounds();
            if (!bounds || selectedIds.length < 2) return null;

            const padding = 8;
            const handleSize = 10;
            const x = bounds.x - padding;
            const y = bounds.y - padding;
            const w = bounds.width + padding * 2;
            const h = bounds.height + padding * 2;

            // Handle positions
            const handles = [
              { id: 'nw', x: x, y: y, cursor: 'nwse-resize' },
              { id: 'n', x: x + w / 2, y: y, cursor: 'ns-resize' },
              { id: 'ne', x: x + w, y: y, cursor: 'nesw-resize' },
              { id: 'e', x: x + w, y: y + h / 2, cursor: 'ew-resize' },
              { id: 'se', x: x + w, y: y + h, cursor: 'nwse-resize' },
              { id: 's', x: x + w / 2, y: y + h, cursor: 'ns-resize' },
              { id: 'sw', x: x, y: y + h, cursor: 'nesw-resize' },
              { id: 'w', x: x, y: y + h / 2, cursor: 'ew-resize' },
            ];

            return (
              <g>
                {/* Bounding box */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  rx="4"
                  className="pointer-events-none"
                />

                {/* Resize handles */}
                {handles.map((handle) => (
                  <rect
                    key={handle.id}
                    x={handle.x - handleSize / 2}
                    y={handle.y - handleSize / 2}
                    width={handleSize}
                    height={handleSize}
                    fill="white"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    rx="2"
                    style={{ cursor: handle.cursor }}
                    className="transition-all hover:scale-125"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsResizingGroup(true);
                      setResizeHandle(handle.id);
                      setResizeStartBounds(bounds);
                      const rect = canvasRef.current?.getBoundingClientRect();
                      if (rect) {
                        setResizeStartMouse({
                          x: (e.clientX - rect.left) / zoom - pan.x / zoom,
                          y: (e.clientY - rect.top) / zoom - pan.y / zoom,
                        });
                      }
                    }}
                  />
                ))}
              </g>
            );
          })()}

          {/* Render ghost preview when dragging multiple items */}
          {multiDragGhost && multiDragGhost.items.length > 0 && (
            <g opacity="0.4">
              {multiDragGhost.items.map((ghostItem) => (
                <rect
                  key={`ghost-${ghostItem.id}`}
                  x={ghostItem.position.x}
                  y={ghostItem.position.y}
                  width={ghostItem.width}
                  height={ghostItem.height}
                  fill="#3B82F6"
                  stroke="#1E40AF"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  rx="8"
                  className="pointer-events-none"
                />
              ))}
            </g>
          )}

          {connections.map((conn) => {
            const fromItem = items.find((i) => i.id === conn.fromId);
            const toItem = items.find((i) => i.id === conn.toId);
            if (!fromItem || !toItem || isItemHidden(fromItem) || isItemHidden(toItem)) return null;
            const start = getItemCenter(conn.fromId);
            const end = getItemCenter(conn.toId);
            const dx = Math.abs(start.x - end.x);
            const dy = Math.abs(start.y - end.y);
            const controlPointOffset = Math.max(dx, dy) * 0.5;
            const path = `M ${start.x} ${start.y} C ${start.x} ${start.y + controlPointOffset}, ${end.x} ${end.y - controlPointOffset}, ${end.x} ${end.y}`;
            return (
              <path
                key={conn.id}
                d={path}
                stroke="#cbd5e1"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Smart Guides Layer */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-50">
          {guides.map((g, i) => (
            <line
              key={i}
              x1={g.type === 'vertical' ? g.pos : g.start}
              y1={g.type === 'vertical' ? g.start : g.pos}
              x2={g.type === 'vertical' ? g.pos : g.end}
              y2={g.type === 'vertical' ? g.end : g.pos}
              stroke="#3B82F6"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
          ))}
        </svg>

        {/* Ghost Placeholder (Kanban) */}
        {ghostPosition && ghostSize && (
          <div
            className="absolute bg-blue-500/10 border-2 border-blue-500 border-dashed rounded-lg z-20 pointer-events-none transition-all duration-100 ease-out"
            style={{
              left: ghostPosition.x,
              top: ghostPosition.y,
              width: ghostSize.width,
              height: ghostSize.height,
            }}
          />
        )}

        {/* Selection Box */}
        {selectionBox && (
          <div
            className="absolute border border-blue-500 bg-blue-500/10 pointer-events-none z-50"
            style={{
              left: Math.min(selectionBox.start.x, selectionBox.current.x),
              top: Math.min(selectionBox.start.y, selectionBox.current.y),
              width: Math.abs(selectionBox.current.x - selectionBox.start.x),
              height: Math.abs(selectionBox.current.y - selectionBox.start.y),
            }}
          />
        )}

        {/* Items */}
        {items.map((item) => {
          if (isItemHidden(item)) return null;

          let previewItems: BoardItem[] | undefined = undefined;
          if (item.type === ItemType.BOARD && item.linkedBoardId) {
            previewItems = boards[item.linkedBoardId]?.items;
          }

          const isDragTargetKanban = dragOverKanbanId === item.id;

          return (
            <React.Fragment key={item.id}>
              {/* Context Toolbar (If selected) */}
              {activeItem && activeItem.id === item.id && !isConnectionMode && (
                <div
                  className="absolute z-[60]"
                  style={{ left: item.position.x + (item.width || 240) / 2, top: item.position.y }}
                >
                  <ContextToolbar
                    item={activeItem}
                    selectionCount={selectedIds.length}
                    onColorChange={(color) => handleColorChange(item.id, color)}
                    onStyleChange={(style) => handleStyleChange(item.id, style)}
                    onDuplicate={() => handleDuplicate(item.id)}
                    onDelete={() => handleDelete(item.id)}
                    onTidyUp={handleTidyUp}
                    onExtractPalette={() => handleExtractPalette()}
                  />
                </div>
              )}
              <DraggableItem
                item={item}
                isSelected={selectedIds.includes(item.id)}
                isEditing={editingId === item.id}
                isConnectionMode={isConnectionMode}
                previewItems={previewItems}
                isDragOver={dragOverBoardId === item.id || isDragTargetKanban}
                onMouseDown={handleItemMouseDown}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onContentChange={handleContentChange}
                onTodoChange={handleTodoChange}
                onColorChange={handleColorChange}
                onStyleChange={handleStyleChange}
                onToggleCollapse={handleToggleCollapse}
                onConnect={handleConnect}
                onNavigate={navigateToBoard}
                onExtractPalette={(id) => handleExtractPalette(id)}
                onQuickAdd={handleKanbanQuickAdd}
                onResize={handleResize}
                onResizeStart={pushHistory}
                onEdit={(id) => setEditingId(id)}
                zoom={zoom}
              />
            </React.Fragment>
          );
        })}
      </div>

      <Toolbar
        isConnectionMode={isConnectionMode}
        isDrawingMode={isDrawingMode}
        onAddNote={handleAddNote}
        onAddTodo={handleAddTodo}
        onAddContainer={handleAddContainer}
        onAddBoard={handleAddBoard}
        onAddLink={handleAddLink}
        onAddKanban={handleAddKanban}
        onUploadImage={handleUploadClick}
        onToggleConnectionMode={() => {
          setIsConnectionMode(!isConnectionMode);
          setConnectionStartId(null);
          setIsDrawingMode(false);
        }}
        onToggleDrawingMode={() => {
          setIsDrawingMode(!isDrawingMode);
          setIsConnectionMode(false);
        }}
        onAiBrainstorm={() => setIsAiModalOpen(true)}
        onUndo={undo}
        onRedo={redo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
      />

      {/* Lasso Mode Indicator */}
      {isLassoMode && (
        <div className="fixed left-4 bottom-6 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-left">
          <Cable size={18} />
          <span className="text-sm font-medium">Lasso Selection Mode</span>
          <span className="text-xs bg-purple-700 px-2 py-0.5 rounded">Press L or ESC to exit</span>
        </div>
      )}

      {/* Selection Counter */}
      {selectedIds.length > 0 && (
        <div className="fixed left-4 top-20 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-left">
          <CheckSquare size={18} />
          <span className="text-sm font-medium">
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          {selectedIds.length > 1 && (
            <button
              onClick={clearSelection}
              className="ml-2 text-xs bg-blue-700 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-900 px-2 py-0.5 rounded transition-colors"
              title="Clear selection"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {items.length === 0 && <EmptyState onAddNote={handleAddNote} />}

      <NavigationControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        items={items}
        pan={pan}
        setPan={setPan}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6 border border-white/50 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
                  AI Brainstorm
                </span>
              </h3>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAiSubmit}>
              <textarea
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-400 outline-none transition-all resize-none text-sm"
                rows={3}
                placeholder="What do you want to brainstorm?"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end mt-4 gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  Generate Ideas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
