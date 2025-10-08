import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  PanResponder,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { questions } from '../data/questions';
import { AssessmentScoring } from '../lib/scoringAlgorithm';
import { SwipeDirection } from '../lib/scoringAlgorithm';
import { debugLogger } from '../lib/debugLogger';
import { Screen } from '../ui/Screen';
import { ProgressBar } from '../components/ProgressBar';
import { SwipeCard } from '../components/SwipeCard';
import { Button } from '../ui/Button';
import { Colors, Typography, Spacing } from '../theme';

// TODO: Set to false before production deployment
const TESTING_MODE = true;

type AssessmentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Assessment'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isDesktop = screenWidth > 1024;
const SWIPE_THRESHOLD = 100;

export default function AssessmentScreen() {
  const navigation = useNavigation<AssessmentScreenNavigationProp>();
  const [scoring] = useState(() => new AssessmentScoring(questions));
  
  // Initialize debug logger for new assessment
  useEffect(() => {
    if (TESTING_MODE) {
      debugLogger.clear();
      console.log('🧪 TESTING MODE ENABLED - Debug logging active');
    }
    
    // CRITICAL: Validate question data integrity
    console.log('=== QUESTION DATA VALIDATION ===');
    console.log('Total questions loaded:', questions.length);
    console.log('Expected: 57, Actual:', questions.length);
    
    // Check for undefined or missing questions
    const undefinedQuestions = questions.filter((q, idx) => !q || !q.text);
    if (undefinedQuestions.length > 0) {
      console.error('🚨 UNDEFINED QUESTIONS FOUND:', undefinedQuestions);
    }
    
    // Check questions 25-30 specifically (around Q27)
    console.log('Questions 25-30 (around Q27):');
    questions.slice(24, 30).forEach((q, idx) => {
      const actualIndex = 24 + idx;
      console.log(`Q${actualIndex + 1}:`, {
        id: q?.id,
        hasText: !!q?.text,
        textLength: q?.text?.length || 0,
        textPreview: q?.text?.substring(0, 50) + '...',
        framework: q?.framework,
        category: q?.category
      });
    });
    console.log('=== END VALIDATION ===');
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [progress, setProgress] = useState({ current: 0, total: questions.length, percentage: 0 });
  const [isCompleted, setIsCompleted] = useState(false);
  
  // CRITICAL: Debug current question in real-time
  useEffect(() => {
    console.log('=== CURRENT QUESTION DEBUG ===');
    console.log('Question Index:', scoring.currentQuestionIndex);
    console.log('Question Number:', scoring.currentQuestionIndex + 1);
    console.log('Current Question Object:', currentQuestion);
    console.log('Question Text:', currentQuestion?.text);
    console.log('Question ID:', currentQuestion?.id);
    console.log('Has Text:', !!currentQuestion?.text);
    console.log('Text Length:', currentQuestion?.text?.length || 0);
    if (currentQuestion?.text) {
      console.log('Text Preview:', currentQuestion.text.substring(0, 100) + '...');
    }
    console.log('===========================');
  }, [currentQuestion, scoring.currentQuestionIndex]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [canAnswer, setCanAnswer] = useState(true);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [fastAnswerCount, setFastAnswerCount] = useState(0);

  // Animation values
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Update progress
  useEffect(() => {
    const progressData = scoring.getProgress();
    setProgress(progressData);
    
    // Debug completion check
    const isCompletedCheck = scoring.isCompleted();
    console.log('🔍 COMPLETION CHECK:', {
      responsesLength: scoring.responses.length,
      currentIndex: scoring.currentQuestionIndex,
      totalQuestions: questions.length,
      isCompleted: isCompletedCheck,
      progress: progressData
    });

    // Special debug logging for Q28→Q29→Q30→Q31 flow
    const currentQuestionNumber = scoring.currentQuestionIndex + 1;
    if (currentQuestionNumber >= 28 && currentQuestionNumber <= 31) {
      console.log('🚨 CRITICAL Q28-Q31 FLOW DEBUG:', {
        currentQuestionNumber,
        currentIndex: scoring.currentQuestionIndex,
        responsesLength: scoring.responses.length,
        totalQuestions: questions.length,
        currentQuestionText: currentQuestion?.text?.substring(0, 50) + '...',
        isCompleted: isCompletedCheck
      });
    }
    
    setIsCompleted(isCompletedCheck);
  }, [currentQuestion]);

  // Validate response patterns
  const validateResponsePattern = (responses: any[]) => {
    if (responses.length < 5) return null; // Need at least 5 responses to detect patterns
    
    const recentResponses = responses.slice(-10); // Check last 10 responses
    const directions = recentResponses.map(r => r.direction);
    
    // Check for all same direction
    const allSame = directions.every(d => d === directions[0]);
    if (allSame) {
      return `You've been swiping ${directions[0]} for the last ${directions.length} questions. Please consider each question carefully.`;
    }
    
    // Check for too many positive responses
    const positiveCount = directions.filter(d => d === 'up' || d === 'right').length;
    if (positiveCount >= 8) {
      return "You've been mostly positive. Try to be more honest about your true feelings.";
    }
    
    // Check for too many negative responses
    const negativeCount = directions.filter(d => d === 'down' || d === 'left').length;
    if (negativeCount >= 8) {
      return "You've been mostly negative. Consider if you're being too critical.";
    }
    
    return null;
  };

  // Keyboard support for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyPress = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            handleSwipe('up');
            break;
          case 'ArrowRight':
            event.preventDefault();
            handleSwipe('right');
            break;
          case 'ArrowDown':
            event.preventDefault();
            handleSwipe('down');
            break;
          case 'ArrowLeft':
            event.preventDefault();
            handleSwipe('left');
            break;
          case ' ':
            event.preventDefault();
            // Space bar for "Yes" (right swipe)
            handleSwipe('right');
            break;
          case 'Enter':
            event.preventDefault();
            // Enter for "Yes" (right swipe)
            handleSwipe('right');
            break;
        }
      };

      // Add event listener
      document.addEventListener('keydown', handleKeyPress);

      // Cleanup
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [currentQuestion]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value || 0,
          y: (pan.y as any)._value || 0,
        });
      },
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
        
        // Add rotation based on horizontal movement
        const rotateValue = gesture.dx / 10;
        rotate.setValue(rotateValue);
      },
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        
        const { dx, dy } = gesture;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        
        // Determine swipe direction
        let direction: SwipeDirection | null = null;
        
        if (absDx > absDy && absDx > SWIPE_THRESHOLD) {
          direction = dx > 0 ? 'right' : 'left';
        } else if (absDy > absDx && absDy > SWIPE_THRESHOLD) {
          direction = dy > 0 ? 'down' : 'up';
        }
        
        if (direction) {
          handleSwipe(direction);
        } else {
          // Return to center
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }),
            Animated.spring(rotate, {
              toValue: 0,
              useNativeDriver: false,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handleSwipe = (direction: SwipeDirection) => {
    // Check if user can answer (prevent rapid-fire)
    if (!canAnswer) {
      return; // Prevent rapid-fire answers
    }

    // Check minimum time per question (disabled in testing mode)
    if (!TESTING_MODE) {
      const timeSpent = Date.now() - questionStartTime;
      if (timeSpent < 1000) {
        setFastAnswerCount(prev => prev + 1);
        if (fastAnswerCount >= 1) { // After 2 fast answers (0, 1, then 2+)
          setValidationWarning('Please take a moment to consider this question.');
          setTimeout(() => setValidationWarning(null), 3000);
          setFastAnswerCount(0); // Reset counter
          return;
        }
      } else {
        setFastAnswerCount(0); // Reset counter if they took time
      }
    }

    // Submit response
    scoring.submitResponse(currentQuestion.id, direction);
    
    // Debug logging for testing
    if (TESTING_MODE) {
      const rawScore = currentQuestion.weight[direction];
      const finalScore = currentQuestion.reverse ? -rawScore : rawScore;
      debugLogger.logResponse(currentQuestion, direction, rawScore, finalScore);
    }
    
    // Validate response patterns
    const responses = scoring.responses;
    const warning = validateResponsePattern(responses);
    if (warning) {
      setValidationWarning(warning);
      // Show warning but continue
    }
    
    // Disable answering temporarily (shorter cooldown)
    setCanAnswer(false);
    
    // Calculate exit direction with more dramatic movement
    const exitX = direction === 'left' ? -screenWidth * 1.5 : 
                 direction === 'right' ? screenWidth * 1.5 : 0;
    const exitY = direction === 'up' ? -screenHeight * 1.5 : 
                 direction === 'down' ? screenHeight * 1.5 : 0;
    
    // Animate card out with more dramatic movement
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: exitX, y: exitY },
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Move to next question
      const nextQuestion = scoring.moveToNextQuestion();
      console.log('🔍 NEXT QUESTION DEBUG:', {
        nextQuestion,
        hasText: !!nextQuestion?.text,
        questionId: nextQuestion?.id,
        currentIndex: scoring.currentQuestionIndex
      });
      
      if (nextQuestion && nextQuestion.text) {
        setCurrentQuestion(nextQuestion);
        setQuestionStartTime(Date.now()); // Reset timer for new question
        // Reset animations
        pan.setValue({ x: 0, y: 0 });
        rotate.setValue(0);
        scale.setValue(1);
        // Re-enable answering immediately (no artificial delay)
        setCanAnswer(true);
      } else {
        // Check if we've completed all questions
        if (scoring.currentQuestionIndex >= questions.length) {
          console.log('✅ Assessment completed - all 57 questions answered');
          handleCompletion();
        } else {
          console.error('🚨 CRITICAL: Next question is invalid:', {
            nextQuestion,
            currentIndex: scoring.currentQuestionIndex,
            totalQuestions: questions.length
          });
          // Force completion to prevent infinite loop
          handleCompletion();
        }
      }
    });
  };

  const handleCompletion = () => {
    try {
      const result = scoring.generateResult();
      
      // Debug logging for final results
      if (TESTING_MODE) {
        const scores = scoring.calculateScores();
        debugLogger.logFinalResults(
          scores,
          result.swipeType,
          result.swipeTypeName,
          result.primaryConnection,
          result.primaryEnneagram
        );
      }
      
      navigation.navigate('Results', { result });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate results. Please try again.');
    }
  };


  const handleUndo = () => {
    // Undo last response and go back to previous question
    console.log('Before undo - current index:', scoring.currentQuestionIndex, 'responses:', scoring.responses.length);
    const previousQuestion = scoring.undoLastResponse();
    console.log('After undo - current index:', scoring.currentQuestionIndex, 'responses:', scoring.responses.length);
    
    if (previousQuestion) {
      console.log('Setting question to:', previousQuestion.id, previousQuestion.text.substring(0, 50) + '...');
      setCurrentQuestion(previousQuestion);
      
      // Update progress after undo
      const newProgress = scoring.getProgress();
      setProgress(newProgress);
      
      // Reset animations
      pan.setValue({ x: 0, y: 0 });
      rotate.setValue(0);
      scale.setValue(1);
      
      // Reset timing for the previous question
      setQuestionStartTime(Date.now());
      setCanAnswer(true);
      setValidationWarning(null);
    } else {
      console.log('No previous question available');
    }
  };

  if (isCompleted) {
    return (
      <View style={styles.container}>
        <Text style={styles.completedText}>Assessment Complete!</Text>
        <Text style={styles.loadingText}>Generating your results...</Text>
      </View>
    );
  }

  return (
    <Screen>
      {/* Progress Bar */}
      <ProgressBar progress={progress.percentage} />
      
      <View style={styles.container}>
        <Text style={[styles.progressText, Typography.caption]}>
          Question {progress.current + 1} of {progress.total} • {Math.round(progress.percentage)}% Complete
        </Text>

        {/* Question Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          testID="question-card"
          style={[
            styles.questionCard,
            !canAnswer && styles.disabledCard,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate: rotate.interpolate({
                  inputRange: [-screenWidth, 0, screenWidth],
                  outputRange: ['-30deg', '0deg', '30deg'],
                }) },
                { scale }
              ]
            }
          ]}
          {...panResponder.panHandlers}
        >
          {currentQuestion?.text ? (
            <Text style={[styles.questionText, { color: Colors.text }]}>{currentQuestion.text}</Text>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                🚨 ERROR: No question text available
              </Text>
              <Text style={styles.errorDetails}>
                Question ID: {currentQuestion?.id || 'undefined'}
              </Text>
              <Text style={styles.errorDetails}>
                Index: {scoring.currentQuestionIndex}
              </Text>
              <Text style={styles.errorDetails}>
                Total Questions: {questions.length}
              </Text>
            </View>
          )}
          
          {/* Swipe Indicators */}
          <View style={styles.swipeIndicators}>
            <View style={[styles.indicator, styles.indicatorUp]}>
              <Text style={styles.indicatorText}>YES!</Text>
            </View>
            <View style={[styles.indicator, styles.indicatorRight]}>
              <Text style={styles.indicatorText}>Yes</Text>
            </View>
            <View style={[styles.indicator, styles.indicatorLeft]}>
              <Text style={styles.indicatorText}>No</Text>
            </View>
            <View style={[styles.indicator, styles.indicatorDown]}>
              <Text style={styles.indicatorText}>NO!</Text>
            </View>
          </View>

          {/* Modern Clickable Areas for Web */}
          {Platform.OS === 'web' && (
            <View style={styles.clickableAreas}>
              <TouchableOpacity 
                style={[styles.clickArea, styles.areaUp]} 
                onPress={() => handleSwipe('up')}
                activeOpacity={0.7}
              />
              <TouchableOpacity 
                style={[styles.clickArea, styles.areaRight]} 
                onPress={() => handleSwipe('right')}
                activeOpacity={0.7}
              />
              <TouchableOpacity 
                style={[styles.clickArea, styles.areaLeft]} 
                onPress={() => handleSwipe('left')}
                activeOpacity={0.7}
              />
              <TouchableOpacity 
                style={[styles.clickArea, styles.areaDown]} 
                onPress={() => handleSwipe('down')}
                activeOpacity={0.7}
              />
            </View>
          )}
        </Animated.View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Swipe in any direction to answer:
        </Text>
        <Text style={styles.instructionSubtext}>
          ↑ YES! • → Yes • ← No • ↓ NO!
        </Text>
        {Platform.OS === 'web' && (
          <Text style={styles.keyboardText}>
            Or use keyboard: ↑ → ← ↓ or Space/Enter for Yes
          </Text>
        )}
        {validationWarning && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{validationWarning}</Text>
            <TouchableOpacity 
              style={styles.dismissWarning}
              onPress={() => setValidationWarning(null)}
            >
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </View>

      {/* Accessibility Buttons for Multi-Input Support */}
      <View style={styles.accessibilityButtons}>
        <Button
          title="YES!"
          variant="accessibility"
          onPress={() => handleSwipe('up')}
          disabled={!canAnswer}
          accessibilityLabel="Strongly agree - swipe up"
        />
        <Button
          title="Yes"
          variant="accessibility"
          onPress={() => handleSwipe('right')}
          disabled={!canAnswer}
          accessibilityLabel="Agree - swipe right"
        />
        <Button
          title="No"
          variant="accessibility"
          onPress={() => handleSwipe('left')}
          disabled={!canAnswer}
          accessibilityLabel="Disagree - swipe left"
        />
        <Button
          title="NO!"
          variant="accessibility"
          onPress={() => handleSwipe('down')}
          disabled={!canAnswer}
          accessibilityLabel="Strongly disagree - swipe down"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Undo"
          variant="secondary"
          onPress={handleUndo}
          disabled={scoring.responses.length === 0}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  themeToggle: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 1000,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
    width: 200,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionCard: {
    width: isDesktop ? Math.min(screenWidth - 80, 600) : screenWidth - 40,
    height: isDesktop ? 300 : screenHeight * 0.4,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: isDesktop ? 40 : 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: '#f8f9fa',
  },
  questionText: {
    fontSize: isDesktop ? 20 : 18,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    lineHeight: isDesktop ? 28 : 26,
    marginBottom: 30,
  },
  swipeIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  indicator: {
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.9,
  },
  indicatorUp: {
    top: 20,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  indicatorRight: {
    right: 20,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  indicatorLeft: {
    left: 20,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  indicatorDown: {
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  indicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  instructionSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  keyboardText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    flex: 1,
    marginRight: 8,
  },
  dismissWarning: {
    backgroundColor: '#f8d7da',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dismissText: {
    fontSize: 12,
    color: '#721c24',
    fontWeight: '500',
  },
  clickableAreas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  clickArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  areaUp: {
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
  },
  areaRight: {
    top: '25%',
    right: 0,
    bottom: '25%',
    width: '25%',
  },
  areaLeft: {
    top: '25%',
    left: 0,
    bottom: '25%',
    width: '25%',
  },
  areaDown: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
  },
  accessibilityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#ff6666',
    textAlign: 'center',
    marginBottom: 5,
  },
});
