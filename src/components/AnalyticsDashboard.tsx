/**
 * Analytics Dashboard Component
 * 
 * Displays conversion funnel and payment health metrics
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';
import { trackConversionFunnel, trackPaymentHealth, trackUserEngagement } from '../utils/analytics';

interface ConversionRates {
  unlock_click_rate: number;
  checkout_reach_rate: number;
  payment_complete_rate: number;
  overall_conversion: number;
}

interface PaymentHealth {
  total_errors: number;
  error_types: Record<string, number>;
  error_rate: number;
}

interface UserEngagement {
  results_viewed: number;
  premium_content_viewed: number;
  unlock_clicks: number;
  engagement_rate: number;
}

export default function AnalyticsDashboard() {
  const [conversionRates, setConversionRates] = useState<ConversionRates | null>(null);
  const [paymentHealth, setPaymentHealth] = useState<PaymentHealth | null>(null);
  const [userEngagement, setUserEngagement] = useState<UserEngagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      const [conversion, health, engagement] = await Promise.all([
        trackConversionFunnel(),
        trackPaymentHealth(),
        trackUserEngagement(),
      ]);

      setConversionRates(conversion);
      setPaymentHealth(health);
      setUserEngagement(engagement);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const renderMetricCard = (title: string, value: string, subtitle?: string) => (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderErrorTypes = () => {
    if (!paymentHealth?.error_types || Object.keys(paymentHealth.error_types).length === 0) {
      return <Text style={styles.noDataText}>No errors recorded</Text>;
    }

    return Object.entries(paymentHealth.error_types).map(([errorType, count]) => (
      <View key={errorType} style={styles.errorTypeRow}>
        <Text style={styles.errorTypeName}>{errorType}</Text>
        <Text style={styles.errorTypeCount}>{count}</Text>
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Analytics Dashboard</Text>
      
      {/* Conversion Funnel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conversion Funnel</Text>
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Unlock Click Rate',
            formatPercentage(conversionRates?.unlock_click_rate || 0),
            'Users who click unlock'
          )}
          {renderMetricCard(
            'Checkout Reach Rate',
            formatPercentage(conversionRates?.checkout_reach_rate || 0),
            'Users who reach checkout'
          )}
          {renderMetricCard(
            'Payment Complete Rate',
            formatPercentage(conversionRates?.payment_complete_rate || 0),
            'Users who complete payment'
          )}
          {renderMetricCard(
            'Overall Conversion',
            formatPercentage(conversionRates?.overall_conversion || 0),
            'End-to-end conversion'
          )}
        </View>
      </View>

      {/* Payment Health */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Health</Text>
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Total Errors',
            paymentHealth?.total_errors.toString() || '0',
            'Payment-related errors'
          )}
          {renderMetricCard(
            'Error Rate',
            formatPercentage(paymentHealth?.error_rate || 0),
            'Errors per event'
          )}
        </View>
        
        <View style={styles.errorTypesContainer}>
          <Text style={styles.errorTypesTitle}>Error Types</Text>
          {renderErrorTypes()}
        </View>
      </View>

      {/* User Engagement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Engagement</Text>
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Results Viewed',
            userEngagement?.results_viewed.toString() || '0',
            'Total page views'
          )}
          {renderMetricCard(
            'Unlock Clicks',
            userEngagement?.unlock_clicks.toString() || '0',
            'Unlock button clicks'
          )}
          {renderMetricCard(
            'Premium Views',
            userEngagement?.premium_content_viewed.toString() || '0',
            'Premium content views'
          )}
          {renderMetricCard(
            'Engagement Rate',
            formatPercentage(userEngagement?.engagement_rate || 0),
            'User interaction rate'
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last updated: {new Date().toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '48%',
    marginBottom: Spacing.sm,
  },
  metricTitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: Spacing.xs,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  metricSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  errorTypesContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.md,
  },
  errorTypesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  errorTypeName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  errorTypeCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.error,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
});

