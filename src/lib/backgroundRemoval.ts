export async function removeBackground(imageDataUrl: string): Promise<string> {
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
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple background removal (this is a basic implementation)
      // For production, you'd want to use a proper AI service like remove.bg
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Detect background (assuming it's relatively bright/white)
        // This is a very basic detection - in reality you'd use ML models
        const brightness = (r + g + b) / 3;
        const isBackground = brightness > 200 && 
                           Math.abs(r - g) < 30 && 
                           Math.abs(g - b) < 30 && 
                           Math.abs(r - b) < 30;
        
        if (isBackground) {
          // Make background transparent
          data[i + 3] = 0;
        }
      }
      
      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Create a new canvas with white background
      const finalCanvas = document.createElement('canvas');
      const finalCtx = finalCanvas.getContext('2d');
      
      if (!finalCtx) {
        reject(new Error('Could not get final canvas context'));
        return;
      }
      
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      
      // Fill with white background
      finalCtx.fillStyle = 'white';
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // Draw the processed image on top
      finalCtx.drawImage(canvas, 0, 0);
      
      resolve(finalCanvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageDataUrl;
  });
}

// Alternative: Use remove.bg API (requires API key)
export async function removeBackgroundWithAPI(imageDataUrl: string, apiKey?: string): Promise<string> {
  if (!apiKey) {
    // Fallback to local processing
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
    
    // Convert blob to dataURL and add white background
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            resolve(imageDataUrl); // Fallback to original
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Fill with white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the processed image
          ctx.drawImage(img, 0, 0);
          
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(resultBlob);
    });
  } catch (error) {
    console.error('Background removal failed, using fallback:', error);
    return removeBackground(imageDataUrl);
  }
}