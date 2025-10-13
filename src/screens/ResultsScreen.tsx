/**
 * ResultsScreen
 * 
 * Displays the user's Swipe Type results with profile content
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking, AppState } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { SwipeTypeProfile } from '../types/profile';
import { getProfileByType } from '../data/mockProfiles';
import TypeHeader from '../components/TypeHeader';
import ProfileDisplay from '../components/ProfileDisplay';
import PaymentButton from '../components/PaymentButton';
import Screen from '../ui/Screen';
import Button from '../ui/Button';
import { Colors, Typography, Spacing } from '../theme';
import { 
  createCheckoutSession, 
  checkPremiumAccess, 
  handlePaymentSuccess,
  getPaymentStatusFromUrl,
  handlePaymentError,
  verifyPaymentWithPolling,
  ERROR_MESSAGES
} from '../api/payment';
import analytics from '../utils/analytics';

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;
type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  
  const [profile, setProfile] = useState<SwipeTypeProfile | null>(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'creating' | 'redirecting' | 'verifying' | 'complete' | 'error'
  >('idle');
  const [showManualVerification, setShowManualVerification] = useState(false);

  // Extract type information from route params
  const { typeNumber, typeName, directness, tangibility } = route.params || {};
  
  // Mock user and assessment IDs (in real app, these would come from auth/context)
  const userId = 'user_123'; // TODO: Get from auth context
  const assessmentId = 'assessment_456'; // TODO: Get from assessment session

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!typeNumber) {
          throw new Error('No type number provided');
        }
        
        const profileData = getProfileByType(typeNumber);
        if (!profileData) {
          throw new Error(`Profile not found for type ${typeNumber}`);
        }
        
        setProfile(profileData);
        
        // Track Results Viewed event
        analytics.track('Results Viewed', {
          type_number: typeNumber,
          type_name: profileData.typeName,
          assessment_id: assessmentId,
          has_premium: false, // Will be updated after premium check
          timestamp: new Date().toISOString(),
        });
        
        // Check premium access
        await checkPremiumAccessStatus();
        
        // Handle payment return
        handlePaymentReturn();
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [typeNumber]);

  // Handle app focus to check for payment return
  useFocusEffect(
    React.useCallback(() => {
      const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active' && isProcessingPayment) {
          console.log('🔄 App became active, checking payment status...');
          // Re-check premium access when returning from payment
          checkPremiumAccessStatus();
        }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);
      
      return () => subscription?.remove();
    }, [isProcessingPayment])
  );

  const checkPremiumAccessStatus = async () => {
    try {
      console.log('🔐 Checking premium access...');
      const accessData = await checkPremiumAccess(userId, assessmentId);
      setIsPremiumUnlocked(accessData.hasAccess);
      console.log('✅ Premium access status:', accessData.hasAccess);
    } catch (error) {
      console.error('❌ Error checking premium access:', error);
      // Don't set error state for premium access check failures
    }
  };

  const handlePaymentReturn = () => {
    // Check if user is returning from payment
    const paymentStatus = getPaymentStatusFromUrl();
    
    if (paymentStatus.status === 'success' && paymentStatus.paymentIntentId) {
      console.log('🎉 Payment successful, verifying...');
      processPaymentSuccess(paymentStatus.paymentIntentId);
    } else if (paymentStatus.status === 'cancelled') {
      console.log('❌ Payment cancelled');
      Alert.alert('Payment Cancelled', 'Your payment was cancelled. You can try again anytime.');
      setIsProcessingPayment(false);
    } else if (paymentStatus.status === 'error') {
      console.log('❌ Payment error:', paymentStatus.error);
      setPaymentError(paymentStatus.error || 'Payment failed');
      setIsProcessingPayment(false);
    }
  };

  const processPaymentSuccess = async (paymentIntentId: string) => {
    try {
      setPaymentStatus('verifying');
      setIsProcessingPayment(true);
      setPaymentError(null);
      
      const success = await handlePaymentSuccess(paymentIntentId, assessmentId, userId);
      
      if (success) {
        setPaymentStatus('complete');
        setIsPremiumUnlocked(true);
        Alert.alert(
          'Payment Successful!', 
          'Your premium profile has been unlocked. Enjoy your complete personality insights!'
        );
      } else {
        // Try polling verification as backup for webhook delays
        console.log('🔄 Primary verification failed, trying polling backup...');
        const pollingSuccess = await verifyPaymentWithPolling(userId, assessmentId);
        
        if (pollingSuccess) {
          setPaymentStatus('complete');
          setIsPremiumUnlocked(true);
          Alert.alert(
            'Payment Successful!', 
            'Your premium profile has been unlocked. Enjoy your complete personality insights!'
          );
        } else {
          setPaymentStatus('error');
          setShowManualVerification(true);
          setPaymentError('Payment verification is taking longer than expected. Please wait a moment and refresh, or contact support if the issue persists.');
        }
      }
    } catch (error) {
      console.error('❌ Error handling payment success:', error);
      setPaymentStatus('error');
      setPaymentError('Failed to unlock premium content. Please contact support.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleUnlockClick = async () => {
    try {
      // Track Unlock Clicked event
      analytics.track('Unlock Clicked', {
        type_number: typeNumber,
        source: 'results_page',
        timestamp: new Date().toISOString(),
      });
      
      setPaymentStatus('creating');
      setIsProcessingPayment(true);
      setPaymentError(null);
      setShowManualVerification(false);
      
      console.log('💳 Starting payment flow...');
      
      // Create checkout session
      const session = await createCheckoutSession({
        assessmentId,
        userId,
        typeNumber: typeNumber || 1,
      });
      
      if (session && session.url) {
        console.log('✅ Checkout session created, redirecting to Stripe...');
        
        // Track Checkout Started event
        analytics.track('Checkout Started', {
          type_number: typeNumber,
          session_id: session.sessionId,
          amount: 1200,
          currency: 'usd',
          timestamp: new Date().toISOString(),
        });
        
        setPaymentStatus('redirecting');
        
        // Open Stripe checkout in browser
        const canOpen = await Linking.canOpenURL(session.url);
        if (canOpen) {
          await Linking.openURL(session.url);
          console.log('🔗 Opened Stripe checkout');
        } else {
          throw new Error('Cannot open payment URL');
        }
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      const userMessage = handlePaymentError(err);
      
              // Track Payment Error event with enhanced error tracking
              analytics.trackPaymentError(err, {
                typeNumber: typeNumber,
                assessmentId: assessmentId,
                userId: userId,
                paymentStatus: paymentStatus,
                step: paymentStatus,
                timestamp: new Date().toISOString(),
              });
      
      console.error('❌ Payment error:', error);
      setPaymentError(userMessage);
      setPaymentStatus('error');
      setIsProcessingPayment(false);
    }
  };

  const handleRetakeAssessment = () => {
    Alert.alert(
      'Retake Assessment',
      'Are you sure you want to retake the assessment? Your current results will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retake', onPress: () => {
          navigation.navigate('Assessment');
        }}
      ]
    );
  };

  const handleShareResults = () => {
    // TODO: Implement sharing functionality
    Alert.alert('Share Results', 'Sharing functionality will be implemented in a future update');
  };

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your results...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !profile) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Results</Text>
          <Text style={styles.errorText}>
            {error || 'No profile data available'}
          </Text>
          <Button 
            title="Retake Assessment" 
            onPress={() => navigation.navigate('Assessment')}
            style={styles.errorButton}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TypeHeader
        typeNumber={profile.typeNumber}
        typeName={profile.typeName}
        directness={profile.directness}
        tangibility={profile.tangibility}
      />
      
      {/* Payment Status Indicators */}
      {paymentStatus === 'creating' && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Creating secure checkout...</Text>
      </View>
      )}
      
      {paymentStatus === 'redirecting' && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Redirecting to payment...</Text>
        </View>
      )}
      
      {paymentStatus === 'verifying' && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Verifying payment...</Text>
      </View>
      )}
      
      {showManualVerification && (
        <View style={styles.manualVerificationContainer}>
          <Text style={styles.manualVerificationText}>
            Payment verification is taking longer than expected. 
            Please wait a moment and refresh, or contact support if the issue persists.
          </Text>
          <Button 
            title="Refresh Status" 
            onPress={() => checkPremiumAccessStatus()}
            style={styles.refreshButton}
          />
        </View>
      )}
      
        <ProfileDisplay
          profile={profile}
          isPremiumUnlocked={isPremiumUnlocked}
          onUnlockClick={handleUnlockClick}
          isProcessingPayment={isProcessingPayment}
          paymentError={paymentError}
        />
      
      <View style={styles.actionButtons}>
          <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleRetakeAssessment}
          >
          <Text style={styles.actionButtonText}>Retake Assessment</Text>
          </TouchableOpacity>
          
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleShareResults}
        >
          <Text style={styles.actionButtonText}>Share Results</Text>
        </TouchableOpacity>
      </View>

      {/* Hidden Admin Access Button - Remove in production */}
      <TouchableOpacity
        style={styles.adminButton}
        onPress={() => navigation.navigate('AdminDashboard')}
      >
        <Text style={styles.adminButtonText}>🔧 Admin</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  errorButton: {
    marginTop: Spacing.md,
  },
  statusContainer: {
    backgroundColor: Colors.primary + '20',
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  statusText: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  manualVerificationContainer: {
    backgroundColor: Colors.warning + '20',
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  manualVerificationText: {
    fontSize: 14,
    color: Colors.warning,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  refreshButton: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  adminButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.8,
  },
  adminButtonText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },
});