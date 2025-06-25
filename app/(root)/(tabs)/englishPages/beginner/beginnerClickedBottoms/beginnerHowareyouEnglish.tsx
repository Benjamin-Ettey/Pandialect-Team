import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// Simulated API fetch for "How are you?" lessons
const fetchHowAreYouLessons = async () => [
  {
    type: 'choice',
    question: "How do you ask someone how they are in English?",
    options: [
      "What's your name?",
      "How are you?",
      "Where are you from?",
      "How old are you?",
    ],
    answer: "How are you?",
    panda: "https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2028258_1280.png",
  },
  {
    type: 'choice',
    question: "Which is a polite response to 'How are you?'",
    options: [
      "I'm fine, thank you.",
      "Go away.",
      "Don't talk to me.",
      "Why do you care?",
    ],
    answer: "I'm fine, thank you.",
    panda: "https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2028258_1280.png",
  },
  {
    type: 'match',
    question: "Match the questions to the correct responses",
    pairs: [
      { left: "How are you?", right: "I'm good, thanks!" },
      { left: "How's it going?", right: "Pretty well!" },
      { left: "How do you do?", right: "How do you do?" },
    ],
    panda: "https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2028258_1280.png",
  },
  {
    type: 'choice',
    question: "Which of these is NOT a way to ask how someone is?",
    options: [
      "How are you?",
      "How's it going?",
      "What's up?",
      "What's your favorite color?",
    ],
    answer: "What's your favorite color?",
    panda: "https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2028258_1280.png",
  },
];

const pandaCongrats = "https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2028258_1280.png";

