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
  Modal, // Modal is used for the hearts exhausted message
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

type ExerciseType = 'translation' | 'multiple_choice' | 'matching';

// Define a type for individual items in a matching exercise
type MatchItem = {
  id: string; // Unique ID for the item (e.g., 'left-hello', 'right-bonjour')
  value: string; // The text to display for the item
  side: 'left' | 'right'; // Indicates which column it belongs to
  originalKey?: string; // Stores the original key from `pairs` for left-side items
  originalValue?: string; // Stores the original value from `pairs` for right-side items
};

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
  // matchedPairs now stores IDs of matched items: { itemId1: itemId2, itemId2: itemId1 }
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  // selectedMatch now stores the ID of the first selected item
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  // New state to temporarily store IDs of incorrectly matched items for visual feedback
  const [incorrectlyMatchedPair, setIncorrectlyMatchedPair] = useState<string[]>([]);
  const [hearts, setHearts] = useState(3);
  const [showHeartsExhaustedModal, setShowHeartsExhaustedModal] = useState(false); // New state for hearts modal

  // States to hold the shuffled MatchItem objects for matching exercises, ensuring stable order
  const [shuffledLeftMatchItems, setShuffledLeftMatchItems] = useState<MatchItem[]>([]);
  const [shuffledRightMatchItems, setShuffledRightMatchItems] = useState<MatchItem[]>([]);

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
      // For matching, show check button when all original left items have a matched right item
      const allOriginalPairsMatched = Object.keys(currentExercise.pairs || {}).length > 0 &&
        Object.keys(currentExercise.pairs || {}).every(key => {
          // Check if the original left item's ID has a corresponding match in matchedPairs
          const leftItemId = `left-${key}`;
          return !!matchedPairs[leftItemId];
        });
      setShowCheckButton(allOriginalPairsMatched && !showContinueButton);
    } else {
      setShowCheckButton(false);
    }
  }, [typedTranslation, selectedAnswer, matchedPairs, currentExercise, showContinueButton]);

  // Effect to prepare and shuffle matching items only once when a new matching exercise loads
  useEffect(() => {
    if (currentExercise && currentExercise.type === 'matching' && currentExercise.pairs) {
      // Create MatchItem objects for left side
      const leftItemsData: MatchItem[] = Object.keys(currentExercise.pairs).map(key => ({
        id: `left-${key}`, // Unique ID for left item
        value: key,
        side: 'left',
        originalKey: key
      }));
      // Create MatchItem objects for right side
      const rightItemsData: MatchItem[] = Object.values(currentExercise.pairs).map(value => ({
        id: `right-${value}`, // Unique ID for right item
        value: value,
        side: 'right',
        originalValue: value
      }));

      setShuffledLeftMatchItems(shuffleArray(leftItemsData));
      setShuffledRightMatchItems(shuffleArray(rightItemsData));
      setMatchedPairs({}); // Clear matched pairs for the new exercise
      setSelectedMatch(null); // Clear selected match for the new exercise
      setIncorrectlyMatchedPair([]); // Clear any incorrect highlights
    }
  }, [currentExerciseIndex, currentExercise]); // Re-run when exercise changes

  // Effect to fetch exercises for the lesson
  useEffect(() => {
    console.log('LanguageLessonsPage: useEffect triggered. Current lessonId:', lessonId);

    // --- Aggressive State Reset for a new lesson ---
    setLoading(true); // Always set loading to true at the start of a new fetch
    setError(null);    // Clear any previous errors
    setExercises([]);  // Clear previous exercises data
    setCurrentExerciseIndex(0); // Reset exercise index to start from the first exercise
    setSelectedAnswer(null); // Clear any previous selections
    setTypedTranslation(''); // Clear translation input
    setShowCheckButton(false); // Reset button visibility
    setShowContinueButton(false); // Reset button visibility
    setFeedbackMessage(null); // Clear feedback
    setIsCorrect(false); // Reset correctness
    setMatchedPairs({}); // Clear matching specific states
    setSelectedMatch(null);
    setIncorrectlyMatchedPair([]);
    setHearts(3); // Reset hearts for a new lesson start
    setShowHeartsExhaustedModal(false); // Ensure modal is hidden on new lesson load
    // --- End Aggressive State Reset ---

    const fetchExercisesForLesson = async () => {
      console.log('LanguageLessonsPage: fetchExercisesForLesson function executed.');
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          console.log('LanguageLessonsPage: No access token found, redirecting to login.');
          router.push('/login');
          return;
        }

        if (!lessonId) {
          console.warn('LanguageLessonsPage: lessonId is undefined, cannot fetch exercises.');
          setLoading(false);
          setError('Lesson ID is missing. Please go back and select a lesson.');
          return;
        }

        console.log(`LanguageLessonsPage: Fetching exercises from: ${BASE_API_URL}/api/exercises?lessonId=${lessonId}`);
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
          const errorData = await response.json();
          console.error('LanguageLessonsPage: Failed to fetch exercises, server response:', errorData);
          throw new Error(errorData.message || 'Failed to fetch exercises for lesson');
        }

        const data: ExerciseList = await response.json();
        console.log('LanguageLessonsPage: Successfully fetched exercises:', data.length, 'items.');
        setExercises(shuffleArray(data));
      } catch (err: any) {
        console.error('LanguageLessonsPage: Error during fetchExercisesForLesson:', err);
        setError(err.message || 'Failed to load exercises. Please try again.');
      } finally {
        console.log('LanguageLessonsPage: fetchExercisesForLesson finally block: setting loading to false.');
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchExercisesForLesson();
    } else {
      // If lessonId is not available initially (e.g., direct navigation without params)
      setLoading(false);
      setError('No lesson selected. Please go back to the home page and choose a lesson.');
      console.log('LanguageLessonsPage: lessonId is null or undefined on initial load, stopping loading.');
    }
  }, [lessonId, router]); // Depend on lessonId and router for re-fetching and navigation


  // handleAnswerSelect now takes a MatchItem object
  const handleAnswerSelect = (item: MatchItem) => {
    if (!currentExercise || showContinueButton) return; // Prevent selection after feedback is shown

    if (currentExercise.type === 'matching') {
      if (!selectedMatch) {
        setSelectedMatch(item.id);
      } else {
        const firstSelectedItem = [...shuffledLeftMatchItems, ...shuffledRightMatchItems].find(
          (matchItem) => matchItem.id === selectedMatch
        );
        const secondSelectedItem = item;

        if (!firstSelectedItem || firstSelectedItem.id === secondSelectedItem.id || firstSelectedItem.side === secondSelectedItem.side) {
          setSelectedMatch(null);
          return;
        }

        let isMatch = false;

        if (firstSelectedItem.side === 'left' && secondSelectedItem.side === 'right') {
          if (currentExercise.pairs?.[firstSelectedItem.value] === secondSelectedItem.value) {
            isMatch = true;
          }
        } else if (firstSelectedItem.side === 'right' && secondSelectedItem.side === 'left') {
          if (currentExercise.pairs?.[secondSelectedItem.value] === firstSelectedItem.value) {
            isMatch = true;
          }
        }

        if (isMatch) {
          setMatchedPairs(prev => ({
            ...prev,
            [firstSelectedItem.id]: secondSelectedItem.id,
            [secondSelectedItem.id]: firstSelectedItem.id
          }));
        } else {
          // Decrement hearts and check if hearts reach 0
          setHearts(prev => {
            const newHearts = Math.max(prev - 1, 0);
            if (newHearts === 0) {
              setShowHeartsExhaustedModal(true);
              setFeedbackMessage(null);
              setShowCheckButton(false);
              setShowContinueButton(false);
            }
            return newHearts;
          });
          setIncorrectlyMatchedPair([firstSelectedItem.id, secondSelectedItem.id]);
          setTimeout(() => {
            setIncorrectlyMatchedPair([]);
          }, 700);
        }
        setSelectedMatch(null);
      }
    } else if (currentExercise.type === 'multiple_choice') {
      setSelectedAnswer(item.value);
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
      const expectedPairs = currentExercise.pairs || {};
      let allPairsCorrectAndComplete = true;

      // Check if every expected left item has been correctly matched
      Object.keys(expectedPairs).forEach(leftOriginalValue => {
        const expectedRightOriginalValue = expectedPairs[leftOriginalValue];
        const leftItemId = `left-${leftOriginalValue}`;
        const rightItemId = `right-${expectedRightOriginalValue}`;

        // If the left item is not in matchedPairs, or its matched value is incorrect
        if (!matchedPairs[leftItemId] || matchedPairs[leftItemId] !== rightItemId) {
          allPairsCorrectAndComplete = false;
        }
      });

      // Also ensure no extra incorrect pairs were made (by checking total matched pairs count)
      // Since we store A:B and B:A, the count should be double the original pairs count
      if (Object.keys(matchedPairs).length !== Object.keys(expectedPairs).length * 2) {
        allPairsCorrectAndComplete = false;
      }

      correct = allPairsCorrectAndComplete;
      submittedAnswer = JSON.stringify(matchedPairs); // For debugging/logging
    }

    if (correct) {
      setIsCorrect(true);
      setFeedbackMessage('Correct!');
      setXp(prev => prev + (currentExercise.xpReward || 0));
      setStreak(prev => prev + 1);
      setShowContinueButton(true);
    } else {
      // Calculate new hearts BEFORE setting state, to check if it hits zero
      const newHeartsAfterCost = Math.max(hearts - currentExercise.heartsCost, 0);

      if (newHeartsAfterCost === 0) {
        // Hearts are exhausted, show modal immediately
        setHearts(newHeartsAfterCost); // Update hearts state
        setShowHeartsExhaustedModal(true);
        // Clear any exercise-specific feedback and buttons
        setFeedbackMessage(null); // Clear feedback message
        setShowCheckButton(false); // Hide check button
        setShowContinueButton(false); // Hide continue button
      } else {
        // Hearts are not exhausted, proceed with regular incorrect feedback
        setIsCorrect(false);
        setFeedbackMessage('Incorrect.');
        setHearts(newHeartsAfterCost); // Update hearts state
        setStreak(0);
        setShowContinueButton(true);
      }
    }
  };

  const continueToNextExercise = () => {
    setFeedbackMessage(null); // Clear feedback
    setShowContinueButton(false); // Hide continue button
    setTypedTranslation(''); // Clear translation input
    setSelectedAnswer(null); // Clear multiple choice selection
    setMatchedPairs({}); // Clear matching pairs for the next exercise
    setSelectedMatch(null); // Clear matching selection for the next exercise
    setIncorrectlyMatchedPair([]); // Clear any incorrect highlights

    // If hearts are 0, the modal should handle navigation, so prevent further exercise progression
    if (hearts <= 0) {
      // The modal will handle navigation to home
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
      // Navigate to the new LessonCompletionPage instead of showing a modal
      router.replace({
        pathname: '/(root)/(tabs)/englishPages/beginner/LessonCompletionPage',
        params: {
          xpGained: xp, // Total XP gained in this lesson
          lessonTitle: lessonTitle,
          totalXpPossible: lessonXpReward, // Total XP possible for the lesson
          currentStreak: streak // Current streak
        }
      });
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

  const handleHeartsExhaustedAndGoHome = () => {
    setShowHeartsExhaustedModal(false);
    router.replace('/(root)/(tabs)/englishPages/beginner/HomepageTabs/home');
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
                  onPress={() => handleAnswerSelect({ id: option, value: option, side: 'left' })} // Pass a dummy MatchItem for MC
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

        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentExercise.question}</Text>
            <View style={styles.matchColumns}>
              <View style={styles.matchColumn}>
                {shuffledLeftMatchItems.map((item) => (
                  <TouchableOpacity
                    key={item.id} // Use the unique ID as key
                    style={[
                      styles.matchOption,
                      selectedMatch === item.id && styles.selectedMatch, // Highlight if this item is the first selection
                      !!matchedPairs[item.id] && styles.matchedOption, // Apply matched style immediately
                      incorrectlyMatchedPair.includes(item.id) && styles.incorrectTemporaryMatch, // Highlight if part of an incorrect temporary match
                      // Styles after checking (showContinueButton)
                      showContinueButton && !!matchedPairs[item.id] && (currentExercise.pairs?.[item.value] === shuffledRightMatchItems.find(rItem => rItem.id === matchedPairs[item.id])?.value ? styles.correctOption : styles.incorrectOption),
                      showContinueButton && selectedMatch === item.id && !isCorrect && styles.incorrectOption // Show incorrect if selected and overall answer is wrong
                    ]}
                    onPress={() => handleAnswerSelect(item)}
                    activeOpacity={0.7}
                    disabled={
                      showContinueButton || // Disable all if feedback is showing
                      !!matchedPairs[item.id] || // Disable if this item is already part of a matched pair
                      (selectedMatch !== null && selectedMatch !== item.id && item.side === shuffledLeftMatchItems.find(i => i.id === selectedMatch)?.side) // Disable other items on the same side if one is selected
                    }
                  >
                    <Text style={styles.optionText}>{item.value}</Text>
                    {!!matchedPairs[item.id] && ( // Show checkmark if matched
                      <Ionicons name="checkmark" size={20} color="#58CC02" style={styles.matchCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.matchColumn}>
                {shuffledRightMatchItems.map((item) => (
                  <TouchableOpacity
                    key={item.id} // Use the unique ID as key
                    style={[
                      styles.matchOption,
                      selectedMatch === item.id && styles.selectedMatch, // Highlight if this item is the first selection
                      !!matchedPairs[item.id] && styles.matchedOption, // Apply matched style immediately
                      incorrectlyMatchedPair.includes(item.id) && styles.incorrectTemporaryMatch, // Highlight if part of an incorrect temporary match
                      // Styles after checking (showContinueButton)
                      showContinueButton && !!matchedPairs[item.id] && (currentExercise.pairs?.[shuffledLeftMatchItems.find(lItem => lItem.id === matchedPairs[item.id])?.value] === item.value ? styles.correctOption : styles.incorrectOption),
                      showContinueButton && selectedMatch === item.id && !isCorrect && styles.incorrectOption // Show incorrect if selected and overall answer is wrong
                    ]}
                    onPress={() => handleAnswerSelect(item)}
                    activeOpacity={0.7}
                    disabled={
                      showContinueButton || // Disable all if feedback is showing
                      !!matchedPairs[item.id] || // Disable if this item is already part of a matched pair
                      (selectedMatch !== null && selectedMatch !== item.id && item.side === shuffledRightMatchItems.find(i => i.id === selectedMatch)?.side) // Disable other items on the same side if one is selected
                    }
                  >
                    <Text style={styles.optionText}>{item.value}</Text>
                    {!!matchedPairs[item.id] && ( // Show checkmark if matched
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
          disabled={showHeartsExhaustedModal} // Disable continue if hearts modal is showing
        >
          <Text style={styles.actionButtonText}>
            {hearts <= 0 ? 'End Lesson' : (currentExerciseIndex < exercises.length - 1 ? 'Continue' : 'Finish Lesson')}
          </Text>
        </TouchableOpacity>
      )}

      {/* Hearts Exhausted Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showHeartsExhaustedModal}
        onRequestClose={() => { }} // Handle Android back button
      >
        <View style={styles.heartsExhaustedModalContainer}>
          <View style={styles.heartsExhaustedModalContent}>
            <Ionicons name="heart-dislike-outline" size={60} color="#FF3B30" style={styles.heartsExhaustedIcon} />
            <Text style={styles.heartsExhaustedTitle}>Out of Hearts!</Text>
            <Text style={styles.heartsExhaustedMessage}>
              You've run out of hearts for this lesson. Don't worry, you can try again later!
            </Text>
            <TouchableOpacity
              style={styles.heartsExhaustedButton}
              onPress={handleHeartsExhaustedAndGoHome}
              activeOpacity={0.8}
            >
              <Text style={styles.heartsExhaustedButtonText}>Go to Home</Text>
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
    borderColor: '#58CC02', // Green border for matched items
    backgroundColor: '#E8F5E9' // Light green background for matched items
  },
  incorrectTemporaryMatch: {
    borderColor: '#FF3B30', // Red border for temporarily incorrect match
    backgroundColor: '#FFEBEE', // Light red background
  },
  matchCheck: {
    position: 'absolute',
    right: 8
  },
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
  },
  // New styles for Hearts Exhausted Modal
  heartsExhaustedModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  heartsExhaustedModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  heartsExhaustedIcon: {
    marginBottom: 20,
  },
  heartsExhaustedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10,
    textAlign: 'center',
  },
  heartsExhaustedMessage: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 25,
  },
  heartsExhaustedButton: {
    backgroundColor: '#FF3B30', // Red button
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
  },
  heartsExhaustedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LanguageLessonsPage;
