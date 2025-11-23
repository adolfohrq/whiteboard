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
}

export interface Position {
  x: number;
  y: number;
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
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
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

  // Swatch Specific
  swatchColor?: string; // HEX value

  // Drawing Specific
  points?: Position[]; // Array of points for the path
  strokeColor?: string;

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
