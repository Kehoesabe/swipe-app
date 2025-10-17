/**
 * Admin Navigation
 * 
 * Navigation stack for admin dashboard functionality including
 * purchase management, refunds, and access control.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

// Import admin screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import PurchasesScreen from '../screens/admin/PurchasesScreen';
import PurchaseDetailScreen from '../screens/admin/PurchaseDetailScreen';

const AdminStack = createStackNavigator<RootStackParamList>();

/**
 * Admin Navigator Component
 * 
 * Provides navigation for admin dashboard functionality.
 * All screens in this navigator require admin authentication.
 */
function AdminNavigator() {
  return (
    <AdminStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <AdminStack.Screen 
        name="AdminDashboard" 
        component={AdminDashboard}
        options={{
          title: 'Admin Dashboard',
          headerShown: true,
        }}
      />
      <AdminStack.Screen 
        name="AdminPurchases" 
        component={PurchasesScreen}
        options={{
          title: 'Purchases',
          headerShown: true,
        }}
      />
      <AdminStack.Screen 
        name="AdminPurchaseDetail" 
        component={PurchaseDetailScreen}
        options={{
          title: 'Purchase Details',
          headerShown: true,
        }}
      />
    </AdminStack.Navigator>
  );
}

export default AdminNavigator;



