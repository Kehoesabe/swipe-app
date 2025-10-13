# Security Policy

## 🔒 Security Overview

Security is a top priority for the Swipe App. This document outlines security best practices, vulnerability reporting procedures, and security guidelines for contributors.

## Table of Contents
- [Reporting Vulnerabilities](#reporting-vulnerabilities)
- [Security Best Practices](#security-best-practices)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Network Security](#network-security)
- [Secure Coding Guidelines](#secure-coding-guidelines)
- [Dependency Management](#dependency-management)
- [Security Checklist](#security-checklist)

---

## 🚨 Reporting Vulnerabilities

### How to Report

If you discover a security vulnerability, please **DO NOT** open a public issue. Instead:

1. **Email**: security@yourcompany.com
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Disclosure Policy

- We follow **responsible disclosure**
- Vulnerabilities will be publicly disclosed after:
  - Fix is deployed
  - Reasonable time for users to update
  - Coordination with security researcher

---

## 🛡️ Security Best Practices

### Environment Variables

**✅ DO:**
```typescript
// Use environment variables for configuration
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Store in .env files (NOT committed to git)
EXPO_PUBLIC_API_URL=https://api.example.com
```

**❌ DON'T:**
```typescript
// Never hardcode sensitive values
const API_KEY = 'sk_live_abc123xyz789'; // BAD!
const API_URL = 'https://api.example.com'; // BAD!
```

### Secrets Management

**For Production:**
- Use **EAS Secrets** for sensitive values
- Never commit API keys or secrets to git
- Rotate secrets regularly
- Use different secrets for different environments

```bash
# Store secrets in EAS
eas secret:create --scope project --name API_KEY --value "your-key"
```

### .gitignore Configuration

Ensure these are in `.gitignore`:
```gitignore
# Environment variables
.env
.env.local
.env.development
.env.staging
.env.production
.env*.local

# Credentials
*.p12
*.p8
*.mobileprovision
*.jks
google-services.json
GoogleService-Info.plist

# Sensitive files
secrets/
credentials/
```

---

## 🔐 Authentication & Authorization

### Token Management

**✅ Secure Token Storage:**
```typescript
import * as SecureStore from 'expo-secure-store';

// Store tokens securely
const saveToken = async (token: string) => {
  await SecureStore.setItemAsync('authToken', token);
};

// Retrieve tokens
const getToken = async () => {
  return await SecureStore.getItemAsync('authToken');
};

// Delete tokens on logout
const clearToken = async () => {
  await SecureStore.deleteItemAsync('authToken');
};
```

**❌ Insecure Token Storage:**
```typescript
// Never store sensitive data in AsyncStorage
await AsyncStorage.setItem('authToken', token); // BAD!

// Never store in plain JavaScript
window.authToken = token; // BAD!

// Never log tokens
console.log('Token:', token); // BAD!
```

### JWT Best Practices

```typescript
// Validate JWT expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

// Refresh tokens before expiration
useEffect(() => {
  const checkAndRefreshToken = async () => {
    const token = await getToken();
    if (token && isTokenExpired(token)) {
      await refreshAuthToken();
    }
  };
  
  const interval = setInterval(checkAndRefreshToken, 60000); // Check every minute
  return () => clearInterval(interval);
}, []);
```

### OAuth Implementation

```typescript
// Use PKCE for OAuth flows
import * as AuthSession from 'expo-auth-session';

const useOAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'your-client-id',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'myapp',
        path: 'redirect'
      }),
      usePKCE: true, // IMPORTANT: Enable PKCE
    },
    { authorizationEndpoint: 'https://oauth.example.com/authorize' }
  );
  
  return { request, response, promptAsync };
};
```

---

## 🔒 Data Protection

### Sensitive Data Handling

**User Input Validation:**
```typescript
// Always validate and sanitize user input
import { z } from 'zod';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(128);

const validateLoginForm = (email: string, password: string) => {
  try {
    emailSchema.parse(email);
    passwordSchema.parse(password);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
```

**Prevent XSS:**
```typescript
// Sanitize user-generated content
import DOMPurify from 'isomorphic-dompurify';

const sanitizeUserInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
};

// Use in component
<Text>{sanitizeUserInput(userInput)}</Text>
```

**Prevent SQL Injection (Backend):**
```typescript
// Always use parameterized queries
// ✅ Good (parameterized)
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ Bad (vulnerable to SQL injection)
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

### Data Encryption

**Encrypt Sensitive Data at Rest:**
```typescript
import * as Crypto from 'expo-crypto';

// Encrypt sensitive data
const encryptData = async (data: string, key: string): Promise<string> => {
  const encrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data + key
  );
  return encrypted;
};

// Use for sensitive local storage
const saveSensitiveData = async (data: string) => {
  const encrypted = await encryptData(data, 'your-encryption-key');
  await SecureStore.setItemAsync('sensitive_data', encrypted);
};
```

### Personal Data (GDPR/CCPA)

```typescript
// Implement data deletion
const deleteUserData = async (userId: string) => {
  // Delete from database
  await UserService.deleteUser(userId);
  
  // Clear local storage
  await SecureStore.deleteItemAsync('authToken');
  await AsyncStorage.clear();
  
  // Clear cache
  await clearCache();
};

// Implement data export
const exportUserData = async (userId: string) => {
  const userData = await UserService.getUserData(userId);
  return JSON.stringify(userData, null, 2);
};
```

---

## 🌐 Network Security

### HTTPS Only

**✅ Enforce HTTPS:**
```typescript
// Configure app.json
{
  "expo": {
    "android": {
      "usesCleartextTraffic": false // Disable cleartext traffic
    }
  }
}

// Validate URLs
const isSecureUrl = (url: string): boolean => {
  return url.startsWith('https://');
};
```

### API Security

**Implement Request Authentication:**
```typescript
// Add auth headers to all requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await SecureStore.getItemAsync('authToken');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-App-Version': APP_VERSION,
    },
  });
};
```

**Rate Limiting:**
```typescript
// Implement client-side rate limiting
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number, timeWindow: number) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
}

