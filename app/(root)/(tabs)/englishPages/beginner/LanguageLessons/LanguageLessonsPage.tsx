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
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Type definitions
type ExerciseType = 'translation' | 'multiple_choice' | 'matching';

type Exercise = {
  id: string;
  type: ExerciseType;
  question: string;
  hint?: string;
  order: number;
  xpReward: number;
  heartsCost: number;
  correctAnswer?: string;
  options?: string[];
  correctOptionIndex?: number;
  pairs?: Record<string, string>;
};


type ExerciseList = Exercise[];

const LanguageLessonsPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Destructure lessonId, and assume lessonTitle and lessonXpReward are passed as params
  const { lessonId, lessonTitle, lessonXpReward } = params;

  // State management
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [hearts, setHearts] = useState(3);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Directly access exercises array
  const currentExercise = exercises?.[currentExerciseIndex];

  // Adjust progress calculation based on exercises array length
  const progressPercent = exercises?.length
    ? ((currentExerciseIndex + 1) / exercises.length) * 100
    : 0;

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

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

        const response = await fetch(
          `http://localhost:8080/api/exercises?lessonId=${lessonId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Exercise Response Status: " + response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch exercises for lesson');
        }

        const data: ExerciseList = await response.json(); // data is now Exercise[]

        // Set the exercises array directly
        setExercises(data);

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
  }, [lessonId]); // Depend on lessonId

  const handleAnswerSelect = (answer: string) => {
    if (!currentExercise) return;

    if (currentExercise.type === 'matching') {
      if (!selectedMatch) {
        setSelectedMatch(answer);
      } else {
        const isPairValid = Object.entries(currentExercise.pairs || {}).some(
          ([key, value]) =>
            (key === selectedMatch && value === answer) ||
            (value === selectedMatch && key === answer)
        );

        if (isPairValid) {
          setMatchedPairs({
            ...matchedPairs,
            [selectedMatch]: answer,
            [answer]: selectedMatch
          });
          // After a successful match, if all pairs are matched, show next button
          if (Object.keys(matchedPairs).length + 2 === Object.keys(currentExercise.pairs || {}).length * 2) {
            setShowNextButton(true);
          }
        } else {
          setHearts(prev => prev - 1);
          // If hearts reach 0, you might want to end the lesson or go to a "game over" screen
        }
        setSelectedMatch(null);
      }
    } else {
      setSelectedAnswer(answer);
    }
    // For non-matching exercises, always show next button after selection
    if (currentExercise.type !== 'matching') {
      setShowNextButton(true);
    }
  };

  const handleNext = () => {
    if (!currentExercise) return;

    let correct = false;

    if (currentExercise.type === 'matching') {
      // Check if all pairs are correctly matched
      correct = Object.entries(currentExercise.pairs || {}).every(
        ([key, value]) => matchedPairs[key] === value || matchedPairs[value] === key
      );
    } else if (currentExercise.type === 'multiple_choice') {
      correct = selectedAnswer === currentExercise.options?.[currentExercise.correctOptionIndex || 0];
    } else { // Assuming 'translation' type
      correct = selectedAnswer === currentExercise.correctAnswer;
    }

    setIsCorrect(correct);
    setShowFeedbackModal(true);

    if (correct) {
      setXp(prev => prev + (currentExercise.xpReward || 0));
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      setHearts(prev => prev - currentExercise.heartsCost); // Deduct hearts for incorrect answer
    }
  };

  const continueToNextExercise = () => {
    setShowFeedbackModal(false);

    // Check if hearts are 0 after feedback, before moving to next exercise
    if (hearts <= 0) {
      // Handle game over or lesson failure
      // For now, let's just go back to home or show a specific failure modal
      router.push('/(root)/(tabs)/englishPages/beginner/HomepageTabs/home'); // Or a specific failure screen
      return;
    }

    Animated.timing(progress, {
      toValue: exercises?.length ?
        ((currentExerciseIndex + 1) / exercises.length) * 100 : 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();

    if (exercises && currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setSelectedAnswer(null);
      setShowNextButton(false);
      setMatchedPairs({});
      setSelectedMatch(null);
    } else {
      setShowCompletionModal(true);
      completeLesson();
    }
  };

  const completeLesson = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      // Use lessonId from params, as 'lesson' state no longer holds it
      if (!accessToken || !lessonId) return;

      await fetch(
        `http://localhost:8080/api/lessons/${lessonId}/complete`,
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
      return (
        <View style={styles.questionContainer}>
          <Text>No exercise available at this index.</Text>
        </View>
      );
    }

    switch (currentExercise.type) {
      case 'translation':
      case 'multiple_choice':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentExercise.question}</Text>
            <View style={styles.optionsContainer}>
              {currentExercise.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    // Apply correct/incorrect styling only after feedback is shown
                    showFeedbackModal && selectedAnswer === option && isCorrect && styles.correctOption,
                    showFeedbackModal && selectedAnswer === option && !isCorrect && styles.incorrectOption
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  activeOpacity={0.7}
                  disabled={showFeedbackModal} // Disable options after submission
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'matching':
        const leftItems = Object.keys(currentExercise.pairs || {});
        const rightItems = Object.values(currentExercise.pairs || {});

        // Combine and shuffle items for display flexibility if needed,
        // but for basic matching, keeping them separate might be fine.
        // Ensure that order for pairs is not fixed visually unless intended.

        // Filter out items already matched
        const availableLeftItems = leftItems.filter(item => !matchedPairs[item]);
        const availableRightItems = rightItems.filter(item => !Object.values(matchedPairs).includes(item));

        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentExercise.question}</Text>
            <View style={styles.matchColumns}>
              <View style={styles.matchColumn}>
                {leftItems.map((item) => ( // Render all items but disable matched ones
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.matchOption,
                      selectedMatch === item && styles.selectedMatch,
                      matchedPairs[item] && styles.matchedOption, // Matched state
                      // Feedback styling for matched pairs (optional, based on UI needs)
                      showFeedbackModal && matchedPairs[item] && styles.correctOption,
                      // showFeedbackModal && !matchedPairs[item] && styles.incorrectOption // This might be tricky for partial matches
                    ]}
                    onPress={() => handleAnswerSelect(item)}
                    activeOpacity={0.7}
                    // Disable if feedback is showing or if already matched (either key or value side)
                    disabled={showFeedbackModal || !!matchedPairs[item] || Object.values(matchedPairs).includes(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                    {matchedPairs[item] && (
                      <Ionicons name="checkmark" size={20} color="#58CC02" style={styles.matchCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.matchColumn}>
                {rightItems.map((item) => ( // Render all items but disable matched ones
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.matchOption,
                      selectedMatch === item && styles.selectedMatch,
                      Object.keys(matchedPairs).find(key => matchedPairs[key] === item) && styles.matchedOption, // Matched state
                      // Feedback styling
                      showFeedbackModal && Object.keys(matchedPairs).find(key => matchedPairs[key] === item) && styles.correctOption,
                    ]}
                    onPress={() => handleAnswerSelect(item)}
                    activeOpacity={0.7}
                    // Disable if feedback is showing or if already matched (either key or value side)
                    disabled={showFeedbackModal || !!Object.keys(matchedPairs).find(key => matchedPairs[key] === item) || Object.keys(matchedPairs).includes(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                    {Object.keys(matchedPairs).find(key => matchedPairs[key] === item) && (
                      <Ionicons name="checkmark" size={20} color="#58CC02" style={styles.matchCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.questionContainer}>
            <Text>Unknown exercise type: {currentExercise.type}</Text>
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
            onPress={() => router.back()} // Go back on error
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
      {/* Header */}
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

      {/* Lesson Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Use lessonTitle from params */}
        <Text style={styles.lessonTitle}>{(lessonTitle as string) || "Loading Lesson..."}</Text>
        {renderExercise()}
      </ScrollView>

      {/* Next Button */}
      {showNextButton && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentExerciseIndex < exercises.length - 1 ? 'Next' : 'Finish'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Feedback Modal */}
      <Modal visible={showFeedbackModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            isCorrect ? styles.correctModal : styles.incorrectModal
          ]}>
            <Ionicons
              name={isCorrect ? "checkmark-circle" : "close-circle"}
              size={60}
              color={isCorrect ? "#58CC02" : "#FF3B30"}
            />
            <Text style={styles.feedbackText}>
              {isCorrect ? 'Correct!' : `Incorrect. ${currentExercise?.hint || 'Try again!'}`}
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={continueToNextExercise}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                {hearts <= 0 ? 'End Lesson' : (currentExerciseIndex < exercises.length - 1 ? 'Continue' : 'Finish Lesson')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Completion Modal */}
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
                {/* Use lessonXpReward from params for total XP */}
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

      {/* Streak Indicator */}
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
    paddingBottom: 100
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
  nextButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#58CC02',
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
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
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
    flexDirection: 'row', // To align checkmark
    justifyContent: 'center'
  },
  selectedMatch: {
    borderColor: '#7f6edb',
    backgroundColor: '#edeafd'
  },
  matchedOption: {
    borderColor: '#58CC02',
    backgroundColor: '#E8F5E9'
  },
  matchCheck: {
    position: 'absolute',
    right: 8,
    // top: 8, // Removed top so it aligns better vertically center if text is one line
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center'
  },
  correctModal: {
    borderTopWidth: 8,
    borderTopColor: '#58CC02'
  },
  incorrectModal: {
    borderTopWidth: 8,
    borderTopColor: '#FF3B30'
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center'
  },
  continueButton: {
    backgroundColor: '#58CC02',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
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