# AI Agent Guidelines: Common Mistakes & Best Practices

This document helps AI assistants (and developers) avoid common pitfalls when working on this React Native + Expo + TypeScript project.

## Model Responsibilities (Oct 2025)

### ChatGPT (GPT-5) — Architect / Lead Dev
- Designs architecture, produces full-file implementations and docs.
- Writes scripts only when absolutely necessary (PowerShell use requires explicit approval).
- Hands off clear instructions for Cursor diffs and test coverage.

### Cursor AI — In-IDE Engineer (Claude 4.5 Sonnet ONLY)
- Performs type-safe refactors, test generation, and import fixes via **visible diffs**.
- Never runs hidden terminal actions or edits protected files without double approval.
- Bias toward minimal, surgical diffs; add focused tests for changes.

### Claude (Browser) — Reviewer / Advisor (Sonnet 4.5)
- Reviews architecture and logic; catches loops and risky patterns.
- No direct file edits; suggestions must return through Cursor diffs.

### Human — Product Lead (Daniel)
- Approves visible diffs; enforces protected-file policy; orchestrates handoffs.

---

## Common AI Mistakes → Best Practices (SAF-specific)

- **Mistake:** Proposing multi-model Cursor setups.  
  **Do:** Assume **Claude 4.5 Sonnet only** in Cursor unless told otherwise.

- **Mistake:** Large, sweeping refactors.  
  **Do:** Produce minimal diffs, keep behavior stable, add tests.

- **Mistake:** Editing `.env*`, `package.json`, `app.config.ts` without safeguards.  
  **Do:** Propose changes with rationale; require double approval.

- **Mistake:** Running full test suite during tight dev cycles.  
  **Do:** Follow SAF’s TDD “focused tests during dev; full suite pre-push”.

- **Mistake:** Hidden terminal automation.  
  **Do:** All changes must be via Cursor diffs; terminal is for emergencies only.

---

## 🏗️ Architecture Mistakes

### ❌ **Mistake: Over-Engineering Too Early**
**What LLMs Do Wrong**:
- Suggest Redux, MobX, or complex state management before it's needed
- Propose microservices-style architecture for simple apps
- Add unnecessary abstractions and layers

