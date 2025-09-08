import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';

// Convert data URL to File object
function dataURLToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Apply white background to result
function addWhiteBackground(imageBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the processed image on top
      ctx.drawImage(img, 0, 0);
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = () => reject(new Error('Failed to load processed image'));
    img.src = URL.createObjectURL(imageBlob);
  });
}

// Main background removal function using IMG.LY
export async function removeBackground(imageDataUrl: string, onProgress?: (progress: number) => void): Promise<string> {
  try {
    onProgress?.(10);
    
    // Convert data URL to File for IMG.LY library
    const imageFile = dataURLToFile(imageDataUrl, 'photo.jpg');
    onProgress?.(20);
    
    console.log('Starting AI background removal...');
    
    // Use IMG.LY background removal
    const resultBlob = await imglyRemoveBackground(imageFile);
    onProgress?.(70);
    
    console.log('Background removal complete, adding white background...');
    
    // Add white background to the result
    const finalResult = await addWhiteBackground(resultBlob);
    onProgress?.(100);
    
    console.log('Final result data URL prefix:', finalResult.substring(0, 50));
    return finalResult;
    
  } catch (error) {
    console.warn('AI background removal failed, falling back to simple method:', error);
    onProgress?.(50);
    return removeBackgroundFallback(imageDataUrl);
  }
}

// Improved fallback method - fixes the black photo issue
export async function removeBackgroundFallback(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill with white background first
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // More conservative background detection - much less aggressive
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Only replace very bright, white-ish backgrounds
        const brightness = (r + g + b) / 3;
        const isVeryWhiteBackground = brightness > 240 && // Much higher threshold
                           Math.abs(r - g) < 10 && // Very tight color similarity
                           Math.abs(g - b) < 10 && 
                           Math.abs(r - b) < 10 &&
                           r > 240 && g > 240 && b > 240; // All channels must be very bright
        
        if (isVeryWhiteBackground) {
          // Replace with pure white
          data[i] = 255;     // Red
          data[i + 1] = 255; // Green  
          data[i + 2] = 255; // Blue
          // Keep original alpha value
        }
      }
      
      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageDataUrl;
  });
}

// Skip background processing option
export async function skipBackgroundProcessing(imageDataUrl: string): Promise<string> {
  // Simply return a white-background version without aggressive processing
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the original image on top
      ctx.drawImage(img, 0, 0);
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageDataUrl;
  });
}

// Alternative: Use remove.bg API (requires API key) - kept for compatibility
export async function removeBackgroundWithAPI(imageDataUrl: string, apiKey?: string): Promise<string> {
  if (!apiKey) {
    // Fallback to IMG.LY processing
    return removeBackground(imageDataUrl);
  }
  
  try {
    // Convert dataURL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('image_file', blob);
    formData.append('size', 'auto');
    
    const removeResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });
    
    if (!removeResponse.ok) {
      throw new Error('Background removal API failed');
    }
    
    const resultBlob = await removeResponse.blob();
    
    // Add white background to result
    return addWhiteBackground(resultBlob);
  } catch (error) {
    console.error('Background removal API failed, using IMG.LY fallback:', error);
    return removeBackground(imageDataUrl);
  }
}