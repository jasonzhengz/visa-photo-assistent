'use client';

import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { VisaRequirement } from '@/types';

interface CameraCaptureProps {
  onPhotoCapture: (photo: string) => void;
  visaRequirement: VisaRequirement;
}

export default function CameraCapture({ onPhotoCapture, visaRequirement }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const capture = useCallback(() => {
    if (webcamRef.current) {
      setIsCapturing(true);
      
      setTimeout(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          onPhotoCapture(imageSrc);
        }
        setIsCapturing(false);
      }, 500);
    }
  }, [onPhotoCapture]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const aspectRatio = visaRequirement.width / visaRequirement.height;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.9}
          videoConstraints={{
            facingMode,
            width: 640,
            height: 480,
          }}
          className="w-full h-auto"
        />
        
        {/* Photo frame overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Frame outline */}
            <div 
              className="border-4 border-white border-opacity-80 rounded-lg shadow-lg"
              style={{
                width: '280px',
                height: `${280 / aspectRatio}px`,
              }}
            />
            
            {/* Corner guides */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg -translate-x-1 -translate-y-1" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg translate-x-1 -translate-y-1" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg -translate-x-1 translate-y-1" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg translate-x-1 translate-y-1" />
            
            {/* Instructions */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full text-center">
                Align your face within the frame
              </div>
            </div>
          </div>
        </div>

        {/* Capture flash overlay */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white opacity-80" />
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium mb-2">Photo Guidelines:</h4>
        <ul className="space-y-1 text-xs">
          <li>• Position your face within the frame</li>
          <li>• Look directly at the camera</li>
          <li>• Keep a neutral expression</li>
          <li>• Ensure good lighting on your face</li>
          <li>• Remove glasses if possible</li>
        </ul>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={toggleCamera}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <button
          onClick={capture}
          disabled={isCapturing}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isCapturing ? 'Capturing...' : 'Take Photo'}
        </button>
      </div>
    </div>
  );
}