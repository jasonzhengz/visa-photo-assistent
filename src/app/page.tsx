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

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      
      // Clear state data for the current and future steps
      switch (currentStep) {
        case 2:
          // Going back from step 2 to 1, clear selected country
          setPhotoState(prev => ({ ...prev, selectedCountry: null }));
          break;
        case 3:
          // Going back from step 3 to 2, clear original photo
          setPhotoState(prev => ({ ...prev, originalPhoto: null }));
          break;
        case 4:
          // Going back from step 4 to 3, clear processed photo
          setPhotoState(prev => ({ ...prev, processedPhoto: null }));
          break;
        case 5:
          // Going back from step 5 to 4, clear final layout
          setPhotoState(prev => ({ ...prev, finalLayout: null }));
          break;
      }
    }
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
              <div className="flex gap-2">
                <button
                  onClick={goToPreviousStep}
                  className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={resetApp}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="relative flex items-center justify-between mb-8">
          {/* Progress line background */}
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 z-0"></div>
          {/* Progress line fill */}
          <div 
            className="absolute top-4 left-8 h-0.5 bg-blue-600 z-0 transition-all duration-300"
            style={{ width: `calc(${((currentStep - 1) / 4) * 100}% - ${((currentStep - 1) / 4) * 2}rem)` }}
          ></div>
          
          {[
            { number: 1, name: 'Country' },
            { number: 2, name: 'Photo' },
            { number: 3, name: 'Background' },
            { number: 4, name: 'Crop' },
            { number: 5, name: 'Download' }
          ].map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 relative z-10 ${
                  step.number <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border-2 border-gray-200'
                }`}
              >
                {step.number}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                step.number <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
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