import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Constants (unchanged from your original)
const LANGUAGES = [
  { name: 'Spanish', flag: '🇪🇸', code: 'es' },
  { name: 'French', flag: '🇫🇷', code: 'fr' },
  { name: 'German', flag: '🇩🇪', code: 'de' },
  { name: 'Italian', flag: '🇮🇹', code: 'it' },
  { name: 'Mandarin', flag: '🇨🇳', code: 'zh' },
  { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
];

const LEVELS = [
  { name: 'Beginner', code: 'beginner' },
  { name: 'Intermediate', code: 'intermediate' },
  { name: 'Advanced', code: 'advanced' },
];

const VOCABULARY_CATEGORIES = [
  {
    title: 'Daily Words',
    description: 'Learn a new word every day',
    icon: 'book',
    color: '#7f6edb',
    route: 'daily-vocabulary'
  },
  {
    title: 'Food & Dining',
    description: 'Essential vocabulary for restaurants',
    icon: 'utensils',
    color: '#ff6d00',
    route: 'food-vocabulary'
  },
  {
    title: 'Travel Phrases',
    description: 'Words you need when traveling',
    icon: 'plane',
    color: '#00b4d8',
    route: 'travel-vocabulary'
  },
  {
    title: 'Did You Know?',
    description: 'Fun facts about the language',
    icon: 'lightbulb',
    color: '#9c27b0',
    route: 'fun-facts'
  },
];

const GRAMMAR_TOPICS = [
  {
    title: 'Verb Conjugation',
    description: 'Master present tense verbs',
    icon: 'language',
    color: '#2ecc71',
    route: 'verb-conjugation'
  },
  {
    title: 'Sentence Structure',
    description: 'Build proper sentences',
    icon: 'layer-group',
    color: '#e74c3c',
    route: 'sentence-structure'
  },
  {
    title: 'Tenses',
    description: 'Past, present and future',
    icon: 'clock',
    color: '#f39c12',
    route: 'tenses'
  },
];

// Sample data (unchanged)
const DAILY_WORDS = {
  es: { word: "Hola", pronunciation: "OH-lah", meaning: "Hello", example: "¡Hola! ¿Cómo estás? - Hello! How are you?" },
  fr: { word: "Bonjour", pronunciation: "bohn-ZHOOR", meaning: "Hello", example: "Bonjour, comment ça va? - Hello, how are you?" },
  de: { word: "Hallo", pronunciation: "HAH-loh", meaning: "Hello", example: "Hallo, wie geht's? - Hello, how are you?" },
  it: { word: "Ciao", pronunciation: "CHOW", meaning: "Hello/Goodbye", example: "Ciao, come stai? - Hello, how are you?" },
  zh: { word: "你好", pronunciation: "Nǐ hǎo", meaning: "Hello", example: "你好吗? - How are you?" },
  ja: { word: "こんにちは", pronunciation: "Konnichiwa", meaning: "Hello", example: "こんにちは、お元気ですか? - Hello, how are you?" }
};

const VERB_CONJUGATIONS = {
  es: {
    verb: "hablar",
    meaning: "to speak",
    conjugations: [
      "Yo hablo - I speak",
      "Tú hablas - You speak",
      "Él/Ella habla - He/She speaks",
      "Nosotros hablamos - We speak",
      "Vosotros habláis - You all speak",
      "Ellos hablan - They speak"
    ]
  },
  fr: {
    verb: "parler",
    meaning: "to speak",
    conjugations: [
      "Je parle - I speak",
      "Tu parles - You speak",
      "Il/Elle parle - He/She speaks",
      "Nous parlons - We speak",
      "Vous parlez - You speak (formal/plural)",
      "Ils/Elles parlent - They speak"
    ]
  }
};

const FUN_FACTS = {
  es: "Spanish is the second most spoken language in the world by native speakers.",
  fr: "French was the official language of England for over 300 years after the Norman Conquest."
};

const bgIllustration = 'https://cdn.pixabay.com/photo/2017/06/10/07/18/panda-2385886_1280.png';

const HomeScreen = () => {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [langModal, setLangModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
  const [levelModal, setLevelModal] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [fireCount, setFireCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [fetchingPractice, setFetchingPractice] = useState(false);
  const [dailyWordModal, setDailyWordModal] = useState(false);
  const [verbConjugationModal, setVerbConjugationModal] = useState(false);
  const [funFactModal, setFunFactModal] = useState(false);
  const [lockedFeatureModal, setLockedFeatureModal] = useState(false);

  const handleLangSelect = (lang) => {
    setLangModal(false);
    setSelectedLang(lang);
  };

  const handleLevelSelect = (level) => {
    setLevelModal(false);
    setSelectedLevel(level);
  };

  const handlePracticePress = (practice) => {
    setSelectedPractice(practice);

    if (practice.title === 'Daily Words') {
      setDailyWordModal(true);
    } else if (practice.title === 'Verb Conjugation') {
      setVerbConjugationModal(true);
    } else if (practice.title === 'Did You Know?') {
      setFunFactModal(true);
    } else {
      setLockedFeatureModal(true);
    }
  };

  const handleStartPractice = () => {
    setModalVisible(false);
    if (selectedPractice) {
      setFetchingPractice(true);
      setTimeout(() => {
        setFetchingPractice(false);
        router.push({
          pathname: `/(root)/(tabs)/practice/${selectedPractice.route}`,
          params: {
            lang: selectedLang.code,
            level: selectedLevel.code,
            type: selectedPractice.title.includes('Words') ? 'vocabulary' : 'grammar'
          },
        });
      }, 1000);
    }
  };

  // Responsive scaling functions
  const scaleSize = (size) => Math.min(width, height) * (size / 375);
  const scaleFont = (size) => Math.min(width, height) * (size / 375);

  return (
    <View style={styles.container}>
      {/* Decorative Background */}
      <Image
        source={{ uri: bgIllustration }}
        style={styles.backgroundImage}
        resizeMode="contain"
        pointerEvents="none"
      />

      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <View style={styles.langSelectorContainer}>
            <TouchableOpacity
              style={styles.langCircle}
              onPress={() => setLangModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>{selectedLang.flag}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLangModal(true)} activeOpacity={0.7}>
              <Ionicons name="chevron-down" size={scaleFont(18)} color="#222" style={styles.chevron} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.levelSelector}
            onPress={() => setLevelModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.levelText}>{selectedLevel.name}</Text>
            <Ionicons name="chevron-down" size={scaleFont(14)} color="#7f6edb" style={styles.chevron} />
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.starContainer}>
              <MaterialCommunityIcons name="star" size={scaleFont(18)} color="#f7c948" />
              <Text style={styles.starText}>{starCount}/30</Text>
            </View>
            <View style={styles.fireContainer}>
              <FontAwesome5 name="fire" size={scaleFont(16)} color="#ff6d00" />
              <Text style={styles.fireText}>{fireCount}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Language Modal */}
      <Modal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setLangModal(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.langOption}
                  onPress={() => handleLangSelect(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.langFlag}>{item.flag}</Text>
                  <Text style={styles.langName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Level Modal */}
      <Modal visible={levelModal} transparent animationType="fade" onRequestClose={() => setLevelModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setLevelModal(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={LEVELS}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.langOption}
                  onPress={() => handleLevelSelect(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.levelName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Loading state */}
      {fetchingPractice && (
        <Modal transparent animationType="fade" visible={fetchingPractice}>
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#7f6edb" />
              <Text style={styles.loadingText}>Preparing your practice...</Text>
            </View>
          </View>
        </Modal>
      )}

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        style={styles.contentScroll}
      >
        <Text style={styles.headerTitle}>
          {selectedLevel.name} - {selectedLang.name}
        </Text>
        <Text style={styles.headerSubtitle}>
          Daily practice to improve your skills
        </Text>

        {/* Vocabulary Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Vocabulary Practice</Text>
          <Text style={styles.sectionDescription}>
            Learn new words and phrases daily
          </Text>

          <View style={styles.practiceGrid}>
            {VOCABULARY_CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={[styles.practiceCard, { backgroundColor: `${item.color}15` }]}
                activeOpacity={0.8}
                onPress={() => handlePracticePress(item)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <FontAwesome5 name={item.icon} size={scaleFont(20)} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Grammar Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Grammar Practice</Text>
          <Text style={styles.sectionDescription}>
            Master the rules of {selectedLang.name}
          </Text>

          <View style={styles.practiceGrid}>
            {GRAMMAR_TOPICS.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={[styles.practiceCard, { backgroundColor: `${item.color}15` }]}
                activeOpacity={0.8}
                onPress={() => handlePracticePress(item)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <FontAwesome5 name={item.icon} size={scaleFont(20)} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Daily Word Modal */}
      <Modal visible={dailyWordModal} transparent animationType="fade" onRequestClose={() => setDailyWordModal(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.modalBox, { width: width * 0.85 }]}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setDailyWordModal(false)}>
              <AntDesign name="close" size={scaleFont(24)} color="#7f6edb" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: '#7f6edb' }]}>Word of the Day</Text>

            <View style={styles.wordOfTheDayContainer}>
              <Text style={styles.wordText}>{DAILY_WORDS[selectedLang.code]?.word}</Text>
              <Text style={styles.pronunciationText}>Pronunciation: {DAILY_WORDS[selectedLang.code]?.pronunciation}</Text>
              <Text style={styles.meaningText}>Meaning: {DAILY_WORDS[selectedLang.code]?.meaning}</Text>

              <View style={styles.exampleContainer}>
                <Text style={styles.exampleTitle}>Example:</Text>
                <Text style={styles.exampleText}>{DAILY_WORDS[selectedLang.code]?.example}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#7f6edb' }]}
              onPress={() => setDailyWordModal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalButtonText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Verb Conjugation Modal */}
      <Modal visible={verbConjugationModal} transparent animationType="fade" onRequestClose={() => setVerbConjugationModal(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.modalBox, { width: width * 0.85 }]}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setVerbConjugationModal(false)}>
              <AntDesign name="close" size={scaleFont(24)} color="#2ecc71" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: '#2ecc71' }]}>Verb Conjugation</Text>

            {VERB_CONJUGATIONS[selectedLang.code] ? (
              <>
                <Text style={styles.verbTitle}>{VERB_CONJUGATIONS[selectedLang.code].verb} ({VERB_CONJUGATIONS[selectedLang.code].meaning})</Text>

                <View style={styles.conjugationContainer}>
                  {VERB_CONJUGATIONS[selectedLang.code].conjugations.map((conj, index) => (
                    <View key={index} style={styles.conjugationRow}>
                      <Text style={styles.conjugationText}>{conj}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#2ecc71' }]}
                  onPress={() => setVerbConjugationModal(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalButtonText}>Got It</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.noDataText}>Verb conjugation data not available for {selectedLang.name}</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Fun Fact Modal */}
      <Modal visible={funFactModal} transparent animationType="fade" onRequestClose={() => setFunFactModal(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.modalBox, { width: width * 0.85 }]}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setFunFactModal(false)}>
              <AntDesign name="close" size={scaleFont(24)} color="#9c27b0" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: '#9c27b0' }]}>Did You Know?</Text>

            <View style={styles.funFactContainer}>
              <FontAwesome5 name="lightbulb" size={scaleFont(40)} color="#9c27b0" style={styles.funFactIcon} />
              <Text style={styles.funFactText}>{FUN_FACTS[selectedLang.code]}</Text>
            </View>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#9c27b0' }]}
              onPress={() => setFunFactModal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalButtonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Locked Feature Modal */}
      <Modal visible={lockedFeatureModal} transparent animationType="fade" onRequestClose={() => setLockedFeatureModal(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.modalBox, { width: width * 0.85 }]}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setLockedFeatureModal(false)}>
              <AntDesign name="close" size={scaleFont(24)} color="#e74c3c" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: '#e74c3c' }]}>Feature Locked</Text>

            <View style={styles.lockedFeatureContainer}>
              <FontAwesome5 name="lock" size={scaleFont(40)} color="#e74c3c" style={styles.lockedIcon} />
              <Text style={styles.lockedFeatureText}>
                Complete more lessons to unlock this feature!
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#e74c3c' }]}
              onPress={() => setLockedFeatureModal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalButtonText}>Continue Learning</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edeafd',
  },
  backgroundImage: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    top: -40,
    right: -60,
    opacity: 0.09,
    zIndex: -1,
  },
  safeArea: {
    backgroundColor: '#edeafd',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#edeafd',
    borderBottomWidth: 1.5,
    borderBottomColor: '#d6d0fa',
    shadowColor: '#7f6edb',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  langSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '30%',
  },
  langCircle: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: '#edeafd',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#7f6edb',
    shadowColor: '#7f6edb',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  langFlag: {
    fontSize: width * 0.07,
  },
  chevron: {
    marginLeft: width * 0.005,
  },
  levelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#7f6edb',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  levelText: {
    color: '#7f6edb',
    fontWeight: 'bold',
    marginRight: width * 0.01,
    fontSize: width * 0.035,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f6ff',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#7f6edb',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
  },
  starText: {
    marginLeft: width * 0.01,
    color: '#7f6edb',
    fontWeight: 'bold',
    fontSize: width * 0.03,
  },
  fireContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#ffb366',
    marginLeft: width * 0.02,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
  },
  fireText: {
    marginLeft: width * 0.01,
    color: '#ff6d00',
    fontWeight: 'bold',
    fontSize: width * 0.03,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: height * 0.1,
    paddingLeft: width * 0.05,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    minWidth: width * 0.45,
    elevation: 8,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    width: width * 0.5,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    borderRadius: 10,
    marginBottom: 2,
    backgroundColor: '#edeafd',
    marginTop: 2,
  },
  langName: {
    fontSize: width * 0.04,
    color: '#222',
    marginLeft: width * 0.03,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  levelName: {
    fontSize: width * 0.04,
    color: '#7f6edb',
    fontWeight: 'bold',
    letterSpacing: 0.2,
    marginLeft: width * 0.02,
  },
  scrollContainer: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
  },
  contentScroll: {
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: height * 0.01,
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: width * 0.04,
    color: '#888',
    marginBottom: height * 0.02,
    marginLeft: width * 0.005,
  },
  sectionContainer: {
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: height * 0.01,
  },
  sectionDescription: {
    fontSize: width * 0.035,
    color: '#888',
    marginBottom: height * 0.02,
  },
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  practiceCard: {
    width: width * 0.43,
    borderRadius: 16,
    padding: width * 0.04,
    marginBottom: width * 0.04,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconContainer: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.01,
  },
  cardTitle: {
    fontSize: width * 0.038,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: height * 0.005,
  },
  cardDescription: {
    fontSize: width * 0.03,
    color: '#666',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: width * 0.07,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: width * 0.04,
    right: width * 0.04,
    zIndex: 2,
    padding: width * 0.01,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  wordOfTheDayContainer: {
    width: '100%',
    padding: width * 0.04,
    backgroundColor: '#f9f6ff',
    borderRadius: 12,
    marginBottom: height * 0.02,
  },
  wordText: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#7f6edb',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  pronunciationText: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.01,
    fontStyle: 'italic',
  },
  meaningText: {
    fontSize: width * 0.045,
    color: '#444',
    textAlign: 'center',
    marginBottom: height * 0.02,
    fontWeight: '600',
  },
  exampleContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: width * 0.03,
    borderWidth: 1,
    borderColor: '#e0d6ff',
  },
  exampleTitle: {
    fontSize: width * 0.035,
    color: '#7f6edb',
    fontWeight: 'bold',
    marginBottom: height * 0.005,
  },
  exampleText: {
    fontSize: width * 0.04,
    color: '#444',
  },
  verbTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#2ecc71',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  conjugationContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  conjugationRow: {
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  conjugationText: {
    fontSize: width * 0.04,
    color: '#444',
  },
  funFactContainer: {
    width: '100%',
    padding: width * 0.04,
    backgroundColor: '#f5e6ff',
    borderRadius: 12,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  funFactIcon: {
    marginBottom: height * 0.02,
  },
  funFactText: {
    fontSize: width * 0.045,
    color: '#333',
    textAlign: 'center',
    lineHeight: height * 0.03,
  },
  lockedFeatureContainer: {
    width: '100%',
    padding: width * 0.04,
    backgroundColor: '#ffebee',
    borderRadius: 12,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  lockedIcon: {
    marginBottom: height * 0.02,
  },
  lockedFeatureText: {
    fontSize: width * 0.045,
    color: '#333',
    textAlign: 'center',
    lineHeight: height * 0.03,
  },
  noDataText: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    marginVertical: height * 0.02,
  },
  modalButton: {
    backgroundColor: '#7f6edb',
    borderRadius: 14,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    alignItems: 'center',
    marginTop: height * 0.01,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: width * 0.07,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  loadingText: {
    fontSize: width * 0.04,
    color: '#666',
    marginTop: height * 0.02,
    textAlign: 'center',
  },
});

export default HomeScreen;