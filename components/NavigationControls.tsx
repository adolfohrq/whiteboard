import React, { useState, useRef } from 'react';
import { Plus, Minus, Sun, Moon, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { BoardItem, Position, ItemType } from '../types';

interface NavigationControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  items: BoardItem[];
  pan: Position;
  setPan: (pan: Position) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  items,
  pan,
  setPan,
  isDarkMode,
  onToggleDarkMode,
}) => {
  // Minimap state
  const [isMinimapVisible, setIsMinimapVisible] = useState(true);
  const [minimapSize, setMinimapSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [isDraggingViewport, setIsDraggingViewport] = useState(false);
  const minimapRef = useRef<HTMLDivElement>(null);

  // Minimap size configurations
  const sizeConfig = {
    small: 100,
    medium: 140,
    large: 200,
  };

  const MINIMAP_SIZE = sizeConfig[minimapSize];
  const VIEWPORT_WIDTH = window.innerWidth;
  const VIEWPORT_HEIGHT = window.innerHeight;

  // Calculate bounds of the content
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  if (items.length === 0) {
    minX = -500;
    maxX = 500;
    minY = -500;
    maxY = 500;
  } else {
    items.forEach((item) => {
      const w = item.width || 240;
      const h = item.height || 200;
      minX = Math.min(minX, item.position.x);
      maxX = Math.max(maxX, item.position.x + w);
      minY = Math.min(minY, item.position.y);
      maxY = Math.max(maxY, item.position.y + h);
    });
    // Add some padding
    minX -= 1000;
    maxX += 1000;
    minY -= 1000;
    maxY += 1000;
  }

  const worldWidth = maxX - minX;
  const worldHeight = maxY - minY;
  const scale = Math.min(MINIMAP_SIZE / worldWidth, MINIMAP_SIZE / worldHeight);

  // Map a world coordinate to minimap coordinate
  const mapX = (x: number) => (x - minX) * scale;
  const mapY = (y: number) => (y - minY) * scale;

  // Map minimap coordinate to world coordinate
  const unmapX = (x: number) => x / scale + minX;
  const unmapY = (y: number) => y / scale + minY;

  // Viewport Rect in World Space
  const viewportWorldX = -pan.x / zoom;
  const viewportWorldY = -pan.y / zoom;
  const viewportWorldW = VIEWPORT_WIDTH / zoom;
  const viewportWorldH = VIEWPORT_HEIGHT / zoom;

  // Handle click to jump
  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingViewport) return;

    const rect = minimapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to world coordinates
    const worldX = unmapX(clickX);
    const worldY = unmapY(clickY);

    // Center viewport on clicked position
    const newPan = {
      x: -(worldX * zoom - VIEWPORT_WIDTH / 2),
      y: -(worldY * zoom - VIEWPORT_HEIGHT / 2),
    };

    setPan(newPan);
  };

  // Handle viewport drag
  const handleViewportMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingViewport(true);
  };

  const handleViewportDrag = (e: MouseEvent) => {
    if (!isDraggingViewport || !minimapRef.current) return;

    const rect = minimapRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert to world coordinates
    const worldX = unmapX(mouseX);
    const worldY = unmapY(mouseY);

    // Center viewport on mouse position
    const newPan = {
      x: -(worldX * zoom - VIEWPORT_WIDTH / 2),
      y: -(worldY * zoom - VIEWPORT_HEIGHT / 2),
    };

    setPan(newPan);
  };

  const handleViewportDragEnd = () => {
    setIsDraggingViewport(false);
  };

  // Attach global mouse events for viewport drag
  React.useEffect(() => {
    if (isDraggingViewport) {
      window.addEventListener('mousemove', handleViewportDrag);
      window.addEventListener('mouseup', handleViewportDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleViewportDrag);
        window.removeEventListener('mouseup', handleViewportDragEnd);
      };
    }
  }, [isDraggingViewport, scale, minX, minY, zoom, setPan]);

  // Toggle minimap size
  const toggleMinimapSize = () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(minimapSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setMinimapSize(sizes[nextIndex]);
  };

  const containerWidth = minimapSize === 'small' ? 120 : minimapSize === 'medium' ? 160 : 220;
  const containerHeight = minimapSize === 'small' ? 120 : minimapSize === 'medium' ? 160 : 220;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 animate-in fade-in slide-in-from-bottom-4">
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-1">
        <button
          aria-label="Toggle Dark Mode"
          onClick={onToggleDarkMode}
          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Minimap Container */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative transition-all duration-300 ${
          isMinimapVisible ? 'opacity-100' : 'opacity-0 pointer-events-none h-0'
        }`}
        style={{
          width: containerWidth,
          height: isMinimapVisible ? containerHeight : 0,
        }}
      >
        {/* Minimap Header with Controls */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-1.5 bg-gradient-to-b from-white/90 to-transparent dark:from-gray-800/90 backdrop-blur-sm">
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">
            Map
          </span>
          <div className="flex gap-0.5">
            <button
              onClick={toggleMinimapSize}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              title={`Size: ${minimapSize}`}
            >
              {minimapSize === 'small' ? (
                <Maximize2 size={12} />
              ) : minimapSize === 'large' ? (
                <Minimize2 size={12} />
              ) : (
                <Maximize2 size={12} />
              )}
            </button>
          </div>
        </div>

        {/* Minimap Content */}
        <div className="w-full h-full p-3 pt-8">
          <div
            ref={minimapRef}
            className="w-full h-full relative bg-gray-50 dark:bg-gray-900 rounded opacity-90 overflow-hidden cursor-pointer select-none"
            onClick={handleMinimapClick}
          >
            {/* Items */}
            {items.map((item) => {
              const isHovered = hoveredItemId === item.id;
              let color = '#CBD5E1';
              if (item.type === ItemType.CONTAINER) color = 'transparent';
              else if (item.color) color = item.color === '#FFFFFF' ? '#94A3B8' : item.color;

              return (
                <div
                  key={item.id}
                  className={`absolute rounded-[1px] transition-all ${
                    isHovered ? 'ring-2 ring-blue-400 z-10 scale-110' : ''
                  }`}
                  style={{
                    left: mapX(item.position.x),
                    top: mapY(item.position.y),
                    width: Math.max(2, (item.width || 240) * scale),
                    height: Math.max(2, (item.height || 200) * scale),
                    backgroundColor: color,
                    border: item.type === ItemType.CONTAINER ? '1px solid #94A3B8' : 'none',
                  }}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                />
              );
            })}

            {/* Viewport Rect */}
            <div
              className={`absolute border-2 border-blue-500 bg-blue-500/10 z-10 transition-all ${
                isDraggingViewport ? 'cursor-grabbing ring-2 ring-blue-300' : 'cursor-grab hover:bg-blue-500/20'
              }`}
              style={{
                left: mapX(viewportWorldX),
                top: mapY(viewportWorldY),
                width: viewportWorldW * scale,
                height: viewportWorldH * scale,
              }}
              onMouseDown={handleViewportMouseDown}
            />
          </div>
        </div>
      </div>

      {/* Minimap Toggle Button */}
      <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-1">
        <button
          aria-label="Toggle Minimap"
          onClick={() => setIsMinimapVisible(!isMinimapVisible)}
          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          title={isMinimapVisible ? 'Hide Minimap' : 'Show Minimap'}
        >
          {isMinimapVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-1">
        <button
          aria-label="Zoom Out"
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          title="Zoom Out"
        >
          <Minus size={20} />
        </button>
        <span className="text-xs font-medium w-12 text-center text-gray-500 dark:text-gray-400">
          {Math.round(zoom * 100)}%
        </span>
        <button
          aria-label="Zoom In"
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          title="Zoom In"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};
