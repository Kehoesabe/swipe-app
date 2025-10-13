# Contributing to Swipe App

Thank you for your interest in contributing to Swipe App! This document provides guidelines and information for contributors.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Background or identity
- Experience level
- Technical preferences
- Communication style

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, trolling, or personal attacks
- Discriminatory language or behavior
- Spam or off-topic discussions
- Publishing others' private information without permission

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git
- Expo CLI (optional but recommended)
- A code editor (VS Code, Cursor, etc.)

### Setup
1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/swipe-app.git
   cd swipe-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Verify setup**
   - App should load in Expo Go or simulator
   - No TypeScript errors
   - All tests pass: `npm test`

## Development Workflow

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (e.g., `feature/user-auth`)
- **bugfix/**: Bug fixes (e.g., `bugfix/navigation-crash`)
- **hotfix/**: Critical production fixes

### Creating a Branch
```bash
# Start from main
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/issue-description
```

### Making Changes
1. **Make your changes** following the code standards below
2. **Test your changes** thoroughly
3. **Update documentation** if needed
4. **Commit with conventional commits**

### Commit Message Format
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat: add user profile screen
fix: resolve navigation crash on iOS
docs: update API documentation
test: add unit tests for user service
chore: update dependencies
```

## Code Standards

### TypeScript
- **Strict mode**: No `any` types without justification
- **Interfaces**: Define clear interfaces for all data structures
- **Type inference**: Use where obvious, explicit types for function returns
- **Null safety**: Handle null/undefined cases explicitly

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementation
};

// ❌ Avoid
const getUser = async (id: any): Promise<any> => {
  // implementation
};
```

### React Native Components
- **Functional components**: Use hooks, not class components
- **Props interface**: Always define TypeScript interfaces for props
- **Component size**: Keep components under 200 lines
- **Single responsibility**: One component, one purpose

```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Styling
- **StyleSheet.create()**: Always use for styles
- **Constants**: Use design system constants
- **No inline styles**: Except for dynamic values
- **Platform considerations**: Handle iOS/Android differences

```typescript
// ✅ Good
import { Colors, Spacing } from '@/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
});

// ❌ Avoid
<View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
```

### File Organization
- **One component per file**
- **PascalCase for components**: `UserProfile.tsx`
- **camelCase for utilities**: `formatDate.ts`
- **Index files for clean imports**

### Naming Conventions
- **Components**: PascalCase (`UserProfile`)
- **Hooks**: camelCase with 'use' prefix (`useUserData`)
- **Utilities**: camelCase (`formatCurrency`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: Match the export (component files = PascalCase)

## Testing Guidelines

### What to Test
- **Unit tests**: Pure functions, utilities, hooks
- **Integration tests**: Component interactions, navigation
- **Critical paths**: User authentication, data flow
- **Edge cases**: Error states, empty data, network failures

### Testing Standards
- **Test behavior, not implementation**
- **Use descriptive test names**
- **Mock external dependencies**
- **Test accessibility**
- **Aim for 80%+ coverage on critical paths**

```typescript
// ✅ Good test
describe('UserProfile', () => {
  it('displays user name when user data is loaded', () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const { getByText } = render(<UserProfile user={mockUser} />);
    
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('shows loading state while fetching user data', () => {
    const { getByTestId } = render(<UserProfile user={null} loading={true} />);
    
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- UserProfile.test.tsx
```

## Pull Request Process

### Before Submitting
- [ ] Code follows project standards
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Code is tested on multiple platforms
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional format

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested on Web

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
```

### Review Process
1. **Automated checks** must pass (CI/CD)
2. **Code review** by at least one maintainer
3. **Testing** on multiple platforms
4. **Approval** from maintainer
5. **Merge** to target branch

### Review Guidelines
**For Reviewers**:
- Be constructive and specific
- Test the changes locally
- Check for security issues
- Verify accessibility
- Ensure performance considerations

**For Authors**:
- Respond to feedback promptly
- Make requested changes
- Ask questions if feedback is unclear
- Keep PRs focused and small

## Issue Reporting

### Bug Reports
When reporting bugs, include:

1. **Clear title** and description
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Environment details**:
   - OS and version
   - Node.js version
   - Expo SDK version
   - Device/simulator details
5. **Screenshots/videos** if applicable
6. **Error logs** if available

### Feature Requests
For new features:

1. **Problem description**: What problem does this solve?
2. **Proposed solution**: How should it work?
3. **Alternatives considered**: What other approaches were considered?
4. **Additional context**: Any other relevant information

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: Urgent issues
- `priority: low`: Nice to have

## Development Tips

### Performance
- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` appropriately
- Avoid creating objects in render
- Use FlatList for long lists

### Accessibility
- Use `accessibilityLabel` for interactive elements
- Ensure sufficient color contrast
- Support screen readers
- Make touch targets at least 44x44 points

### Platform Considerations
- Test on iOS, Android, and Web
- Handle platform-specific differences
- Use SafeAreaView for iOS notches
- Consider different screen sizes

### Debugging
- Use React Native Debugger
- Check Metro bundler logs
- Use `console.log` strategically
- Test on real devices, not just simulators

## Getting Help

### Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/)

### Community
- GitHub Discussions for questions
- GitHub Issues for bugs and features
- Code review for learning opportunities

### Mentorship
- Look for `good first issue` labels
- Ask questions in discussions
- Participate in code reviews
- Share knowledge with others

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs
- Community appreciation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to Swipe App! 🚀**

---

**Last Updated**: October 2, 2025  
**Version**: 1.0








