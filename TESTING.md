# Local Testing Guide

## Camera Issues
- **No camera access**: Use Chrome/Edge (better WebRTC support)
- **Camera permission denied**: Check browser permissions in settings
- **Mobile camera not working**: Ensure you're using HTTPS (use ngrok for mobile testing)

## Image Processing Issues
- **Background removal not working well**: The basic algorithm works best with simple backgrounds
- **Crop area not visible**: Try refreshing the page
- **Download not working**: Check browser's download settings

## Mobile Testing
```bash
# Install ngrok for mobile testing with HTTPS
npm install -g ngrok

# In another terminal, run:
ngrok http 3000

# Use the HTTPS URL on your mobile device
```

## PWA Testing
- **Desktop**: Look for install icon in address bar (Chrome/Edge)
- **Mobile**: Use "Add to Home Screen" from browser menu
- **Offline**: Try disconnecting internet after first load

## Browser Support
- ✅ Chrome/Chromium 90+
- ✅ Safari 14+
- ✅ Firefox 90+
- ✅ Edge 90+

## Development Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Test production build
npm run start

# Check for type errors
npx tsc --noEmit

# Run linting
npm run lint
```