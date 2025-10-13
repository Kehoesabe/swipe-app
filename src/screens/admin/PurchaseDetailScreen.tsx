/**
 * Admin Purchase Detail Screen
 * 
 * Displays detailed information about a specific purchase with admin actions.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { 
  getAdminPurchaseDetail, 
  issueRefund, 
  grantPremiumAccess,
  AdminPurchaseDetail 
} from '../../api/admin';
import { Colors, Typography, Spacing } from '../../theme';
import Button from '../../ui/Button';

type PurchaseDetailScreenRouteProp = RouteProp<RootStackParamList, 'AdminPurchaseDetail'>;
type PurchaseDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminPurchaseDetail'>;

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return Colors.success;
      case 'pending': return Colors.warning;
      case 'failed': return Colors.error;
      case 'cancelled': return Colors.secondaryText;
      case 'refunded': return Colors.secondaryText;
      default: return Colors.secondaryText;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor(status) }]}>
      <Text style={styles.badgeText}>{status.toUpperCase()}</Text>
    </View>
  );
};

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  copyable?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, copyable = false }) => {
  const handleCopy = () => {
    if (typeof value === 'string') {
      // TODO: Implement clipboard functionality
      Alert.alert('Copied', `${label}: ${value}`);
    }
  };

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <TouchableOpacity 
        style={styles.infoValue}
        onPress={copyable ? handleCopy : undefined}
        disabled={!copyable}
      >
        <Text style={[styles.infoValueText, copyable && styles.copyableText]}>
          {value}
        </Text>
        {copyable && (
          <Text style={styles.copyHint}>Tap to copy</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const PurchaseDetailScreen: React.FC = () => {
  const route = useRoute<PurchaseDetailScreenRouteProp>();
  const navigation = useNavigation<PurchaseDetailScreenNavigationProp>();
  const { purchaseId } = route.params;

  const [purchase, setPurchase] = useState<AdminPurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPurchaseDetail();
  }, [purchaseId]);

  const loadPurchaseDetail = async () => {
    try {
      setLoading(true);
      const data = await getAdminPurchaseDetail(purchaseId);
      setPurchase(data);
    } catch (error) {
      console.error('Error loading purchase detail:', error);
      Alert.alert('Error', 'Failed to load purchase details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!purchase) return;

    Alert.alert(
      'Issue Refund',
      `Are you sure you want to issue a full refund of $${(purchase.amount / 100).toFixed(2)}? This will revoke premium access.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Issue Refund', 
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await issueRefund(purchase.id, 'Admin refund');
              Alert.alert('Success', 'Refund issued successfully');
              loadPurchaseDetail(); // Reload to get updated status
            } catch (error) {
              console.error('Error issuing refund:', error);
              Alert.alert('Error', `Refund failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleGrantAccess = async () => {
    if (!purchase) return;

    Alert.alert(
      'Grant Premium Access',
      'Manually grant premium access to this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Grant Access', 
          onPress: async () => {
            try {
              setActionLoading(true);
              await grantPremiumAccess({
                userId: purchase.user_id,
                assessmentId: purchase.assessment_id,
                reason: 'Admin manual grant',
              });
              Alert.alert('Success', 'Premium access granted successfully');
              loadPurchaseDetail(); // Reload to get updated access info
            } catch (error) {
              console.error('Error granting access:', error);
              Alert.alert('Error', `Failed to grant access: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const openStripe = async (paymentIntentId: string) => {
    const stripeUrl = `https://dashboard.stripe.com/payments/${paymentIntentId}`;
    const canOpen = await Linking.canOpenURL(stripeUrl);
    
    if (canOpen) {
      await Linking.openURL(stripeUrl);
    } else {
      Alert.alert('Error', 'Cannot open Stripe dashboard');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading purchase details...</Text>
      </View>
    );
  }

  if (!purchase) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Purchase not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Purchase Details</Text>
        <TouchableOpacity onPress={loadPurchaseDetail} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <Section title="Customer Information">
        <InfoRow 
          label="Email" 
          value={purchase.customer_email || 'No email provided'} 
        />
        <InfoRow 
          label="User ID" 
          value={purchase.user_id} 
          copyable 
        />
        {purchase.customer_name && (
          <InfoRow 
            label="Name" 
            value={purchase.customer_name} 
          />
        )}
        {purchase.user_info && (
          <InfoRow 
            label="Account Created" 
            value={formatDateTime(purchase.user_info.created_at)} 
          />
        )}
      </Section>

      <Section title="Payment Information">
        <InfoRow 
          label="Amount" 
          value={formatAmount(purchase.amount)} 
        />
        <InfoRow 
          label="Status" 
          value={<StatusBadge status={purchase.status} />} 
        />
        <InfoRow 
          label="Currency" 
          value={purchase.currency.toUpperCase()} 
        />
        <InfoRow 
          label="Payment Intent ID" 
          value={purchase.stripe_payment_intent_id} 
          copyable 
        />
        <InfoRow 
          label="Created" 
          value={formatDateTime(purchase.created_at)} 
        />
        {purchase.paid_at && (
          <InfoRow 
            label="Paid At" 
            value={formatDateTime(purchase.paid_at)} 
          />
        )}
        {purchase.refunded_at && (
          <InfoRow 
            label="Refunded At" 
            value={formatDateTime(purchase.refunded_at)} 
          />
        )}
        {purchase.receipt_url && (
          <TouchableOpacity 
            style={styles.receiptButton}
            onPress={() => Linking.openURL(purchase.receipt_url!)}
          >
            <Text style={styles.receiptButtonText}>View Receipt</Text>
          </TouchableOpacity>
        )}
      </Section>

      <Section title="Assessment Information">
        <InfoRow 
          label="Assessment ID" 
          value={purchase.assessment_id} 
          copyable 
        />
        <InfoRow 
          label="Type Number" 
          value={purchase.metadata?.type_number?.toString() || 'Unknown'} 
        />
        <InfoRow 
          label="Type Name" 
          value={purchase.metadata?.type_name || 'Unknown'} 
        />
        {purchase.assessment_info && (
          <InfoRow 
            label="Swipe Type" 
            value={purchase.assessment_info.swipe_type_name} 
          />
        )}
      </Section>

      {purchase.premium_access && (
        <Section title="Premium Access">
          <InfoRow 
            label="Access ID" 
            value={purchase.premium_access.id} 
            copyable 
          />
          <InfoRow 
            label="Granted At" 
            value={formatDateTime(purchase.premium_access.granted_at)} 
          />
          <InfoRow 
            label="Reason" 
            value={purchase.premium_access.reason} 
          />
          {purchase.premium_access.expires_at && (
            <InfoRow 
              label="Expires At" 
              value={formatDateTime(purchase.premium_access.expires_at)} 
            />
          )}
        </Section>
      )}

      <Section title="Admin Actions">
        <View style={styles.actionsContainer}>
          {purchase.status === 'succeeded' && !purchase.refunded_at && (
            <Button
              title="Issue Refund"
              onPress={handleRefund}
              loading={actionLoading}
              style={[styles.actionButton, styles.refundButton]}
              textStyle={styles.refundButtonText}
            />
          )}
          
          <Button
            title="View in Stripe"
            onPress={() => openStripe(purchase.stripe_payment_intent_id)}
            style={[styles.actionButton, styles.stripeButton]}
            textStyle={styles.stripeButtonText}
          />
          
          {!purchase.premium_access && (
            <Button
              title="Grant Premium Access"
              onPress={handleGrantAccess}
              loading={actionLoading}
              style={[styles.actionButton, styles.grantButton]}
              textStyle={styles.grantButtonText}
            />
          )}
        </View>
      </Section>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.h2.fontSize,
    color: Colors.error,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: Colors.primary,
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
  section: {
    margin: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoRow: {
    marginBottom: Spacing.md,
  },
  infoLabel: {
    fontSize: Typography.caption.fontSize,
    color: Colors.secondaryText,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  infoValue: {
    minHeight: 24,
  },
  infoValueText: {
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },
  copyableText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  copyHint: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: Spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  receiptButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  receiptButtonText: {
    color: Colors.white,
    fontSize: Typography.caption.fontSize,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: 6,
  },
  refundButton: {
    backgroundColor: Colors.error,
  },
  refundButtonText: {
    color: Colors.white,
    fontWeight: '500',
  },
  stripeButton: {
    backgroundColor: Colors.secondaryText,
  },
  stripeButtonText: {
    color: Colors.white,
    fontWeight: '500',
  },
  grantButton: {
    backgroundColor: Colors.success,
  },
  grantButtonText: {
    color: Colors.white,
    fontWeight: '500',
  },
});

export default PurchaseDetailScreen;
