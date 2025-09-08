# Visa Photo Assistant PWA

A Progressive Web App that helps users take and process photos for visa applications. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

✅ **Country Selection**: Support for 10+ countries with specific visa photo requirements
✅ **Camera Integration**: Device camera access with real-time photo frame overlay
✅ **Background Processing**: Automatic background removal and replacement with white
✅ **Photo Cropping**: Interactive cropping tool with visa-specific dimensions
✅ **4R Layout Generation**: Professional printing layout (4" × 6") with multiple photos
✅ **Download & Print**: High-resolution exports optimized for printing
✅ **PWA Support**: Installable app with offline capabilities
✅ **Mobile Responsive**: Optimized for mobile devices and tablets

## Supported Countries

- United States (35mm × 45mm)
- United Kingdom (35mm × 45mm)
- Canada (35mm × 45mm)
- Australia (35mm × 45mm)
- Germany (35mm × 45mm)
- France (35mm × 45mm)
- Japan (35mm × 45mm)
- China (33mm × 48mm)
- India (35mm × 45mm)
- Singapore (35mm × 45mm)

## User Journey

1. **Select Country**: Choose visa destination country
2. **Take Photo**: Use device camera with guided frame overlay
3. **Process Background**: Automatic background change to white
4. **Crop Photo**: Interactive cropping to exact visa dimensions
5. **Generate Layout**: Create 4R printing layout with multiple copies
6. **Download**: Get high-resolution files ready for printing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA**: next-pwa for service worker and manifest
- **Camera**: react-webcam for device camera access
- **Image Processing**: HTML5 Canvas API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd visa-photo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Deployment to Vercel

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Configure Settings**: Use the included `vercel.json` configuration
3. **Deploy**: Automatic deployment on push to main branch

### Environment Variables

No environment variables are required for basic functionality. For enhanced background removal, you can optionally add:

- `NEXT_PUBLIC_REMOVE_BG_API_KEY`: API key for remove.bg service

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with PWA configuration
│   └── page.tsx            # Main application page
├── components/
│   ├── CountrySelector.tsx # Country selection dropdown
│   ├── CameraCapture.tsx   # Camera interface with overlay
│   ├── BackgroundProcessor.tsx # Background removal processing
│   ├── PhotoCropper.tsx    # Interactive photo cropping
│   ├── PhotoLayout.tsx     # 4R layout generation
│   └── DownloadSection.tsx # Download and print interface
├── lib/
│   ├── visaRequirements.ts # Country visa specifications
│   └── backgroundRemoval.ts # Image processing utilities
└── types/
    └── index.ts            # TypeScript type definitions
```

## Image Processing

- **Input**: JPEG from device camera
- **Background Removal**: Canvas-based processing (with optional API fallback)
- **Output Resolution**: 300 DPI for professional printing
- **Format**: JPEG with high quality compression

## PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Ready**: Service worker caches essential resources
- **App-like Experience**: Full-screen standalone display
- **Fast Loading**: Optimized bundle size and lazy loading

## Browser Support

- Chrome/Chromium 90+
- Safari 14+
- Firefox 90+
- Edge 90+

*Camera access requires HTTPS in production*

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and support, please use the GitHub Issues section of this repository.