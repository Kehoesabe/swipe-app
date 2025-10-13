/**
 * Admin API Tests
 * 
 * Tests for admin functionality including purchases, refunds, and access management.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import {
  getAdminPurchases,
  getAdminPurchaseDetail,
  issueRefund,
  grantPremiumAccess,
  revokePremiumAccess,
  getAdminStats,
  searchPurchases,
  exportPurchases,
  AdminPurchase,
  AdminPurchaseDetail,
  RefundRequest,
  GrantAccessRequest,
} from '../../src/api/admin';

// Mock fetch globally
global.fetch = jest.fn();

describe('Admin API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getAdminPurchases', () => {
    const mockPurchases: AdminPurchase[] = [
      {
        id: 'purchase_1',
        user_id: 'user_123',
        assessment_id: 'assessment_456',
        stripe_payment_intent_id: 'pi_test_123',
        amount: 1200,
        currency: 'usd',
        status: 'succeeded',
        customer_email: 'test@example.com',
        customer_name: 'Test User',
        metadata: {
          type_number: 1,
          type_name: 'Direct Nurturer',
        },
        created_at: '2025-01-10T10:00:00Z',
        updated_at: '2025-01-10T10:00:00Z',
        paid_at: '2025-01-10T10:00:00Z',
      },
      {
        id: 'purchase_2',
        user_id: 'user_456',
        assessment_id: 'assessment_789',
        stripe_payment_intent_id: 'pi_test_456',
        amount: 1200,
        currency: 'usd',
        status: 'pending',
        customer_email: 'pending@example.com',
        metadata: {
          type_number: 2,
          type_name: 'Steady Helper',
        },
        created_at: '2025-01-10T11:00:00Z',
        updated_at: '2025-01-10T11:00:00Z',
      },
    ];

    test('fetches purchases successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          purchases: mockPurchases,
          total: 2,
          has_more: false,
        }),
      });

      const result = await getAdminPurchases();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/purchases'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-admin-token',
          }),
        })
      );

      expect(result.purchases).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.has_more).toBe(false);
    });

    test('fetches purchases with filters', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          purchases: [mockPurchases[0]],
          total: 1,
          has_more: false,
        }),
      });

      await getAdminPurchases({
        status: 'succeeded',
        limit: 25,
        user_id: 'user_123',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('status=succeeded&limit=25&user_id=user_123'),
        expect.any(Object)
      );
    });

    test('handles API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(getAdminPurchases()).rejects.toThrow('Failed to fetch purchases');
    });
  });

  describe('getAdminPurchaseDetail', () => {
    const mockPurchaseDetail: AdminPurchaseDetail = {
      id: 'purchase_1',
      user_id: 'user_123',
      assessment_id: 'assessment_456',
      stripe_payment_intent_id: 'pi_test_123',
      amount: 1200,
      currency: 'usd',
      status: 'succeeded',
      customer_email: 'test@example.com',
      customer_name: 'Test User',
      metadata: {
        type_number: 1,
        type_name: 'Direct Nurturer',
      },
      created_at: '2025-01-10T10:00:00Z',
      updated_at: '2025-01-10T10:00:00Z',
      paid_at: '2025-01-10T10:00:00Z',
      premium_access: {
        id: 'access_1',
        granted_at: '2025-01-10T10:00:00Z',
        reason: 'purchase',
      },
      user_info: {
        email: 'test@example.com',
        name: 'Test User',
        created_at: '2025-01-01T00:00:00Z',
      },
      assessment_info: {
        swipe_type: 'directNurturer',
        swipe_type_name: 'Direct Nurturer',
        completed_at: '2025-01-10T09:00:00Z',
      },
    };

    test('fetches purchase detail successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPurchaseDetail,
      });

      const result = await getAdminPurchaseDetail('purchase_1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/purchase/purchase_1'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-admin-token',
          }),
        })
      );

      expect(result.id).toBe('purchase_1');
      expect(result.premium_access).toBeDefined();
      expect(result.user_info).toBeDefined();
      expect(result.assessment_info).toBeDefined();
    });

    test('handles purchase not found', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Purchase not found' }),
      });

      await expect(getAdminPurchaseDetail('invalid_id')).rejects.toThrow('Failed to fetch purchase detail');
    });
  });

  describe('issueRefund', () => {
    test('issues refund successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          refund_id: 're_123',
          amount: 1200,
          status: 'succeeded',
          created_at: '2025-01-10T12:00:00Z',
        }),
      });

      const result = await issueRefund('purchase_1', 'Admin refund');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/refund'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            purchaseId: 'purchase_1',
            reason: 'Admin refund',
          }),
        })
      );

      expect(result.refund_id).toBe('re_123');
      expect(result.amount).toBe(1200);
      expect(result.status).toBe('succeeded');
    });

    test('issues refund with different reason', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          refund_id: 're_456',
          amount: 1200,
          status: 'succeeded',
          created_at: '2025-01-10T12:00:00Z',
        }),
      });

      const result = await issueRefund('purchase_1', 'Customer request');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/refund'),
        expect.objectContaining({
          body: JSON.stringify({
            purchaseId: 'purchase_1',
            reason: 'Customer request',
          }),
        })
      );

      expect(result.refund_id).toBe('re_456');
    });

    test('handles refund errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Refund failed' }),
      });

      await expect(issueRefund('purchase_1', 'Test refund')).rejects.toThrow('Refund failed');
    });
  });

  describe('grantPremiumAccess', () => {
    test('grants premium access successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_id: 'access_123',
          granted_at: '2025-01-10T12:00:00Z',
          reason: 'Admin manual grant',
        }),
      });

      const result = await grantPremiumAccess({
        userId: 'user_123',
        assessmentId: 'assessment_456',
        reason: 'Admin manual grant',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/grant-access'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userId: 'user_123',
            assessmentId: 'assessment_456',
            reason: 'Admin manual grant',
          }),
        })
      );

      expect(result.access_id).toBe('access_123');
      expect(result.reason).toBe('Admin manual grant');
    });

    test('grants access with expiration', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_id: 'access_456',
          granted_at: '2025-01-10T12:00:00Z',
          expires_at: '2025-02-10T12:00:00Z',
          reason: 'Temporary access',
        }),
      });

      const result = await grantPremiumAccess({
        userId: 'user_123',
        assessmentId: 'assessment_456',
        reason: 'Temporary access',
        expiresAt: '2025-02-10T12:00:00Z',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/grant-access'),
        expect.objectContaining({
          body: JSON.stringify({
            userId: 'user_123',
            assessmentId: 'assessment_456',
            reason: 'Temporary access',
            expiresAt: '2025-02-10T12:00:00Z',
          }),
        })
      );

      expect(result.expires_at).toBe('2025-02-10T12:00:00Z');
    });
  });

  describe('revokePremiumAccess', () => {
    test('revokes premium access successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Premium access revoked successfully',
        }),
      });

      const result = await revokePremiumAccess(
        'user_123',
        'assessment_456',
        'Admin revocation'
      );

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/revoke-access'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            user_id: 'user_123',
            assessment_id: 'assessment_456',
            reason: 'Admin revocation',
          }),
        })
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Premium access revoked successfully');
    });
  });

  describe('getAdminStats', () => {
    test('fetches admin statistics', async () => {
      const mockStats = {
        total_purchases: 100,
        total_revenue: 12000,
        successful_purchases: 85,
        failed_purchases: 10,
        pending_purchases: 5,
        refunded_purchases: 3,
        recent_purchases: 12,
        conversion_rate: 0.85,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      });

      const result = await getAdminStats();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/stats'),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result.total_purchases).toBe(100);
      expect(result.total_revenue).toBe(12000);
      expect(result.conversion_rate).toBe(0.85);
    });
  });

  describe('searchPurchases', () => {
    test('searches purchases successfully', async () => {
      const mockSearchResults = [
        {
          id: 'purchase_1',
          user_id: 'user_123',
          customer_email: 'test@example.com',
          status: 'succeeded',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ purchases: mockSearchResults }),
      });

      const result = await searchPurchases('test@example.com');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/search'),
        expect.objectContaining({
          method: 'GET',
          body: JSON.stringify({ query: 'test@example.com' }),
        })
      );

      expect(result).toHaveLength(1);
      expect(result[0].customer_email).toBe('test@example.com');
    });
  });

  describe('exportPurchases', () => {
    test('exports purchases successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          download_url: 'https://example.com/export.csv',
          expires_at: '2025-01-11T12:00:00Z',
        }),
      });

      const result = await exportPurchases({
        start_date: '2025-01-01',
        end_date: '2025-01-10',
        format: 'csv',
        status: 'succeeded',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/export'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            start_date: '2025-01-01',
            end_date: '2025-01-10',
            format: 'csv',
            status: 'succeeded',
          }),
        })
      );

      expect(result.download_url).toBe('https://example.com/export.csv');
      expect(result.expires_at).toBe('2025-01-11T12:00:00Z');
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getAdminPurchases()).rejects.toThrow('Network error');
    });

    test('handles malformed responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      await expect(getAdminPurchases()).rejects.toThrow();
    });
  });
});
