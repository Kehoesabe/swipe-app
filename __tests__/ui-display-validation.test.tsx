import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ResultsScreen from '../src/screens/ResultsScreen';
import FullReportScreen from '../src/screens/FullReportScreen';
import { freeSummaries } from '../src/data/freeSummaries';
import { premiumReports } from '../src/data/premiumReports';
import { getDisplayName } from '../src/data/swipeTypeMapping';

// Mock navigation
const Stack = createStackNavigator();

const createMockResult = (swipeType: string) => ({
  sessionId: 'test-session-123',
  swipeType,
  swipeTypeName: getDisplayName(swipeType),
  primaryConnection: 'supportiveActions',
  primaryEnneagram: 'type1',
  detailedCombo: 'supportiveActions_type1',
  method: 'assessment' as const,
  calculatedAt: new Date(),
  scores: {
    connectionStyles: { supportiveActions: 8, qualityPresence: 6, physicalCloseness: 4, verbalAffirmation: 2, thoughtfulGestures: 3, sharedGrowth: 1 },
    enneagramTypes: { type1: 7, type6: 5, type9: 4, type2: 3, type3: 2, type4: 1, type5: 1, type7: 1, type8: 1 }
  }
});

const MockedResultsScreen = ({ result }: { result: any }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen} 
        initialParams={{ result }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const MockedFullReportScreen = ({ result }: { result: any }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="FullReport" 
        component={FullReportScreen} 
        initialParams={{ result }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('UI Display Validation', () => {
  const swipeTypes = [
    'solidRock', 'watchfulGuard', 'warmHeart', 'gentleGuide',
    'deepConnector', 'authenticSoul', 'progressPartner', 'freeSpirit'
  ];

  describe('ResultsScreen Display', () => {
    swipeTypes.forEach(swipeType => {
      test(`should display correct content for ${swipeType}`, async () => {
        const result = createMockResult(swipeType);
        const { getByText } = render(<MockedResultsScreen result={result} />);
        
        // Verify the swipe type name is displayed
        const expectedDisplayName = getDisplayName(swipeType);
        expect(getByText(expectedDisplayName)).toBeTruthy();
        
        // Verify the free summary content is displayed
        const expectedSummary = freeSummaries[swipeType];
        expect(getByText(expectedSummary.substring(0, 50))).toBeTruthy();
        
        // Verify the purchase prompt is displayed
        expect(getByText('Unlock Your Complete Report')).toBeTruthy();
        expect(getByText('View Full Report (Free Preview)')).toBeTruthy();
      });
    });
  });

  describe('FullReportScreen Display', () => {
    swipeTypes.forEach(swipeType => {
      test(`should display correct premium content for ${swipeType}`, async () => {
        const result = createMockResult(swipeType);
        const { getByText } = render(<MockedFullReportScreen result={result} />);
        
        // Verify the swipe type name is displayed
        const expectedDisplayName = getDisplayName(swipeType);
        expect(getByText(expectedDisplayName)).toBeTruthy();
        
        // Verify all premium report sections are displayed
        const report = premiumReports[swipeType];
        
        // Check introduction
        expect(getByText(report.introduction.substring(0, 50))).toBeTruthy();
        
        // Check section headings
        expect(getByText('How You Love')).toBeTruthy();
        expect(getByText('What You Need')).toBeTruthy();
        expect(getByText('Your Strengths')).toBeTruthy();
        expect(getByText('Growth Opportunities')).toBeTruthy();
        expect(getByText('In Conflict')).toBeTruthy();
        expect(getByText('Advice for Partners')).toBeTruthy();
        
        // Check section content
        expect(getByText(report.howYouLove.substring(0, 50))).toBeTruthy();
        expect(getByText(report.whatYouNeed.substring(0, 50))).toBeTruthy();
        expect(getByText(report.yourStrengths.substring(0, 50))).toBeTruthy();
        expect(getByText(report.growthOpportunities.substring(0, 50))).toBeTruthy();
        expect(getByText(report.inConflict.substring(0, 50))).toBeTruthy();
        expect(getByText(report.adviceForPartners.substring(0, 50))).toBeTruthy();
      });
    });
  });

  describe('Content Quality Validation', () => {
    test('should have consistent content structure across all swipe types', () => {
      swipeTypes.forEach(swipeType => {
        const summary = freeSummaries[swipeType];
        const report = premiumReports[swipeType];
        
        // Free summary should have consistent structure
        expect(summary).toMatch(/You are a/);
        expect(summary).toMatch(/Your strength:/);
        expect(summary).toMatch(/Your growth edge:/);
        expect(summary).toMatch(/Unlock your detailed playbook:/);
        
        // Premium report should have all required sections
        expect(report.introduction).toBeTruthy();
        expect(report.howYouLove).toBeTruthy();
        expect(report.whatYouNeed).toBeTruthy();
        expect(report.yourStrengths).toBeTruthy();
        expect(report.growthOpportunities).toBeTruthy();
        expect(report.inConflict).toBeTruthy();
        expect(report.adviceForPartners).toBeTruthy();
      });
    });

    test('should have appropriate content length', () => {
      swipeTypes.forEach(swipeType => {
        const summary = freeSummaries[swipeType];
        const report = premiumReports[swipeType];
        
        // Free summary should be concise (200-300 words)
        expect(summary.length).toBeGreaterThan(200);
        expect(summary.length).toBeLessThan(400);
        
        // Premium report sections should be substantial (500-750 words each)
        expect(report.introduction.length).toBeGreaterThan(500);
        expect(report.howYouLove.length).toBeGreaterThan(500);
        expect(report.whatYouNeed.length).toBeGreaterThan(500);
        expect(report.yourStrengths.length).toBeGreaterThan(500);
        expect(report.growthOpportunities.length).toBeGreaterThan(500);
        expect(report.inConflict.length).toBeGreaterThan(500);
        expect(report.adviceForPartners.length).toBeGreaterThan(500);
      });
    });

    test('should have unique content for each swipe type', () => {
      const summaries = swipeTypes.map(type => freeSummaries[type]);
      const introductions = swipeTypes.map(type => premiumReports[type].introduction);
      
      // Each summary should be unique
      summaries.forEach((summary, index) => {
        summaries.forEach((otherSummary, otherIndex) => {
          if (index !== otherIndex) {
            expect(summary).not.toBe(otherSummary);
          }
        });
      });
      
      // Each introduction should be unique
      introductions.forEach((intro, index) => {
        introductions.forEach((otherIntro, otherIndex) => {
          if (index !== otherIndex) {
            expect(intro).not.toBe(otherIntro);
          }
        });
      });
    });
  });

  describe('Navigation and User Experience', () => {
    test('should display purchase prompt with correct features', async () => {
      const result = createMockResult('solidRock');
      const { getByText } = render(<MockedResultsScreen result={result} />);
      
      // Verify purchase prompt content
      expect(getByText('Unlock Your Complete Report')).toBeTruthy();
      expect(getByText('Get your detailed 7-section report with personalized insights, relationship advice, and growth opportunities.')).toBeTruthy();
      
      // Verify feature list
      expect(getByText('✓ How You Love - Your unique love style')).toBeTruthy();
      expect(getByText('✓ What You Need - Your emotional needs')).toBeTruthy();
      expect(getByText('✓ Your Strengths - Your relationship superpowers')).toBeTruthy();
      expect(getByText('✓ Growth Opportunities - Areas to develop')).toBeTruthy();
      expect(getByText('✓ In Conflict - How you handle disagreements')).toBeTruthy();
      expect(getByText('✓ Advice for Partners - How others can love you better')).toBeTruthy();
      
      // Verify CTA button
      expect(getByText('View Full Report (Free Preview)')).toBeTruthy();
      expect(getByText('* Currently free during beta testing')).toBeTruthy();
    });

    test('should display share functionality', async () => {
      const result = createMockResult('warmHeart');
      const { getByText } = render(<MockedResultsScreen result={result} />);
      
      // Verify share button
      expect(getByText('Share Your Type')).toBeTruthy();
    });
  });

  describe('Responsive Design Validation', () => {
    test('should handle different screen sizes', () => {
      // Test with different screen dimensions
      const screenSizes = [
        { width: 375, height: 667 }, // iPhone SE
        { width: 414, height: 896 }, // iPhone 11
        { width: 768, height: 1024 }, // iPad
        { width: 1024, height: 768 }, // Desktop
        { width: 1440, height: 900 } // Large desktop
      ];

      screenSizes.forEach(({ width, height }) => {
        // Mock Dimensions.get('window')
        jest.doMock('react-native', () => ({
          ...jest.requireActual('react-native'),
          Dimensions: {
            get: jest.fn(() => ({ width, height }))
          }
        }));

        const result = createMockResult('solidRock');
        const { getByText } = render(<MockedResultsScreen result={result} />);
        
        // Should display content regardless of screen size
        expect(getByText('Solid Rock')).toBeTruthy();
        expect(getByText('Unlock Your Complete Report')).toBeTruthy();
      });
    });
  });
});




