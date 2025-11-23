import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { BoardItem, ItemType, COLORS, Todo, ItemStyle } from '../types';
import {
  GripHorizontal,
  Sparkles,
  Plus,
  CheckSquare,
  Square,
  X as XIcon,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Globe,
  Loader2,
  ArrowRight,
  FolderKanban,
  Copy,
  Check,
  Palette,
  StickyNote,
  Layout,
} from 'lucide-react';
import { expandContent } from '../services/geminiService';
import { ResizeHandles } from './ResizeHandles';

interface DraggableItemProps {
  item: BoardItem;
  isSelected: boolean;
  isConnectionMode: boolean;
  isEditing: boolean;
  previewItems?: BoardItem[]; // New: For rendering mini-content inside boards
  isDragOver?: boolean; // New: Feedback when dragging items OVER this board
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
  onTodoChange: (id: string, todos: Todo[]) => void;
  onColorChange: (id: string, color: string) => void;
  onStyleChange: (id: string, style: Partial<ItemStyle>) => void;
  onToggleCollapse?: (id: string) => void;
  onConnect?: (id: string) => void;
  onNavigate?: (boardId: string) => void;
  onExtractPalette?: (id: string) => void;
  onQuickAdd?: (columnId: string, type: ItemType) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  onEdit?: (id: string) => void;
  zoom?: number; // Passed for resizing calculation
}

