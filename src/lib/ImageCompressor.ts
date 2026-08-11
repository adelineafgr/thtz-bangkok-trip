/**
 * Compress an image file or base64 Data URL using HTML Canvas
 * Resizes dimensions to max maxDim x maxDim and quality (default 0.6)
 * Output size is usually 20KB - 60KB per image.
 */
export async function compressDataUrl(dataUrl: string, maxDim = 600, quality = 0.6): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }

  // If dataUrl is already short (< 70KB), no need to recompress
  if (dataUrl.length < 90000) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch (err) {
        console.warn('Image compression failed, keeping original URL:', err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

/**
 * Compress File object to lightweight base64 Data URL
 */
export function compressImageFile(file: File, maxDim = 600, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        const compressed = await compressDataUrl(result, maxDim, quality);
        resolve(compressed);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Deep scan object or array and compress all large base64 image strings asynchronously
 */
export async function compressDataObjects<T>(obj: T): Promise<T> {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    const compressedList = await Promise.all(obj.map(item => compressDataObjects(item)));
    return compressedList as unknown as T;
  }

  const result: Record<string, any> = { ...obj };
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (typeof val === 'string' && val.startsWith('data:image')) {
      result[key] = await compressDataUrl(val, 600, 0.6);
    } else if (typeof val === 'object' && val !== null) {
      result[key] = await compressDataObjects(val);
    }
  }

  return result as T;
}
