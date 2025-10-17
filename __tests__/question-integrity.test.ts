/**
 * Question Data Integrity Tests
 * Validates all 57 questions are present and properly formatted
 */

import { questions } from '../src/data/questions';

describe('Question Data Integrity', () => {
  test('should have exactly 57 questions', () => {
    expect(questions).toHaveLength(57);
  });
  
  test('all questions should have required fields', () => {
    questions.forEach((q, index) => {
      expect(q.id).toBeDefined();
      expect(q.text).toBeDefined();
      expect(q.text.length).toBeGreaterThan(0);
      expect(q.framework).toBeDefined();
      expect(q.category).toBeDefined();
      expect(q.weight).toBeDefined();
      expect(typeof q.reverse).toBe('boolean');
    });
  });
  
  test('all questions should have non-empty text', () => {
    const emptyTextQuestions = questions.filter(q => !q.text || q.text.trim() === '');
    expect(emptyTextQuestions).toHaveLength(0);
  });
  
  test('question IDs should be unique and complete (1-57)', () => {
    const ids = questions.map(q => q.id).sort((a, b) => a - b);
    const expectedIds = Array.from({length: 57}, (_, i) => i + 1);
    expect(ids).toEqual(expectedIds);
  });
  
  test('should have exactly 27 connection questions', () => {
    const connectionQuestions = questions.filter(q => q.framework === 'connection');
    expect(connectionQuestions).toHaveLength(27);
  });
  
  test('should have exactly 30 enneagram questions', () => {
    const enneagramQuestions = questions.filter(q => q.framework === 'enneagram');
    expect(enneagramQuestions).toHaveLength(30);
  });
  
  test('should have exactly 6 reverse-coded questions', () => {
    const reverseQuestions = questions.filter(q => q.reverse);
    expect(reverseQuestions).toHaveLength(6);
  });
  
  test('all questions should have valid weight objects', () => {
    questions.forEach(q => {
      expect(q.weight).toHaveProperty('up');
      expect(q.weight).toHaveProperty('right');
      expect(q.weight).toHaveProperty('left');
      expect(q.weight).toHaveProperty('down');
      expect(typeof q.weight.up).toBe('number');
      expect(typeof q.weight.right).toBe('number');
      expect(typeof q.weight.left).toBe('number');
      expect(typeof q.weight.down).toBe('number');
    });
  });
  
  test('questions 25-30 should exist and have text (around Q27 bug)', () => {
    const questions25to30 = questions.slice(24, 30);
    expect(questions25to30).toHaveLength(6);
    
    questions25to30.forEach((q, index) => {
      const questionNumber = 25 + index;
      expect(q.id).toBe(questionNumber);
      expect(q.text).toBeDefined();
      expect(q.text.length).toBeGreaterThan(0);
      console.log(`Q${questionNumber}: ${q.text.substring(0, 50)}...`);
    });
  });
  
  test('no duplicate question IDs', () => {
    const ids = questions.map(q => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(57);
  });
  
  test('no undefined or null questions', () => {
    const undefinedQuestions = questions.filter(q => !q);
    expect(undefinedQuestions).toHaveLength(0);
  });
  
  test('all question text should be strings', () => {
    questions.forEach(q => {
      expect(typeof q.text).toBe('string');
    });
  });
  
  test('all frameworks should be valid', () => {
    const validFrameworks = ['connection', 'enneagram'];
    questions.forEach(q => {
      expect(validFrameworks).toContain(q.framework);
    });
  });
  
  test('all categories should be non-empty strings', () => {
    questions.forEach(q => {
      expect(typeof q.category).toBe('string');
      expect(q.category.length).toBeGreaterThan(0);
    });
  });
});




