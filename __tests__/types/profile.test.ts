/**
 * Profile Types Tests
 * 
 * Tests for TypeScript type definitions and interfaces
 */
import { Profile, SwipeResult } from '@/types';

describe('Profile Types', () => {
  describe('Profile interface', () => {
    test('has required properties', () => {
      const profile: Profile = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        age: 25,
        location: 'New York',
        interests: ['music', 'sports'],
        photos: ['https://example.com/photo1.jpg'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(profile.id).toBeDefined();
      expect(profile.name).toBeDefined();
      expect(profile.email).toBeDefined();
      expect(profile.avatar).toBeDefined();
      expect(profile.bio).toBeDefined();
      expect(profile.age).toBeDefined();
      expect(profile.location).toBeDefined();
      expect(profile.interests).toBeDefined();
      expect(profile.photos).toBeDefined();
      expect(profile.createdAt).toBeDefined();
      expect(profile.updatedAt).toBeDefined();
    });

    test('has correct property types', () => {
      const profile: Profile = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        age: 25,
        location: 'New York',
        interests: ['music', 'sports'],
        photos: ['https://example.com/photo1.jpg'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(typeof profile.id).toBe('string');
      expect(typeof profile.name).toBe('string');
      expect(typeof profile.email).toBe('string');
      expect(typeof profile.avatar).toBe('string');
      expect(typeof profile.bio).toBe('string');
      expect(typeof profile.age).toBe('number');
      expect(typeof profile.location).toBe('string');
      expect(Array.isArray(profile.interests)).toBe(true);
      expect(Array.isArray(profile.photos)).toBe(true);
      expect(profile.createdAt instanceof Date).toBe(true);
      expect(profile.updatedAt instanceof Date).toBe(true);
    });
  });

  describe('SwipeResult type', () => {
    test('has correct swipe result values', () => {
      const swipeResults: SwipeResult[] = ['Yes', 'No', 'YES!', 'NO!'];
      
      expect(swipeResults).toContain('Yes');
      expect(swipeResults).toContain('No');
      expect(swipeResults).toContain('YES!');
      expect(swipeResults).toContain('NO!');
    });

    test('swipe results are strings', () => {
      const swipeResults: SwipeResult[] = ['Yes', 'No', 'YES!', 'NO!'];
      
      swipeResults.forEach(result => {
        expect(typeof result).toBe('string');
      });
    });
  });
});


