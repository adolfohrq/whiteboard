# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Milanote clone - a visual collaboration tool built with React, TypeScript, and Vite. It provides an infinite canvas workspace where users can create notes, todos, images, links, containers, nested boards, color swatches, kanban columns, and freehand drawings. The app supports AI-powered content generation via Google's Gemini API.

## Development Commands

### Running the application
```bash
npm run dev
```
- Starts Vite dev server on port **4124** (not the default 3000)
- Access at: http://localhost:4124/

### Building
```bash
npm run build
```
- Compiles TypeScript and bundles with Vite
- Output to `dist/` directory

### Preview production build
```bash
npm run preview
```

### Linting
```bash
npm run lint              # Check for errors (fails on warnings)
npm run lint:fix          # Auto-fix issues
```

### Formatting
```bash
npm run format            # Format all TS/TSX/CSS/MD files
npm run format:check      # Check formatting without changes
```

### Pre-commit hooks
- Husky runs `npm test` on pre-commit (though no test framework is currently configured)
- lint-staged automatically formats and lints staged files

## Architecture

### State Management (Zustand)

The app uses a single Zustand store ([store/useStore.ts](store/useStore.ts)) with localStorage persistence:

- **Multi-board architecture**: `boards` is a `Record<string, BoardData>` where each board contains items, connections, and metadata
- **Current board tracking**: `currentBoardId` determines which board is active
- **Undo/Redo**: History stacks (`past`/`future`) with 20-step limit, debounced at 500ms
- **Persistence**: Only `boards` and `currentBoardId` are persisted (not history stacks)
- **Key pattern**: Call `pushHistory()` BEFORE making changes to save current state

Board hierarchy:
- Each `BoardData` has a `parentId` for navigation
- `BOARD` type items have `linkedBoardId` to point to child boards
- Root board has ID `'root'` with `parentId: null`

### Item Types System

All canvas items extend the `BoardItem` interface ([types.ts](types.ts)):

```typescript
enum ItemType {
  NOTE,      // Rich text with markdown support
  IMAGE,     // URL-based images with upload capability
  TODO,      // Todo lists with checkboxes
  CONTAINER, // Collapsible groups with colored backgrounds
  LINK,      // URL previews with metadata fetching
  BOARD,     // Entry points to nested boards (linkedBoardId)
  SWATCH,    // Color palette items (swatchColor)
  KANBAN,    // Kanban columns for task organization
  DRAWING    // Freehand paths (points[], strokeColor)
}
```

Type-specific properties:
- **Links**: `title`, `description`, `imageUrl`, `faviconUrl`, `siteName`, `loading`
- **Boards**: `linkedBoardId` references child board
- **Containers**: `collapsed` state
- **Swatches**: `swatchColor` hex value
- **Drawings**: `points[]` array of positions, `strokeColor`
- **Todos**: `todos[]` array with `{id, text, done}`

### Canvas System

Canvas interactions are managed through custom hooks:

- **useCanvasControls** ([hooks/useCanvasControls.ts](hooks/useCanvasControls.ts)): Pan (middle-click drag) and zoom with keyboard shortcuts
- **useSelection** ([hooks/useSelection.ts](hooks/useSelection.ts)): Multi-select via click/shift-click or drag box selection
- **useSmartGuides** ([hooks/useSmartGuides.ts](hooks/useSmartGuides.ts)): Alignment guides when dragging items near others

Transform calculation pattern in [App.tsx](App.tsx):
```typescript
const transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
```

### AI Integration (Gemini)

Service: [services/geminiService.ts](services/geminiService.ts)

Three AI functions:
1. **generateIdeas(topic)**: Returns 5 creative ideas as string array using structured JSON output
2. **expandContent(currentContent)**: Expands text into fuller paragraph
3. **analyzeBoard(itemsContent)**: Summarizes board theme and suggests next steps

API key setup:
- Configure `GEMINI_API_KEY` in `.env.local`
- Vite exposes it as `process.env.API_KEY` via config ([vite.config.ts](vite.config.ts))
- Service gracefully handles missing keys with user-friendly errors

All functions use `gemini-2.5-flash` model and include toast notifications for loading states.

### Validation & Security

Zod schemas in [schemas/boardItem.schema.ts](schemas/boardItem.schema.ts) validate item structure.

Utilities in [utils/validation.ts](utils/validation.ts):
- `validateAndSanitizeUrl()`: Sanitizes URLs and validates against allowed protocols
- `sanitizeText()`: Uses DOMPurify to prevent XSS in user content
- `validateBoardItem()`: Zod-based validation for complete items

Always sanitize user input before rendering, especially for NOTE items with markdown.

### Component Organization

- **components/**: UI components (DraggableItem is the core 1000+ line component handling all item types)
- **hooks/**: Reusable React hooks for canvas, selection, storage, dark mode
- **services/**: External integrations (Gemini AI, link preview, color extraction)
- **utils/**: Toast notifications, error handling, validation, export
- **templates.ts**: Predefined board templates (Kanban, SWOT, etc.)

### Path Aliasing

`@/` maps to project root via tsconfig and Vite:
```typescript
import { useStore } from '@/store/useStore';
```

### Styling

- TailwindCSS loaded via CDN in [index.html](index.html)
- Custom styles in [index.css](index.css) for grid background and scrollbars
- Dark mode support via `useDarkMode` hook with `dark` class on document root

### Export Functionality

[utils/exportUtils.ts](utils/exportUtils.ts) provides `exportBoardAsImage()` using html-to-image library to convert canvas to downloadable PNG.

## ESLint Configuration

Key rules enforced:
- `@typescript-eslint/no-explicit-any: "error"` - No `any` types allowed
- `no-console: "warn"` - Only `console.warn` and `console.error` permitted
- `prefer-const` and `no-var` enforced
- React hooks rules via `eslint-plugin-react-hooks`

## Important Development Notes

1. **Port configuration**: Dev server runs on 4124, not default Vite port
2. **State mutations**: Always call `pushHistory()` before `updateBoard()` for undo support
3. **Multi-board navigation**: Use `setCurrentBoardId()` to switch boards, update breadcrumb trail accordingly
4. **Link previews**: [services/linkPreview.ts](services/linkPreview.ts) fetches metadata; may fail due to CORS
5. **Color extraction**: [services/colorUtils.ts](services/colorUtils.ts) uses canvas API to extract dominant colors from images
6. **Connections**: Stored separately from items in `BoardData.connections[]` with `fromId`/`toId` references

## Testing

No test framework is currently configured, but the pre-commit hook expects `npm test` to exist. Consider adding Vitest or Jest if writing tests.
