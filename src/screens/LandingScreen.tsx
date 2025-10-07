import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isDesktop = screenWidth > 1024;

export default function LandingScreen() {
  const navigation = useNavigation<LandingScreenNavigationProp>();

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <Text style={styles.logo}>Swipe Type</Text>
      <Text style={styles.headline}>Discover Your Swipe Type</Text>
      <Text style={styles.subhead}>The personality test for relationships</Text>
      
      {/* Primary CTA */}
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Assessment')}
      >
        <Text style={styles.primaryButtonText}>Take the Assessment (4 min)</Text>
        <Text style={styles.buttonSubtext}>Discover your Connection Style & Enneagram Type</Text>
      </TouchableOpacity>
      
      {/* Secondary CTA */}
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('DirectInput')}
      >
        <Text style={styles.secondaryButtonText}>I Know My Types Already</Text>
        <Text style={styles.buttonSubtext}>Get instant results</Text>
      </TouchableOpacity>
      
      <Text style={styles.infoText}>Not sure? Take the assessment to discover both!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#000', // Black background like TikTok
  },
  desktopContainer: {
    maxWidth: 600,
    alignSelf: 'center',
    marginHorizontal: 'auto',
  },
  logo: {
    fontSize: isDesktop ? 40 : 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  headline: {
    fontSize: isDesktop ? 32 : 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
  },
  subhead: {
    fontSize: isDesktop ? 20 : 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: isDesktop ? 64 : 48,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});
