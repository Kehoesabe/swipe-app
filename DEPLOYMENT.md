# Deployment Guide

Complete deployment procedures for iOS, Android, and Web platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Development Builds](#development-builds)
- [Preview Builds](#preview-builds)
- [Production Builds](#production-builds)
- [Web Deployment](#web-deployment)
- [OTA Updates](#ota-updates)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- **EAS CLI**: `npm install -g @expo/eas-cli`
- **Expo Account**: Sign up at [expo.dev](https://expo.dev)
- **Apple Developer Account**: For iOS App Store
- **Google Play Console**: For Android Play Store
- **Git**: For version control

### Setup EAS
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

## Development Builds

For testing native features not available in Expo Go.

### iOS Development Build
```bash
# Build for iOS simulator
eas build --profile development --platform ios

# Build for iOS device
eas build --profile development --platform ios --device-id <device-id>
```

### Android Development Build
```bash
# Build for Android emulator
eas build --profile development --platform android

# Build for Android device
eas build --profile development --platform android --device-id <device-id>
```

### Installing Development Builds
1. Download the build from EAS dashboard
2. Install on device/emulator
3. Run `npx expo start --dev-client` to connect

## Preview Builds

For internal testing and stakeholder demos.

### iOS Preview (TestFlight)
```bash
# Build for TestFlight
eas build --profile preview --platform ios

# Submit to TestFlight
eas submit --platform ios --latest
```

### Android Preview (Internal Testing)
```bash
# Build for Google Play Internal Testing
eas build --profile preview --platform android

# Submit to Google Play Internal Testing
eas submit --platform android --latest
```

## Production Builds

### iOS Production
```bash
# Build for App Store
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios --latest
```

### Android Production
```bash
# Build for Google Play Store
eas build --profile production --platform android

# Submit to Google Play Store
eas submit --platform android --latest
```

## Web Deployment

### Build for Web
```bash
# Create web build
npx expo export --platform web

# Or use EAS Build for web
eas build --profile production --platform web
```

### Deploy to Hosting

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Add to package.json
"homepage": "https://yourusername.github.io/swipe-app"

# Deploy
npm run build
npm install -g gh-pages
gh-pages -d dist
```

## OTA Updates

### Configure Updates
```bash
# Install expo-updates
npx expo install expo-updates

# Configure app.json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

### Publish Updates
```bash
# Publish update
eas update --branch production --message "Bug fixes and improvements"

# Publish to specific channel
eas update --channel production --message "New features"
```

### Update Strategy
```typescript
import * as Updates from 'expo-updates';

// Check for updates
const checkForUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.error('Update check failed:', error);
  }
};
```

## Build Profiles

### Development Profile
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal",
    "ios": {
      "resourceClass": "m-medium"
    },
    "android": {
      "buildType": "apk"
    }
  }
}
```

### Preview Profile
```json
{
  "preview": {
    "distribution": "internal",
    "ios": {
      "resourceClass": "m-medium"
    },
    "android": {
      "buildType": "apk"
    }
  }
}
```

### Production Profile
```json
{
  "production": {
    "distribution": "store",
    "ios": {
      "resourceClass": "m-medium"
    },
    "android": {
      "buildType": "aab"
    }
  }
}
```

## Environment Configuration

### Environment Variables
```bash
# Set environment variables
eas secret:create --scope project --name API_URL --value "https://api.example.com"
eas secret:create --scope project --name API_KEY --value "your-api-key"
```

### Build-time Configuration
```typescript
// app.config.js
export default {
  expo: {
    name: "Swipe App",
    slug: "swipe-app",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
      apiKey: process.env.API_KEY,
    },
  },
};
```

## App Store Submission

### iOS App Store
1. **Build and submit**:
   ```bash
   eas build --profile production --platform ios
   eas submit --platform ios
   ```

2. **App Store Connect**:
   - Add app information
   - Upload screenshots
   - Set pricing and availability
   - Submit for review

### Google Play Store
1. **Build and submit**:
   ```bash
   eas build --profile production --platform android
   eas submit --platform android
   ```

2. **Google Play Console**:
   - Create app listing
   - Upload screenshots
   - Set content rating
   - Submit for review

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: eas build --profile production --platform all --non-interactive
```

### Automated Testing
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run type-check
```

## Monitoring and Analytics

### Crash Reporting
```bash
# Install Sentry
npx expo install @sentry/react-native

# Configure Sentry
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_DSN_HERE',
});
```

### Performance Monitoring
```bash
# Install Flipper for debugging
npm install --save-dev react-native-flipper

# Configure performance monitoring
import { Performance } from 'react-native-performance';
```

## Troubleshooting

### Common Build Issues

**iOS Build Fails**:
```bash
# Clean and retry
eas build --clear-cache --profile production --platform ios
```

**Android Build Fails**:
```bash
# Check Android SDK
eas build --profile production --platform android --clear-cache
```

**Web Build Issues**:
```bash
# Clear cache and rebuild
rm -rf .expo
npx expo export --platform web --clear
```

### Build Logs
```bash
# View build logs
eas build:list
eas build:view <build-id>
```

### Local Debugging
```bash
# Run with verbose logging
npx expo start --verbose

# Check for issues
npx expo-doctor
```

## Security Considerations

### Code Signing
- iOS: Automatic with Apple Developer account
- Android: Use EAS managed credentials

### Secrets Management
```bash
# Store secrets securely
eas secret:create --scope project --name SECRET_NAME --value "secret-value"

# Use in builds
eas build --profile production --platform all
```

### App Store Security
- Enable App Transport Security (iOS)
- Use HTTPS for all API calls
- Implement certificate pinning if needed

## Performance Optimization

### Bundle Size
```bash
# Analyze bundle size
npx expo export --platform web --analyze

# Optimize images
npx expo install expo-image-optimizer
```

### Build Performance
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      ["expo-build-properties", {
        "ios": {
          "newArchEnabled": true
        },
        "android": {
          "newArchEnabled": true
        }
      }]
    ]
  }
}
```

## Rollback Procedures

### OTA Update Rollback
```bash
# Revert to previous update
eas update --channel production --message "Rollback to previous version"
```

### App Store Rollback
1. Submit previous version to App Store
2. Use App Store Connect to rollback
3. Notify users of the issue

## Best Practices

### Pre-deployment Checklist
- [ ] All tests pass
- [ ] Code review completed
- [ ] Performance tested
- [ ] Security review done
- [ ] Documentation updated
- [ ] Version number incremented
- [ ] Changelog updated

### Post-deployment
- [ ] Monitor crash reports
- [ ] Check performance metrics
- [ ] Monitor user feedback
- [ ] Verify all features work
- [ ] Test on multiple devices

## Resources

### Documentation
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)

### Tools
- [Expo Dashboard](https://expo.dev)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

---

**Last Updated**: October 2, 2025








