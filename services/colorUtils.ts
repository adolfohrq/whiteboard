// Helper to convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

interface Pixel {
  r: number;
  g: number;
  b: number;
}

// Simple Median Cut Algorithm Implementation
const getDominantColors = (pixels: Pixel[], count: number): string[] => {
  if (pixels.length === 0) return [];

  const boxes = [pixels];

  while (boxes.length < count) {
    // Find the box with the largest volume (or simple range) to split
    let largestBoxIndex = -1;
    let maxRange = -1;
    let channelToSplit: 'r' | 'g' | 'b' = 'r';

    boxes.forEach((box, index) => {
      if (box.length === 0) return;

      // Find min/max for R, G, B
      let minR = 255,
        maxR = 0;
      let minG = 255,
        maxG = 0;
      let minB = 255,
        maxB = 0;

      box.forEach((p) => {
        minR = Math.min(minR, p.r);
        maxR = Math.max(maxR, p.r);
        minG = Math.min(minG, p.g);
        maxG = Math.max(maxG, p.g);
        minB = Math.min(minB, p.b);
        maxB = Math.max(maxB, p.b);
      });

      const rangeR = maxR - minR;
      const rangeG = maxG - minG;
      const rangeB = maxB - minB;
      const maxBoxRange = Math.max(rangeR, rangeG, rangeB);

      if (maxBoxRange > maxRange) {
        maxRange = maxBoxRange;
        largestBoxIndex = index;
        if (rangeR >= rangeG && rangeR >= rangeB) channelToSplit = 'r';
        else if (rangeG >= rangeR && rangeG >= rangeB) channelToSplit = 'g';
        else channelToSplit = 'b';
      }
    });

    if (largestBoxIndex === -1) break; // Cannot split further

    const boxToSplit = boxes[largestBoxIndex];
    // Sort by the channel with max range
    boxToSplit.sort((a, b) => a[channelToSplit] - b[channelToSplit]);

    // Split in half
    const mid = Math.floor(boxToSplit.length / 2);
    const box1 = boxToSplit.slice(0, mid);
    const box2 = boxToSplit.slice(mid);

    // Replace old box with new ones
    boxes.splice(largestBoxIndex, 1, box1, box2);
  }

  // Calculate average color for each box
  return boxes.map((box) => {
    if (box.length === 0) return '#000000';
    const sum = box.reduce((acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }), {
      r: 0,
      g: 0,
      b: 0,
    });
    const r = Math.round(sum.r / box.length);
    const g = Math.round(sum.g / box.length);
    const b = Math.round(sum.b / box.length);
    return rgbToHex(r, g, b);
  });
};

export const extractPaletteFromImage = async (
  imageUrl: string,
  colorCount: number = 5
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    // Use a CORS proxy for external images
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const isExternal = /^https?:\/\//.test(imageUrl) && !imageUrl.startsWith(window.location.origin);
    img.src = isExternal ? `${proxyUrl}${encodeURIComponent(imageUrl)}` : imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Could not get canvas context');
        return;
      }

      // Downscale image for performance (max 150px dimension)
      const MAX_SIZE = 150;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > MAX_SIZE) {
          h *= MAX_SIZE / w;
          w = MAX_SIZE;
        }
      } else {
        if (h > MAX_SIZE) {
          w *= MAX_SIZE / h;
          h = MAX_SIZE;
        }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      try {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const pixels: Pixel[] = [];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Filter out transparent or extremely white/black pixels to get "rich" colors
          // You can adjust these thresholds
          if (a < 128) continue; // Skip transparent
          // Optional: Skip pure whites/blacks if desired, but sometimes they are relevant.
          // Let's keep them but maybe filter out ONLY exact white/black if needed.

          pixels.push({ r, g, b });
        }

        const palette = getDominantColors(pixels, colorCount);
        resolve(palette);
      } catch (e) {
        console.error('Canvas security error (CORS):', e);
        // Fallback or reject.
        // Note: If the image is from an external URL without CORS headers, this will fail.
        reject('CORS_ERROR');
      }
    };

    img.onerror = (e) => reject(e);
  });
};
