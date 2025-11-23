import React from 'react';
import {
  Trash2,
  Copy,
  Bold,
  Heading1,
  AlignLeft,
  AlignCenter,
  LayoutGrid,
  List,
  GalleryHorizontal,
  Palette,
} from 'lucide-react';
import { COLORS, ItemType, BoardItem, ItemStyle } from '../types';

interface ContextToolbarProps {
  item: BoardItem;
  selectionCount: number;
  onColorChange: (color: string) => void;
  onStyleChange: (style: Partial<ItemStyle>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onTidyUp: (type: 'grid' | 'column' | 'row') => void;
  onExtractPalette?: () => void;
}

export const ContextToolbar: React.FC<ContextToolbarProps> = ({
  item,
  selectionCount,
  onColorChange,
  onStyleChange,
  onDuplicate,
  onDelete,
  onTidyUp,
  onExtractPalette,
}) => {
  const currentStyle = item.style || { fontSize: 'md', fontWeight: 'normal', textAlign: 'left' };
  const isMulti = selectionCount > 1;

  return (
    <div
      className="absolute -top-16 left-1/2 -translate-x-1/2 h-12 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full px-3 flex items-center gap-2 z-[60] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 whitespace-nowrap"
      onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking toolbar
    >
      {/* If Multi-select, show Tidy Up Options */}
      {isMulti && (
        <div className="flex items-center">
          <div className="px-3 text-xs font-bold text-gray-400 border-r border-gray-200 mr-2">
            {selectionCount} selected
          </div>

          <div className="flex items-center gap-1 mr-2">
            <button
              aria-label="Grid Layout"
              onClick={() => onTidyUp('grid')}
              className="p-1.5 rounded hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors"
              title="Grid Layout"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              aria-label="Vertical Stack"
              onClick={() => onTidyUp('column')}
              className="p-1.5 rounded hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors"
              title="Vertical Stack"
            >
              <List size={18} />
            </button>
            <button
              aria-label="Horizontal Row"
              onClick={() => onTidyUp('row')}
              className="p-1.5 rounded hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors"
              title="Horizontal Row"
            >
              <GalleryHorizontal size={18} />
            </button>
          </div>

          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        </div>
      )}

      {/* Palette Extraction (Only for Image) */}
      {!isMulti && item.type === ItemType.IMAGE && onExtractPalette && (
        <>
          <button
            aria-label="Extract Color Palette"
            onClick={() => onExtractPalette()}
            className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-black transition-colors text-xs font-medium"
            title="Extract Color Palette"
          >
            <Palette size={16} className="text-purple-500" />
            <span>Palette</span>
          </button>
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        </>
      )}

      {/* Color Picker (Only for Notes, or if multi-selecting notes) */}
      {item.type === ItemType.NOTE && (
        <>
          <div className="flex items-center gap-1.5 px-1">
            {Object.entries(COLORS).map(([key, val]) => (
          <button
            aria-label="Select Color"
            key={key}
            className={`w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform ${!isMulti && item.color === val ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
            style={{ backgroundColor: val }}
            onClick={() => onColorChange(val)}
            title={key}
          />
            ))}
          </div>
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        </>
      )}

      {/* Typography Controls (Only for Notes) */}
      {item.type === ItemType.NOTE && (
        <>
          <div className="flex items-center gap-1">
            <button
              aria-label="Toggle Heading"
              onClick={() =>
                onStyleChange({
                  fontSize: currentStyle.fontSize === 'lg' ? 'md' : 'lg',
                  fontWeight: 'bold',
                })
              }
              className={`p-1.5 rounded hover:bg-gray-100 ${currentStyle.fontSize === 'lg' ? 'bg-gray-100 text-blue-600' : 'text-gray-600'}`}
              title="Heading"
            >
              <Heading1 size={16} />
            </button>
            <button
              aria-label="Toggle Bold"
              onClick={() =>
                onStyleChange({
                  fontWeight: currentStyle.fontWeight === 'bold' ? 'normal' : 'bold',
                })
              }
              className={`p-1.5 rounded hover:bg-gray-100 ${currentStyle.fontWeight === 'bold' ? 'bg-gray-100 text-blue-600' : 'text-gray-600'}`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              aria-label="Toggle Alignment"
              onClick={() =>
                onStyleChange({
                  textAlign: currentStyle.textAlign === 'center' ? 'left' : 'center',
                })
              }
              className={`p-1.5 rounded hover:bg-gray-100 ${currentStyle.textAlign === 'center' ? 'bg-gray-100 text-blue-600' : 'text-gray-600'}`}
              title="Align"
            >
              {currentStyle.textAlign === 'center' ? (
                <AlignCenter size={16} />
              ) : (
                <AlignLeft size={16} />
              )}
            </button>
          </div>
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        </>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-1">
        <button
          aria-label="Duplicate Item"
          onClick={onDuplicate}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
          title="Duplicate"
        >
          <Copy size={16} />
        </button>
        <button
          aria-label="Delete Item"
          onClick={onDelete}
          className="p-1.5 rounded hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
