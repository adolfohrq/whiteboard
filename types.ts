export enum ItemType {
  NOTE = 'NOTE',
  IMAGE = 'IMAGE',
  TODO = 'TODO',
  CONTAINER = 'CONTAINER',
  LINK = 'LINK',
  BOARD = 'BOARD', // New type for Nested Boards
  SWATCH = 'SWATCH', // New type for Color Palettes
  KANBAN = 'KANBAN', // New type for Kanban Columns
  DRAWING = 'DRAWING', // Freehand drawing path
  COMMENT = 'COMMENT', // New type for Comment bubbles
}

export interface Position {
  x: number;
  y: number;
  pressure?: number; // Pressure value from 0 to 1 (for stylus/tablet support)
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
}

export interface ItemStyle {
  // Typography
  fontSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fontWeight: 'normal' | 'bold' | 'light';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  lineHeight?: 'tight' | 'normal' | 'relaxed';

  // Visual Effects
  opacity?: number; // 0 to 1
  borderWidth?: number; // in pixels
  borderColor?: string;
  borderRadius?: number; // in pixels
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  blur?: number; // backdrop blur in pixels

  // Background
  backgroundColor?: string;
  backgroundOpacity?: number; // 0 to 1
}

export interface BoardItem {
  id: string;
  type: ItemType;
  position: Position;
  content: string; // Text content, Image URL, Container Title, Link URL, or Board Title
  todos?: Todo[]; // For ItemType.TODO
  color?: string;
  width?: number;
  height?: number;

  // Link Specific
  title?: string;
  description?: string;
  imageUrl?: string;
  faviconUrl?: string;
  siteName?: string;
  loading?: boolean;

  // Board Specific
  linkedBoardId?: string; // ID of the child board this item points to

  // Container Specific
  collapsed?: boolean;
  padding?: number; // Internal padding in pixels
  backgroundImage?: string; // Background image URL
  borderStyle?: 'solid' | 'dashed' | 'rounded'; // Border style
  autoResize?: boolean; // Auto-expand when adding items
  autoLayout?: 'none' | 'grid' | 'list' | 'masonry'; // Auto-layout mode
  layoutMode?: 'free' | 'grid' | 'list'; // Smart Frames layout mode (default: 'free')
  gap?: number; // Gap between items in smart layout (default: 10)
  sortBy?: 'type' | 'date' | 'size' | 'none'; // Sort contents
  filterType?: ItemType | 'all'; // Filter view by type
  pinnedItems?: string[]; // IDs of pinned items
  locked?: boolean; // Lock container to prevent movement

  // NOTE Specific
  lastSaved?: number; // Timestamp of last save
  tags?: string[]; // Hashtags for organization

  // Swatch Specific
  swatchColor?: string; // HEX value

  // Drawing Specific
  points?: Position[]; // Array of points for the path
  strokeColor?: string;
  zIndex?: number; // Z-index for layering (higher = front)
  groupId?: string; // ID for grouping multiple drawings together

  style?: ItemStyle;
}

// The Data Structure for a single Board
export interface BoardData {
  id: string;
  title: string;
  items: BoardItem[];
  connections: Connection[];
  parentId: string | null; // For hierarchy navigation
  createdAt: number;
}

export interface DragState {
  isDragging: boolean;
  itemIds: string[];
  startPos: Position;
  initialPositions: Record<string, Position>;
}

export interface Guideline {
  type: 'vertical' | 'horizontal';
  pos: number;
  start: number;
  end: number;
}

export const COLORS = {
  white: '#FFFFFF',
  gray: '#F3F4F6',
  yellow: '#FEF3C7',
  green: '#D1FAE5',
  blue: '#DBEAFE',
  red: '#FEE2E2',
  purple: '#F3E8FF',
  dark: '#1F2937',
  transparent: 'transparent',
};
