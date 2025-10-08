import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { freeSummaries } from '../data/freeSummaries';
import { premiumReports } from '../data/premiumReports';
import { AssessmentResult } from '../lib/types';
import { useTheme } from '../theme/ThemeProvider';

interface ResultsScreenProps {
  route: {
    params: {
      result: AssessmentResult;
    };
  };
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isDesktop = screenWidth > 1024;

export default function ResultsScreen({ route }: ResultsScreenProps) {
  console.log('🎯 ResultsScreen loaded with route params:', route.params);
  const { result } = route.params;
  console.log('📊 Result data:', result);
  const navigation = useNavigation();
  const themeContext = useTheme();
  
  // Safety check for theme context
  if (!themeContext) {
    console.error('🚨 Theme context not available in ResultsScreen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Loading theme...</Text>
      </View>
    );
  }
  
  const { theme, isDark, toggleTheme } = themeContext;

  // Fallback theme if not available
  const safeTheme = theme || {
    colors: {
      background: '#000000',
      surface: '#1a1a1a',
      text: '#ffffff',
      textInverse: '#000000',
      primary: '#8B5CF6',
      border: '#333333'
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I'm a ${result.swipeTypeName}! Discover your Swipe Type at [your-app-link]`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: safeTheme.colors.background }, isDesktop && styles.desktopContainer]}>
      {/* Theme Toggle for Testing */}
      <TouchableOpacity 
        style={[styles.themeToggle, { backgroundColor: safeTheme.colors.surface, borderColor: safeTheme.colors.border }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.themeToggleText, { color: safeTheme.colors.text }]}>
          {isDark ? '🌙' : '☀️'} {isDark ? 'Dark' : 'Light'} Mode
        </Text>
      </TouchableOpacity>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: safeTheme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: safeTheme.colors.textInverse }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: safeTheme.colors.textInverse }]}>Your Results</Text>
      </View>

      {/* Type Reveal */}
      <View style={styles.reveal}>
        <Text style={styles.yourType}>Your Swipe Type</Text>
        {/* Type Badge with Primary Gradient */}
        <View style={[styles.typeBadge, { backgroundColor: safeTheme.colors.primary }]}>
          <Text style={styles.typeName}>{result.swipeTypeName}</Text>
        </View>
      </View>

      {/* Free Summary - Teaser */}
      <View style={[styles.section, { backgroundColor: safeTheme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: safeTheme.colors.text }]}>Your Profile</Text>
        <Text style={[styles.content, { color: safeTheme.colors.text }]}>{freeSummaries[result.swipeType]}</Text>
      </View>

      {/* Purchase Prompt */}
      <View style={styles.purchaseSection}>
        <View style={[styles.premiumCard, { backgroundColor: safeTheme.colors.surface }]}>
          <Text style={[styles.premiumTitle, { color: safeTheme.colors.text }]}>Unlock Your Complete Report</Text>
          <Text style={[styles.premiumDescription, { color: safeTheme.colors.text }]}>
            Get your detailed 7-section report with personalized insights, 
            relationship advice, and growth opportunities.
          </Text>
          
          <View style={styles.featuresList}>
            <Text style={[styles.featureItem, { color: safeTheme.colors.text }]}>✓ How You Love - Your unique love style</Text>
            <Text style={[styles.featureItem, { color: safeTheme.colors.text }]}>✓ What You Need - Your emotional needs</Text>
            <Text style={[styles.featureItem, { color: safeTheme.colors.text }]}>✓ Your Strengths - Your relationship superpowers</Text>
            <Text style={[styles.featureItem, { color: safeTheme.colors.text }]}>✓ Growth Opportunities - Areas to develop</Text>
            <Text style={[styles.featureItem, { color: safeTheme.colors.text }]}>✓ In Conflict - How you handle disagreements</Text>
            <Text style={[styles.featureItem, { color: safeTheme.colors.text }]}>✓ Advice for Partners - How others can love you better</Text>
          </View>

          <TouchableOpacity 
            style={[styles.purchaseButton, { backgroundColor: safeTheme.colors.primary }]}
            onPress={() => navigation.navigate('FullReport', { result })}
          >
            <Text style={[styles.purchaseButtonText, { color: safeTheme.colors.textInverse }]}>View Full Report (Free Preview)</Text>
          </TouchableOpacity>
          
          <Text style={styles.previewNote}>
            * Currently free during beta testing
          </Text>
        </View>
      </View>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share Your Type</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 1000,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  desktopContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    marginHorizontal: 'auto',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  reveal: {
    padding: 32,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  yourType: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
  typeName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  typeBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  section: {
    padding: isDesktop ? 32 : 24,
    paddingHorizontal: isDesktop ? 48 : 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: isDesktop ? 18 : 16,
    lineHeight: isDesktop ? 28 : 24,
    color: '#333',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  reportSection: {
    fontSize: isDesktop ? 18 : 16,
    lineHeight: isDesktop ? 28 : 24,
    color: '#333',
    marginBottom: 16,
  },
  shareButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  purchaseSection: {
    padding: isDesktop ? 32 : 24,
    paddingHorizontal: isDesktop ? 48 : 24,
  },
  premiumCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  premiumDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 8,
  },
  purchaseButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