**✅ Do This Instead**:
- Start with React hooks (useState, useReducer)
- Use Context API only when multiple components need shared state
- Follow YAGNI (You Aren't Gonna Need It) principle
- Add complexity only when you feel the pain of not having it

### ❌ **Mistake: Ignoring Platform Differences**
**What LLMs Do Wrong**:
- Write code that only works on one platform
- Forget iOS safe areas and Android status bars
- Use web-only APIs without fallbacks

**✅ Do This Instead**:
```typescript
import { Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Always consider platform differences
const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

// Use SafeAreaView for iOS notches
<SafeAreaView style={styles.container}>
  {/* content */}
</SafeAreaView>
```

### ❌ **Mistake: Wrong Navigation Patterns**
**What LLMs Do Wrong**:
- Mix navigation paradigms (drawer + tabs + stack incorrectly)
- Don't type navigation props properly
- Pass entire objects through navigation params

**✅ Do This Instead**:
```typescript
// Define navigation types
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string }; // Pass IDs, not objects
  Settings: undefined;
};

// Use typed navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
  route: RouteProp<RootStackParamList, 'Profile'>;
};
```

### ❌ **Mistake: Improper Folder Structure**
**What LLMs Do Wrong**:
- Create folders for one file
- Mix feature and technical organization inconsistently
- Don't follow the established project structure

**✅ Do This Instead**:
- Follow the existing structure in this project
- Group by feature when features grow large (home/, auth/, etc.)
- Keep shared components in components/
- Don't create a folder until you have 3+ related files

---

## 💻 Coding Mistakes

### ❌ **Mistake: TypeScript 'any' Overuse**
**What LLMs Do Wrong**:
```typescript
// BAD: Using 'any' unnecessarily
const handleData = (data: any) => {
  return data.user.name; // No type safety!
};

// BAD: Ignoring TypeScript errors with 'any'
const response: any = await fetch(url);
```

**✅ Do This Instead**:
```typescript
// GOOD: Define proper types
interface User {
  id: string;
  name: string;
  email: string;
}

interface ApiResponse {
  data: User;
  status: number;
}

const handleData = (response: ApiResponse): string => {
  return response.data.name; // Type-safe!
};

// GOOD: Type the response
const response = await fetch(url);
const data: ApiResponse = await response.json();
```

### ❌ **Mistake: Inline Styles Everywhere**
**What LLMs Do Wrong**:
```typescript
// BAD: Inline styles
<View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
  <Text style={{ fontSize: 18, color: '#333' }}>Hello</Text>
</View>
```

**✅ Do This Instead**:
```typescript
// GOOD: StyleSheet with constants
import { Colors, Spacing } from '@/constants';

<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 18,
    color: Colors.text,
  },
});
```

### ❌ **Mistake: Missing Error Handling**
**What LLMs Do Wrong**:
```typescript
// BAD: No error handling
const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};
```

**✅ Do This Instead**:
```typescript
// GOOD: Proper error handling
const fetchUser = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw or handle appropriately
  }
};

// In component
const [error, setError] = useState<string | null>(null);

const loadUser = async () => {
  try {
    const user = await fetchUser(userId);
    setUser(user);
    setError(null);
  } catch (err) {
    setError('Failed to load user. Please try again.');
  }
};
```

### ❌ **Mistake: Performance Anti-Patterns**
**What LLMs Do Wrong**:
```typescript
// BAD: Creating objects in render
<Component style={{ margin: 10 }} />

// BAD: Anonymous functions in lists
data.map((item) => <Item onPress={() => handlePress(item)} />)

// BAD: Not using keys in lists
{items.map(item => <Item data={item} />)}
```

**✅ Do This Instead**:
```typescript
// GOOD: StyleSheet outside render
const styles = StyleSheet.create({
  container: { margin: 10 },
});
<Component style={styles.container} />

// GOOD: Use useCallback for event handlers
const handlePress = useCallback((item: Item) => {
  console.log(item);
}, []);

// GOOD: Use FlatList with proper keys
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item data={item} />}
/>
```

### ❌ **Mistake: Improper Hook Usage**
**What LLMs Do Wrong**:
```typescript
// BAD: Hooks inside conditions
if (condition) {
  useEffect(() => {}, []);
}

// BAD: Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // userId missing!

// BAD: Not cleaning up
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
}, []);
```

**✅ Do This Instead**:
```typescript
// GOOD: Hooks at top level, condition inside
useEffect(() => {
  if (condition) {
    // do something
  }
}, [condition]);

// GOOD: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);

// GOOD: Clean up effects
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);
}, []);
```

### ❌ **Mistake: Hardcoded Values**
**What LLMs Do Wrong**:
```typescript
// BAD: Magic numbers and strings
<View style={{ padding: 16, backgroundColor: '#007AFF' }}>
  <Text style={{ fontSize: 18 }}>Hello</Text>
</View>

if (user.role === 'admin') { }
```

**✅ Do This Instead**:
```typescript
// GOOD: Use constants
import { Colors, Spacing, Typography } from '@/constants';

<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: Typography.fontSize.lg,
  },
});

// Use enums or constants for roles
enum UserRole {
  Admin = 'admin',
  User = 'user',
}

if (user.role === UserRole.Admin) { }
```

---

## 🧪 Testing Mistakes

### ❌ **Mistake: Not Writing Testable Code**
**What LLMs Do Wrong**:
- Tightly couple components to navigation, API calls, storage
- Put business logic inside components
- Don't separate concerns

**✅ Do This Instead**:
```typescript
// BAD: Hard to test
const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  
  return <Text>{user?.name}</Text>;
};

// GOOD: Testable with dependency injection
const ProfileScreen = ({ userService = UserService }) => {
  const { user, loading, error } = useUser(userService);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  return <Text>{user?.name}</Text>;
};

// Hook is separately testable
const useUser = (userService) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    userService.getUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userService]);
  
  return { user, loading, error };
};
```

### ❌ **Mistake: Testing Implementation Details**
**What LLMs Do Wrong**:
```typescript
// BAD: Testing internal state
expect(component.state.counter).toBe(5);

// BAD: Testing class names and structure
expect(wrapper.find('.button-class')).toHaveLength(1);
```

**✅ Do This Instead**:
```typescript
// GOOD: Test behavior and output
import { render, fireEvent } from '@testing-library/react-native';

test('increments counter when button pressed', () => {
  const { getByText, getByTestId } = render(<Counter />);
  
  const button = getByText('Increment');
  const counter = getByTestId('counter-value');
  
  expect(counter).toHaveTextContent('0');
  
  fireEvent.press(button);
  
  expect(counter).toHaveTextContent('1');
});
```

### ❌ **Mistake: Not Mocking External Dependencies**
**What LLMs Do Wrong**:
- Make real API calls in tests
- Don't mock navigation
- Access real storage/file system

**✅ Do This Instead**:
```typescript
// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock API calls
jest.mock('@/services/userService', () => ({
  UserService: {
    getUser: jest.fn().mockResolvedValue({ id: '1', name: 'Test' }),
  },
}));

// Test with mocks
test('navigates to profile on button press', async () => {
  const { getByText } = render(<HomeScreen />);
  const button = getByText('View Profile');
  
  fireEvent.press(button);
  
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('Profile', { userId: '1' });
  });
});
```

---

## 🚨 Common Expo-Specific Mistakes

### ❌ **Mistake: Using React Native CLI Packages**
**What LLMs Do Wrong**:
- Suggest `react-native link`
- Recommend packages that need native code modifications
- Forget Expo has managed versions of common packages

**✅ Do This Instead**:
- Use `npx expo install` instead of `npm install` for core dependencies
- Check Expo documentation for managed alternatives
- Use `expo-camera`, `expo-location`, etc. instead of community packages when available

### ❌ **Mistake: Incompatible Package Versions**
**What LLMs Do Wrong**:
- Install latest versions that aren't compatible with Expo SDK
- Mix incompatible dependency versions

**✅ Do This Instead**:
```bash
# Let Expo manage compatible versions
npx expo install react-native-gesture-handler react-native-reanimated

# Check compatibility
npx expo-doctor
```

---

## 🎯 Quick Checklist for AI Assistants

Before suggesting code, verify:

**Architecture**:
- [ ] Is this the simplest solution that could work?
- [ ] Does it follow the existing project structure?
- [ ] Will it work on iOS, Android, and Web?

**Code Quality**:
- [ ] No TypeScript 'any' types without good reason
- [ ] Error handling is present
- [ ] Uses StyleSheet.create, not inline styles
- [ ] Uses constants from @/constants
- [ ] Follows existing naming conventions

**Performance**:
- [ ] No objects/arrays created in render
- [ ] Proper keys on list items
- [ ] Dependencies correct in useEffect/useCallback/useMemo

**React Native Specific**:
- [ ] Uses Platform checks for platform-specific code
- [ ] Handles safe areas appropriately
- [ ] Uses appropriate React Native components (View, not div)

**Expo Specific**:
- [ ] Uses Expo-compatible packages
- [ ] Suggests `npx expo install` for dependencies
- [ ] Doesn't require ejecting or native modifications

---

## 💡 Remember

**When in doubt**:
1. Check existing code patterns in this project
2. Prefer simplicity over cleverness
3. Make it work, then make it better
4. Test on multiple platforms
5. Ask the developer before major architectural changes

**Red flags to avoid**:
- "Just add Redux" - for simple state
- "Quick hack" - technical debt
- "This will work on iOS" - untested assumptions
- "Copy this from the internet" - understand before using
- "We need microservices" - premature optimization

---

**Remember: The best code is code that doesn't need to be written. Always ask if the complexity is truly necessary.**






