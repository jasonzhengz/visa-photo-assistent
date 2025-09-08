'use client';

import { useState } from 'react';
import { VisaRequirement } from '@/types';
import { visaRequirements } from '@/lib/visaRequirements';

interface CountrySelectorProps {
  onCountrySelect: (requirement: VisaRequirement) => void;
  selectedCountry: VisaRequirement | null;
}

export default function CountrySelector({ onCountrySelect, selectedCountry }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Country for Visa Application
      </label>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {selectedCountry ? (
            <div>
              <div className="font-medium">{selectedCountry.country}</div>
              <div className="text-sm text-gray-500">
                {selectedCountry.width}mm × {selectedCountry.height}mm
              </div>
            </div>
          ) : (
            <span className="text-gray-500">Choose a country...</span>
          )}
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {visaRequirements.map((requirement) => (
              <button
                key={requirement.country}
                onClick={() => {
                  onCountrySelect(requirement);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <div className="font-medium">{requirement.country}</div>
                <div className="text-sm text-gray-500">
                  {requirement.width}mm × {requirement.height}mm
                </div>
                {requirement.notes && (
                  <div className="text-xs text-gray-400 mt-1">
                    {requirement.notes}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedCountry && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Requirements for {selectedCountry.country}</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Photo size: {selectedCountry.width}mm × {selectedCountry.height}mm</li>
            <li>• Background: {selectedCountry.backgroundColor}</li>
            {selectedCountry.headHeight && (
              <li>• Head should occupy {selectedCountry.headHeight}% of photo height</li>
            )}
            {selectedCountry.notes && <li>• {selectedCountry.notes}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}