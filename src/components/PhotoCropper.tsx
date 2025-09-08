'use client';

import { useState, useRef, useEffect } from 'react';
import { VisaRequirement, CropArea } from '@/types';

interface PhotoCropperProps {
  processedPhoto: string;
  visaRequirement: VisaRequirement;
  onLayoutGenerated: (layoutPhoto: string) => void;
}

export default function PhotoCropper({ processedPhoto, visaRequirement, onLayoutGenerated }: PhotoCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 250 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(processedPhoto);

  // Debug: Log the processed photo data
  useEffect(() => {
    console.log('PhotoCropper received processedPhoto:', processedPhoto.substring(0, 50));
    // Only reset states if we actually have a NEW photo (not just a re-render)
    if (currentPhoto !== processedPhoto) {
      console.log('New photo detected, resetting states');
      setCurrentPhoto(processedPhoto);
      setImageLoaded(false);
      setImageError(false);
    }
  }, [processedPhoto, currentPhoto]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Failed to load processed image:', e);
    setImageError(true);
    setImageLoaded(false);
  };

  const aspectRatio = visaRequirement.width / visaRequirement.height;

  useEffect(() => {
    if (imageLoaded && imageRef.current) {
      const img = imageRef.current;
      const newWidth = 200;
      const newHeight = 200 / aspectRatio;
      const centerX = (img.clientWidth - newWidth) / 2;
      const centerY = (img.clientHeight - newHeight) / 2;
      
      setCropArea({
        x: centerX,
        y: centerY,
        width: newWidth,
        height: newHeight,
      });
    }
  }, [imageLoaded, aspectRatio]);

  // Add global mouse event listeners for smooth dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      
      const rect = imageRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate new crop position using the offset
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;
      
      const maxX = rect.width - cropArea.width;
      const maxY = rect.height - cropArea.height;
      
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      }));
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset, cropArea.width, cropArea.height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate offset from mouse to crop area top-left corner
    setDragOffset({
      x: x - cropArea.x,
      y: y - cropArea.y
    });
    
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Prevent default but let global handler do the work
    if (isDragging) {
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    // This is mainly for fallback, global handler will do most work
    if (isDragging) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const cropAndGenerateLayout = () => {
    if (!imageRef.current || !canvasRef.current || !layoutCanvasRef.current) return;
    
    const cropCanvas = canvasRef.current;
    const cropCtx = cropCanvas.getContext('2d');
    const img = imageRef.current;
    
    if (!cropCtx) return;
    
    // Calculate scaling factors
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    
    // Set canvas size to visa requirement dimensions (at 300 DPI)
    const dpi = 300;
    const mmToPixels = dpi / 25.4;
    const photoWidth = visaRequirement.width * mmToPixels;
    const photoHeight = visaRequirement.height * mmToPixels;
    
    cropCanvas.width = photoWidth;
    cropCanvas.height = photoHeight;
    
    // Calculate crop area in original image coordinates
    const sourceX = cropArea.x * scaleX;
    const sourceY = cropArea.y * scaleY;
    const sourceWidth = cropArea.width * scaleX;
    const sourceHeight = cropArea.height * scaleY;
    
    // Draw cropped and scaled image
    cropCtx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      photoWidth,
      photoHeight
    );
    
    // Get the cropped photo as data URL to use for layout generation
    const croppedDataUrl = cropCanvas.toDataURL('image/jpeg', 0.95);
    
    // Generate 4R layout
    generate4RLayout(croppedDataUrl);
  };

  const generate4RLayout = (croppedPhoto: string) => {
    if (!layoutCanvasRef.current) return;
    
    const canvas = layoutCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // 4R paper dimensions: 4" x 6" at 300 DPI
    const dpi = 300;
    const paperWidth = 4 * dpi;  // 1200px
    const paperHeight = 6 * dpi; // 1800px
    
    canvas.width = paperWidth;
    canvas.height = paperHeight;
    
    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, paperWidth, paperHeight);
    
    // Calculate photo dimensions at 300 DPI
    const mmToPixels = dpi / 25.4;
    const photoWidth = visaRequirement.width * mmToPixels;
    const photoHeight = visaRequirement.height * mmToPixels;
    
    // Calculate how many photos can fit
    const cols = Math.floor(paperWidth / (photoWidth + 20)); // 20px margin between photos
    const rows = Math.floor(paperHeight / (photoHeight + 20));
    
    // Calculate starting positions to center the grid
    const totalGridWidth = cols * photoWidth + (cols - 1) * 20;
    const totalGridHeight = rows * photoHeight + (rows - 1) * 20;
    const startX = (paperWidth - totalGridWidth) / 2;
    const startY = (paperHeight - totalGridHeight) / 2;
    
    // Load and draw photos
    const img = new Image();
    img.onload = () => {
      // Draw photos in grid
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = startX + col * (photoWidth + 20);
          const y = startY + row * (photoHeight + 20);
          
          // Draw photo
          ctx.drawImage(img, x, y, photoWidth, photoHeight);
          
          // Draw border
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoWidth, photoHeight);
        }
      }
      
      // Add cutting guides (dotted lines)
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 0.5;
      
      // Vertical cutting lines
      for (let col = 1; col < cols; col++) {
        const x = startX + col * (photoWidth + 20) - 10;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, paperHeight);
        ctx.stroke();
      }
      
      // Horizontal cutting lines
      for (let row = 1; row < rows; row++) {
        const y = startY + row * (photoHeight + 20) - 10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(paperWidth, y);
        ctx.stroke();
      }
      
      // Reset line dash
      ctx.setLineDash([]);
      
      // Add text information
      ctx.fillStyle = '#6b7280';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      
      const infoText = `${visaRequirement.country} Visa Photos - ${visaRequirement.width}mm × ${visaRequirement.height}mm`;
      ctx.fillText(infoText, paperWidth / 2, paperHeight - 30);
      
      ctx.font = '18px Arial';
      ctx.fillText(`${cols}×${rows} photos on 4"×6" paper`, paperWidth / 2, paperHeight - 60);
      
      // Generate final layout
      const layoutDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onLayoutGenerated(layoutDataUrl);
    };
    
    img.src = croppedPhoto;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Step 4: Crop Photo</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Drag the crop area to position your photo. The photo will be resized to {visaRequirement.width}mm × {visaRequirement.height}mm.
          </p>
        </div>

        {/* Image with crop overlay */}
        <div className="relative mb-4 bg-white rounded-lg overflow-hidden border min-h-96">
          {imageError ? (
            <div className="flex items-center justify-center h-96 bg-gray-100">
              <div className="text-center">
                <p className="text-gray-600">Failed to load processed image</p>
                <p className="text-sm text-gray-500">Try processing the background again</p>
              </div>
            </div>
          ) : (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading processed image...</p>
                  </div>
                </div>
              )}
              <img
                ref={imageRef}
                key={processedPhoto} // Force re-render when processedPhoto changes
                src={processedPhoto}
                alt="Processed"
                className="w-full h-auto max-h-96 object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ 
                  userSelect: 'none', 
                  backgroundColor: 'white', 
                  minHeight: '200px',
                  opacity: imageLoaded ? 1 : 0
                }}
              />
            </>
          )}
          
          {imageLoaded && (
            <>
              {/* Sophisticated overlay that reveals crop area */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse ${cropArea.width/2}px ${cropArea.height/2}px at ${cropArea.x + cropArea.width/2}px ${cropArea.y + cropArea.height/2}px, transparent 0%, transparent 100%, rgba(0,0,0,0.4) 100%)`,
                  WebkitMask: `radial-gradient(ellipse ${cropArea.width/2}px ${cropArea.height/2}px at ${cropArea.x + cropArea.width/2}px ${cropArea.y + cropArea.height/2}px, transparent 0%, transparent 80%, black 100%)`,
                  mask: `radial-gradient(ellipse ${cropArea.width/2}px ${cropArea.height/2}px at ${cropArea.x + cropArea.width/2}px ${cropArea.y + cropArea.height/2}px, transparent 0%, transparent 80%, black 100%)`,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  zIndex: 5
                }}
              />
              
              {/* Crop area */}
              <div
                className={`absolute border-2 shadow-lg bg-transparent transition-colors ${
                  isDragging 
                    ? 'border-blue-500 cursor-grabbing' 
                    : 'border-yellow-400 cursor-grab hover:border-yellow-500'
                }`}
                style={{
                  left: `${cropArea.x}px`,
                  top: `${cropArea.y}px`,
                  width: `${cropArea.width}px`,
                  height: `${cropArea.height}px`,
                  zIndex: 10
                }}
                onMouseDown={handleMouseDown}
              >
                {/* Corner handles */}
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400" />
                
                {/* Center guide lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-50" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-50" />
              </div>
            </>
          )}
        </div>

        {/* Size controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop Size (maintains {visaRequirement.width}×{visaRequirement.height}mm ratio)
          </label>
          <input
            type="range"
            min="100"
            max="300"
            value={cropArea.width}
            onChange={(e) => {
              const width = parseInt(e.target.value);
              setCropArea(prev => ({
                ...prev,
                width,
                height: width / aspectRatio,
              }));
            }}
            className="w-full"
          />
        </div>

        {/* Crop and generate layout button */}
        <button
          onClick={cropAndGenerateLayout}
          className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Crop & Generate Layout
        </button>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-1">Cropping Tips:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Drag the crop area to reposition</li>
            <li>• Use the slider to adjust crop size</li>
            <li>• Ensure your head fits properly within the crop area</li>
            <li>• The final photo will be optimized for printing</li>
          </ul>
        </div>
      </div>

      {/* Hidden canvases for cropping and layout */}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={layoutCanvasRef} className="hidden" />
    </div>
  );
}