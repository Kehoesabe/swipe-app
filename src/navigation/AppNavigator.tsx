import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen';
import DirectInputScreen from '../screens/DirectInputScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import ResultsScreen from '../screens/ResultsScreen';
import FullReportScreen from '../screens/FullReportScreen';
import AdminNavigator from './AdminNavigator';
import AdminGuard from '../components/AdminGuard';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Landing"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Landing" 
          component={LandingScreen} 
          options={{ title: 'Swipe Type' }}
        />
        <Stack.Screen 
          name="DirectInput" 
          component={DirectInputScreen} 
          options={{ title: 'Direct Input' }}
        />
        <Stack.Screen 
          name="Assessment" 
          component={AssessmentScreen} 
          options={{ title: 'Assessment' }}
        />
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen} 
          options={{ title: 'Your Results' }}
        />
        <Stack.Screen 
          name="FullReport" 
          component={FullReportScreen} 
          options={{ title: 'Complete Report' }}
        />
        {/* Admin screens - protected by AdminGuard */}
        <Stack.Screen 
          name="AdminDashboard" 
          options={{ 
            title: 'Admin Dashboard',
            headerShown: false, // Hide header since AdminNavigator handles it
          }}
        >
          {() => (
            <AdminGuard>
              <AdminNavigator />
            </AdminGuard>
          )}
        </Stack.Screen>
        <Stack.Screen 
          name="AdminPurchases" 
          options={{ 
            title: 'Purchases',
            headerShown: false, // Hide header since AdminNavigator handles it
          }}
        >
          {() => (
            <AdminGuard>
              <AdminNavigator />
            </AdminGuard>
          )}
        </Stack.Screen>
        <Stack.Screen 
          name="AdminPurchaseDetail" 
          options={{ 
            title: 'Purchase Details',
            headerShown: false, // Hide header since AdminNavigator handles it
          }}
        >
          {() => (
            <AdminGuard>
              <AdminNavigator />
            </AdminGuard>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}