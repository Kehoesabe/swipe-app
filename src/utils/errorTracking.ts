/**
 * Error Tracking Utility
 * 
 * Provides error tracking capabilities for payment failures and other critical errors.
 * In production, this would integrate with services like Sentry, Bugsnag, or similar.
 */

interface ErrorContext {
  typeNumber?: number;
  assessmentId?: string;
  userId?: string;
  paymentStatus?: string;
  step?: string;
  sessionId?: string;
  amount?: number;
  currency?: string;
  timestamp?: string;
}

interface ErrorTracker {
  captureException: (error: Error, context: any) => void;
  captureMessage: (message: string, context: any) => void;
  setUser: (user: { id: string; email?: string }) => void;
  addBreadcrumb: (breadcrumb: { message: string; category: string; level: string }) => void;
}

// Mock error tracker for development/testing
class MockErrorTracker implements ErrorTracker {
  private breadcrumbs: Array<{ message: string; category: string; level: string; timestamp: string }> = [];
  private user: { id: string; email?: string } | null = null;

  captureException(error: Error, context: any) {
    console.error('🚨 Error Tracked:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      user: this.user,
      breadcrumbs: this.breadcrumbs,
      timestamp: new Date().toISOString(),
    });
  }

  captureMessage(message: string, context: any) {
    console.warn('📝 Message Tracked:', {
      message,
      context,
      user: this.user,
      breadcrumbs: this.breadcrumbs,
      timestamp: new Date().toISOString(),
    });
  }

  setUser(user: { id: string; email?: string }) {
    this.user = user;
    console.log('👤 User Set:', user);
  }

  addBreadcrumb(breadcrumb: { message: string; category: string; level: string }) {
    this.breadcrumbs.push({
      ...breadcrumb,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 50 breadcrumbs
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs = this.breadcrumbs.slice(-50);
    }
  }

  getBreadcrumbs() {
    return [...this.breadcrumbs];
  }

  clearBreadcrumbs() {
    this.breadcrumbs = [];
  }
}

// Create error tracker instance
const errorTracker: ErrorTracker = new MockErrorTracker();

/**
 * Track payment-related errors
 */
export const trackPaymentError = (error: Error, context: ErrorContext) => {
  errorTracker.captureException(error, {
    tags: {
      type: 'payment_error',
      payment_status: context.paymentStatus || 'unknown',
      step: context.step || 'unknown',
    },
    extra: {
      type_number: context.typeNumber,
      assessment_id: context.assessmentId,
      user_id: context.userId,
      session_id: context.sessionId,
      amount: context.amount,
      currency: context.currency,
      timestamp: context.timestamp || new Date().toISOString(),
    },
  });
};

/**
 * Track general application errors
 */
export const trackAppError = (error: Error, context: ErrorContext) => {
  errorTracker.captureException(error, {
    tags: {
      type: 'app_error',
    },
    extra: {
      type_number: context.typeNumber,
      assessment_id: context.assessmentId,
      user_id: context.userId,
      timestamp: context.timestamp || new Date().toISOString(),
    },
  });
};

/**
 * Track user actions as breadcrumbs
 */
export const trackUserAction = (action: string, context: ErrorContext) => {
  errorTracker.addBreadcrumb({
    message: action,
    category: 'user_action',
    level: 'info',
  });
};

/**
 * Track payment flow steps
 */
export const trackPaymentStep = (step: string, context: ErrorContext) => {
  errorTracker.addBreadcrumb({
    message: `Payment step: ${step}`,
    category: 'payment_flow',
    level: 'info',
  });
};

/**
 * Set user context for error tracking
 */
export const setErrorTrackingUser = (userId: string, email?: string) => {
  errorTracker.setUser({ id: userId, email });
};

/**
 * Track critical payment failures
 */
export const trackCriticalPaymentFailure = (error: Error, context: ErrorContext) => {
  errorTracker.captureException(error, {
    tags: {
      type: 'critical_payment_failure',
      payment_status: context.paymentStatus || 'unknown',
      step: context.step || 'unknown',
    },
    extra: {
      type_number: context.typeNumber,
      assessment_id: context.assessmentId,
      user_id: context.userId,
      session_id: context.sessionId,
      amount: context.amount,
      currency: context.currency,
      timestamp: context.timestamp || new Date().toISOString(),
    },
  });
};

/**
 * Track webhook processing errors
 */
export const trackWebhookError = (error: Error, context: ErrorContext) => {
  errorTracker.captureException(error, {
    tags: {
      type: 'webhook_error',
      payment_status: context.paymentStatus || 'unknown',
    },
    extra: {
      type_number: context.typeNumber,
      assessment_id: context.assessmentId,
      user_id: context.userId,
      session_id: context.sessionId,
      timestamp: context.timestamp || new Date().toISOString(),
    },
  });
};

/**
 * Get error tracking instance for testing
 */
export const getErrorTracker = () => errorTracker;

export default errorTracker;
