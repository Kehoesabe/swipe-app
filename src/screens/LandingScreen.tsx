import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../ui/Screen';
import Button from '../ui/Button';
import { Typography, Spacing } from '../theme';

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isDesktop = screenWidth > 1024;

export default function LandingScreen() {
  const navigation = useNavigation<LandingScreenNavigationProp>();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.logo, Typography.h1]}>Swipe Type</Text>
        <Text style={[styles.headline, Typography.h2]}>Discover Your Swipe Type</Text>
        <Text style={[styles.subhead, Typography.body]}>The personality test for relationships</Text>
        
        {/* Primary CTA */}
        <Button
          title="Take the Assessment (4 min)"
          variant="primary"
          onPress={() => navigation.navigate('Assessment')}
          style={styles.primaryButton}
        />
        <Text style={[styles.buttonSubtext, Typography.caption]}>
          Discover your Connection Style & Enneagram Type
        </Text>
        
        {/* Secondary CTA */}
        <Button
          title="I Know My Types Already"
          variant="secondary"
          onPress={() => navigation.navigate('DirectInput')}
          style={styles.secondaryButton}
        />
        <Text style={[styles.buttonSubtext, Typography.caption]}>
          Get instant results
        </Text>
        
        <Text style={[styles.infoText, Typography.caption]}>
          Not sure? Take the assessment to discover both!
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  headline: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subhead: {
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  primaryButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
  secondaryButton: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  buttonSubtext: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  infoText: {
    textAlign: 'center',
  },
});
