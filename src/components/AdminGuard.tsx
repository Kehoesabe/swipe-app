/**
 * Admin Guard Component
 * 
 * Protects admin routes by checking user authentication and admin status.
 * Redirects non-admin users to the main app.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../theme';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Admin Guard Component
 * 
 * Wraps admin screens to ensure only authenticated admin users can access them.
 * Shows loading state while checking authentication.
 * Redirects non-admin users with appropriate messaging.
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock admin check - in production, this would verify JWT token
      // and check user role from the backend
      const mockUser = {
        id: 'user_123',
        email: 'admin@swipe-type.com',
        is_admin: true, // Set to false to test non-admin access
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!mockUser.is_admin) {
        Alert.alert(
          'Access Denied',
          'You do not have admin privileges to access this area.',
          [
            {
              text: 'Go Back',
              onPress: () => navigation.goBack(),
            },
          ]
        );
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError('Failed to verify admin access');
      Alert.alert(
        'Authentication Error',
        'Unable to verify your admin access. Please try again.',
        [
          {
            text: 'Go Back',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Verifying admin access...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Please contact support if you believe this is an error.
        </Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.deniedContainer}>
        <Text style={styles.deniedText}>Access Denied</Text>
        <Text style={styles.deniedSubtext}>
          You do not have admin privileges to access this area.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.body.fontSize,
    color: Colors.text,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.h2.fontSize,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  errorSubtext: {
    fontSize: Typography.caption.fontSize,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  deniedText: {
    fontSize: Typography.h1.fontSize,
    color: Colors.error,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  deniedSubtext: {
    fontSize: Typography.body.fontSize,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
});

export default AdminGuard;
