/**
 * Admin API Tests
 * 
 * Comprehensive test suite for admin dashboard functionality.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

const request = require('supertest');
const app = require('../app');

// Mock database
const mockDb = {
  query: jest.fn(),
};

// Mock Stripe
const mockStripe = {
  refunds: {
    create: jest.fn(),
  },
};

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';

describe('Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock database connection
    app.use((req, res, next) => {
      req.db = mockDb;
      next();
    });
  });

  describe('GET /api/admin/purchases', () => {
    test('fetches purchases successfully', async () => {
      const mockPurchases = [
        {
          id: 'purchase_1',
          user_id: 'user_123',
          amount: 1200,
          status: 'succeeded',
          created_at: '2025-01-10T10:00:00Z',
        },
        {
          id: 'purchase_2',
          user_id: 'user_456',
          amount: 1200,
          status: 'pending',
          created_at: '2025-01-10T11:00:00Z',
        },
      ];

      mockDb.query
        .mockResolvedValueOnce({ rows: mockPurchases })
        .mockResolvedValueOnce({ rows: [{ count: '2' }] });

      const response = await request(app)
        .get('/api/admin/purchases')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(200);

      expect(response.body.purchases).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.has_more).toBe(false);
    });

    test('filters purchases by status', async () => {
      const mockPurchases = [
        {
          id: 'purchase_1',
          status: 'succeeded',
        },
      ];

      mockDb.query
        .mockResolvedValueOnce({ rows: mockPurchases })
        .mockResolvedValueOnce({ rows: [{ count: '1' }] });

      const response = await request(app)
        .get('/api/admin/purchases?status=succeeded')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(200);

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE p.status = $1'),
        ['succeeded']
      );
    });

    test('handles pagination', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] });

      await request(app)
        .get('/api/admin/purchases?limit=10&offset=20')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(200);

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $1 OFFSET $2'),
        [10, 20]
      );
    });

    test('requires admin authentication', async () => {
      await request(app)
        .get('/api/admin/purchases')
        .expect(401);
    });
  });

  describe('GET /api/admin/purchase/:id', () => {
    test('fetches purchase detail successfully', async () => {
      const mockPurchase = {
        id: 'purchase_1',
        user_id: 'user_123',
        amount: 1200,
        status: 'succeeded',
        customer_email: 'test@example.com',
        swipe_type_name: 'Direct Nurturer',
        premium_granted_at: '2025-01-10T10:00:00Z',
      };

      mockDb.query.mockResolvedValueOnce({ rows: [mockPurchase] });

      const response = await request(app)
        .get('/api/admin/purchase/purchase_1')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(200);

      expect(response.body.id).toBe('purchase_1');
      expect(response.body.user_info.email).toBe('test@example.com');
      expect(response.body.assessment_info.swipe_type_name).toBe('Direct Nurturer');
    });

    test('returns 404 for non-existent purchase', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      await request(app)
        .get('/api/admin/purchase/nonexistent')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(404);
    });
  });

  describe('POST /api/admin/refund', () => {
    test('issues refund successfully', async () => {
      const mockPurchase = {
        id: 'purchase_1',
        user_id: 'user_123',
        assessment_id: 'assessment_456',
        stripe_payment_intent_id: 'pi_123',
        status: 'succeeded',
      };

      const mockRefund = {
        id: 're_123',
        amount: 1200,
        status: 'succeeded',
      };

      mockDb.query
        .mockResolvedValueOnce({ rows: [mockPurchase] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      mockStripe.refunds.create.mockResolvedValueOnce(mockRefund);

      const response = await request(app)
        .post('/api/admin/refund')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          purchaseId: 'purchase_1',
          reason: 'Customer request',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.refund_id).toBe('re_123');
    });

    test('returns 400 for non-existent purchase', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      await request(app)
        .post('/api/admin/refund')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          purchaseId: 'nonexistent',
          reason: 'Test',
        })
        .expect(404);
    });

    test('returns 400 for non-succeeded purchase', async () => {
      const mockPurchase = {
        id: 'purchase_1',
        status: 'pending',
      };

      mockDb.query.mockResolvedValueOnce({ rows: [mockPurchase] });

      await request(app)
        .post('/api/admin/refund')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          purchaseId: 'purchase_1',
          reason: 'Test',
        })
        .expect(400);
    });

    test('requires purchase ID and reason', async () => {
      await request(app)
        .post('/api/admin/refund')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({})
        .expect(400);
    });
  });

  describe('POST /api/admin/grant-access', () => {
    test('grants premium access successfully', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [] }) // No existing access
        .mockResolvedValueOnce({ rows: [{ id: 'access_123', granted_at: '2025-01-10T10:00:00Z' }] });

      const response = await request(app)
        .post('/api/admin/grant-access')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          userId: 'user_123',
          assessmentId: 'assessment_456',
          reason: 'Admin grant',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.access_id).toBe('access_123');
    });

    test('returns 400 if access already exists', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [{ id: 'existing_access' }] });

      await request(app)
        .post('/api/admin/grant-access')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          userId: 'user_123',
          assessmentId: 'assessment_456',
          reason: 'Admin grant',
        })
        .expect(400);
    });

    test('requires all required fields', async () => {
      await request(app)
        .post('/api/admin/grant-access')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          userId: 'user_123',
          // Missing assessmentId and reason
        })
        .expect(400);
    });
  });

  describe('POST /api/admin/revoke-access', () => {
    test('revokes premium access successfully', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ id: 'access_123' }] }) // Existing access
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/admin/revoke-access')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          userId: 'user_123',
          assessmentId: 'assessment_456',
          reason: 'Admin revocation',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('returns 404 if no active access found', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      await request(app)
        .post('/api/admin/revoke-access')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          userId: 'user_123',
          assessmentId: 'assessment_456',
          reason: 'Admin revocation',
        })
        .expect(404);
    });
  });

  describe('GET /api/admin/stats', () => {
    test('fetches admin statistics', async () => {
      const mockStats = {
        total_purchases: '100',
        successful_purchases: '85',
        failed_purchases: '10',
        pending_purchases: '5',
        refunded_purchases: '3',
        recent_purchases: '12',
        total_revenue: '102000',
      };

      mockDb.query.mockResolvedValueOnce({ rows: [mockStats] });

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(200);

      expect(response.body.total_purchases).toBe(100);
      expect(response.body.total_revenue).toBe(1020); // Converted from cents
      expect(response.body.conversion_rate).toBe(0.85);
    });
  });

  describe('GET /api/admin/search', () => {
    test('searches purchases successfully', async () => {
      const mockResults = [
        {
          id: 'purchase_1',
          customer_email: 'test@example.com',
        },
      ];

      mockDb.query.mockResolvedValueOnce({ rows: mockResults });

      const response = await request(app)
        .get('/api/admin/search?query=test@example.com')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(200);

      expect(response.body.purchases).toHaveLength(1);
      expect(response.body.total).toBe(1);
    });

    test('requires minimum query length', async () => {
      await request(app)
        .get('/api/admin/search?query=a')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(400);
    });
  });

  describe('POST /api/admin/export', () => {
    test('exports purchase data', async () => {
      const mockData = [
        {
          id: 'purchase_1',
          amount: 1200,
          status: 'succeeded',
        },
      ];

      mockDb.query.mockResolvedValueOnce({ rows: mockData });

      const response = await request(app)
        .post('/api/admin/export')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          start_date: '2025-01-01',
          end_date: '2025-01-31',
          format: 'csv',
        })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.format).toBe('csv');
    });

    test('requires start and end dates', async () => {
      await request(app)
        .post('/api/admin/export')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          format: 'csv',
        })
        .expect(400);
    });
  });

  describe('Error Handling', () => {
    test('handles database errors gracefully', async () => {
      mockDb.query.mockRejectedValueOnce(new Error('Database connection failed'));

      await request(app)
        .get('/api/admin/purchases')
        .set('Authorization', 'Bearer mock-admin-token')
        .expect(500);
    });

    test('handles Stripe API errors', async () => {
      const mockPurchase = {
        id: 'purchase_1',
        status: 'succeeded',
        stripe_payment_intent_id: 'pi_123',
      };

      mockDb.query
        .mockResolvedValueOnce({ rows: [mockPurchase] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      mockStripe.refunds.create.mockRejectedValueOnce(new Error('Stripe API error'));

      await request(app)
        .post('/api/admin/refund')
        .set('Authorization', 'Bearer mock-admin-token')
        .send({
          purchaseId: 'purchase_1',
          reason: 'Test',
        })
        .expect(500);
    });
  });
});

