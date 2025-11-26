import React, { useState } from 'react';
import {
  Trash2,
  Copy,
  Bold,
  Italic,
  Underline,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LayoutGrid,
  List,
  GalleryHorizontal,
  Palette,
  Sparkles,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Clipboard,
  Droplet,
  Square,
  ChevronDown,
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
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onIncreaseOpacity?: () => void;
  onDecreaseOpacity?: () => void;
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
  onBringToFront,
  onSendToBack,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState<ItemStyle | null>(null);

  const currentStyle: ItemStyle = item.style || {
    fontSize: 'md',
    fontWeight: 'normal',
    textAlign: 'left',
    opacity: 1,
    shadow: 'none',
  };

  const isMulti = selectionCount > 1;
  const isTextItem = item.type === ItemType.NOTE || item.type === ItemType.TODO || item.type === ItemType.CONTAINER || item.type === ItemType.COMMENT;
  const isColorable = item.type === ItemType.NOTE || item.type === ItemType.COMMENT;

  const copyStyle = () => {
    setCopiedStyle(currentStyle);
  };

  const pasteStyle = () => {
    if (copiedStyle) onStyleChange(copiedStyle);
  };

  const resetStyle = () => {
    onStyleChange({
      fontSize: 'md',
      fontWeight: 'normal',
      textAlign: 'left',
      opacity: 1,
      borderWidth: 0,
      borderRadius: 0,
      shadow: 'none',
    });
  };

  return (
    <div
      className="absolute -top-12 -translate-x-1/2 bg-white/95 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 z-[60] animate-in fade-in zoom-in-95 duration-150"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1 px-2 h-10">
        {/* Multi-select Info */}
        {isMulti && (
          <>
            <div className="px-2 text-xs font-bold text-purple-600 bg-purple-50 rounded-md">
              {selectionCount}
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => onTidyUp('grid')}
                className="p-1.5 rounded hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors"
                title="Grid (⌘+Shift+G)"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => onTidyUp('column')}
                className="p-1.5 rounded hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors"
                title="Column (⌘+Shift+V)"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => onTidyUp('row')}
                className="p-1.5 rounded hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors"
                title="Row (⌘+Shift+H)"
              >
                <GalleryHorizontal size={16} />
              </button>
            </div>
            <div className="w-px h-6 bg-gray-200" />
          </>
        )}

        {/* Text Formatting */}
        {isTextItem && (
          <>
            <div className="flex items-center gap-0.5">
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                  title="Font Size"
                >
                  <Type size={16} />
                  <ChevronDown size={10} className="absolute -bottom-0.5 -right-0.5" />
                </button>
                {showMore && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-1.5 flex gap-1 z-50">
                    {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          onStyleChange({ fontSize: size });
                          setShowMore(false);
                        }}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${currentStyle.fontSize === size
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-100 text-gray-600'
                          }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() =>
                  onStyleChange({
                    fontWeight: currentStyle.fontWeight === 'bold' ? 'normal' : 'bold',
                  })
                }
                className={`p-1.5 rounded transition-colors ${currentStyle.fontWeight === 'bold'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
                  }`}
                title="Bold (⌘+B)"
              >
                <Bold size={16} />
              </button>
              <button
                onClick={() =>
                  onStyleChange({
                    fontStyle: currentStyle.fontStyle === 'italic' ? 'normal' : 'italic',
                  })
                }
                className={`p-1.5 rounded transition-colors ${currentStyle.fontStyle === 'italic'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
                  }`}
                title="Italic (⌘+I)"
              >
                <Italic size={16} />
              </button>
              <button
                onClick={() =>
                  onStyleChange({
                    textDecoration: currentStyle.textDecoration === 'underline' ? 'none' : 'underline',
                  })
                }
                className={`p-1.5 rounded transition-colors ${currentStyle.textDecoration === 'underline'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
                  }`}
                title="Underline (⌘+U)"
              >
                <Underline size={16} />
              </button>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-0.5">
              {[
                { value: 'left' as const, icon: AlignLeft },
                { value: 'center' as const, icon: AlignCenter },
                { value: 'right' as const, icon: AlignRight },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onStyleChange({ textAlign: value })}
                  className={`p-1.5 rounded transition-colors ${currentStyle.textAlign === value
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  title={`Align ${value}`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-gray-200" />
          </>
        )}

        {/* Colors */}
        {isColorable && (
          <>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                title="Color (⌘+K)"
              >
                <Palette size={16} />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50">
                  <div className="grid grid-cols-5 gap-1.5 w-32">
                    {Object.entries(COLORS).slice(0, 10).map(([key, val]) => (
                      <button
                        key={key}
                        className={`w-5 h-5 rounded border-2 transition-transform hover:scale-110 ${item.color === val ? 'ring-2 ring-blue-400 border-white' : 'border-gray-200'
                          }`}
                        style={{ backgroundColor: val }}
                        onClick={() => {
                          onColorChange(val);
                          setShowColorPicker(false);
                        }}
                        title={key}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-px h-6 bg-gray-200" />
          </>
        )}

        {/* Effects */}
        <div className="relative">
          <button
            onClick={() => setShowEffects(!showEffects)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Effects (⌘+E)"
          >
            <Sparkles size={16} />
          </button>
          {showEffects && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 w-48">
              <div className="space-y-2">
                {/* Shadow */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Shadow</label>
                  <div className="flex gap-1">
                    {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((shadow) => (
                      <button
                        key={shadow}
                        onClick={() => onStyleChange({ shadow })}
                        className={`px-2 py-1 rounded text-xs transition-colors flex-1 ${currentStyle.shadow === shadow
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                      >
                        {shadow === 'none' ? 'Off' : shadow.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Border Radius */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Radius</label>
                  <div className="flex gap-1">
                    {[0, 4, 8, 12, 16].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => onStyleChange({ borderRadius: radius })}
                        className={`px-2 py-1 rounded text-xs transition-colors flex-1 ${currentStyle.borderRadius === radius
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Opacity */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block flex justify-between">
                    <span>Opacity</span>
                    <span className="text-indigo-600 font-mono">{Math.round((currentStyle.opacity || 1) * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentStyle.opacity || 1) * 100}
                    onChange={(e) => onStyleChange({ opacity: parseInt(e.target.value) / 100 })}
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Palette */}
        {!isMulti && item.type === ItemType.IMAGE && onExtractPalette && (
          <>
            <button
              onClick={onExtractPalette}
              className="p-1.5 rounded hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors"
              title="Extract Palette"
            >
              <Droplet size={16} />
            </button>
          </>
        )}

        <div className="w-px h-6 bg-gray-200" />

        {/* Layer Controls */}
        {onBringToFront && onSendToBack && (
          <>
            <div className="flex items-center gap-0.5">
              <button
                onClick={onBringToFront}
                className="p-1.5 rounded hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                title="Front (⌘+])"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={onSendToBack}
                className="p-1.5 rounded hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                title="Back (⌘+[)"
              >
                <ArrowDown size={16} />
              </button>
            </div>
            <div className="w-px h-6 bg-gray-200" />
          </>
        )}

        {/* Style Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={copyStyle}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Copy Style (⌘+Shift+C)"
          >
            <Clipboard size={16} />
          </button>
          <button
            onClick={pasteStyle}
            disabled={!copiedStyle}
            className={`p-1.5 rounded transition-colors ${copiedStyle
              ? 'hover:bg-gray-100 text-gray-600'
              : 'text-gray-300 cursor-not-allowed'
              }`}
            title="Paste Style (⌘+Shift+V)"
          >
            <Square size={16} />
          </button>
          <button
            onClick={resetStyle}
            className="p-1.5 rounded hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors"
            title="Reset (⌘+0)"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Item Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
            title="Duplicate (⌘+D)"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors"
            title="Delete (⌫)"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
