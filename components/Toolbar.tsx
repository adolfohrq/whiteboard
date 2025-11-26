import React from 'react';
import {
  StickyNote,
  CheckSquare,
  Cable,
  Upload,
  Layout,
  Link as LinkIcon,
  FolderKanban,
  Sparkles,
  Columns,
  Undo2,
  Redo2,
  PenTool,
  Workflow,
  MessageSquare,
} from 'lucide-react';

interface TooltipWrapperProps {
  children: React.ReactNode;
  label: string;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ children, label }) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
      {label}
    </span>
  </div>
);

interface ToolbarProps {
  isConnectionMode: boolean;
  onAddNote: () => void;
  onAddTodo: () => void;
  onAddContainer: () => void;
  onAddLink: () => void;
  onAddBoard: () => void;
  onAddKanban: () => void;
  onAddMindMap: () => void;
  onAddComment: () => void;
  onUploadImage: () => void;
  onToggleConnectionMode: () => void;
  onToggleDrawingMode: () => void;
  onAiBrainstorm: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDrawingMode: boolean;
}

const ToolbarButton = ({
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
  children,
  isActive = false,
  variant = 'default',
}: {
  onClick?: () => void;
  disabled?: boolean;
  'aria-label': string;
  children: React.ReactNode;
  isActive?: boolean;
  variant?: 'default' | 'primary' | 'ghost';
}) => {
  const baseClasses =
    'p-2 rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75';

  const variantClasses = {
    default: `text-gray-600 hover:bg-gray-100 hover:text-black active:bg-gray-200 ${isActive ? 'bg-gray-100 text-black' : ''
      }`,
    primary: `bg-gradient-to-tr from-purple-50 to-blue-50 text-purple-600 hover:text-purple-700 hover:shadow-md border border-purple-100 ${isActive ? 'shadow-md' : ''
      }`,
    ghost: `text-gray-600 hover:bg-gray-100 hover:text-black active:bg-gray-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : ''
      }`,
  };

  const disabledClasses = 'disabled:text-gray-300 disabled:cursor-not-allowed';

  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
    >
      {children}
    </button>
  );
};

export const Toolbar: React.FC<ToolbarProps> = ({
  isConnectionMode,
  onAddNote,
  onAddTodo,
  onAddContainer,
  onAddLink,
  onAddBoard,
  onAddKanban,
  onAddMindMap,
  onAddComment,
  onUploadImage,
  onToggleConnectionMode,
  onToggleDrawingMode,
  onAiBrainstorm,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isDrawingMode,
}) => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 z-50">
      {/* History Controls */}
      <div className="flex flex-col gap-1 p-1 border-b border-gray-200">
        <TooltipWrapper label="Undo">
          <ToolbarButton
            aria-label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
            variant="ghost"
          >
            <Undo2 size={20} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
        <TooltipWrapper label="Redo">
          <ToolbarButton
            aria-label="Redo"
            onClick={onRedo}
            disabled={!canRedo}
            variant="ghost"
          >
            <Redo2 size={20} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
      </div>

      {/* Content Creation */}
      <div className="flex flex-col gap-1 p-1">
        <TooltipWrapper label="New Note">
          <ToolbarButton aria-label="Add New Note" onClick={onAddNote}>
            <StickyNote size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
        <TooltipWrapper label="To-Do List">
          <ToolbarButton aria-label="Add To-Do List" onClick={onAddTodo}>
            <CheckSquare size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
        <TooltipWrapper label="Add Comment">
          <ToolbarButton aria-label="Add Comment" onClick={onAddComment}>
            <MessageSquare size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
        <TooltipWrapper label="Paste Link">
          <ToolbarButton aria-label="Paste Link" onClick={onAddLink}>
            <LinkIcon size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
        <TooltipWrapper label="Upload Image">
          <ToolbarButton aria-label="Upload Image" onClick={onUploadImage}>
            <Upload size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
      </div>

      {/* Organizational Tools */}
      <div className="flex flex-col gap-1 p-1 border-t border-gray-200">
        <TooltipWrapper label="New Board">
          <ToolbarButton aria-label="Add New Board" onClick={onAddBoard}>
            <FolderKanban size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
        <TooltipWrapper label="Kanban Column">
          <ToolbarButton aria-label="Add Kanban Column" onClick={onAddKanban}>
            <Columns size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
        <TooltipWrapper label="Free Group">
          <ToolbarButton aria-label="Add Free Group" onClick={onAddContainer}>
            <Layout size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
        <TooltipWrapper label="Mind Map">
          <ToolbarButton aria-label="Create Mind Map" onClick={onAddMindMap} variant="primary">
            <Workflow size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
      </div>

      {/* Special Tools */}
      <div className="flex flex-col gap-1 p-1 border-t border-gray-200">
        <TooltipWrapper label={isConnectionMode ? 'Cancel Connection' : 'Connect Items'}>
          <ToolbarButton
            aria-label={isConnectionMode ? 'Cancel Connection Mode' : 'Enter Connection Mode'}
            onClick={onToggleConnectionMode}
            isActive={isConnectionMode}
            variant="ghost"
          >
            <Cable size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>

        <TooltipWrapper label={isDrawingMode ? 'Stop Drawing' : 'Freehand Draw'}>
          <ToolbarButton
            aria-label={isDrawingMode ? 'Stop Drawing Mode' : 'Enter Drawing Mode'}
            onClick={onToggleDrawingMode}
            isActive={isDrawingMode}
            variant="ghost"
          >
            <PenTool size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>

        <TooltipWrapper label="AI Brainstorm">
          <ToolbarButton
            aria-label="AI Brainstorm"
            onClick={onAiBrainstorm}
            variant="primary"
          >
            <Sparkles size={22} strokeWidth={1.5} />
          </ToolbarButton>
        </TooltipWrapper>
      </div>
    </div>
  );
};
