# Changelog
## [1.1.0] - 2025-10-06
### Added
- **Refined workflow policy:** Single-model Cursor configuration (Claude 4.5 Sonnet only) with protected-file double-approval and handoff requirements.
- Cross-refs added in `ARCHITECTURE.md` and `FOUNDATION_SUMMARY.md`.
- New guardrails appended to `.cursorrules`.
- Expanded `AGENTS.md` responsibilities and SAF-specific best practices.

### Notes
- This update does not change the SAF TDD process; it clarifies model roles and strengthens safety controls around diffs and environment files.



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project documentation suite
- Core navigation structure
- Testing infrastructure

### Changed

### Deprecated

### Removed

### Fixed

### Security

---

## [1.0.0] - 2025-10-02

### Added
- Initial project setup with Expo SDK 54
- TypeScript configuration with strict mode
- React Navigation with bottom tabs
- ESLint and Prettier configuration
- Comprehensive documentation:
  - `.cursorrules` for AI assistant guidance
  - `PROJECT_BRIEF.md` for project overview
  - `ARCHITECTURE.md` for technical architecture
  - `AGENTS.md` for AI agent guidelines
  - `CONTRIBUTING.md` for contribution workflow
  - `TESTING.md` for testing strategies
  - `QUICK_REFERENCE.md` for quick lookups
  - `DEPLOYMENT.md` for deployment procedures
  - `SECURITY.md` for security best practices
- Project structure with organized folders:
  - `src/components/` for reusable UI components
  - `src/screens/` for screen components
  - `src/navigation/` for navigation setup
  - `src/hooks/` for custom React hooks
  - `src/services/` for API integration
  - `src/utils/` for utility functions
  - `src/types/` for TypeScript definitions
  - `src/constants/` for app constants
- Three sample screens (Home, Search, Profile)
- Constants for Colors, Spacing, and Typography
- `.env.example` for environment configuration
- `.gitignore` configuration
- Basic testing setup with Jest

### Development Tools
- Hot reloading for fast development
- TypeScript type checking
- ESLint for code linting
- Prettier for code formatting
- Git hooks for pre-commit checks

---

## Version Format

**[MAJOR.MINOR.PATCH]**

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

### Types of Changes

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

---

## How to Update This Changelog

### For Each Release

1. **Create a new version section** at the top under [Unreleased]
2. **Use the format**: `## [X.Y.Z] - YYYY-MM-DD`
3. **Move changes** from [Unreleased] to the new version
4. **Group changes** by type (Added, Changed, Fixed, etc.)
5. **Add links** at the bottom for the version comparison

### Examples

#### Adding a Feature
```markdown
### Added
- User authentication with email and password
- Profile picture upload functionality
- Dark mode support
```

#### Bug Fix
```markdown
### Fixed
- Navigation crash when returning from profile screen
- Memory leak in image loading component
- Input field validation error messages
```

#### Breaking Change
```markdown
### Changed
- **BREAKING**: Renamed `getUserData()` to `fetchUser()` in UserService
- Updated API endpoint structure (requires backend v2.0+)
```

#### Security Update
```markdown
### Security
- Updated dependencies to patch CVE-2024-XXXXX
- Implemented rate limiting on authentication endpoints
- Added CSRF token validation
```

---

## Git Tags

Each release should be tagged in git:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## Links

[Unreleased]: https://github.com/yourcompany/swipe-app/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourcompany/swipe-app/releases/tag/v1.0.0