const beginnerHowareyouEnglish = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const [xp, setXp] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // For match type
  const [matchSelections, setMatchSelections] = useState<{ left: string | null; right: string | null }>({ left: null, right: null });
  const [matchedPairs, setMatchedPairs] = useState<{ [key: string]: string }>({});

  // Progress bar
  const progress = ((current + (showCongrats ? 1 : 0)) / (lessons.length || 1)) * width * 0.8 + width * 0.08;

  useEffect(() => {
    (async () => {
      const data = await fetchHowAreYouLessons();
      setLessons(data);
    })();
  }, []);

  const handleOption = (option: string) => {
    setSelected(option);
    setFeedback('');
  };

  const handleNext = () => {
    if (lessons[current].type === 'choice') {
      if (selected === lessons[current].answer) {
        setXp(xp + 10);
        if (current === lessons.length - 1) {
          setShowCongrats(true);
          setModalVisible(true);
        } else {
          setCurrent(current + 1);
          setSelected(null);
          setFeedback('');
        }
      } else {
        setFeedback('Try again! 🐼');
      }
    } else if (lessons[current].type === 'match') {
      // All pairs matched
      if (Object.keys(matchedPairs).length === lessons[current].pairs.length) {
        setXp(xp + 15);
        if (current === lessons.length - 1) {
          setShowCongrats(true);
          setModalVisible(true);
        } else {
          setCurrent(current + 1);
          setFeedback('');
        }
      } else {
        setFeedback('Match all pairs to continue!');
      }
    }
  };

  // Matching logic
  const handleMatchSelect = (side: 'left' | 'right', value: string) => {
    setMatchSelections((prev) => {
      const updated = { ...prev, [side]: value };
      // If both selected, check for match
      if (updated.left && updated.right) {
        const pair = lessons[current].pairs.find(
          (p: any) => p.left === updated.left && p.right === updated.right
        );
        if (pair && !matchedPairs[updated.left]) {
          setMatchedPairs((prevPairs) => ({ ...prevPairs, [updated.left!]: updated.right! }));
          setFeedback('Matched! 🐼');
          setTimeout(() => setFeedback(''), 700);
        } else {
          setFeedback('Not a match! Try again 🐼');
          setTimeout(() => setFeedback(''), 900);
        }
        return { left: null, right: null };
      }
      return updated;
    });
  };

  const handleModalContinue = () => {
    setModalVisible(false);
    router.replace('/(root)/(tabs)/englishPages/beginner/englishbeginnerHomepage/homeEnglish');
  };

  if (!lessons.length) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#7f6edb', fontSize: 20, fontWeight: 'bold' }}>Loading lessons...</Text>
      </View>
    );
  }

  const lesson = lessons[current];

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBar, { width: progress }]} />
        </View>
        <Text style={styles.progressText}>
          {showCongrats
            ? '100%'
            : `${Math.round(((current + 1) / lessons.length) * 100)}%`}
        </Text>
      </View>

      {/* Panda and Speech Bubble */}
      <View style={styles.pandaContainer}>
        <Image source={{ uri: lesson.panda }} style={styles.pandaImg} />
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            {showCongrats
              ? "🎉 Great job! You've completed this lesson. Click continue to move on!"
              : lesson.type === 'choice'
                ? "Hi! Let's learn how to ask and answer 'How are you?' in English. Choose the correct answer below!"
                : "Match the questions to the correct responses by tapping one from each side."}
          </Text>
        </View>
      </View>

      {/* XP Display */}
      <View style={styles.xpBox}>
        <Ionicons name="star" size={22} color="#f7c948" />
        <Text style={styles.xpText}>{xp} XP</Text>
      </View>

      {/* Lesson Content */}
      {!showCongrats && lesson.type === 'choice' && (
        <View style={styles.lessonBox}>
          <Text style={styles.question}>{lesson.question}</Text>
          {lesson.options.map((option: string) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionBtn,
                selected === option && {
                  backgroundColor:
                    option === lesson.answer
                      ? '#b6eeb7'
                      : '#f8d7da',
                  borderColor:
                    option === lesson.answer
                      ? '#3bb273'
                      : '#e74c3c',
                },
              ]}
              onPress={() => handleOption(option)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
          <TouchableOpacity
            style={[
              styles.nextBtn,
              { backgroundColor: selected ? '#7f6edb' : '#ccc' },
            ]}
            onPress={handleNext}
            disabled={!selected}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Matching Lesson */}
      {!showCongrats && lesson.type === 'match' && (
        <View style={styles.lessonBox}>
          <Text style={styles.question}>{lesson.question}</Text>
          <View style={styles.matchRow}>
            <View style={{ flex: 1 }}>
              {lesson.pairs.map((pair: any) => (
                <TouchableOpacity
                  key={pair.left}
                  style={[
                    styles.matchBtn,
                    matchSelections.left === pair.left && { backgroundColor: '#b6eeb7', borderColor: '#3bb273' },
                    matchedPairs[pair.left] && { backgroundColor: '#b6eeb7', borderColor: '#3bb273', opacity: 0.6 },
                  ]}
                  disabled={!!matchedPairs[pair.left]}
                  onPress={() => handleMatchSelect('left', pair.left)}
                >
                  <Text style={styles.matchText}>{pair.left}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ width: 18 }} />
            <View style={{ flex: 1 }}>
              {lesson.pairs.map((pair: any) => (
                <TouchableOpacity
                  key={pair.right}
                  style={[
                    styles.matchBtn,
                    matchSelections.right === pair.right && { backgroundColor: '#b6eeb7', borderColor: '#3bb273' },
                    Object.values(matchedPairs).includes(pair.right) && { backgroundColor: '#b6eeb7', borderColor: '#3bb273', opacity: 0.6 },
                  ]}
                  disabled={Object.values(matchedPairs).includes(pair.right)}
                  onPress={() => handleMatchSelect('right', pair.right)}
                >
                  <Text style={styles.matchText}>{pair.right}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
          <TouchableOpacity
            style={[
              styles.nextBtn,
              {
                backgroundColor:
                  Object.keys(matchedPairs).length === lesson.pairs.length
                    ? '#7f6edb'
                    : '#ccc',
              },
            ]}
            onPress={handleNext}
            disabled={Object.keys(matchedPairs).length !== lesson.pairs.length}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Congrats Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Image source={{ uri: pandaCongrats }} style={styles.pandaCongrats} />
            <Text style={styles.congratsText}>🎉 Congratulations!</Text>
            <Text style={styles.congratsSubText}>
              You have mastered asking and answering "How are you?" and earned {xp} XP!
            </Text>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleModalContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default beginnerHowareyouEnglish;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 12,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  progressBarBg: {
    width: '85%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: 14,
    backgroundColor: '#3bb273',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 13,
    color: '#3bb273',
    fontWeight: 'bold',
    marginTop: -2,
  },
  pandaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 18,
    width: '100%',
    justifyContent: 'center',
  },
  pandaImg: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    maxWidth: '70%',
    borderWidth: 1.5,
    borderColor: '#7f6edb',
    shadowColor: '#7f6edb',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  speechText: {
    color: '#7f6edb',
    fontSize: 15,
    fontWeight: 'bold',
  },
  xpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f6ff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    marginTop: -8,
  },
  xpText: {
    marginLeft: 6,
    color: '#7f6edb',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lessonBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#7f6edb',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 18,
  },
  question: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  optionBtn: {
    width: '100%',
    backgroundColor: '#edeafd',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#edeafd',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  feedback: {
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    fontSize: 15,
  },
  nextBtn: {
    marginTop: 18,
    backgroundColor: '#7f6edb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    width: '100%',
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  matchRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  matchBtn: {
    backgroundColor: '#edeafd',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#edeafd',
    alignItems: 'center',
    marginHorizontal: 2,
    minWidth: 90,
  },
  matchText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    position: 'relative',
  },
  pandaCongrats: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  congratsText: {
    fontSize: 22,
    color: '#3bb273',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  congratsSubText: {
    fontSize: 16,
    color: '#7f6edb',
    marginBottom: 8,
    textAlign: 'center',
  },
  continueBtn: {
    backgroundColor: '#7f6edb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 18,
    width: '100%',
  },
  continueBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});