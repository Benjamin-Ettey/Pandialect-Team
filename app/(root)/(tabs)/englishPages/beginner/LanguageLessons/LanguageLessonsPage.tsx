import { FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

type QuestionType = 'translate' | 'listen' | 'match' | 'speak' | 'fill-blank';

type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  imageUrl?: string;
  sentence?: string;
  blankIndex?: number;
};

type Lesson = {
  id: string;
  title: string;
  description: string;
  xp: number;
  questions: Question[];
};

const LanguageLessonsPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lang, level, lesson: lessonId } = params;

  // Enhanced lesson data
  const lesson: Lesson = {
    id: 'greetings',
    title: 'Basic Greetings',
    description: 'Master essential Spanish greetings',
    xp: 30,
    questions: [
      {
        id: '1',
        type: 'translate',
        prompt: 'How do you say "Hello" in Spanish?',
        correctAnswer: 'Hola',
        options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/1973/1973807.png'
      },
      {
        id: '2',
        type: 'fill-blank',
        prompt: 'Complete the greeting:',
        sentence: "___ días (Good morning)",
        correctAnswer: 'Buenos',
        options: ['Buenos', 'Buenas', 'Hola', 'Bien'],
        blankIndex: 0
      },
      {
        id: '3',
        type: 'match',
        prompt: 'Match the Spanish with the English',
        correctAnswer: 'Hola=Hello\nGracias=Thank you\nAdiós=Goodbye',
        options: ['Hola', 'Hello', 'Gracias', 'Thank you', 'Adiós', 'Goodbye']
      }
    ]
  };

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  const handleAnswerSelect = (answer: string) => {
    if (currentQuestion.type === 'match') {
      // For match questions, handle pair selection
      if (!selectedMatch) {
        setSelectedMatch(answer);
      } else {
        // Check if this is a valid pair
        const correctPairs = currentQuestion.correctAnswer.split('\n');
        const isPairValid = correctPairs.some(pair => {
          const [left, right] = pair.split('=');
          return (left === selectedMatch && right === answer) ||
            (right === selectedMatch && left === answer);
        });

        if (isPairValid) {
          setMatchedPairs({
            ...matchedPairs,
            [selectedMatch]: answer,
            [answer]: selectedMatch
          });
        } else {
          // Wrong pair - lose a heart
          setHearts(prev => prev - 1);
        }
        setSelectedMatch(null);
      }
    } else {
      setSelectedAnswer(answer);
    }
    setShowNextButton(true);
  };

  const handleNext = () => {
    // Validate answer
    let correct = false;

    if (currentQuestion.type === 'match') {
      // Validate matches
      const correctPairs = currentQuestion.correctAnswer.split('\n');
      correct = correctPairs.every(pair => {
        const [spanish, english] = pair.split('=');
        return matchedPairs[spanish] === english || matchedPairs[english] === spanish;
      });
    } else {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    }

    setIsCorrect(correct);
    setShowFeedbackModal(true);

    if (correct) {
      setXp(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const continueToNextQuestion = () => {
    setShowFeedbackModal(false);

    // Animate progress
    Animated.timing(progress, {
      toValue: ((currentQuestionIndex + 1) / lesson.questions.length) * 100,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();

    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowNextButton(false);
      setMatchedPairs({});
      setSelectedMatch(null);
    } else {
      // Lesson completed
      setShowCompletionModal(true);
    }
  };

  const handleContinueHome = () => {
    // Here you would typically save progress to backend
    setShowCompletionModal(false);
    router.push('/(root)/(tabs)/englishPages/beginner/HomepageTabs/home');
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'translate':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
            {currentQuestion.imageUrl && (
              <Image
                source={{ uri: currentQuestion.imageUrl }}
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.optionsContainer}>
              {currentQuestion.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    selectedAnswer === option && isCorrect && styles.correctOption,
                    selectedAnswer === option && !isCorrect && styles.incorrectOption
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  activeOpacity={0.7}
                  disabled={showFeedbackModal}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'fill-blank':
        const sentenceParts = currentQuestion.sentence?.split('___') || [];
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
            <View style={styles.sentenceContainer}>
              <Text style={styles.sentenceText}>{sentenceParts[0]}</Text>
              <View style={[
                styles.blankSpace,
                selectedAnswer && styles.blankFilled
              ]}>
                {selectedAnswer ? (
                  <Text style={styles.blankText}>{selectedAnswer}</Text>
                ) : (
                  <Text style={styles.blankPlaceholder}>______</Text>
                )}
              </View>
              <Text style={styles.sentenceText}>{sentenceParts[1]}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {currentQuestion.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    selectedAnswer === option && isCorrect && styles.correctOption,
                    selectedAnswer === option && !isCorrect && styles.incorrectOption
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  activeOpacity={0.7}
                  disabled={showFeedbackModal}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'match':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
            <View style={styles.matchColumns}>
              <View style={styles.matchColumn}>
                {currentQuestion.options?.filter((_, i) => i % 2 === 0).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.matchOption,
                      selectedMatch === option && styles.selectedMatch,
                      matchedPairs[option] && styles.matchedOption,
                      showFeedbackModal && matchedPairs[option] && styles.correctOption,
                      showFeedbackModal && !matchedPairs[option] && styles.incorrectOption
                    ]}
                    onPress={() => handleAnswerSelect(option)}
                    activeOpacity={0.7}
                    disabled={showFeedbackModal || !!matchedPairs[option]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                    {matchedPairs[option] && (
                      <Ionicons name="checkmark" size={20} color="#58CC02" style={styles.matchCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.matchColumn}>
                {currentQuestion.options?.filter((_, i) => i % 2 === 1).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.matchOption,
                      selectedMatch === option && styles.selectedMatch,
                      matchedPairs[option] && styles.matchedOption,
                      showFeedbackModal && matchedPairs[option] && styles.correctOption,
                      showFeedbackModal && !matchedPairs[option] && styles.incorrectOption
                    ]}
                    onPress={() => handleAnswerSelect(option)}
                    activeOpacity={0.7}
                    disabled={showFeedbackModal || !!matchedPairs[option]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                    {matchedPairs[option] && (
                      <Ionicons name="checkmark" size={20} color="#58CC02" style={styles.matchCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

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
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        {renderQuestion()}
      </ScrollView>

      {/* Next Button */}
      {showNextButton && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < lesson.questions.length - 1 ? 'Next' : 'Finish'}
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
              {isCorrect ? 'Correct' : `Incorrect. The answer is: ${currentQuestion.correctAnswer}`}
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={continueToNextQuestion}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                {currentQuestionIndex < lesson.questions.length - 1 ? 'Continue' : 'Finish Lesson'}
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
            <Text style={styles.completionSubtitle}>You've mastered {lesson.title}</Text>

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
                <Text style={styles.statText}>Perfect Score!</Text>
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
  questionImage: {
    width: '100%',
    height: 150,
    marginVertical: 16,
    borderRadius: 8,
    alignSelf: 'center'
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
  sentenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    flexWrap: 'wrap'
  },
  sentenceText: {
    fontSize: 18,
    color: '#333'
  },
  blankSpace: {
    minWidth: 100,
    borderBottomWidth: 2,
    borderBottomColor: '#58CC02',
    marginHorizontal: 8,
    paddingVertical: 4
  },
  blankFilled: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12
  },
  blankText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333'
  },
  blankPlaceholder: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center'
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
    alignItems: 'center'
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
    top: 8
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
  }
});

export default LanguageLessonsPage;