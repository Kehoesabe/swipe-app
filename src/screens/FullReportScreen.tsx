import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { premiumReports } from '../data/premiumReports';
import { AssessmentResult } from '../lib/types';

const { width: screenWidth } = Dimensions.get('window');
const isDesktop = screenWidth > 1024;

interface FullReportScreenProps {
  route: {
    params: {
      result: AssessmentResult;
    };
  };
}

export default function FullReportScreen({ route }: FullReportScreenProps) {
  const { result } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView style={[styles.container, isDesktop && styles.desktopContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Summary</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Complete Report</Text>
      </View>

      {/* Type Header */}
      <View style={styles.reveal}>
        <Text style={styles.yourType}>Your Swipe Type</Text>
        <Text style={styles.typeName}>{result.swipeTypeName}</Text>
      </View>

      {/* Full Report Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Detailed Report</Text>
        
        {/* Introduction */}
        <Text style={styles.reportSection}>
          {premiumReports[result.swipeType].introduction}
        </Text>

        {/* How You Love */}
        <Text style={styles.subheading}>How You Love</Text>
        <Text style={styles.reportSection}>
          {premiumReports[result.swipeType].howYouLove}
        </Text>

        {/* What You Need */}
        <Text style={styles.subheading}>What You Need</Text>
        <Text style={styles.reportSection}>
          {premiumReports[result.swipeType].whatYouNeed}
        </Text>

        {/* Your Strengths */}
        <Text style={styles.subheading}>Your Strengths</Text>
        <Text style={styles.reportSection}>
          {premiumReports[result.swipeType].yourStrengths}
        </Text>

        {/* Growth Opportunities */}
        <Text style={styles.subheading}>Growth Opportunities</Text>
        <Text style={styles.reportSection}>
          {premiumReports[result.swipeType].growthOpportunities}
        </Text>

        {/* In Conflict */}
        <Text style={styles.subheading}>In Conflict</Text>
        <Text style={styles.reportSection}>
          {premiumReports[result.swipeType].inConflict}
        </Text>

        {/* Advice for Partners */}
        <Text style={styles.subheading}>Advice for Partners</Text>
        <Text style={styles.reportSection}>
          {premiumReports[result.swipeType].adviceForPartners}
        </Text>
      </View>

      {/* Back to Summary Button */}
      <TouchableOpacity 
        style={styles.backToSummaryButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backToSummaryText}>← Back to Summary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background like TikTok
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
  section: {
    padding: isDesktop ? 32 : 24,
    paddingHorizontal: isDesktop ? 48 : 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
  backToSummaryButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  backToSummaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
