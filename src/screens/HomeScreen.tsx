import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../constants';

type RootStackParamList = {
  Main: undefined;
  HelloUser: undefined;
  UserProfile: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleHelloUser = () => {
    navigation.navigate('HelloUser');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="rocket" size={60} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>Welcome to Swipe App! 🚀</Text>
        <Text style={styles.subtitle}>
          Your mobile app is ready for development
        </Text>
        <Text style={styles.description}>
          This is a well-structured Expo + TypeScript project with:
          {'\n'}• Navigation setup
          {'\n'}• TypeScript configuration
          {'\n'}• ESLint & Prettier
          {'\n'}• Organized folder structure
        </Text>
        
        <TouchableOpacity
          style={styles.helloButton}
          onPress={handleHelloUser}
          accessibilityLabel="Say hello to user"
          accessibilityRole="button"
        >
          <Ionicons name="person" size={20} color={Colors.white} />
          <Text style={styles.helloButtonText}>Say Hello User</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  helloButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  helloButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
});
