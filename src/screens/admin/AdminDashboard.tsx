/**
 * Admin Dashboard Screen
 * 
 * Main admin interface with quick stats and navigation to admin functions.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { getAdminStats } from '../../api/admin';
import { Colors, Typography, Spacing } from '../../theme';

type AdminDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'AdminDashboard'>;

interface AdminStats {
  total_purchases: number;
  total_revenue: number;
  successful_purchases: number;
  failed_purchases: number;
  pending_purchases: number;
  refunded_purchases: number;
  recent_purchases: number;
  conversion_rate: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color = Colors.primary }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
);

interface QuickActionProps {
  title: string;
  description: string;
  onPress: () => void;
  color?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, onPress, color = Colors.primary }) => (
  <TouchableOpacity style={[styles.actionCard, { borderLeftColor: color }]} onPress={onPress}>
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionDescription}>{description}</Text>
  </TouchableOpacity>
);

const AdminDashboard: React.FC = () => {
  const navigation = useNavigation<AdminDashboardNavigationProp>();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading admin stats:', error);
      Alert.alert('Error', 'Failed to load admin statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading admin dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={loadStats} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {stats && (
        <>
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Purchases"
                value={stats.total_purchases}
                color={Colors.primary}
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.total_revenue)}
                color={Colors.success}
              />
              <StatCard
                title="Success Rate"
                value={formatPercentage(stats.conversion_rate)}
                subtitle={`${stats.successful_purchases} successful`}
                color={Colors.success}
              />
              <StatCard
                title="Recent Purchases"
                value={stats.recent_purchases}
                subtitle="Last 24 hours"
                color={Colors.warning}
              />
            </View>
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Purchase Status</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Successful"
                value={stats.successful_purchases}
                color={Colors.success}
              />
              <StatCard
                title="Failed"
                value={stats.failed_purchases}
                color={Colors.error}
              />
              <StatCard
                title="Pending"
                value={stats.pending_purchases}
                color={Colors.warning}
              />
              <StatCard
                title="Refunded"
                value={stats.refunded_purchases}
                color={Colors.secondaryText}
              />
            </View>
          </View>
        </>
      )}

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickAction
            title="View Purchases"
            description="Browse and manage all purchases"
            onPress={() => navigation.navigate('AdminPurchases')}
            color={Colors.primary}
          />
          <QuickAction
            title="Search Purchases"
            description="Find specific purchases by email or ID"
            onPress={() => Alert.alert('Search', 'Search functionality coming soon!')}
            color={Colors.secondary}
          />
          <QuickAction
            title="Export Data"
            description="Export purchase data for reporting"
            onPress={() => Alert.alert('Export', 'Export functionality coming soon!')}
            color={Colors.success}
          />
          <QuickAction
            title="System Health"
            description="Check payment system status"
            onPress={() => Alert.alert('System Health', 'System health check coming soon!')}
            color={Colors.warning}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Admin Dashboard • Last updated: {new Date().toLocaleTimeString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.h1.fontSize,
    fontWeight: 'bold',
    color: Colors.text,
  },
  refreshButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  refreshText: {
    color: Colors.white,
    fontSize: Typography.caption.fontSize,
    fontWeight: '500',
  },
  statsSection: {
    margin: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.md,
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
  },
  statTitle: {
    fontSize: Typography.caption.fontSize,
    color: Colors.secondaryText,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  statValue: {
    fontSize: Typography.h1.fontSize,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  actionsSection: {
    margin: Spacing.lg,
  },
  actionsGrid: {
    gap: Spacing.md,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.lg,
    borderLeftWidth: 4,
  },
  actionTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    fontSize: Typography.caption.fontSize,
    color: Colors.secondaryText,
  },
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
});

export default AdminDashboard;
