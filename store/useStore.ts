import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BoardData, BoardItem, Connection, ItemType } from '../types';

// Initial State
const INITIAL_ROOT_ID = 'root';
const INITIAL_BOARD: BoardData = {
  id: INITIAL_ROOT_ID,
  title: 'Home',
  items: [],
  connections: [],
  parentId: null,
  createdAt: Date.now(),
};

interface AppState {
  boards: Record<string, BoardData>;
  currentBoardId: string;

  // History Stacks (Limit 20 steps)
  past: Record<string, BoardData>[];
  future: Record<string, BoardData>[];

  // Actions
  setCurrentBoardId: (id: string) => void;

  // Call this BEFORE making a change to save state to history
  pushHistory: () => void;

  undo: () => void;
  redo: () => void;

  // Data Manipulation
  updateBoard: (boardId: string, updater: (board: BoardData) => BoardData) => void;
  setBoards: (boards: Record<string, BoardData>) => void;

  // Helper to get current board data easily
  getCurrentBoard: () => BoardData;
}

let lastPushTime = 0;
const DEBOUNCE_MS = 500;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      boards: { [INITIAL_ROOT_ID]: INITIAL_BOARD },
      currentBoardId: INITIAL_ROOT_ID,
      past: [],
      future: [],

      setCurrentBoardId: (id) => set({ currentBoardId: id }),

      getCurrentBoard: () => {
        const state = get();
        return state.boards[state.currentBoardId] || INITIAL_BOARD;
      },

      pushHistory: () => {
        const now = Date.now();
        if (now - lastPushTime < DEBOUNCE_MS) {
          return;
        }
        lastPushTime = now;

        const { boards, past } = get();
        // Limit history to 20 steps to save memory
        const newPast = [...past, boards].slice(-20);
        set({ past: newPast, future: [] });
      },

      undo: () => {
        const { past, boards, future } = get();
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        set({
          boards: previous,
          past: newPast,
          future: [boards, ...future],
        });
      },

      redo: () => {
        const { future, boards, past } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
          boards: next,
          past: [...past, boards],
          future: newFuture,
        });
      },

      updateBoard: (boardId, updater) => {
        set((state) => {
          const currentBoard = state.boards[boardId];
          if (!currentBoard) return state;

          const updatedBoard = updater(currentBoard);

          return {
            boards: {
              ...state.boards,
              [boardId]: updatedBoard,
            },
          };
        });
      },

      setBoards: (newBoards) => {
        set({ boards: newBoards });
      },
    }),
    {
      name: 'mila-store-v2',
      partialize: (state) => ({
        boards: state.boards,
        currentBoardId: state.currentBoardId,
      }), // Don't persist history stacks
      storage: createJSONStorage(() => localStorage), // Use default storage with wrapper
    }
  )
);
