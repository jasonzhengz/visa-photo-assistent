'use client';

import { useRef } from 'react';
import { VisaRequirement } from '@/types';

interface PhotoLayoutProps {
  croppedPhoto: string;
  visaRequirement: VisaRequirement;
  onLayoutGenerated: (layoutPhoto: string) => void;
}

export default function PhotoLayout({ croppedPhoto, visaRequirement, onLayoutGenerated }: PhotoLayoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const generate4RLayout = () => {
    if (!canvasRef.current || !previewCanvasRef.current) return;
    
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const previewCtx = previewCanvas.getContext('2d');
    
    if (!ctx || !previewCtx) return;
    
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
      
      // Create preview (scaled down)
      const scale = 0.3;
      previewCanvas.width = paperWidth * scale;
      previewCanvas.height = paperHeight * scale;
      
      previewCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
    };
    
    img.src = croppedPhoto;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Step 4: Generate 4R Layout</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            This will create a 4&quot;×6&quot; layout with multiple copies of your photo optimized for printing.
          </p>
        </div>

        {/* Preview area */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Layout Preview:</h4>
          <div className="bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center min-h-48">
            <canvas 
              ref={previewCanvasRef}
              className="max-w-full h-auto border rounded"
              style={{ maxHeight: '300px' }}
            />
            {!previewCanvasRef.current && (
              <p className="text-gray-500">Click &quot;Generate Layout&quot; to see preview</p>
            )}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generate4RLayout}
          className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium mb-4"
        >
          Generate 4R Layout (4&quot; × 6&quot;)
        </button>

        {/* Layout information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Layout Information:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Paper size: 4&quot; × 6&quot; (10.16cm × 15.24cm)</li>
            <li>• Photo size: {visaRequirement.width}mm × {visaRequirement.height}mm</li>
            <li>• High resolution: 300 DPI for professional printing</li>
            <li>• Includes cutting guides for easy separation</li>
            <li>• Multiple copies for your convenience</li>
          </ul>
        </div>

        {/* Printing tips */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Printing Tips:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Use photo paper for best quality</li>
            <li>• Print at actual size (100% scale)</li>
            <li>• Use high-quality photo printing service</li>
            <li>• Cut along the dotted guide lines</li>
          </ul>
        </div>
      </div>

      {/* Hidden canvas for full-resolution layout */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}