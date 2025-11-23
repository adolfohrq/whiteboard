import React from 'react';
import { BoardItem, ItemType } from '../types';
import {
  Settings,
  Image as ImageIcon,
  Lock,
  Unlock,
  Grid3x3,
  List,
  Columns,
  SortAsc,
  Filter,
  Copy,
  Download,
} from 'lucide-react';

interface ContainerSettingsProps {
  container: BoardItem;
  onPropertyChange: (id: string, property: Partial<BoardItem>) => void;
  onToggleLock: (id: string) => void;
  onClone: (id: string) => void;
  onExport?: (id: string) => void;
}

export const ContainerSettings: React.FC<ContainerSettingsProps> = ({
  container,
  onPropertyChange,
  onToggleLock,
  onClone,
  onExport,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/container:opacity-100 transition-opacity">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowSettings(!showSettings);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-gray-800"
        title="Container Settings"
      >
        <Settings size={14} />
      </button>

      {showSettings && (
        <div
          className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 space-y-3"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Padding Control */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Padding
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={container.padding || 12}
              onChange={(e) =>
                onPropertyChange(container.id, { padding: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-right">{container.padding || 12}px</div>
          </div>

          {/* Border Style */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Border Style
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onPropertyChange(container.id, { borderStyle: 'solid' })}
                className={`flex-1 py-1 px-2 text-xs rounded border ${
                  (container.borderStyle || 'solid') === 'solid'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                Solid
              </button>
              <button
                onClick={() => onPropertyChange(container.id, { borderStyle: 'dashed' })}
                className={`flex-1 py-1 px-2 text-xs rounded border ${
                  container.borderStyle === 'dashed'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                Dashed
              </button>
              <button
                onClick={() => onPropertyChange(container.id, { borderStyle: 'rounded' })}
                className={`flex-1 py-1 px-2 text-xs rounded border ${
                  container.borderStyle === 'rounded'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                Rounded
              </button>
            </div>
          </div>

          {/* Background Image */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Background Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={container.backgroundImage || ''}
                onChange={(e) =>
                  onPropertyChange(container.id, { backgroundImage: e.target.value })
                }
                placeholder="Image URL"
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {container.backgroundImage && (
                <button
                  onClick={() => onPropertyChange(container.id, { backgroundImage: '' })}
                  className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Auto-layout */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Auto-layout
            </label>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => onPropertyChange(container.id, { autoLayout: 'none' })}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 text-xs rounded ${
                  (container.autoLayout || 'none') === 'none'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                None
              </button>
              <button
                onClick={() => onPropertyChange(container.id, { autoLayout: 'grid' })}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 text-xs rounded ${
                  container.autoLayout === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 size={12} /> Grid
              </button>
              <button
                onClick={() => onPropertyChange(container.id, { autoLayout: 'list' })}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 text-xs rounded ${
                  container.autoLayout === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List size={12} /> List
              </button>
              <button
                onClick={() => onPropertyChange(container.id, { autoLayout: 'masonry' })}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 text-xs rounded ${
                  container.autoLayout === 'masonry'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Columns size={12} /> Masonry
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              <SortAsc size={12} className="inline mr-1" />
              Sort Contents
            </label>
            <select
              value={container.sortBy || 'none'}
              onChange={(e) =>
                onPropertyChange(container.id, {
                  sortBy: e.target.value as 'type' | 'date' | 'size' | 'none',
                })
              }
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="none">No sorting</option>
              <option value="type">By type</option>
              <option value="date">By date</option>
              <option value="size">By size</option>
            </select>
          </div>

          {/* Filter Type */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              <Filter size={12} className="inline mr-1" />
              Filter View
            </label>
            <select
              value={container.filterType || 'all'}
              onChange={(e) =>
                onPropertyChange(container.id, {
                  filterType: e.target.value as ItemType | 'all',
                })
              }
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Show all</option>
              <option value={ItemType.NOTE}>Notes only</option>
              <option value={ItemType.TODO}>Tasks only</option>
              <option value={ItemType.IMAGE}>Images only</option>
              <option value={ItemType.LINK}>Links only</option>
            </select>
          </div>

          {/* Auto-resize Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700">Auto-resize</label>
            <input
              type="checkbox"
              checked={container.autoResize || false}
              onChange={(e) =>
                onPropertyChange(container.id, { autoResize: e.target.checked })
              }
              className="w-4 h-4"
            />
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-3 space-y-1">
            <button
              onClick={() => onToggleLock(container.id)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded hover:bg-gray-100 text-gray-700"
            >
              {container.locked ? (
                <>
                  <Unlock size={14} /> Unlock Container
                </>
              ) : (
                <>
                  <Lock size={14} /> Lock Container
                </>
              )}
            </button>
            <button
              onClick={() => onClone(container.id)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded hover:bg-gray-100 text-gray-700"
            >
              <Copy size={14} /> Clone with Contents
            </button>
            {onExport && (
              <button
                onClick={() => onExport(container.id)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded hover:bg-gray-100 text-gray-700"
              >
                <Download size={14} /> Export Container
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
