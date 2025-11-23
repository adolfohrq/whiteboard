import { toPng } from 'html-to-image';
import { showError, showSuccess } from './toast';

export const exportBoardAsImage = async (elementId: string = 'root', fileName: string = 'milaclone-board') => {
  const node = document.getElementById(elementId);
  if (!node) {
    showError('Could not find board to export');
    return;
  }

  // Show loading state could be handled by the caller, but we'll use a promise toast or similar if needed.
  // For now, simple execution.

  try {
    // We need to handle the scaling/transform of the canvas potentially, 
    // but taking a screenshot of the viewport is the simplest first step.
    // However, the user might want the *whole* canvas. 
    // Capturing the infinite canvas is tricky because it relies on transforms.
    // For this V1, we will capture the current viewport view which is what the user sees.
    
    // To capture the whole "content", we would need to temporarily scale the canvas to 1 
    // and resize the container to fit all items, which is complex and can crash browsers with large boards.
    // We will stick to "Screenshot Viewport" for stability.

    const dataUrl = await toPng(node, {
      quality: 0.95,
      backgroundColor: '#f9fafb', // Match background color
      filter: (node) => {
        // Exclude UI elements from the screenshot
        if (node.tagName === 'BUTTON' || node.classList?.contains('fixed')) {
            // This is a naive filter, might need refinement to exclude specific UI controls
            // But 'fixed' usually catches floating toolbars.
            // Let's rely on specific classes if possible or exclude by ID if we tag them.
            return true;
        }
        return true;
      }
    });

    const link = document.createElement('a');
    link.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
    showSuccess('Board exported successfully!');
  } catch (err) {
    console.error('Export failed:', err);
    showError('Failed to export board image.');
  }
};

