/**
 * Admin API Functions
 * 
 * Provides admin functionality for managing purchases, refunds, and premium access.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

export interface AdminPurchase {
  id: string;
  user_id: string;
  assessment_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
  customer_email?: string;
  customer_name?: string;
  metadata?: {
    type_number?: number;
    type_name?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
  paid_at?: string;
  refunded_at?: string;
  receipt_url?: string;
}

export interface AdminPurchaseDetail extends AdminPurchase {
  premium_access?: {
    id: string;
    granted_at: string;
    expires_at?: string;
    reason: string;
  };
  user_info?: {
    email: string;
    name?: string;
    created_at: string;
  };
  assessment_info?: {
    swipe_type: string;
    swipe_type_name: string;
    completed_at: string;
  };
}

export interface AdminPurchasesResponse {
  purchases: AdminPurchase[];
  total: number;
  has_more: boolean;
  next_cursor?: string;
}

export interface RefundRequest {
  purchase_id: string;
  reason: string;
  amount?: number; // Optional partial refund amount
}

export interface RefundResponse {
  refund_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface GrantAccessRequest {
  user_id: string;
  assessment_id: string;
  reason: string;
  expires_at?: string; // Optional expiration date
}

export interface GrantAccessResponse {
  access_id: string;
  granted_at: string;
  expires_at?: string;
  reason: string;
}

// Mock auth token for development
const getAuthToken = () => 'mock-admin-token';
const getBaseUrl = () => process.env.EXPO_PUBLIC_APP_BASE_URL || 'http://localhost:8081';

/**
 * Get list of purchases for admin dashboard
 */
export async function getAdminPurchases(params: {
  status?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<AdminPurchasesResponse> {
  try {
    console.log('🔍 Fetching admin purchases:', params);
    
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${getBaseUrl()}/api/admin/purchases?${query}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch purchases');
    }

    const data = await response.json();
    console.log('✅ Admin purchases fetched:', data.purchases?.length || 0, 'purchases');
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin purchases:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific purchase
 */
export async function getAdminPurchaseDetail(id: string): Promise<AdminPurchaseDetail> {
  try {
    console.log('🔍 Fetching purchase detail:', id);
    
    const response = await fetch(`${getBaseUrl()}/api/admin/purchase/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch purchase detail');
    }

    const data = await response.json();
    console.log('✅ Purchase detail fetched:', data.id);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching purchase detail:', error);
    throw error;
  }
}

/**
 * Issue a refund for a purchase
 */
export async function issueRefund(purchaseId: string, reason: string): Promise<RefundResponse> {
  try {
    console.log('💰 Issuing refund:', { purchaseId, reason });
    
    const response = await fetch(`${getBaseUrl()}/api/admin/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ purchaseId, reason }),
    });

    if (!response.ok) {
      throw new Error('Refund failed');
    }

    const data = await response.json();
    console.log('✅ Refund issued:', data.refund_id);
    
    return data;
  } catch (error) {
    console.error('❌ Error issuing refund:', error);
    throw error;
  }
}

/**
 * Manually grant premium access to a user
 */
export async function grantPremiumAccess(params: {
  userId: string;
  assessmentId: string;
  reason: string;
  expiresAt?: string;
}): Promise<GrantAccessResponse> {
  try {
    console.log('🔓 Granting premium access:', params);
    
    const response = await fetch(`${getBaseUrl()}/api/admin/grant-access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to grant premium access');
    }

    const data = await response.json();
    console.log('✅ Premium access granted:', data.access_id);
    
    return data;
  } catch (error) {
    console.error('❌ Error granting premium access:', error);
    throw error;
  }
}

/**
 * Revoke premium access for a user
 */
export async function revokePremiumAccess(
  userId: string,
  assessmentId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔒 Revoking premium access:', { userId, assessmentId, reason });
    
    const response = await fetch(`${getBaseUrl()}/api/admin/revoke-access`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        assessment_id: assessmentId,
        reason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to revoke premium access');
    }

    const data = await response.json();
    console.log('✅ Premium access revoked:', data.message);
    
    return data;
  } catch (error) {
    console.error('❌ Error revoking premium access:', error);
    throw error;
  }
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<{
  total_purchases: number;
  total_revenue: number;
  successful_purchases: number;
  failed_purchases: number;
  pending_purchases: number;
  refunded_purchases: number;
  recent_purchases: number; // Last 24 hours
  conversion_rate: number;
}> {
  try {
    console.log('📊 Fetching admin stats');
    
    const response = await fetch(`${getBaseUrl()}/api/admin/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch admin stats');
    }

    const data = await response.json();
    console.log('✅ Admin stats fetched');
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    throw error;
  }
}

/**
 * Search purchases by email, user ID, or payment intent ID
 */
export async function searchPurchases(query: string): Promise<AdminPurchase[]> {
  try {
    console.log('🔍 Searching purchases:', query);
    
    const response = await fetch(`${getBaseUrl()}/api/admin/search`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to search purchases');
    }

    const data = await response.json();
    console.log('✅ Search results:', data.purchases?.length || 0, 'purchases');
    
    return data.purchases || [];
  } catch (error) {
    console.error('❌ Error searching purchases:', error);
    throw error;
  }
}

/**
 * Export purchases data for reporting
 */
export async function exportPurchases(params: {
  start_date: string;
  end_date: string;
  format: 'csv' | 'json';
  status?: string;
}): Promise<{ download_url: string; expires_at: string }> {
  try {
    console.log('📤 Exporting purchases:', params);
    
    const response = await fetch(`${getBaseUrl()}/api/admin/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to export purchases');
    }

    const data = await response.json();
    console.log('✅ Export created:', data.download_url);
    
    return data;
  } catch (error) {
    console.error('❌ Error exporting purchases:', error);
    throw error;
  }
}
