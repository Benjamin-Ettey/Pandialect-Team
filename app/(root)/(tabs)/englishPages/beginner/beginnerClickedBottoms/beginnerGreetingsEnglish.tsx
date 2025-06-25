import React, { useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Simulated API data (replace with real API fetch if needed)
const greetingsData = [
  {
    question: "How do you say 'Hello' in English?",
    options: ['Hola', 'Bonjour', 'Hello', 'Ciao'],
    answer: 'Hello',
  },
  {
    question: "How do you say 'Good morning' in English?",
    options: ['Buongiorno', 'Good morning', 'Guten Morgen', 'Bonjour'],
    answer: 'Good morning',
  },
  {
    question: "How do you say 'Hi' in English?",
    options: ['Salut', 'Hi', 'Hallo', 'Ciao'],
    answer: 'Hi',
  },
];

const pandaImage = 'https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2028258_1280.png'; // Trusted panda image

const { width } = Dimensions.get('window');

const BeginnerGreetingsEnglish = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);

  // Progress bar width calculation
  const progress = ((current + (showCongrats ? 1 : 0)) / greetingsData.length) * width * 0.8 + width * 0.08;

  const handleOption = (option: string) => {
    setSelected(option);
    setFeedback('');
  };

  const handleNext = () => {
    if (selected === greetingsData[current].answer) {
      if (current === greetingsData.length - 1) {
        setShowCongrats(true);
        setFeedback('');
      } else {
        setCurrent(current + 1);
        setSelected(null);
        setFeedback('');
      }
    } else {
      setFeedback('Try again! 🐼');
    }
  };

  const handleContinue = () => {
    // Replace with your navigation logic to the next page
    // router.push('/your-next-page');
  };

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
            : `${Math.round(((current + 1) / greetingsData.length) * 100)}%`}
        </Text>
      </View>

      {/* Panda and Speech Bubble */}
      <View style={styles.pandaContainer}>
        <Image source={{ uri: pandaImage }} style={styles.pandaImg} />
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            {showCongrats
              ? "🎉 Great job! You've completed greetings. Click continue to move on!"
              : "Hi! Let's learn English greetings. Choose the correct answer below!"}
          </Text>
        </View>
      </View>

      {/* Lesson Content */}
      {!showCongrats ? (
        <View style={styles.lessonBox}>
          <Text style={styles.question}>{greetingsData[current].question}</Text>
          {greetingsData[current].options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionBtn,
                selected === option && {
                  backgroundColor:
                    option === greetingsData[current].answer
                      ? '#b6eeb7'
                      : '#f8d7da',
                  borderColor:
                    option === greetingsData[current].answer
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
      ) : (
        <View style={styles.lessonBox}>
          <Text style={styles.congratsText}>🎉 Congratulations!</Text>
          <Text style={styles.congratsSubText}>
            You have mastered English greetings.
          </Text>
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: '#7f6edb', marginTop: 18 }]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BeginnerGreetingsEnglish;

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
    marginBottom: 18,
    textAlign: 'center',
  },
});