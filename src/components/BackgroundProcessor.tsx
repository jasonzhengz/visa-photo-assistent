'use client';

import { useState } from 'react';
import { removeBackground, skipBackgroundProcessing } from '@/lib/backgroundRemoval';

interface BackgroundProcessorProps {
  originalPhoto: string;
  onProcessedPhoto: (processedPhoto: string) => void;
}

export default function BackgroundProcessor({ originalPhoto, onProcessedPhoto }: BackgroundProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [processedResult, setProcessedResult] = useState<string | null>(null);

  const handleProcessBackground = async () => {
    setIsProcessing(true);
    setError(null);
    setStatusMessage('Processing with AI...');
    
    try {
      const processedPhoto = await removeBackground(originalPhoto);
      setStatusMessage('Complete!');
      setProcessedResult(processedPhoto);
      onProcessedPhoto(processedPhoto);
    } catch (err) {
      setError('Failed to process background. Please try again.');
      console.error('Background processing error:', err);
      setStatusMessage('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipProcessing = async () => {
    setIsProcessing(true);
    setError(null);
    setStatusMessage('Adding white background...');
    
    try {
      const processedPhoto = await skipBackgroundProcessing(originalPhoto);
      setStatusMessage('Complete!');
      setProcessedResult(processedPhoto);
      onProcessedPhoto(processedPhoto);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Background processing error:', err);
      setStatusMessage('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Step 3: Process Background</h3>
        
        {/* Original photo preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Original Photo:</p>
          <img 
            src={originalPhoto} 
            alt="Original" 
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>

        {/* Show processed result preview */}
        {processedResult && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Processed Result:</p>
            <div className="bg-white rounded-lg border p-2">
              <img 
                src={processedResult} 
                alt="Processed" 
                className="w-full h-48 object-cover rounded"
              />
            </div>
            <button
              onClick={() => onProcessedPhoto(processedResult)}
              className="mt-3 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Continue to Cropping →
            </button>
          </div>
        )}

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
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {statusMessage}
              </div>
            ) : (
              'AI Background Removal'
            )}
          </button>

          {/* Alternative: Skip background processing */}
          <button
            onClick={handleSkipProcessing}
            disabled={isProcessing}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            Skip - Just Add White Background
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-xs text-red-500 mt-1">
                Don&apos;t worry! The app will use a backup method if the AI processing fails.
              </p>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Background Processing Options</h4>
            <p className="text-sm text-blue-700 mb-2">
              Choose how to handle your photo background for visa applications:
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>• <strong>AI Removal:</strong> Professional AI-powered background detection and removal</p>
              <p>• <strong>Skip Processing:</strong> Simple white background overlay (good for photos already against white backgrounds)</p>
              <p>• Both options ensure visa compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}