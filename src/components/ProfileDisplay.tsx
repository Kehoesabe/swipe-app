/**
 * ProfileDisplay Component
 * 
 * Renders the profile content with free/premium sections
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ProfileDisplayProps } from '../types/profile';
import { Colors, Typography, Spacing } from '../theme';
import analytics from '../utils/analytics';

export default function ProfileDisplay({ 
  profile, 
  isPremiumUnlocked, 
  onUnlockClick,
  isProcessingPayment = false,
  paymentError = null
}: ProfileDisplayProps) {
  
  // Track Premium Content Viewed event
  useEffect(() => {
    if (isPremiumUnlocked && profile) {
      analytics.track('Premium Content Viewed', {
        type_number: profile.typeNumber,
        assessment_id: 'assessment_456', // TODO: Pass from props
        timestamp: new Date().toISOString(),
      });
    }
  }, [isPremiumUnlocked, profile]);
  const renderFreeContent = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Swipe Type</Text>
      <Text style={styles.freeSummary}>{profile.freeSummary}</Text>
    </View>
  );

  const renderPremiumContent = () => {
    if (!isPremiumUnlocked) {
      return (
        <View style={styles.premiumLocked}>
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedTitle}>Unlock Your Full Profile</Text>
            <Text style={styles.lockedDescription}>
              Get detailed insights about your communication style, growth areas, 
              and relationship patterns.
            </Text>
            <TouchableOpacity 
              style={[styles.unlockButton, isProcessingPayment && styles.unlockButtonDisabled]} 
              onPress={onUnlockClick}
              disabled={isProcessingPayment}
            >
              <Text style={styles.unlockButtonText}>
                {isProcessingPayment ? 'Processing...' : 'Unlock Full Profile'}
              </Text>
            </TouchableOpacity>
            
            {paymentError && (
              <Text style={styles.errorText}>{paymentError}</Text>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.premiumContent}>
        <Text style={styles.sectionTitle}>Full Profile</Text>
        <Text style={styles.premiumText}>{profile.premium.fullNarrative}</Text>
        
        <View style={styles.strengthsSection}>
          <Text style={styles.subsectionTitle}>Your Strengths</Text>
          {profile.premium.strengths.map((strength, index) => (
            <View key={index} style={styles.strengthItem}>
              <Text style={styles.strengthTitle}>{strength.title}</Text>
              <Text style={styles.strengthContent}>{strength.content}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.growthSection}>
          <Text style={styles.subsectionTitle}>Growth Areas</Text>
          {profile.premium.growthAreas.map((growth, index) => (
            <View key={index} style={styles.growthItem}>
              <Text style={styles.growthTitle}>{growth.title}</Text>
              <Text style={styles.growthContent}>{growth.content}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.communicationSection}>
          <Text style={styles.subsectionTitle}>Communication Style</Text>
          <Text style={styles.communicationText}>{profile.premium.communicationStyle}</Text>
        </View>
        
        <View style={styles.frictionSection}>
          <Text style={styles.subsectionTitle}>Friction Points</Text>
          <Text style={styles.frictionText}>{profile.premium.frictionPoints}</Text>
        </View>
        
        <View style={styles.partnerSection}>
          <Text style={styles.subsectionTitle}>For Your Partner</Text>
          <Text style={styles.partnerText}>{profile.premium.partnerTranslation}</Text>
        </View>
        
        <View style={styles.growthPathSection}>
          <Text style={styles.subsectionTitle}>Growth Pathway</Text>
          <Text style={styles.growthPathText}>{profile.premium.growthPathway}</Text>
        </View>
        
        <View style={styles.kpisSection}>
          <Text style={styles.subsectionTitle}>Key Performance Indicators</Text>
          {profile.premium.kpis.map((kpi, index) => (
            <View key={index} style={styles.kpiItem}>
              <Text style={styles.kpiText}>• {kpi}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.lexiconSection}>
          <Text style={styles.subsectionTitle}>Signature Lexicon</Text>
          {profile.premium.signatureLexicon.map((term, index) => (
            <View key={index} style={styles.lexiconItem}>
              <Text style={styles.lexiconTerm}>{term.term}</Text>
              <Text style={styles.lexiconDefinition}>{term.definition}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderFreeContent()}
      {renderPremiumContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  freeSummary: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  premiumLocked: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  lockedOverlay: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  lockedDescription: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  unlockButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unlockButtonDisabled: {
    backgroundColor: Colors.disabled,
    opacity: 0.6,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.caption.fontSize,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  premiumContent: {
    padding: Spacing.lg,
  },
  premiumText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  strengthsSection: {
    marginBottom: Spacing.lg,
  },
  strengthItem: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  strengthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  strengthContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  growthSection: {
    marginBottom: Spacing.lg,
  },
  growthItem: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  growthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  growthContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  communicationSection: {
    marginBottom: Spacing.lg,
  },
  communicationText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  frictionSection: {
    marginBottom: Spacing.lg,
  },
  frictionText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  partnerSection: {
    marginBottom: Spacing.lg,
  },
  partnerText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  growthPathSection: {
    marginBottom: Spacing.lg,
  },
  growthPathText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  kpisSection: {
    marginBottom: Spacing.lg,
  },
  kpiItem: {
    marginBottom: Spacing.sm,
  },
  kpiText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  lexiconSection: {
    marginBottom: Spacing.lg,
  },
  lexiconItem: {
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: 6,
  },
  lexiconTerm: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  lexiconDefinition: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.secondaryText,
  },
});
