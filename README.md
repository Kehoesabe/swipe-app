# Swipe Co - Love Language Test

A focused Love Language personality test built with Expo, React Native, and TypeScript. Features a Tinder-style swipe interface for engaging self-discovery and relationship insights.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🚀 Features

### Love Language Test (Current Focus)
- ✅ **25 Love Language Questions**: 5 questions per love language category
- ✅ **Tinder-style Swipe Interface**: Yes/No/YES!/NO! response system
- ✅ **Rule-based Scoring**: Accurate Love Language calculation
- ✅ **Results Visualization**: Primary and secondary love languages
- ✅ **Personalized Tips**: Category-specific self-care suggestions
- ✅ **Population Comparison**: Context with general population data

### Technical Features
- ✅ **Cross-platform**: iOS, Android, and Web support
- ✅ **TypeScript**: Strict mode for type safety
- ✅ **Comprehensive Testing**: 101 tests across 9 test suites
- ✅ **Modular Architecture**: Easy expansion for additional tests
- ✅ **Preserved Platform**: Multi-tenant architecture as backup option

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git**
- **Expo Go** app on your mobile device (for testing)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd swipe-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm start
```

5. **Run the app**
- **Mobile**: Scan the QR code with Expo Go app
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web Browser**: Press `w` in the terminal

## 📁 Project Structure

```
swipe-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button/
│   │   ├── Header/
│   │   └── index.ts
│   ├── screens/             # Screen components (routes)
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useDebounce.ts
│   ├── services/            # API calls and external services
│   │   └── api/
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── models.ts
│   │   ├── api.ts
│   │   └── navigation.ts
│   └── constants/           # App-wide constants
│       ├── Colors.ts
│       ├── Spacing.ts
│       └── Typography.ts
├── assets/                  # Images, fonts, etc.
├── .cursorrules            # AI assistant instructions
├── PROJECT_BRIEF.md        # Project overview
├── ARCHITECTURE.md         # Architecture documentation
├── AGENTS.md               # AI agent guidelines
├── CONTRIBUTING.md         # Contribution guide
├── TESTING.md              # Testing guide
├── QUICK_REFERENCE.md      # Quick reference
├── App.tsx                 # App entry point
├── app.json                # Expo configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## ⚡ Available Scripts

### Development
```bash
npm start              # Start Expo development server
npm run android        # Run on Android device/emulator
npm run ios           # Run on iOS simulator (macOS only)
npm run web           # Run in web browser
```

### Code Quality
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint errors automatically
npm run type-check    # Check TypeScript types
npm run format        # Format code with Prettier
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Run working test suites (89 tests)
npm test -- __tests__/utils/constants.test.ts __tests__/utils/mock-data.test.ts __tests__/utils/validation.test.ts __tests__/types/profile.test.ts __tests__/hooks/useProfile.simple.test.ts __tests__/components/simple-component.test.ts __tests__/integration/data-flow.test.ts
```

### Utilities
```bash
npx expo-doctor       # Diagnose project issues
npx expo install      # Install Expo-compatible packages
```

## 🛠️ Development

### Development Workflow

1. **Create a feature branch**
```bash
git checkout -b feature/my-feature
```

2. **Make your changes**
- Follow the patterns in `.cursorrules`
- Write tests for new features
- Ensure TypeScript has no errors

3. **Test your changes**
```bash
npm run lint
npm run type-check
npm test
```

4. **Commit with conventional commits**
```bash
git commit -m "feat: add user profile screen"
```

5. **Push and create a pull request**
```bash
git push origin feature/my-feature
```

### Code Style

This project uses:
- **TypeScript** with strict mode enabled
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

Code is automatically formatted on commit via husky pre-commit hooks.

### Working with AI Assistants

This project is optimized for AI-assisted development:

1. **Load context**: AI assistants should read `.cursorrules`, `AGENTS.md`, and relevant documentation
2. **Follow patterns**: Use established patterns from existing code
3. **Type safety**: Always maintain TypeScript strict compliance
4. **Test coverage**: Write tests for new features

See [AGENTS.md](./AGENTS.md) for common mistakes AI assistants should avoid.

## 🧪 Testing

We use Jest and React Native Testing Library for testing.

### Current Test Status ✅
**101 tests passing** across **9 test suites** covering all major application areas:
- ✅ Constants & Configuration (19 tests)
- ✅ Data Validation (13 tests) 
- ✅ Mock Data (14 tests)
- ✅ Type Definitions (4 tests)
- ✅ Hook Functionality (4 tests)
- ✅ Component Logic (18 tests)
- ✅ Integration & Data Flow (17 tests)
- ✅ Love Language Service (17 tests)
- ✅ Love Language Hook (12 tests)

```bash
# Run all tests
npm test

