'use client';

import { useState, useRef, useEffect } from 'react';
import { VisaRequirement, CropArea } from '@/types';

interface PhotoCropperProps {
  processedPhoto: string;
  visaRequirement: VisaRequirement;
  onCroppedPhoto: (croppedPhoto: string) => void;
}

export default function PhotoCropper({ processedPhoto, visaRequirement, onCroppedPhoto }: PhotoCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 250 });
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;
    
    e.preventDefault();
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const maxX = rect.width - cropArea.width;
    const maxY = rect.height - cropArea.height;
    
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x - cropArea.width / 2, maxX)),
      y: Math.max(0, Math.min(y - cropArea.height / 2, maxY)),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cropPhoto = () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!ctx) return;
    
    // Calculate scaling factors
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    
    // Set canvas size to visa requirement dimensions (at 300 DPI)
    const dpi = 300;
    const mmToPixels = dpi / 25.4;
    canvas.width = visaRequirement.width * mmToPixels;
    canvas.height = visaRequirement.height * mmToPixels;
    
    // Calculate crop area in original image coordinates
    const sourceX = cropArea.x * scaleX;
    const sourceY = cropArea.y * scaleY;
    const sourceWidth = cropArea.width * scaleX;
    const sourceHeight = cropArea.height * scaleY;
    
    // Draw cropped and scaled image
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCroppedPhoto(croppedDataUrl);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Step 3: Crop Photo</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Drag the crop area to position your photo. The photo will be resized to {visaRequirement.width}mm × {visaRequirement.height}mm.
          </p>
        </div>

        {/* Image with crop overlay */}
        <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
          <img
            ref={imageRef}
            src={processedPhoto}
            alt="Processed"
            className="w-full h-auto max-h-96 object-contain"
            onLoad={() => setImageLoaded(true)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ userSelect: 'none' }}
          />
          
          {imageLoaded && (
            <>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none" />
              
              {/* Crop area */}
              <div
                className="absolute border-2 border-white shadow-lg cursor-move bg-transparent"
                style={{
                  left: `${cropArea.x}px`,
                  top: `${cropArea.y}px`,
                  width: `${cropArea.width}px`,
                  height: `${cropArea.height}px`,
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

        {/* Crop button */}
        <button
          onClick={cropPhoto}
          className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Crop Photo to {visaRequirement.width}mm × {visaRequirement.height}mm
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

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}