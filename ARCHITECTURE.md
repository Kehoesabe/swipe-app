# Swipe Platform Architecture Documentation

## Overview
This document describes the architectural decisions, patterns, and structure of the Swipe Platform - a multi-tenant market research data collection platform.

## Architecture Principles

### 1. **Separation of Concerns**
Each layer has a single, well-defined responsibility:
- **Screens**: Coordinate UI and user interactions
- **Components**: Reusable UI elements
- **Hooks**: Encapsulate stateful logic
- **Services**: External communication (API, storage, analytics)
- **Utils**: Pure functions and helpers
- **Platform**: Multi-tenant data isolation and user management

### 2. **Unidirectional Data Flow**
```
User Action → Event Handler → State Update → UI Re-render
```

### 3. **Type Safety First**
TypeScript strict mode enforces:
- No implicit any
- Strict null checks
- Strict function types
- No unused locals/parameters

### 4. **Progressive Enhancement**
Start simple, add complexity when needed:
- Local state → Context → Global state library (if ever needed)
- Fetch → Custom hooks → React Query (if caching needed)
- Manual navigation → Type-safe navigation → Deep linking (when required)

### 5. **Multi-tenant Architecture**
- **Data Isolation**: Separate public and private content
- **User Management**: Role-based access control
- **Privacy-first**: Aggregated data only, no personal information
- **Scalable**: Support for multiple customers and content types

---

## Platform Architecture

### **Multi-tenant Data Model**
```
Platform
├── Public Content (Available to all users)
│   ├── Stock Market (3 questions)
│   ├── Brand Identity (3 questions)
│   └── Psychological Tests (3 questions)
└── Private Content (Customer-specific)
    ├── Customer A's Research
    ├── Customer B's Research
    └── Customer C's Research
```

### **User Roles & Permissions**
1. **Swipe Co. Admins**: Full platform access, content oversight
2. **Customer Admins**: Manage their organization's private content
3. **Private Users**: Access only their organization's content
4. **Public Users**: Access only public content

### **Data Flow Architecture**
```
User Interaction → Response Collection → Data Aggregation → Analytics Dashboard
     ↓                    ↓                    ↓                    ↓
Swipe Action → Response Storage → Privacy Filtering → Customer Insights
```

---

## Directory Structure

```
src/
├── components/          # Shared UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── index.ts
│
├── screens/            # Screen components (one per route)
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   └── ProfileScreen.tsx
│
├── navigation/         # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── TabNavigator.tsx
│   └── types.ts
│
├── hooks/             # Custom React hooks
│   ├── useDebounce.ts
│   ├── useAuth.ts
│   └── index.ts
│
├── services/          # External integrations
│   ├── api/
│   │   ├── client.ts
│   │   ├── userService.ts
│   │   └── index.ts
│   └── storage/
│       └── AsyncStorage.ts
│
├── types/             # TypeScript type definitions
│   ├── models.ts      # Data models
│   ├── api.ts         # API types
│   └── navigation.ts  # Navigation types
│
├── utils/             # Pure utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── index.ts
│
└── constants/         # App-wide constants
    ├── Colors.ts
    ├── Spacing.ts
    ├── Typography.ts
    └── index.ts
```

---

## Layer Responsibilities

### **Screens Layer**
**Purpose**: Top-level components representing app routes

**Responsibilities**:
- Coordinate data fetching using hooks
- Handle user interactions
- Compose components into complete screens
- Manage screen-level state

**Rules**:
- One screen per route
- Maximum ~300 lines (extract components if larger)
- Minimal business logic (delegate to hooks/utils)
- Focus on composition over complexity

**Example Structure**:
```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, UserList, LoadingSpinner } from '@/components';
import { useUsers } from '@/hooks';
import { Colors, Spacing } from '@/constants';

export const HomeScreen = () => {
  // Hooks
  const { users, loading, error, refetch } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  // Render
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} onRetry={refetch} />;
  
  return (
    <View style={styles.container}>
      <Header title="Home" onSearch={handleSearch} />
      <UserList users={users} searchQuery={searchQuery} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
```

