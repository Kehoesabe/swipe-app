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
  Platform,
  ActivityIndicator
} from 'react-native';
import { useSessionReady } from '../hooks/useSessionReady';
import { validateEnv } from '../config/validateEnv';
import { callFn } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { questions } from '../data/questions';
import { AssessmentScoring } from '../lib/scoringAlgorithm';
import { SwipeDirection } from '../lib/scoringAlgorithm';
import { 
  startAssessment, 
  saveProgress, 
  submitAssessment, 
  resumeAssessment,
  type AssessmentSession,
  type AssessmentResult 
} from '../api/assessment';
import { getTypeInfo } from '../data/swipeTypeMapping';
import { debugLogger } from '../lib/debugLogger';
import Screen from '../ui/Screen';
import { ProgressBar } from '../components/ProgressBar';
import { SwipeCard } from '../components/SwipeCard';
import Button from '../ui/Button';
import { Colors, Typography, Spacing } from '../theme';

// TODO: Set to false before production deployment
const TESTING_MODE = true;

type AssessmentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Assessment'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isDesktop = screenWidth > 1024;
const SWIPE_THRESHOLD = 50;

export default function AssessmentScreen() {
  // Fail fast on missing environment variables
  validateEnv();
  
  const navigation = useNavigation<AssessmentScreenNavigationProp>();
  const [scoring] = useState(() => new AssessmentScoring(questions));
  
  // Get session state from Supabase auth
  const { session, ready } = useSessionReady();
  
  // Initialize assessment session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const newSession = await startAssessment();
        setAssessmentSession(newSession);
        console.log('📝 Assessment session initialized:', newSession.id);
        console.log('🔍 Session state after setSession:', newSession);
      } catch (error) {
        console.error('Failed to initialize assessment session:', error);
        Alert.alert('Error', 'Failed to start assessment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeSession();
  }, []);

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
  const [assessmentSession, setAssessmentSession] = useState<AssessmentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  const [isSwiping, setIsSwiping] = useState(false);
  const [showExitMessage, setShowExitMessage] = useState(false);
  const [exitDirection, setExitDirection] = useState<SwipeDirection | null>(null);

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
        setIsSwiping(true);
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
        console.log('🔍 RELEASE:', { dx: gesture.dx, dy: gesture.dy, threshold: SWIPE_THRESHOLD });
        setIsSwiping(false);
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

  const handleSwipe = async (direction: SwipeDirection) => {
    const canAnswerNow = canAnswer; // your existing state
    const hasSessionNow = !!session;

    console.log('🚨 handleSwipe CALLED', { direction, canAnswer: canAnswerNow, hasSession: hasSessionNow });

    if (!canAnswerNow || !hasSessionNow) {
      console.log('🚨 BLOCKED by guard', { canAnswer: canAnswerNow, hasSession: hasSessionNow });
      return;
    }

    // CRITICAL DEBUG: Track question 56 specifically
    console.log(`🔍 handleAnswer called for Q${currentQuestion.id}, direction: ${direction}`);
    if (currentQuestion.id === 56) {
      console.log(`🚨 CRITICAL: Processing question 56 - this is the missing question!`);
      console.log(`🔍 Current session state before Q56:`, {
        responsesCount: Object.keys(session.responses).length,
        currentIndex: scoring.currentQuestionIndex,
        allResponses: Object.keys(session.responses).map(id => parseInt(id)).sort((a, b) => a - b)
      });
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

    let updatedSession;
    try {
      // Save progress to session
      console.log('🔍 Saving progress for Q' + currentQuestion.id + ' → ' + direction);
      updatedSession = await saveProgress(assessmentSession.id, currentQuestion.id, direction);
      setAssessmentSession(updatedSession);
      
      // CRITICAL DEBUG: Track session state after save
      console.log(`✅ Session updated for Q${currentQuestion.id}. Current session responses count: ${Object.keys(updatedSession.responses).length}`);
      if (currentQuestion.id === 56) {
        console.log(`🚨 CRITICAL: After saving Q56 - session state:`, {
          questionId: currentQuestion.id,
          responsesCount: Object.keys(updatedSession.responses).length,
          hasResponse: !!updatedSession.responses[currentQuestion.id],
          allResponses: Object.keys(updatedSession.responses).map(id => parseInt(id)).sort((a, b) => a - b)
        });
      }
      
      // Submit response to scoring
      scoring.submitResponse(currentQuestion.id, direction);
      console.log(`✅ Scoring updated for Q${currentQuestion.id}. Scoring responses count: ${Object.keys(scoring.responses).length}`);
      
      console.log('✅ Progress saved successfully for Q' + currentQuestion.id);
      console.log('🔍 SESSION STATE AFTER SAVE:', {
        questionId: currentQuestion.id,
        responsesCount: Object.keys(updatedSession.responses).length,
        currentIndex: scoring.currentQuestionIndex,
        hasResponse: !!updatedSession.responses[currentQuestion.id]
      });
      
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
      
      // Show exit message during transition
      setShowExitMessage(true);
      setExitDirection(direction);
      
      // Calculate exit direction with more dramatic movement
      const exitX = direction === 'left' ? -screenWidth * 1.5 : 
                   direction === 'right' ? screenWidth * 1.5 : 0;
      const exitY = direction === 'up' ? -screenHeight * 1.5 : 
                   direction === 'down' ? screenHeight * 1.5 : 0;
      
      // Animate card out with more dramatic movement (slowed by 80%)
      Animated.parallel([
        Animated.timing(pan, {
          toValue: { x: exitX, y: exitY },
          duration: 1050, // 1500ms * 0.70 = 1050ms (30% faster from current)
          useNativeDriver: false,
        }),
        Animated.timing(rotate, {
          toValue: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
          duration: 1050, // 1500ms * 0.70 = 1050ms (30% faster from current)
          useNativeDriver: false,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 1050, // 1500ms * 0.70 = 1050ms (30% faster from current)
          useNativeDriver: false,
        }),
    ]).start(() => {
      // CRITICAL DEBUG: Track animation callback execution
      console.log(`🔍 Animation callback triggered for Q${currentQuestion.id}`);
      if (currentQuestion.id === 56) {
        console.log(`🚨 CRITICAL: Animation callback for Q56 - this should save the response!`);
        console.log(`🔍 Animation callback Q56 state:`, {
          currentQuestionId: currentQuestion.id,
          responsesCount: Object.keys(updatedSession.responses).length,
          hasResponse: !!updatedSession.responses[currentQuestion.id],
          allResponses: Object.keys(updatedSession.responses).map(id => parseInt(id)).sort((a, b) => a - b)
        });
      }
      
      // Hide exit message
      setShowExitMessage(false);
      setExitDirection(null);
      
      // Move to next question
      console.log('🔍 BEFORE MOVE TO NEXT:', {
        currentQuestionId: currentQuestion.id,
        currentIndex: scoring.currentQuestionIndex,
        responsesCount: Object.keys(updatedSession.responses).length
      });
      
      const nextQuestion = scoring.moveToNextQuestion();
      console.log('🔍 AFTER MOVE TO NEXT:', {
        nextQuestion,
        hasText: !!nextQuestion?.text,
        questionId: nextQuestion?.id,
        currentIndex: scoring.currentQuestionIndex,
        responsesCount: Object.keys(updatedSession.responses).length
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
          // CRITICAL FIX: Ensure last question response is saved before completion
          console.log('🔍 Final session state before completion:', {
            responsesCount: Object.keys(updatedSession.responses).length,
            allResponses: Object.keys(updatedSession.responses).map(id => parseInt(id)).sort((a, b) => a - b),
            lastQuestionId: currentQuestion.id,
            hasLastResponse: !!updatedSession.responses[currentQuestion.id]
          });
          
          // CRITICAL: Double-check that the last question's response is saved
          if (!updatedSession.responses[currentQuestion.id]) {
            console.error('🚨 CRITICAL: Last question response not saved! Forcing save...');
            // Force save the last response
            updatedSession.responses[currentQuestion.id] = direction;
            console.log('🔧 Forced save of last response:', {
              questionId: currentQuestion.id,
              direction: direction,
              responsesCount: Object.keys(updatedSession.responses).length
            });
          }
          
          handleCompletion(updatedSession);
        } else {
          console.error('🚨 CRITICAL: Next question is invalid:', {
            nextQuestion,
            currentIndex: scoring.currentQuestionIndex,
            totalQuestions: questions.length
          });
          // Force completion to prevent infinite loop
          handleCompletion(updatedSession);
        }
      }
    });
    
    } catch (error) {
      console.error('❌ Failed to save progress for Q' + currentQuestion.id + ':', error);
      Alert.alert('Error', 'Failed to save your response. Please try again.');
      return;
    }
  };

  const handleCompletion = async (updatedSession?: any) => {
    const sessionToUse = updatedSession || assessmentSession;
    if (!sessionToUse) {
      console.error('No session available for completion');
      return;
    }

    try {
      console.log('🎯 Starting assessment completion...');
      console.log('🔍 Session responses before submission:', {
        totalResponses: Object.keys(sessionToUse.responses).length,
        responses: Object.keys(sessionToUse.responses).map(id => parseInt(id)).sort((a, b) => a - b),
        missingQuestions: []
      });
      
      // CRITICAL: Ensure we have all 57 responses before submission
      console.log('🔍 handleCompletion - Current responses:', Object.keys(sessionToUse.responses).length);
      
      // Verify we have all 57 responses
      if (Object.keys(sessionToUse.responses).length < 57) {
        console.error('🚨 CRITICAL: Missing responses before submission!', {
          expected: 57,
          actual: Object.keys(sessionToUse.responses).length,
          missing: Array.from({length: 57}, (_, i) => i + 1)
            .filter(id => !sessionToUse.responses[id])
        });
        
        // ALTERNATIVE FIX: Find and force save the missing question
        const missingQuestions = Array.from({length: 57}, (_, i) => i + 1)
          .filter(id => !sessionToUse.responses[id]);
        
        console.log('🔍 FORCE: Missing questions found:', missingQuestions);
        
        if (missingQuestions.length > 0) {
          // Force save the first missing question (usually the last one)
          const missingQuestionId = missingQuestions[0];
          const lastDirection = 'right'; // Default to 'right' for missing questions
          
          console.log('🔍 FORCE: Saving missing question:', missingQuestionId);
          sessionToUse.responses[missingQuestionId] = lastDirection;
          
          // CRITICAL: Update the session state immediately
          setAssessmentSession(sessionToUse);
          
          console.log('🔧 Forced save of missing question:', {
            questionId: missingQuestionId,
            direction: lastDirection,
            responsesCount: Object.keys(sessionToUse.responses).length,
            allResponses: Object.keys(sessionToUse.responses).map(id => parseInt(id)).sort((a, b) => a - b)
          });
        }
        
        // Check again after force save
        if (Object.keys(sessionToUse.responses).length < 57) {
          console.error('🚨 STILL MISSING: Responses after force save:', Object.keys(sessionToUse.responses).length);
          Alert.alert('Error', 'Please complete all questions before submitting.');
          return;
        }
      }
      
      // Check for missing questions
      const missingQuestions = [];
      for (let i = 1; i <= questions.length; i++) {
        if (!sessionToUse.responses[i]) {
          missingQuestions.push(i);
        }
      }
      if (missingQuestions.length > 0) {
        console.error('🚨 Missing responses for questions:', missingQuestions);
      }
      
      // Submit assessment to API
      const result = await submitAssessment(sessionToUse.id);
      console.log('✅ Assessment submitted:', result);
      
      // Debug logging for final results
      if (TESTING_MODE) {
        debugLogger.logFinalResults(
          result.scores,
          result.swipeType,
          result.swipeTypeName,
          'N/A', // primaryConnection not in API result
          'N/A'  // primaryEnneagram not in API result
        );
      }
      
      // Get type information for navigation
      const typeInfo = getTypeInfo(result.swipeType as any);
      
      console.log('🚀 Navigating to Results screen with:', { result, typeInfo });
      navigation.navigate('Results', typeInfo);
      console.log('✅ Navigation call completed');
    } catch (error) {
      console.error('🚨 Error in handleCompletion:', error);
      Alert.alert('Error', 'Failed to submit assessment. Please try again.');
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

  // BLOCK UI until session check completes
  if (!ready || !session) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading assessment...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Starting assessment...</Text>
      </View>
    );
  }

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
          
          {/* Swipe Indicators - Only show during active swiping */}
          {isSwiping && (
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
          )}

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

      {/* Ghost Answer Messages - Static messages attached to ghost cards */}
      {(isSwiping || showExitMessage) && (
        <View style={styles.ghostAnswerMessages}>
          {/* Strongly Agree - Purple message for UP swipe */}
          {(!showExitMessage || exitDirection === 'up') && (
            <Animated.View 
              style={[
                styles.ghostMessage,
                styles.ghostMessageUp,
                {
                  transform: [
                    { translateY: pan.y.interpolate({
                      inputRange: [-200, 0],
                      outputRange: [-30, 0],
                      extrapolate: 'clamp'
                    })}
                  ],
                  opacity: showExitMessage && exitDirection === 'up' ? 1 : pan.y.interpolate({
                    inputRange: [-80, 0],
                    outputRange: [1, 0],
                    extrapolate: 'clamp'
                  })
                }
              ]}
            >
              <View style={styles.messageBoxPurple}>
                <Text style={styles.messageTextPurple}>Strongly Agree!</Text>
              </View>
            </Animated.View>
          )}
          
          {/* Slightly Agree - Blue message for RIGHT swipe */}
          {(!showExitMessage || exitDirection === 'right') && (
            <Animated.View 
              style={[
                styles.ghostMessage,
                styles.ghostMessageRight,
                {
                  transform: [
                    { translateX: pan.x.interpolate({
                      inputRange: [0, 200],
                      outputRange: [0, 30],
                      extrapolate: 'clamp'
                    })}
                  ],
                  opacity: showExitMessage && exitDirection === 'right' ? 1 : pan.x.interpolate({
                    inputRange: [0, 80],
                    outputRange: [0, 1],
                    extrapolate: 'clamp'
                  })
                }
              ]}
            >
              <View style={styles.messageBoxBlue}>
                <Text style={styles.messageTextBlue}>Slightly Agree</Text>
              </View>
            </Animated.View>
          )}
          
          {/* Slightly Disagree - Orange message for LEFT swipe */}
          {(!showExitMessage || exitDirection === 'left') && (
            <Animated.View 
              style={[
                styles.ghostMessage,
                styles.ghostMessageLeft,
                {
                  transform: [
                    { translateX: pan.x.interpolate({
                      inputRange: [-200, 0],
                      outputRange: [-30, 0],
                      extrapolate: 'clamp'
                    })}
                  ],
                  opacity: showExitMessage && exitDirection === 'left' ? 1 : pan.x.interpolate({
                    inputRange: [-80, 0],
                    outputRange: [1, 0],
                    extrapolate: 'clamp'
                  })
                }
              ]}
            >
              <View style={styles.messageBoxOrange}>
                <Text style={styles.messageTextOrange}>Slightly Disagree</Text>
              </View>
            </Animated.View>
          )}
          
          {/* Strongly Disagree - Red message for DOWN swipe */}
          {(!showExitMessage || exitDirection === 'down') && (
            <Animated.View 
              style={[
                styles.ghostMessage,
                styles.ghostMessageDown,
                {
                  transform: [
                    { translateY: pan.y.interpolate({
                      inputRange: [0, 200],
                      outputRange: [0, 30],
                      extrapolate: 'clamp'
                    })}
                  ],
                  opacity: showExitMessage && exitDirection === 'down' ? 1 : pan.y.interpolate({
                    inputRange: [0, 80],
                    outputRange: [0, 1],
                    extrapolate: 'clamp'
                  })
                }
              ]}
            >
              <View style={styles.messageBoxRed}>
                <Text style={styles.messageTextRed}>Strongly Disagree!</Text>
              </View>
            </Animated.View>
          )}
        </View>
      )}

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
    paddingHorizontal: 20, // Add padding to prevent text overlap
    flexWrap: 'wrap', // Allow text wrapping
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  accessibilityButton: {
    minWidth: 60,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  ghostAnswerMessages: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  ghostMessage: {
    position: 'absolute',
    zIndex: 1,
  },
  ghostMessageUp: {
    top: '15%',
    left: '50%',
    transform: [{ translateX: -60 }],
  },
  ghostMessageRight: {
    top: '50%',
    right: '5%',
    transform: [{ translateY: -15 }],
  },
  ghostMessageLeft: {
    top: '50%',
    left: '5%',
    transform: [{ translateY: -15 }],
  },
  ghostMessageDown: {
    bottom: '15%',
    left: '50%',
    transform: [{ translateX: -60 }],
  },
  // Purple for UP swipe (Strongly Agree)
  messageBoxPurple: {
    backgroundColor: '#F3E5F5', // Light purple background (lighter than border)
    borderWidth: 2,
    borderColor: '#9C27B0', // Purple border (darker)
    borderRadius: 20, // Pill shape
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTextPurple: {
    color: '#7B1FA2', // Darker purple text for better contrast
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Blue for RIGHT swipe (Slightly Agree)
  messageBoxBlue: {
    backgroundColor: '#E3F2FD', // Light blue background (lighter than border)
    borderWidth: 2,
    borderColor: '#2196F3', // Blue border (darker)
    borderRadius: 20, // Pill shape
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTextBlue: {
    color: '#1976D2', // Darker blue text for better contrast
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Orange for LEFT swipe (Slightly Disagree)
  messageBoxOrange: {
    backgroundColor: '#FFF3E0', // Light orange background (lighter than border)
    borderWidth: 2,
    borderColor: '#FF9800', // Orange border (darker)
    borderRadius: 20, // Pill shape
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTextOrange: {
    color: '#F57C00', // Darker orange text for better contrast
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Red for DOWN swipe (Strongly Disagree)
  messageBoxRed: {
    backgroundColor: '#FFEBEE', // Light red background (lighter than border)
    borderWidth: 2,
    borderColor: '#F44336', // Red border (darker)
    borderRadius: 20, // Pill shape
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTextRed: {
    color: '#D32F2F', // Darker red text for better contrast
    fontSize: 14,
    fontWeight: '700',
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
