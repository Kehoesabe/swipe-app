/**
 * Analytics Utility Functions
 * 
 * Handles tracking of user behavior and payment funnel analytics
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import { trackPaymentError, trackUserAction, trackPaymentStep } from './errorTracking';

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface ConversionFunnel {
  step1: number; // Results Viewed
  step2: number; // Unlock Clicked
  step3: number; // Checkout Started
  step4: number; // Purchase Completed
}

export interface ConversionRates {
  unlock_click_rate: number;
  checkout_reach_rate: number;
  payment_complete_rate: number;
  overall_conversion: number;
}

/**
 * Analytics tracking interface
 */
export interface AnalyticsProvider {
  track(event: string, properties: Record<string, any>): void;
  getFunnel(events: string[]): Promise<ConversionFunnel>;
}

/**
 * Mock analytics implementation for development
 */
class MockAnalytics implements AnalyticsProvider {
  private events: AnalyticsEvent[] = [];

  track(event: string, properties: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(analyticsEvent);
    
    // Track user actions for error tracking breadcrumbs
    if (event === 'Unlock Clicked' || event === 'Checkout Started' || event === 'Purchase Completed') {
      trackUserAction(event, properties);
    }
    
    // Track payment steps for error tracking
    if (event === 'Checkout Started') {
      trackPaymentStep('checkout_started', properties);
    } else if (event === 'Purchase Completed') {
      trackPaymentStep('purchase_completed', properties);
    }
    
    // Log to console in development
    console.log('📊 Analytics Event:', event, properties);
  }

  async getFunnel(events: string[]): Promise<ConversionFunnel> {
    const funnel: ConversionFunnel = {
      step1: 0,
      step2: 0,
      step3: 0,
      step4: 0,
    };

    this.events.forEach(event => {
      const index = events.indexOf(event.event);
      if (index >= 0 && index < 4) {
        funnel[`step${index + 1}` as keyof ConversionFunnel]++;
      }
    });

    return funnel;
  }

  // Helper method to get all events (for debugging)
  getAllEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Helper method to clear events (for testing)
  clearEvents(): void {
    this.events = [];
  }

  // Enhanced error tracking for payment failures
  trackPaymentError(error: Error, context: Record<string, any>): void {
    // Track the error event
    this.track('Payment Error', {
      error_type: error.message,
      error_name: error.name,
      ...context,
    });

    // Also track with error tracking service
    trackPaymentError(error, {
      typeNumber: context.typeNumber,
      assessmentId: context.assessmentId,
      userId: context.userId,
      paymentStatus: context.paymentStatus,
      step: context.step,
      sessionId: context.sessionId,
      amount: context.amount,
      currency: context.currency,
      timestamp: new Date().toISOString(),
    });
  }
}

// Create analytics instance
const analytics = new MockAnalytics();

/**
 * Track conversion funnel metrics
 */
export const trackConversionFunnel = async (): Promise<ConversionRates> => {
  const funnel = await analytics.getFunnel([
    'Results Viewed',
    'Unlock Clicked',
    'Checkout Started',
    'Purchase Completed',
  ]);

  return {
    unlock_click_rate: funnel.step1 > 0 ? funnel.step2 / funnel.step1 : 0,
    checkout_reach_rate: funnel.step2 > 0 ? funnel.step3 / funnel.step2 : 0,
    payment_complete_rate: funnel.step3 > 0 ? funnel.step4 / funnel.step3 : 0,
    overall_conversion: funnel.step1 > 0 ? funnel.step4 / funnel.step1 : 0,
  };
};

/**
 * Track payment health metrics
 */
export const trackPaymentHealth = async () => {
  const errorEvents = analytics.getAllEvents().filter(
    event => event.event === 'Payment Error'
  );

  const totalErrors = errorEvents.length;
  const errorTypes = errorEvents.reduce((acc, event) => {
    const errorType = event.properties.error_type;
    acc[errorType] = (acc[errorType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total_errors: totalErrors,
    error_types: errorTypes,
    error_rate: totalErrors / Math.max(analytics.getAllEvents().length, 1),
  };
};

/**
 * Track user engagement metrics
 */
export const trackUserEngagement = async () => {
  const events = analytics.getAllEvents();
  
  const resultsViewed = events.filter(e => e.event === 'Results Viewed').length;
  const premiumContentViewed = events.filter(e => e.event === 'Premium Content Viewed').length;
  const unlockClicks = events.filter(e => e.event === 'Unlock Clicked').length;

  return {
    results_viewed: resultsViewed,
    premium_content_viewed: premiumContentViewed,
    unlock_clicks: unlockClicks,
    engagement_rate: resultsViewed > 0 ? (premiumContentViewed + unlockClicks) / resultsViewed : 0,
  };
};

export default analytics;