### **Components Layer**
**Purpose**: Reusable UI elements

**Types**:
1. **Presentational Components**: Pure UI, no state
2. **Container Components**: With local state, data fetching
3. **Layout Components**: Structure and positioning

**Rules**:
- Single responsibility
- Prop-driven (avoid internal state when possible)
- Styled with StyleSheet
- Include TypeScript interfaces for props

**Component Template**:
```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### **Hooks Layer**
**Purpose**: Encapsulate stateful logic and side effects

**When to create a custom hook**:
- Logic is reused across multiple components
- Complex state management
- Side effects (data fetching, subscriptions)
- Third-party library integration

**Rules**:
- Name starts with 'use'
- Return object with data, loading, error states
- Handle cleanup in useEffect return
- Accept configuration as parameters

**Hook Template**:
```typescript
import { useState, useEffect } from 'react';
import { UserService } from '@/services';
import { User } from '@/types';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};
```

### **Services Layer**
**Purpose**: Abstract external dependencies and side effects

**Types**:
1. **API Services**: HTTP requests
2. **Storage Services**: AsyncStorage, SecureStore
3. **Analytics Services**: Event tracking
4. **Push Notification Services**: Device registration, handlers

**Rules**:
- Pure functions (no React hooks)
- Return Promises for async operations
- Throw errors, don't return error objects
- Include proper TypeScript types

**Service Template**:
```typescript
import { User, CreateUserRequest } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

export const UserService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    return response.json();
  },

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
    
    return response.json();
  },
};
```

### **Utils Layer**
**Purpose**: Pure, reusable helper functions

**Characteristics**:
- Stateless and side-effect free
- Deterministic (same input → same output)
- Easily testable
- No dependencies on React or app-specific code

**Examples**:
```typescript
// formatters.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// validators.ts
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};
```

---

## State Management Strategy

### **Current Approach: Local State + Hooks**
For the current app size, we use:
- `useState` for component-local state
- Custom hooks for shared stateful logic
- Props drilling for 1-2 level depth

### **When to Add Context**
Add React Context when:
- State is needed by many components at different nesting levels
- Props drilling becomes unwieldy (>3 levels)
- Global app state (theme, auth, user settings)

**Example: Auth Context**
```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Authentication logic
    const userData = await AuthService.login(email, password);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### **When to Add Redux/Zustand**
Only add a global state management library if you have:
- Complex state with many interrelated pieces
- Need for time-travel debugging
- State shared across disconnected component trees
- Performance issues with Context re-renders

**We don't have these needs yet.**

---

## Navigation Architecture

### **Current Structure**
```
App
└── RootNavigator (Stack)
    └── MainTabs (Bottom Tabs)
        ├── HomeStack (Stack)
        │   ├── HomeScreen
        │   └── DetailScreen
        ├── SearchStack (Stack)
        │   └── SearchScreen
        └── ProfileStack (Stack)
            └── ProfileScreen
```

### **Type-Safe Navigation**
```typescript
// types/navigation.ts
export type RootStackParamList = {
  MainTabs: undefined;
  Modal: { title: string };
};

export type MainTabsParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

// Usage in component
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DetailScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Detail'>;
  route: RouteProp<HomeStackParamList, 'Detail'>;
};

export const DetailScreen: React.FC<DetailScreenProps> = ({ navigation, route }) => {
  const { id } = route.params; // Type-safe!
  
  navigation.navigate('Home'); // Type-checked!
};
```

---

## Error Handling Strategy

### **Levels of Error Handling**

1. **Service Level**: Catch and throw descriptive errors
```typescript
async getUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.error('UserService.getUser:', error);
    throw error; // Re-throw for upper layers
  }
}
```

