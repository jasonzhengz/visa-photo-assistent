'use client';

import { useState } from 'react';
import { PhotoState } from '@/types';
import CountrySelector from '@/components/CountrySelector';
import CameraCapture from '@/components/CameraCapture';
import BackgroundProcessor from '@/components/BackgroundProcessor';
import PhotoCropper from '@/components/PhotoCropper';
import DownloadSection from '@/components/DownloadSection';

export default function Home() {
  const [photoState, setPhotoState] = useState<PhotoState>({
    originalPhoto: null,
    processedPhoto: null,
    croppedPhoto: null,
    finalLayout: null,
    selectedCountry: null,
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleCountrySelect = (requirement: typeof photoState.selectedCountry) => {
    setPhotoState(prev => ({ ...prev, selectedCountry: requirement }));
    setCurrentStep(2);
  };

  const handlePhotoCapture = (photo: string) => {
    setPhotoState(prev => ({ ...prev, originalPhoto: photo }));
    setCurrentStep(3);
  };

  const handleProcessedPhoto = (processedPhoto: string) => {
    setPhotoState(prev => ({ ...prev, processedPhoto }));
    setCurrentStep(4);
  };

  const handleLayoutGenerated = (layoutPhoto: string) => {
    setPhotoState(prev => ({ ...prev, finalLayout: layoutPhoto }));
    setCurrentStep(5);
  };

  const resetApp = () => {
    setPhotoState({
      originalPhoto: null,
      processedPhoto: null,
      croppedPhoto: null,
      finalLayout: null,
      selectedCountry: null,
    });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visa Photo Assistant</h1>
              <p className="text-sm text-gray-600">Professional visa photos made easy</p>
            </div>
            {currentStep > 1 && (
              <button
                onClick={resetApp}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 5 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-600">
            {currentStep === 1 && 'Step 1: Select your destination country'}
            {currentStep === 2 && 'Step 2: Take a photo using your device camera'}
            {currentStep === 3 && 'Step 3: Process background to white'}
            {currentStep === 4 && 'Step 4: Crop photo and generate printable layout'}
            {currentStep === 5 && 'Step 5: Download and print your photos'}
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <div className="space-y-8">
          {/* Step 1: Country Selection */}
          {currentStep === 1 && (
            <CountrySelector
              onCountrySelect={handleCountrySelect}
              selectedCountry={photoState.selectedCountry}
            />
          )}

          {/* Step 2: Camera Capture */}
          {currentStep === 2 && photoState.selectedCountry && (
            <CameraCapture
              onPhotoCapture={handlePhotoCapture}
              visaRequirement={photoState.selectedCountry}
            />
          )}

          {/* Step 3: Background Processing */}
          {currentStep === 3 && photoState.originalPhoto && (
            <BackgroundProcessor
              originalPhoto={photoState.originalPhoto}
              onProcessedPhoto={handleProcessedPhoto}
            />
          )}

          {/* Step 4: Photo Cropping & Layout Generation */}
          {currentStep === 4 && photoState.processedPhoto && photoState.selectedCountry && (
            <PhotoCropper
              processedPhoto={photoState.processedPhoto}
              visaRequirement={photoState.selectedCountry}
              onLayoutGenerated={handleLayoutGenerated}
            />
          )}

          {/* Step 5: Download */}
          {currentStep === 5 && photoState.finalLayout && photoState.selectedCountry && (
            <DownloadSection
              layoutPhoto={photoState.finalLayout}
              visaRequirement={photoState.selectedCountry}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Visa Photo Assistant</strong> - Professional visa photos in minutes
            </p>
            <p>
              Supports major countries and visa requirements. Photos are processed locally for your privacy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}