import React from 'react';
import { Lightbulb, MousePointerClick, Type } from 'lucide-react';

export const EmptyState = ({ onAddNote }: { onAddNote: () => void }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <div className="text-center p-8 rounded-lg">
        <Lightbulb
          className="mx-auto text-gray-300 mb-4"
          size={48}
          strokeWidth={1}
        />
        <h2 className="text-xl font-semibold text-gray-500 mb-2">
          Your canvas is empty
        </h2>
        <p className="text-gray-400 max-w-sm mx-auto mb-6">
          Start by adding a note, pasting a link, or dragging files here.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onAddNote}
            className="pointer-events-auto flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors shadow-sm"
          >
            <Type size={16} />
            Add a Note
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MousePointerClick size={16} />
            <span>or start dragging...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
