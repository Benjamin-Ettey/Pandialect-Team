import { apiFetch } from '@/utils/authUtils';
import { BASE_API_URL } from '@/utils/consts';
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, // Added TextInput for translation input
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

type ExerciseType = 'translation' | 'multiple_choice' | 'matching';

type Exercise = {
  id: string;
  type: ExerciseType;
  question: string;
  hint?: string;
  order: number;
  xpReward: number;
  heartsCost: number;
  correctAnswer: string; // Universal correct answer string
  options?: string[]; // Only for multiple_choice
  pairs?: Record<string, string>; // Only for matching
};

type ExerciseList = Exercise[];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const LanguageLessonsPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lessonId, lessonTitle, lessonXpReward } = params;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // For MC and Translation (typed)
  const [typedTranslation, setTypedTranslation] = useState<string>(''); // For translation input
  const [showCheckButton, setShowCheckButton] = useState(false); // Controls "Check Answer" button visibility
  const [showContinueButton, setShowContinueButton] = useState(false); // Controls "Continue" button visibility
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null); // On-screen feedback message
  const [isCorrect, setIsCorrect] = useState(false); // Whether the last answer was correct
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [hearts, setHearts] = useState(3);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentExercise = exercises?.[currentExerciseIndex];

  const progressPercent = exercises?.length
    ? ((currentExerciseIndex + 1) / exercises.length) * 100
    : 0;

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  // Effect to update button visibility based on input
  useEffect(() => {
    if (currentExercise?.type === 'translation') {
      setShowCheckButton(typedTranslation.trim().length > 0 && !showContinueButton);
    } else if (currentExercise?.type === 'multiple_choice') {
      setShowCheckButton(selectedAnswer !== null && !showContinueButton);
    } else if (currentExercise?.type === 'matching') {
      // For matching, show check button when all pairs are matched
      const allPairsMatched = Object.keys(currentExercise.pairs || {}).length > 0 &&
        Object.keys(matchedPairs).length === Object.keys(currentExercise.pairs || {}).length * 2;
      setShowCheckButton(allPairsMatched && !showContinueButton);
    } else {
      setShowCheckButton(false);
    }
  }, [typedTranslation, selectedAnswer, matchedPairs, currentExercise, showContinueButton]);


  useEffect(() => {
    const fetchExercisesForLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        const response = await apiFetch(
          `${BASE_API_URL}/api/exercises?lessonId=${lessonId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch exercises for lesson');
        }

        const data: ExerciseList = await response.json();
        console.log('Fetched exercises:', JSON.stringify(data, null, 2));
        setExercises(shuffleArray(data));
      } catch (err) {
        setLoading(false);
        setError('Failed to load exercises. Please try again.');
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchExercisesForLesson();
    }
  }, [lessonId]);

  const handleAnswerSelect = (answer: string) => {
    if (!currentExercise || showContinueButton) return; // Prevent selection after feedback is shown

    if (currentExercise.type === 'matching') {
      if (!selectedMatch) {
        setSelectedMatch(answer);
      } else {
        const normalizedPairs = Object.entries(currentExercise.pairs || {}).map(([key, value]) => {
          return [key, value].sort().join(':');
        });
        const selectedPair = [selectedMatch, answer].sort().join(':');

        const isPairValid = normalizedPairs.includes(selectedPair);

        if (isPairValid) {
          setMatchedPairs(prev => ({
            ...prev,
            [selectedMatch]: answer,
            [answer]: selectedMatch
          }));
        } else {
          setHearts(prev => Math.max(prev - 1, 0));
        }
        setSelectedMatch(null);
      }
    } else if (currentExercise.type === 'multiple_choice') {
      setSelectedAnswer(answer);
    }
    // Translation input handled by TextInput onChangeText
  };

  const handleCheckAnswer = () => {
    if (!currentExercise) return;

    let correct = false;
    let submittedAnswer: string | null = null;

    if (currentExercise.type === 'translation') {
      submittedAnswer = typedTranslation;
      correct = typedTranslation.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();
    } else if (currentExercise.type === 'multiple_choice') {
      submittedAnswer = selectedAnswer;
      correct = selectedAnswer?.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();
    } else if (currentExercise.type === 'matching') {
      const submittedPairsArray = Object.entries(matchedPairs)
        .filter(([key, value]) => Object.keys(currentExercise.pairs || {}).includes(key))
        .map(([key, value]) => `${key}:${value}`);
      submittedAnswer = submittedPairsArray.sort().join(',');
      correct = currentExercise.correctAnswer.toLowerCase() === submittedAnswer?.toLowerCase();
    }

    setIsCorrect(correct);
    setFeedbackMessage(correct ? 'Correct!' : 'Incorrect.');
    setShowContinueButton(true); // Show continue button after checking

    if (correct) {
      setXp(prev => prev + (currentExercise.xpReward || 0));
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      setHearts(prev => Math.max(prev - currentExercise.heartsCost, 0));
    }
  };

  const continueToNextExercise = () => {
    setFeedbackMessage(null); // Clear feedback
    setShowContinueButton(false); // Hide continue button
    setTypedTranslation(''); // Clear translation input
    setSelectedAnswer(null); // Clear multiple choice selection
    setMatchedPairs({}); // Clear matching pairs
    setSelectedMatch(null); // Clear matching selection

    if (hearts <= 0) {
      router.push('/(root)/(tabs)/englishPages/beginner/HomepageTabs/home');
      return;
    }

    Animated.timing(progress, {
      toValue: exercises?.length
        ? ((currentExerciseIndex + 1) / exercises.length) * 100
        : 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();

    if (exercises && currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setShowCompletionModal(true);
      completeLesson();
    }
  };

  const completeLesson = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken || !lessonId) return;

      await apiFetch(
        `${BASE_API_URL}/api/lessons/${lessonId}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const handleContinueHome = () => {
    setShowCompletionModal(false);
    router.push('/(root)/(tabs)/englishPages/beginner/HomepageTabs/home');
  };

  const renderExercise = () => {
    if (!currentExercise) {
      console.log('No current exercise at index:', currentExerciseIndex);
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.errorText}>No exercise available at this index.</Text>
        </View>
      );
    }

    console.log('Rendering exercise:', JSON.stringify(currentExercise, null, 2));

    switch (currentExercise.type) {
      case 'translation':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentExercise.question}</Text>
            <TextInput
              style={[styles.translationInput, showContinueButton && (isCorrect ? styles.correctInput : styles.incorrectInput)]}
              placeholder="Type your translation here"
              value={typedTranslation}
              onChangeText={setTypedTranslation}
              editable={!showContinueButton} // Disable input after checking
              autoCapitalize="none"
              autoCorrect={false}
            />
            {feedbackMessage && !isCorrect && ( // Show hint/correct answer only if incorrect
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>Hint: {currentExercise.hint || 'No hint available.'}</Text>
                <Text style={styles.correctAnswerText}>Correct Answer: {currentExercise.correctAnswer}</Text>
              </View>
            )}
          </View>
        );

      case 'multiple_choice':
        if (!currentExercise.options || currentExercise.options.length === 0 || !currentExercise.correctAnswer) {
          return (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{currentExercise.question}</Text>
              <Text style={styles.errorText}>Error: Missing options or correct answer for this multiple-choice exercise.</Text>
            </View>
          );
        }
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentExercise.question}</Text>
            <View style={styles.optionsContainer}>
              {currentExercise.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    // Show correct/incorrect feedback after answer submission
                    showContinueButton && option === currentExercise.correctAnswer && styles.correctOption,
                    showContinueButton && selectedAnswer === option && selectedAnswer !== currentExercise.correctAnswer && styles.incorrectOption
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  activeOpacity={0.7}
                  disabled={showContinueButton} // Disable options after checking
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {feedbackMessage && !isCorrect && ( // Show hint/correct answer only if incorrect
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>Hint: {currentExercise.hint || 'No hint available.'}</Text>
                <Text style={styles.correctAnswerText}>Correct Answer: {currentExercise.correctAnswer}</Text>
              </View>
            )}
          </View>
        );

      case 'matching':
        if (!currentExercise.pairs || Object.keys(currentExercise.pairs).length === 0) {
          return (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{currentExercise.question}</Text>
              <Text style={styles.errorText}>Error: No pairs provided for this matching exercise.</Text>
            </View>
          );
        }
        const leftItems = shuffleArray(Object.keys(currentExercise.pairs));
        const rightItems = shuffleArray(Object.values(currentExercise.pairs));

        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentExercise.question}</Text>
            <View style={styles.matchColumns}>
              <View style={styles.matchColumn}>
                {leftItems.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.matchOption,
                      selectedMatch === item && styles.selectedMatch,
                      // If this item is part of a correctly matched pair (after checking)
                      showContinueButton && ((matchedPairs[item] && currentExercise.pairs?.[item] === matchedPairs[item]) || (Object.keys(currentExercise.pairs || {}).find(k => currentExercise.pairs?.[k] === item) && matchedPairs[Object.keys(currentExercise.pairs || {}).find(k => currentExercise.pairs?.[k] === item) || ''] === item)) && styles.correctOption,
                      showContinueButton && selectedMatch === item && !isCorrect && styles.incorrectOption // Show incorrect if selected and overall answer is wrong
                    ]}
                    onPress={() => handleAnswerSelect(item)}
                    activeOpacity={0.7}
                    // Disable if already matched or currently selected as the first part of a pair
                    disabled={showContinueButton || !!matchedPairs[item] || Object.values(matchedPairs).includes(item) || (selectedMatch !== null && selectedMatch !== item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                    {matchedPairs[item] && (
                      <Ionicons name="checkmark" size={20} color="#58CC02" style={styles.matchCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.matchColumn}>
                {rightItems.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.matchOption,
                      selectedMatch === item && styles.selectedMatch,
                      // If this item is part of a correctly matched pair (after checking)
                      showContinueButton && ((Object.keys(currentExercise.pairs || {}).find(k => currentExercise.pairs?.[k] === item) && matchedPairs[Object.keys(currentExercise.pairs || {}).find(k => currentExercise.pairs?.[k] === item) || ''] === item) || (matchedPairs[item] && currentExercise.pairs?.[matchedPairs[item]] === item)) && styles.correctOption,
                      showContinueButton && selectedMatch === item && !isCorrect && styles.incorrectOption // Show incorrect if selected and overall answer is wrong
                    ]}
                    onPress={() => handleAnswerSelect(item)}
                    activeOpacity={0.7}
                    // Disable if already matched or currently selected as the first part of a pair
                    disabled={showContinueButton || !!Object.keys(matchedPairs).find(key => matchedPairs[key] === item) || Object.keys(matchedPairs).includes(item) || (selectedMatch !== null && selectedMatch !== item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                    {Object.keys(matchedPairs).find(key => matchedPairs[key] === item) && (
                      <Ionicons name="checkmark" size={20} color="#58CC02" style={styles.matchCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {feedbackMessage && !isCorrect && ( // Show hint/correct answer only if incorrect
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>Hint: {currentExercise.hint || 'No hint available.'}</Text>
                <Text style={styles.correctAnswerText}>Correct Answer: {currentExercise.correctAnswer}</Text>
              </View>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.errorText}>Unknown exercise type: {currentExercise.type}</Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7F5AED" />
          <Text>Loading lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text>This lesson has no exercises yet.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.heartsContainer}>
          {Array.from({ length: hearts }).map((_, i) => (
            <AntDesign key={i} name="heart" size={24} color="#FF3B30" />
          ))}
        </View>

        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>

        <View style={styles.xpContainer}>
          <FontAwesome5 name="bolt" size={16} color="#FFC800" />
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lessonTitle}>{(lessonTitle as string) || "Loading Lesson..."}</Text>
        {renderExercise()}
      </ScrollView>

      {/* Feedback Section */}
      {feedbackMessage && (
        <View style={[styles.feedbackContainer, isCorrect ? styles.correctFeedback : styles.incorrectFeedback]}>
          <View style={styles.feedbackIconAndText}>
            <Ionicons
              name={isCorrect ? "checkmark-circle" : "close-circle"}
              size={30}
              color={isCorrect ? "#FFFFFF" : "#FFFFFF"}
            />
            <Text style={styles.feedbackMessageText}>{feedbackMessage}</Text>
          </View>
          {!isCorrect && currentExercise?.hint && (
            <Text style={styles.feedbackHintText}>Hint: {currentExercise.hint}</Text>
          )}
          {!isCorrect && (currentExercise?.type !== 'matching' || (currentExercise?.type === 'matching' && feedbackMessage === 'Incorrect.')) && (
            <Text style={styles.feedbackCorrectAnswerText}>Correct: {currentExercise?.correctAnswer}</Text>
          )}
        </View>
      )}

      {/* Action Button: Check Answer or Continue */}
      {showCheckButton && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCheckAnswer}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>Check Answer</Text>
        </TouchableOpacity>
      )}

      {showContinueButton && (
        <TouchableOpacity
          style={[styles.actionButton, isCorrect ? styles.correctActionButton : styles.incorrectActionButton]}
          onPress={continueToNextExercise}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {hearts <= 0 ? 'End Lesson' : (currentExerciseIndex < exercises.length - 1 ? 'Continue' : 'Finish Lesson')}
          </Text>
        </TouchableOpacity>
      )}


      <Modal visible={showCompletionModal} transparent animationType="fade">
        <View style={styles.completionModalContainer}>
          <View style={styles.completionModalContent}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png' }}
              style={styles.completionImage}
              resizeMode="contain"
            />
            <Text style={styles.completionTitle}>Lesson Complete!</Text>
            <Text style={styles.completionSubtitle}>You've mastered {(lessonTitle as string) || "this lesson"}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <FontAwesome5 name="bolt" size={24} color="#FFC800" />
                <Text style={styles.statText}>{xp} XP Earned</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome5 name="fire" size={24} color="#FF6B00" />
                <Text style={styles.statText}>{streak} Day Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={24} color="#58CC02" />
                <Text style={styles.statText}>
                  {Number(
                    Array.isArray(lessonXpReward)
                      ? lessonXpReward[0]
                      : lessonXpReward ?? 0
                  ) || 0} Total XP Possible
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueHomeButton}
              onPress={handleContinueHome}
              activeOpacity={0.8}
            >
              <Text style={styles.continueHomeButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {streak > 0 && (
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>🔥 Streak: {streak}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'space-between'
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: 80
  },
  xpText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#333'
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 120 // Increased padding to make space for feedback/buttons
  },
  questionContainer: {
    marginBottom: 32
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center'
  },
  questionText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 28
  },
  // New styles for Translation Input
  translationInput: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF'
  },
  correctInput: {
    borderColor: '#58CC02',
    backgroundColor: '#E8F5E9',
  },
  incorrectInput: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFEBEE',
  },
  // End new styles for Translation Input

  optionsContainer: {
    marginBottom: 24
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  // Removed wordOptionsContainer, wordCard, selectedWordCard, selectedWordsContainer
  // as they are no longer used for translation input

  selectedOption: {
    backgroundColor: '#E0E0E0',
    borderColor: '#58CC02'
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#58CC02'
  },
  incorrectOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF3B30'
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center'
  },
  // Renamed nextButton to actionButton and added specific styles
  actionButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#7F5AED', // Default for "Check Answer"
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  correctActionButton: {
    backgroundColor: '#58CC02', // Green for "Continue" after correct answer
  },
  incorrectActionButton: {
    backgroundColor: '#FF3B30', // Red for "Continue" after incorrect answer
  },
  streakContainer: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    backgroundColor: '#FFC800',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  streakText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  matchColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  matchColumn: {
    width: '48%'
  },
  matchOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  selectedMatch: {
    borderColor: '#7F5AED', // Updated color for consistency
    backgroundColor: '#EDEAFD' // Light purple background
  },
  matchedOption: {
    borderColor: '#58CC02',
    backgroundColor: '#E8F5E9'
  },
  matchCheck: {
    position: 'absolute',
    right: 8
  },
  // Removed modalContainer, modalContent, correctModal, incorrectModal
  // as feedback is now integrated on screen

  // New feedback container styles
  feedbackContainer: {
    position: 'absolute',
    bottom: 90, // Position above the action button
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  correctFeedback: {
    backgroundColor: '#58CC02', // Green for correct
  },
  incorrectFeedback: {
    backgroundColor: '#FF3B30', // Red for incorrect
  },
  feedbackIconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackMessageText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  feedbackHintText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  feedbackCorrectAnswerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  // End new feedback container styles

  completionModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  completionModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '90%',
    maxHeight: '90%',
    alignItems: 'center'
  },
  completionImage: {
    width: 120,
    height: 120,
    marginBottom: 20
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#58CC02',
    marginBottom: 8,
    textAlign: 'center'
  },
  completionSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center'
  },
  statsContainer: {
    width: '100%',
    marginVertical: 20
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 12
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12
  },
  continueHomeButton: {
    backgroundColor: '#58CC02',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 16
  },
  continueHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16
  },
  retryButton: {
    backgroundColor: '#7F5AED',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default LanguageLessonsPage;