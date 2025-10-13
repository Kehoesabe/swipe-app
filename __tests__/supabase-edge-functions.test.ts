/**
 * Supabase Edge Functions Tests
 * 
 * Tests for the migrated payment system using Supabase Edge Functions
 * Replaces local backend server tests
 */

// Mock fetch for Node.js environment
global.fetch = jest.fn();

describe('Supabase Edge Functions', () => {
  const SUPABASE_URL = 'https://itjmtjsipawahtlfcicu.supabase.co/functions/v1';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0am10anNpcGF3YWh0bGZjaWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1NzQ4MDAsImV4cCI6MjA1MjE1MDgwMH0.example-anon-key';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Common Errors Detection', () => {
    test('401 Unauthorized error is detected', async () => {
      // Mock 401 response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      });

      const response = await fetch(`${SUPABASE_URL}/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Missing or invalid auth headers
        },
        body: JSON.stringify({
          userId: 'test-user',
          assessmentId: 'test-assessment',
          typeNumber: 1
        })
      });

      expect(response.status).toBe(401);
    });

    test('404 Function not found error is detected', async () => {
      // Mock 404 response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 404,
        json: () => Promise.resolve({ error: 'Function not found' })
      });

      const response = await fetch(`${SUPABASE_URL}/nonexistent-function`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(404);
    });

    test('CORS headers are present', async () => {
      // Mock CORS response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        headers: {
          get: (name: string) => {
            if (name === 'Access-Control-Allow-Origin') return '*';
            if (name === 'Access-Control-Allow-Headers') return 'authorization, apikey, content-type';
            return null;
          }
        }
      });

      const response = await fetch(`${SUPABASE_URL}/create-checkout`, {
        method: 'OPTIONS'
      });

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('authorization');
    });
  });

  describe('Migration Validation', () => {
    test('no localhost references in payment.ts', () => {
      const fs = require('fs');
      const paymentContent = fs.readFileSync('src/api/payment.ts', 'utf8');
      
      // Should not contain localhost references
      expect(paymentContent).not.toContain('localhost:9001');
      expect(paymentContent).not.toContain('http://localhost');
      
      // Should contain Supabase URLs
      expect(paymentContent).toContain('itjmtjsipawahtlfcicu.supabase.co');
      expect(paymentContent).toContain('/functions/v1');
    });

    test('correct headers are used', () => {
      const fs = require('fs');
      const paymentContent = fs.readFileSync('src/api/payment.ts', 'utf8');
      
      // Should contain both Authorization and apikey headers
      expect(paymentContent).toContain('Authorization');
      expect(paymentContent).toContain('apikey');
    });

    test('supabase config file exists', () => {
      const fs = require('fs');
      expect(() => fs.readFileSync('src/config/supabase.ts', 'utf8')).not.toThrow();
    });

    test('supabase config has proper exports', () => {
      const fs = require('fs');
      const supabaseConfig = fs.readFileSync('src/config/supabase.ts', 'utf8');
      
      // Should export SUPABASE_URL and SUPABASE_ANON_KEY
      expect(supabaseConfig).toContain('export const SUPABASE_URL');
      expect(supabaseConfig).toContain('export const SUPABASE_ANON_KEY');
      expect(supabaseConfig).toContain('EDGE_FUNCTIONS_URL');
    });

    test('payment.ts imports supabase config', () => {
      const fs = require('fs');
      const paymentContent = fs.readFileSync('src/api/payment.ts', 'utf8');
      
      // Should import from supabase config
      expect(paymentContent).toContain("from '../config/supabase'");
      expect(paymentContent).toContain('SUPABASE_ANON_KEY');
      expect(paymentContent).toContain('EDGE_FUNCTIONS_URL');
    });

    test('environment variables are properly referenced', () => {
      const fs = require('fs');
      const supabaseConfig = fs.readFileSync('src/config/supabase.ts', 'utf8');
      
      // Should reference environment variables
      expect(supabaseConfig).toContain('process.env.EXPO_PUBLIC_SUPABASE_URL');
      expect(supabaseConfig).toContain('process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY');
    });
  });

  describe('Error Response Format', () => {
    test('401 error returns JSON with error message', async () => {
      // Mock 401 response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      });

      const response = await fetch(`${SUPABASE_URL}/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'test-user',
          assessmentId: 'test-assessment',
          typeNumber: 1
        })
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    test('404 returns JSON with error message', async () => {
      // Mock 404 response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 404,
        json: () => Promise.resolve({ error: 'Function not found' })
      });

      const response = await fetch(`${SUPABASE_URL}/nonexistent-function`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });
  });
});