// Usage
const limiter = new RateLimiter(10, 60000); // 10 requests per minute

const makeAPICall = async () => {
  if (!limiter.canMakeRequest()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  return await fetch('/api/endpoint');
};
```

### Certificate Pinning (Advanced)

For highly sensitive apps:
```typescript
// Using expo-secure-store and custom native modules
// This requires ejecting to bare workflow

// Example conceptual implementation
const pinnedCertificates = [
  'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
];

// Implement in native code for production
```

---

## 💻 Secure Coding Guidelines

### Input Validation

**Always validate at multiple layers:**
```typescript
// Client-side validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Type validation
interface UserInput {
  email: string;
  age: number;
}

const validateUserInput = (input: unknown): input is UserInput => {
  return (
    typeof input === 'object' &&
    input !== null &&
    'email' in input &&
    'age' in input &&
    typeof input.email === 'string' &&
    typeof input.age === 'number' &&
    input.age >= 0 &&
    input.age <= 150
  );
};
```

### Error Handling

**Never expose sensitive information in errors:**
```typescript
// ❌ Bad - exposes internal details
catch (error) {
  Alert.alert('Error', error.message); // Might expose DB structure, etc.
}

// ✅ Good - generic user message
catch (error) {
  console.error('Detailed error:', error); // Log for debugging
  Alert.alert(
    'Error',
    'An error occurred. Please try again or contact support.'
  );
}
```

### Logging

**Sanitize logs:**
```typescript
// ❌ Bad - logs sensitive data
console.log('User login:', { email, password }); // NEVER!

// ✅ Good - redacts sensitive data
const sanitizeForLogging = (obj: any) => {
  const sanitized = { ...obj };
  const sensitiveFields = ['password', 'token', 'ssn', 'creditCard'];
  
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

console.log('User login:', sanitizeForLogging({ email, password }));
```

### Secure Random Generation

```typescript
import * as Crypto from 'expo-crypto';

// Generate secure random values
const generateSecureToken = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return randomBytes.reduce((acc, byte) => 
    acc + byte.toString(16).padStart(2, '0'), ''
  );
};

// Don't use Math.random() for security-sensitive operations
// ❌ Bad
const insecureToken = Math.random().toString(36);

// ✅ Good
const secureToken = await generateSecureToken();
```

---

## 📦 Dependency Management

### Regular Updates

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Dependency Review

**Before adding a dependency:**
- Check package maintenance status
- Review security advisories
- Check download stats and community trust
- Review source code for sensitive operations
- Verify package authenticity

### Lock Files

```bash
# Always commit lock files
git add package-lock.json

# Verify integrity when installing
npm ci # Use in CI/CD
```

### Known Vulnerabilities

Check dependencies regularly:
```bash
# Use Snyk (free for open source)
npm install -g snyk
snyk test

# Or use npm audit
npm audit --production
```

---

## ✅ Security Checklist

### Development
- [ ] All environment variables in `.env`, not hardcoded
- [ ] `.env` files in `.gitignore`
- [ ] No sensitive data in logs
- [ ] Input validation on all user inputs
- [ ] Error messages don't expose internals
- [ ] HTTPS only for API calls
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (`npm audit`)

### Authentication
- [ ] Tokens stored in SecureStore
- [ ] Token expiration checked
- [ ] Refresh token mechanism implemented
- [ ] OAuth uses PKCE
- [ ] Session timeout implemented
- [ ] Logout clears all tokens

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] User input sanitized
- [ ] Personal data can be exported
- [ ] Personal data can be deleted
- [ ] No sensitive data in analytics

### Network
- [ ] All API calls use HTTPS
- [ ] Certificate validation enabled
- [ ] Request authentication implemented
- [ ] Rate limiting on API calls
- [ ] Timeout on network requests

### Code
- [ ] TypeScript strict mode enabled
- [ ] ESLint security rules enabled
- [ ] No `eval()` or similar dangerous functions
- [ ] Secure random generation for tokens
- [ ] Dependencies reviewed and minimal

### Testing
- [ ] Security test cases written
- [ ] Penetration testing performed (for production)
- [ ] Authentication flows tested
- [ ] Input validation tested
- [ ] Error handling tested

### Deployment
- [ ] Production secrets in EAS Secrets
- [ ] Different keys per environment
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery plan in place
- [ ] Incident response plan documented

---

## 📚 Resources

### Security Guidelines
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Expo Security Best Practices](https://docs.expo.dev/guides/security/)
- [React Native Security](https://reactnative.dev/docs/security)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)

### Compliance
- [GDPR Compliance](https://gdpr.eu/)
- [CCPA Compliance](https://oag.ca.gov/privacy/ccpa)

---

## 🔄 Security Updates

This document is reviewed and updated quarterly.

**Last Security Review**: October 2, 2025  
**Next Scheduled Review**: January 2, 2026

---

**Remember: Security is everyone's responsibility. When in doubt, ask!**








