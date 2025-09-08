'use client';

import { useState } from 'react';
import { removeBackground } from '@/lib/backgroundRemoval';

interface BackgroundProcessorProps {
  originalPhoto: string;
  onProcessedPhoto: (processedPhoto: string) => void;
}

export default function BackgroundProcessor({ originalPhoto, onProcessedPhoto }: BackgroundProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessBackground = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const processedPhoto = await removeBackground(originalPhoto);
      onProcessedPhoto(processedPhoto);
    } catch (err) {
      setError('Failed to process background. Please try again.');
      console.error('Background processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Step 2: Process Background</h3>
        
        {/* Original photo preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Original Photo:</p>
          <img 
            src={originalPhoto} 
            alt="Original" 
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>

        {/* Processing controls */}
        <div className="space-y-3">
          <button
            onClick={handleProcessBackground}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Background...
              </div>
            ) : (
              'Change Background to White'
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Background Processing</h4>
            <p className="text-sm text-blue-700">
              The app will automatically detect and change your background to white, 
              which is required for most visa applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}