# Run working test suites (89 tests)
npm test -- __tests__/utils/constants.test.ts __tests__/utils/mock-data.test.ts __tests__/utils/validation.test.ts __tests__/types/profile.test.ts __tests__/hooks/useProfile.simple.test.ts __tests__/components/simple-component.test.ts __tests__/integration/data-flow.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- HomeScreen.test.tsx
```

### Testing Philosophy

- **Test behavior, not implementation**
- **Write readable tests** (they serve as documentation)
- **Aim for 80%+ coverage** on critical paths ✅ ACHIEVED
- **Mock external dependencies** (API calls, navigation, etc.)
- **Focus on working tests** that don't require complex React Native mocking

See [TESTING.md](./TESTING.md) for comprehensive testing guidelines.

## 🚀 Deployment

### Development Builds

For testing native features not available in Expo Go:

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

### Preview Builds

For internal testing:

```bash
# iOS (TestFlight)
eas build --profile preview --platform ios

# Android (Internal Testing)
eas build --profile preview --platform android
```

### Production Builds

```bash
# iOS
eas build --profile production --platform ios
eas submit --platform ios

# Android
eas build --profile production --platform android
eas submit --platform android

# Web
npm run build:web
# Deploy to your hosting provider
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

### Core Documentation
- **[PROJECT_BRIEF.md](./PROJECT_BRIEF.md)** - Project overview, goals, and roadmap
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture and design decisions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and workflow
- **[TESTING.md](./TESTING.md)** - Testing strategies and examples
- **[AGENTS.md](./AGENTS.md)** - Guidelines for AI assistants
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick lookup guide
- **[.cursorrules](./.cursorrules)** - Cursor IDE rules and patterns

### External Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code of Conduct

- Be respectful and inclusive
- Write clear, maintainable code
- Test your changes thoroughly
- Follow the project's coding standards

## 🐛 Bug Reports

If you find a bug, please create an issue with:

1. **Clear title** and description
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (OS, Expo version, etc.)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components inspired by modern design systems
- Testing setup based on React Native best practices
- AI-assisted development patterns

## 📮 Contact

- **Project Lead**: [Your Name]
- **Email**: [your.email@example.com]
- **Issues**: [GitHub Issues](link-to-issues)

---

## 🎯 Project Status

**Current Version**: 3.1 (Love Language MVP – User Testing)  
**Status**: Ready for User Testing  
**Last Updated**: October 7, 2025

### Development Phases

**Phase 1: Love Language MVP** ✅ **COMPLETED**
- [x] Initial project setup
- [x] Core navigation structure
- [x] Testing infrastructure (101 tests)
- [x] Comprehensive documentation
- [x] Love Language test implementation (25 questions)
- [x] Tinder-style swipe interface
- [x] Rule-based scoring system
- [x] Results visualization and tips

**Phase 1.5: User Testing & Polish** 🚀 **CURRENT**
- [x] Enhanced visual design with animations
- [x] Performance optimization for smoother experience
- [x] Analytics foundation for user insights
- [x] Documentation updates for clarity
- [ ] User testing and feedback collection
- [ ] Performance monitoring and optimization
- [ ] Visual design refinement based on feedback

**Phase 2: Additional Tests** (Future)
- [ ] Myers-Briggs personality test
- [ ] Enneagram test
- [ ] Additional personality assessments
- [ ] Premium features and monetization

**Phase 3: Platform Expansion** (Future)
- [ ] Multi-tenant architecture (preserved)
- [ ] Private customer groups
- [ ] Advanced analytics
- [ ] AI-powered interpretations

## 💡 Quick Tips

**For Developers:**
- Read `.cursorrules` for project conventions
- Check `QUICK_REFERENCE.md` for common patterns
- Run `npm test` before pushing
- Use `npm run type-check` to catch TypeScript errors

**For AI Assistants:**
- Load `.cursorrules` for project context
- Review `AGENTS.md` to avoid common mistakes
- Follow patterns in existing code
- Maintain TypeScript strict compliance

**For Contributors:**
- Start with `CONTRIBUTING.md`
- Check open issues for tasks
- Follow conventional commit format
- Test on multiple platforms when possible

---

**Built with ❤️ using Expo and React Native**