export const DraggableItemComponent: React.FC<DraggableItemProps> = ({
  item,
  isSelected,
  isConnectionMode,
  isEditing,
  previewItems = [],
  isDragOver = false,
  onMouseDown,
  onContentChange,
  onTodoChange,
  onToggleCollapse,
  onConnect,
  onNavigate,
  onExtractPalette,
  onQuickAdd,
  onResize,
  onResizeStart,
  onResizeEnd,
  onEdit,
  zoom = 1,
}) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null);
  const [dragOverTodoId, setDragOverTodoId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const boardInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [item.imageUrl, item.content]);

  useEffect(() => {
    if (isEditing) {
      if (item.type === ItemType.CONTAINER && titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      } else if (item.type === ItemType.KANBAN && titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      } else if (item.type === ItemType.NOTE && textAreaRef.current) {
        textAreaRef.current.focus();
      } else if (item.type === ItemType.BOARD && boardInputRef.current) {
        boardInputRef.current.focus();
        boardInputRef.current.select();
      }
    }
  }, [isEditing, item.type]);

  const getZIndex = () => {
    if (item.type === ItemType.CONTAINER) return isSelected ? 5 : 1;
    if (item.type === ItemType.KANBAN) return isSelected ? 6 : 2; // Kanban slightly above Container
    if (item.type === ItemType.BOARD && isDragOver) return 5;
    return isSelected ? 50 : 10;
  };

  const getDimensions = () => {
    if (item.type === ItemType.CONTAINER && item.collapsed) {
      return { width: item.width || 500, height: 48 };
    }
    if (item.type === ItemType.KANBAN) {
      return { width: item.width || 300, height: item.height || 400 };
    }
    // Default dimensions if not set, or use stored values
    return {
      width: item.width || 240,
      height: item.height || (item.type === ItemType.NOTE ? 200 : 'auto'),
    };
  };

  const { width, height } = getDimensions();

  // Convert auto height to number for ResizeHandles if needed,
  // though ResizeHandles expects number. If height is auto, we pass a default for the handle but rendered div is auto.
  // But resizing sets a fixed height, so it becomes a number.
  const numericHeight = typeof height === 'number' ? height : 200;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: item.position.x,
    top: item.position.y,
    width,
    height,
    zIndex: getZIndex(),
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      isConnectionMode &&
      onConnect &&
      item.type !== ItemType.CONTAINER &&
      item.type !== ItemType.KANBAN
    ) {
      onConnect(item.id);
    } else {
      onMouseDown(e, item.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === ItemType.BOARD && item.linkedBoardId && onNavigate) {
      onNavigate(item.linkedBoardId);
    } else if (item.type === ItemType.NOTE && onEdit) {
      onEdit(item.id);
    }
  };

  const handleAiExpand = async () => {
    if (!item.content.trim()) return;
    setIsExpanding(true);
    const newText = await expandContent(item.content);
    onContentChange(item.id, newText);
    setIsExpanding(false);
  };

  const copyColorToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.swatchColor) {
      navigator.clipboard.writeText(item.swatchColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // -- Todo Handlers --
  const toggleTodo = (todoId: string) => {
    if (!item.todos) return;
    const newTodos = item.todos.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t));
    onTodoChange(item.id, newTodos);
  };

  const updateTodoText = (todoId: string, text: string) => {
    if (!item.todos) return;
    const newTodos = item.todos.map((t) => (t.id === todoId ? { ...t, text } : t));
    onTodoChange(item.id, newTodos);
  };

  const addTodo = () => {
    const newTodos = [...(item.todos || []), { id: crypto.randomUUID(), text: '', done: false }];
    onTodoChange(item.id, newTodos);
  };

  const deleteTodo = (todoId: string) => {
    if (!item.todos) return;
    onTodoChange(
      item.id,
      item.todos.filter((t) => t.id !== todoId)
    );
  };

  // -- Todo Drag and Drop Handlers --
  const handleTodoDragStart = (e: React.DragEvent, todoId: string) => {
    e.stopPropagation();
    setDraggedTodoId(todoId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTodoDragOver = (e: React.DragEvent, todoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedTodoId && draggedTodoId !== todoId) {
      setDragOverTodoId(todoId);
    }
  };

  const handleTodoDrop = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTodoId || !item.todos || draggedTodoId === dropTargetId) {
      setDraggedTodoId(null);
      setDragOverTodoId(null);
      return;
    }

    const todos = [...item.todos];
    const draggedIndex = todos.findIndex((t) => t.id === draggedTodoId);
    const targetIndex = todos.findIndex((t) => t.id === dropTargetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged item and insert at target position
    const [draggedItem] = todos.splice(draggedIndex, 1);
    todos.splice(targetIndex, 0, draggedItem);

    onTodoChange(item.id, todos);
    setDraggedTodoId(null);
    setDragOverTodoId(null);
  };

  const handleTodoDragEnd = () => {
    setDraggedTodoId(null);
    setDragOverTodoId(null);
  };

  const getTypographyStyle = (style?: ItemStyle): React.CSSProperties => {
    if (!style) return { fontSize: '0.875rem' };
    const sizes = { sm: '0.75rem', md: '0.875rem', lg: '1.25rem', xl: '1.5rem' };
    return {
      fontSize: sizes[style.fontSize],
      fontWeight: style.fontWeight,
      textAlign: style.textAlign,
      lineHeight: style.fontSize === 'lg' || style.fontSize === 'xl' ? '1.2' : '1.5',
    };
  };

  const renderContent = () => {
    switch (item.type) {
      case ItemType.CONTAINER:
        return (
          <div className="flex flex-col h-full w-full relative group/container">
            <div
              className={`h-12 cursor-grab active:cursor-grabbing flex items-center px-3 rounded-t-xl transition-colors ${item.collapsed ? 'rounded-b-xl bg-gray-200/80' : 'bg-black/5'}`}
              onMouseDown={handleMouseDown}
              onDoubleClick={() => onToggleCollapse && onToggleCollapse(item.id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCollapse && onToggleCollapse(item.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="mr-2 text-gray-500 hover:text-black p-1 rounded hover:bg-black/5"
              >
                {item.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              </button>

              <input
                ref={titleInputRef}
                type="text"
                value={item.content}
                onChange={(e) => onContentChange(item.id, e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="GROUP TITLE"
                className="bg-transparent border-none focus:outline-none font-bold text-gray-600 placeholder-gray-400 text-sm w-full uppercase tracking-wide cursor-text"
              />
            </div>
            {!item.collapsed && (
              <div className="flex-1 w-full rounded-b-xl" onMouseDown={handleMouseDown} />
            )}
          </div>
        );

      case ItemType.KANBAN:
        return (
          <div className="flex flex-col h-full w-full relative group/kanban bg-[#F4F5F7] rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            {/* Header */}
            <div
              className="h-12 flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-gray-200/50"
              onMouseDown={handleMouseDown}
            >
              <input
                ref={titleInputRef}
                type="text"
                value={item.content}
                onChange={(e) => onContentChange(item.id, e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="Column Name"
                className="bg-transparent border-none focus:outline-none font-bold text-gray-700 text-sm w-full cursor-text"
              />
              <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded ml-2">
                {item.content ? item.content.substring(0, 1) : '#'}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-white/50">
              <button
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded hover:bg-white hover:shadow-sm text-xs text-gray-500 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd && onQuickAdd(item.id, ItemType.NOTE);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title="Add Note"
              >
                <StickyNote size={12} />
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded hover:bg-white hover:shadow-sm text-xs text-gray-500 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd && onQuickAdd(item.id, ItemType.TODO);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title="Add Task"
              >
                <CheckSquare size={12} />
              </button>
            </div>

            {/* Body (Drop Zone Visual) */}
            <div className="flex-1 w-full p-2 relative" onMouseDown={handleMouseDown}>
              {/* This area is mostly empty visually, but logically it acts as the drag handle for the column background */}
              {isDragOver && (
                <div className="absolute inset-0 bg-blue-500/5 border-2 border-blue-500 border-dashed rounded-b-xl m-1 pointer-events-none" />
              )}
            </div>
          </div>
        );

      case ItemType.BOARD:
        return (
          <div
            className={`flex flex-col h-full relative group/board overflow-hidden bg-white transition-all duration-200 ${isDragOver ? 'ring-4 ring-blue-400 scale-[1.02]' : ''}`}
            onDoubleClick={handleDoubleClick}
          >
            {/* Board Header/Handle with Preview */}
            <div
              className={`h-32 flex-shrink-0 flex items-center justify-center relative border-b border-gray-100 transition-colors ${isDragOver ? 'bg-blue-50' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}
              onMouseDown={handleMouseDown}
            >
              {/* Mini Preview Grid */}
              <div className="absolute inset-0 p-4 grid grid-cols-2 gap-2 opacity-60">
                {previewItems.slice(0, 4).map((preview, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center"
                  >
                    {preview.type === ItemType.IMAGE && preview.content ? (
                      <img src={preview.content} className="w-full h-full object-cover" />
                    ) : preview.type === ItemType.LINK && preview.imageUrl ? (
                      <img src={preview.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex flex-col gap-1 p-1">
                        <div className="h-1 bg-gray-200 rounded w-full" />
                        <div className="h-1 bg-gray-200 rounded w-2/3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Center Icon Overlay */}
              <div className="relative z-10 bg-white/80 p-3 rounded-xl backdrop-blur-sm shadow-sm border border-white/50">
                {isDragOver ? (
                  <ArrowRight size={32} className="text-blue-500 animate-pulse" />
                ) : (
                  <FolderKanban size={32} className="text-gray-500" strokeWidth={1} />
                )}
              </div>

              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-gray-400 uppercase font-bold tracking-wider bg-white/80 px-2 py-1 rounded-full backdrop-blur-md">
                <span className="opacity-0 group-hover/board:opacity-100 transition-opacity flex items-center gap-1">
                  Open Board <ArrowRight size={10} />
                </span>
              </div>
            </div>

            {/* Board Content */}
            <div className="flex-1 p-4 flex flex-col justify-center">
              <input
                ref={boardInputRef}
                type="text"
                value={item.content}
                onChange={(e) => onContentChange(item.id, e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="Board Name"
                className="text-center w-full font-semibold text-gray-800 bg-transparent focus:outline-none placeholder-gray-300"
                style={getTypographyStyle(item.style)}
              />
              <div className="text-center text-xs text-gray-400 mt-1">
                {previewItems.length} items inside
              </div>
            </div>
          </div>
        );

      case ItemType.NOTE:
        const isDark = item.color === COLORS.dark;
        const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
        const placeholderColor = isDark ? 'placeholder-gray-500' : 'placeholder-gray-400';

        return (
          <div className="flex flex-col h-full relative group/note">
            <div
              className="h-6 cursor-grab active:cursor-grabbing flex-shrink-0 flex items-center justify-between px-2 rounded-t-lg transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseDown={handleMouseDown}
            >
              <GripHorizontal
                size={14}
                className={`opacity-0 group-hover/note:opacity-100 transition-opacity ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              />
              <div className="flex gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                <button
                  onClick={handleAiExpand}
                  disabled={isExpanding}
                  className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isExpanding ? 'cursor-wait' : ''} ${isDark ? 'text-purple-300' : 'text-purple-500'}`}
                  title="Expand with AI"
                >
                  {isExpanding ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                </button>
              </div>
            </div>
            <div
              className="flex-1 w-full h-full overflow-hidden relative"
              onDoubleClick={handleDoubleClick}
            >
              {isEditing ? (
                <textarea
                  ref={textAreaRef}
                  className={`w-full h-full p-4 pt-2 bg-transparent resize-none focus:outline-none ${textColor} ${placeholderColor}`}
                  value={item.content}
                  onChange={(e) => onContentChange(item.id, e.target.value)}
                  onBlur={() => onEdit && onEdit('')} // Clear edit mode on blur logic handled by parent? No, parent needs to know to clear.
                  // Actually, blur handling is tricky because clicking 'Expand AI' might blur.
                  // Let's stick to global selection logic or just keep it simple:
                  // Editing is active until user clicks elsewhere (handled by App.tsx handleCanvasMouseDown)
                  placeholder="Type something..."
                  style={{
                    cursor: 'text',
                    ...getTypographyStyle(item.style),
                  }}
                  autoFocus
                />
              ) : (
                <div
                  className={`w-full h-full p-4 pt-2 overflow-y-auto prose prose-sm max-w-none ${isDark ? 'prose-invert text-gray-200' : 'text-gray-800'}`}
                  style={{
                    ...getTypographyStyle(item.style),
                    cursor: 'default',
                  }}
                >
                  {item.content ? (
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                  ) : (
                    <span className={`italic ${placeholderColor}`}>Double-click to edit...</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case ItemType.TODO:
        const totalTodos = item.todos?.length || 0;
        const completedTodos = item.todos?.filter((t) => t.done).length || 0;
        const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

        return (
          <div className="flex flex-col h-full relative group/todo bg-white dark:bg-gray-800">
            <div
              className="cursor-grab active:cursor-grabbing flex-shrink-0 flex flex-col rounded-t-lg border-b border-gray-100 dark:border-gray-700/50"
              onMouseDown={handleMouseDown}
            >
              <div className="h-10 flex items-center justify-between px-3">
                <div className="flex items-center gap-2 flex-1">
                  <GripHorizontal
                    size={16}
                    className="text-gray-300 dark:text-gray-600 opacity-0 group-hover/todo:opacity-100"
                  />
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => onContentChange(item.id, e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    placeholder="To-Do List"
                    className="font-bold text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none text-sm flex-1"
                  />
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-medium ml-2">
                  {completedTodos}/{totalTodos}
                </div>
              </div>
              {/* Progress Bar */}
              {totalTodos > 0 && (
                <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              )}
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar">
              {item.todos?.map((todo) => (
                <div
                  key={todo.id}
                  draggable
                  onDragStart={(e) => handleTodoDragStart(e, todo.id)}
                  onDragOver={(e) => handleTodoDragOver(e, todo.id)}
                  onDrop={(e) => handleTodoDrop(e, todo.id)}
                  onDragEnd={handleTodoDragEnd}
                  className={`flex items-start gap-2.5 group/item rounded-lg px-2 py-1.5 -mx-2 transition-all ${
                    draggedTodoId === todo.id
                      ? 'opacity-50 cursor-grabbing'
                      : dragOverTodoId === todo.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-400'
                        : 'cursor-grab hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="mt-0.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 flex-shrink-0"
                  >
                    {todo.done ? (
                      <CheckSquare size={18} className="text-blue-500" />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                  <input
                    className={`w-full bg-transparent text-sm focus:outline-none ${todo.done ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200'}`}
                    value={todo.text}
                    onChange={(e) => updateTodoText(todo.id, e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    placeholder="New task..."
                  />
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover/item:opacity-100 text-gray-300 dark:text-gray-600 hover:text-red-500"
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addTodo}
                className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm mt-1 px-1 py-1"
              >
                <Plus size={16} /> <span>Add item</span>
              </button>
            </div>
          </div>
        );

      case ItemType.IMAGE:
        return (
          <div className="flex flex-col h-full bg-white shadow-sm group/img">
            <div
              className="w-full h-full cursor-grab active:cursor-grabbing p-2 bg-white rounded-lg shadow-sm border border-gray-100 relative overflow-hidden"
              onMouseDown={handleMouseDown}
            >
              {item.content ? (
                <>
                  <img
                    src={item.content}
                    alt="Board Item"
                    className="w-full h-full object-cover rounded pointer-events-none select-none"
                    draggable={false}
                    loading="lazy"
                  />
                  {/* Optional Generate Palette Button Overlay */}
                  {onExtractPalette && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExtractPalette(item.id);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity z-10 text-gray-500 hover:text-purple-600 border border-gray-100"
                      title="Generate Color Palette"
                    >
                      <Palette size={16} />
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
          </div>
        );

      case ItemType.SWATCH:
        return (
          <div className="flex flex-col h-full bg-white group/swatch overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Color Area */}
            <div
              className="flex-1 cursor-grab active:cursor-grabbing w-full relative"
              style={{ backgroundColor: item.swatchColor || '#ccc' }}
              onMouseDown={handleMouseDown}
            />
            {/* Info / Action Area */}
            <div
              className="h-8 bg-white flex items-center justify-between px-2 border-t border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={copyColorToClipboard}
              onMouseDown={(e) => e.stopPropagation()} // Allow clicking button without drag
            >
              <span className="text-[10px] font-mono text-gray-500 font-medium uppercase">
                {item.swatchColor}
              </span>
              {copied ? (
                <Check size={12} className="text-green-500" />
              ) : (
                <Copy size={12} className="text-gray-300 group-hover/swatch:text-gray-600" />
              )}
            </div>
          </div>
        );

      case ItemType.LINK:
        const showImage = !item.loading && item.imageUrl && !imgError;
        return (
          <div
            className="flex flex-col h-full bg-white dark:bg-gray-800 group/link overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            onMouseDown={handleMouseDown}
          >
            <a
              href={item.content}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
              onMouseDown={(e) => e.stopPropagation()}
              aria-label={`Open link: ${item.title || item.content}`}
            />
            <div
              className="w-full h-48 bg-gray-100 dark:bg-gray-700 relative cursor-pointer overflow-hidden flex-shrink-0 group/header"
            >
              {item.loading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                  <Loader2 size={24} className="text-gray-400 dark:text-gray-500 animate-spin" />
                </div>
              ) : showImage ? (
                <img
                  src={item.imageUrl}
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 ease-out group-hover/link:scale-110"
                  onError={() => setImgError(true)}
                  alt="Link Preview"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-300 dark:text-gray-500 gap-2">
                  {item.faviconUrl && !imgError ? (
                    <img
                      src={item.faviconUrl}
                      className="w-12 h-12 rounded opacity-50 grayscale"
                      onError={() => {
                        /* If favicon also fails */
                      }}
                      alt="Favicon"
                    />
                  ) : (
                    <Globe size={40} strokeWidth={1} />
                  )}
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-0 pointer-events-none">
                 <div className="font-semibold text-base leading-tight mb-1 line-clamp-2 drop-shadow-sm">
                  {item.title || item.content}
                </div>
                <div className="text-xs text-gray-200 line-clamp-1 drop-shadow-sm">
                  {item.description}
                </div>
              </div>
            </div>

            <div
              className="p-3 flex items-center gap-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700/50"
            >
              {item.faviconUrl ? (
                <img
                  src={item.faviconUrl}
                  className="w-4 h-4 rounded-sm"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  alt="Favicon"
                />
              ) : (
                <Globe size={14} className="text-gray-300 dark:text-gray-500" />
              )}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                {item.siteName || new URL(item.content).hostname}
              </span>
              <ExternalLink size={14} className="text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getContainerStyles = () => {
    if (item.type === ItemType.CONTAINER) {
      return {
        backgroundColor: item.collapsed ? 'transparent' : '#F1F5F9',
        border: isSelected
          ? '2px solid #60A5FA'
          : item.collapsed
            ? '2px solid transparent'
            : '2px solid #E2E8F0',
        borderRadius: '16px',
      };
    }
    // Kanban styles are handled inside renderContent but the wrapper needs zIndex and positioning
    return {};
  };

  const isKanban = item.type === ItemType.KANBAN;
  const canResize = isSelected && !isConnectionMode && item.type !== ItemType.CONTAINER && onResize;

  return (
    <div
      style={{ ...style, ...getContainerStyles() }}
      className={`group transition-shadow duration-300 ease-in-out ${
        item.type !== ItemType.CONTAINER && !isKanban
          ? `rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${isSelected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl hover:ring-2 hover:ring-blue-400/50'}`
          : ''
      } ${isKanban ? (isSelected ? 'ring-2 ring-blue-500 rounded-xl' : '') : ''} ${isConnectionMode && item.type !== ItemType.CONTAINER ? 'cursor-crosshair hover:ring-2 hover:ring-purple-400 dark:hover:ring-purple-500' : ''}`}
    >
      <div
        className={`rounded-xl overflow-hidden h-full transition-colors duration-300 ${item.type === ItemType.CONTAINER || isKanban ? 'bg-transparent' : ''}`}
        style={{
          backgroundColor:
            item.type === ItemType.NOTE
              ? item.color || '#fff'
              : item.type === ItemType.CONTAINER || isKanban
                ? 'transparent'
                : 'var(--color-bg-secondary)', // Use CSS variable
        }}
      >
        {renderContent()}
      </div>

      {canResize && (
        <ResizeHandles
          width={width}
          height={numericHeight}
          onResize={(w, h) => onResize && onResize(item.id, w, h)}
          onResizeStart={onResizeStart || (() => {})}
          onResizeEnd={onResizeEnd || (() => {})}
          zoom={zoom}
        />
      )}
    </div>
  );
};

export const DraggableItem = React.memo(DraggableItemComponent);
