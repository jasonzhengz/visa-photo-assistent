'use client';

import { VisaRequirement } from '@/types';

interface DownloadSectionProps {
  layoutPhoto: string;
  visaRequirement: VisaRequirement;
}

export default function DownloadSection({ layoutPhoto, visaRequirement }: DownloadSectionProps) {
  const downloadLayout = () => {
    const link = document.createElement('a');
    link.href = layoutPhoto;
    link.download = `${visaRequirement.country.toLowerCase().replace(/\s+/g, '-')}-visa-photos-4r.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadIndividualPhoto = () => {
    // Create a canvas with just one photo for individual download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const dpi = 300;
    const mmToPixels = dpi / 25.4;
    canvas.width = visaRequirement.width * mmToPixels;
    canvas.height = visaRequirement.height * mmToPixels;
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `${visaRequirement.country.toLowerCase().replace(/\s+/g, '-')}-visa-photo-single.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    img.src = layoutPhoto;
  };

  const printLayout = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Visa Photos - ${visaRequirement.country}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: white;
              }
              img {
                max-width: 100%;
                height: auto;
                page-break-inside: avoid;
              }
              @media print {
                body { margin: 0; }
                img { 
                  width: 4in !important;
                  height: 6in !important;
                }
              }
            </style>
          </head>
          <body>
            <img src="${layoutPhoto}" alt="Visa Photos Layout" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      // Give time for image to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Step 5: Download & Print</h3>
        
        {/* Final layout preview */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Final Layout:</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <img 
              src={layoutPhoto} 
              alt="Final layout"
              className="w-full h-auto max-h-64 object-contain mx-auto rounded border"
            />
          </div>
        </div>

        {/* Download buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={downloadLayout}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Download 4R Layout (Recommended)
          </button>

          <div className="flex space-x-3">
            <button
              onClick={downloadIndividualPhoto}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Single Photo
            </button>
            
            <button
              onClick={printLayout}
              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Now
            </button>
          </div>
        </div>

        {/* File information */}
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <h4 className="font-medium text-gray-900 mb-2">File Information:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Country: {visaRequirement.country}</li>
            <li>• Photo size: {visaRequirement.width}mm × {visaRequirement.height}mm</li>
            <li>• Layout: 4&quot; × 6&quot; (10.16cm × 15.24cm)</li>
            <li>• Resolution: 300 DPI (print quality)</li>
            <li>• Format: JPEG</li>
          </ul>
        </div>

        {/* Success message */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-green-900 mb-1">Photos Ready!</h4>
              <p className="text-sm text-green-700">
                Your visa photos have been processed and are ready for download. 
                The layout is optimized for professional photo printing.
              </p>
            </div>
          </div>
        </div>

        {/* Restart button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Create New Visa Photos
          </button>
        </div>
      </div>
    </div>
  );
}