2. **Hook Level**: Manage error state
```typescript
const [error, setError] = useState<Error | null>(null);

try {
  const data = await service.getData();
  setData(data);
  setError(null);
} catch (err) {
  setError(err as Error);
}
```

3. **Component Level**: Display errors to user
```typescript
if (error) {
  return <ErrorView message={error.message} onRetry={refetch} />;
}
```

4. **App Level**: Error boundaries for unhandled errors
```typescript
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

---

## Performance Considerations

### **Optimization Checklist**
- [ ] Use FlatList for long lists
- [ ] Implement proper keyExtractor
- [ ] Use React.memo for expensive components
- [ ] Use useCallback for callbacks passed to children
- [ ] Use useMemo for expensive calculations
- [ ] Avoid inline styles and functions
- [ ] Optimize images (compressed, sized appropriately)
- [ ] Lazy load screens with React.lazy (when needed)

### **When NOT to Optimize**
- Don't premature optimize
- Profile first, then optimize
- Only optimize after identifying bottlenecks
- Prefer readable code over clever optimizations

---

## Testing Strategy

### **Testing Pyramid**
```
         E2E Tests (Few)
       /               \
    Integration Tests (Some)
   /                         \
Unit Tests (Many)
```

### **What to Test Where**

**Unit Tests** (Utils, Hooks, Services):
- Pure functions
- Custom hooks (with @testing-library/react-hooks)
- Service methods (mocked fetch)

**Integration Tests** (Components, Screens):
- Component rendering
- User interactions
- Navigation flows
- State changes

**E2E Tests** (Future consideration):
- Critical user journeys
- Cross-platform behavior
- Performance benchmarks

---

## Security Considerations

### **Current Security Measures**
1. **No secrets in code**: Use environment variables
2. **HTTPS only**: All API calls over secure connections
3. **Input validation**: Validate user input before processing
4. **Secure storage**: Use expo-secure-store for sensitive data

### **Future Security Enhancements**
- Certificate pinning
- Biometric authentication
- Token refresh mechanism
- Rate limiting on API calls

---

## Deployment Architecture

### **Development**
```
Developer → Expo Go → Device
         ↓
    Expo Development Server
         ↓
    Metro Bundler
```

### **Production**
```
Code → Build → Distribution
  ↓      ↓         ↓
GitHub   EAS    App Store
         Build   Play Store
                 Web Hosting
```

---

## Future Considerations

### **When the App Grows**

**Consider adding**:
- React Query for data caching and synchronization
- Zustand or Redux for complex global state
- Deep linking for app-to-app navigation
- Push notifications
- Offline support with local database
- CI/CD pipeline
- Feature flags
- A/B testing

**Architecture evolution**:
- Feature-based folder structure
- Shared component library
- Micro-frontends (if team grows large)
- Monorepo setup (if multiple apps)

---

## Decision Log

**Why Expo over bare React Native?**
- Faster development iteration
- Managed native dependencies
- Easy OTA updates
- Better DX for our team size

**Why TypeScript strict mode?**
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Easier refactoring

**Why React Navigation over alternatives?**
- Most popular and maintained
- Excellent TypeScript support
- Flexible and customizable
- Great documentation

**Why no global state library yet?**
- App is small enough
- Local state + hooks sufficient
- Can add later without major refactor
- YAGNI principle

---

## System Roles & Workflow Cross-Reference (Oct 2025)

- **Model Configuration & Guardrails:** See `DEVELOPMENT_WORKFLOW.md` (top section) for the single-model Cursor policy (Claude 4.5 Sonnet), protected files, and handoff rules.
- **AI Operating Rules for Editors:** See `.cursorrules` for in-IDE enforcement details.
- **LLM Best Practices & Anti-Patterns:** See `AGENTS.md` for SWIPE-specific do’s/don’ts and minimal-diff expectations.


**Last Updated**: October 2, 2025





