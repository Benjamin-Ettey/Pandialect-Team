import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

const { width } = Dimensions.get('window');

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

const DEFAULT_LESSONS = [
  {
    title: 'Greetings',
    route: 'greetings',
    image: 'https://cdn-icons-png.flaticon.com/512/1973/1973807.png',
  },
  {
    title: 'Being Polite',
    route: 'polite',
    image: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
  },
  {
    title: 'How are you?',
    route: 'howareyou',
    image: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
  },
  {
    title: 'Food',
    route: 'food',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
  },
  {
    title: 'Travels',
    route: 'travels',
    image: 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
  },
  {
    title: 'Mastering the language',
    route: 'mastering',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
];

const bgIllustration = 'https://cdn.pixabay.com/photo/2017/06/10/07/18/panda-2385886_1280.png';

const HomeScreen = () => {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [langModal, setLangModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
  const [levelModal, setLevelModal] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [fireCount, setFireCount] = useState(0);

  const [lessons, setLessons] = useState(DEFAULT_LESSONS);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{ title: string; route: string } | null>(null);
  const [fetchingLesson, setFetchingLesson] = useState(false);

  useEffect(() => {
    setLoadingLessons(true);
    setTimeout(() => {
      setLessons(DEFAULT_LESSONS);
      setLoadingLessons(false);
    }, 600);
  }, [selectedLang, selectedLevel]);

  const handleLangSelect = (lang) => {
    setLangModal(false);
    setSelectedLang(lang);
  };

  const handleLevelSelect = (level) => {
    setLevelModal(false);
    setSelectedLevel(level);
  };

  const handleLessonPress = (lesson) => {
    setSelectedLesson(lesson);
    setModalVisible(true);
  };

  const handleStartLesson = () => {
    setModalVisible(false); // Close the modal immediately

    if (selectedLesson) {
      setFetchingLesson(true);

      // Simulate loading before navigation
      setTimeout(() => {
        setFetchingLesson(false);
        router.push({
          pathname: '/(root)/(tabs)/englishPages/beginner/LanguageLessons/LanguageLessonsPage',
          params: {
            lang: selectedLang.code,
            level: selectedLevel.code,
            lesson: selectedLesson.route,
          },
        });
      }, 2000);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#edeafd' }}>
      {/* Decorative Background */}
      <Image
        source={{ uri: bgIllustration }}
        style={{
          position: 'absolute',
          width: width * 0.7,
          height: width * 0.7,
          top: -40,
          right: -60,
          opacity: 0.09,
          zIndex: -1,
        }}
        resizeMode="contain"
        pointerEvents="none"
      />

      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '30%' }}>
            <TouchableOpacity
              style={[styles.langCircle, { width: 40, height: 40 }]}
              onPress={() => setLangModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>{selectedLang.flag}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLangModal(true)} activeOpacity={0.7}>
              <Ionicons name="chevron-down" size={18} color="#222" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.levelSelector, { paddingHorizontal: 10, paddingVertical: 5 }]}
            onPress={() => setLevelModal(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.levelText, { fontSize: 14 }]}>{selectedLevel.name}</Text>
            <Ionicons name="chevron-down" size={14} color="#7f6edb" style={{ marginLeft: 2 }} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '40%' }}>
            <View style={[styles.starContainer, { paddingHorizontal: 8, paddingVertical: 3 }]}>
              <MaterialCommunityIcons name="star" size={18} color="#f7c948" />
              <Text style={[styles.starText, { fontSize: 13 }]}>{starCount}/30</Text>
            </View>
            <View style={[styles.fireContainer, { paddingHorizontal: 8, paddingVertical: 3 }]}>
              <FontAwesome5 name="fire" size={16} color="#ff6d00" />
              <Text style={[styles.fireText, { fontSize: 13 }]}>{fireCount}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Language Modal */}
      <Modal
        visible={langModal}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setLangModal(false)}
        >
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
      <Modal
        visible={levelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setLevelModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setLevelModal(false)}
        >
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

      {/* Loading state when fetching lessons */}
      {fetchingLesson && (
        <Modal transparent animationType="fade" visible={fetchingLesson}>
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modalBox}>
              <ActivityIndicator size="large" color="#7f6edb" />
              <Text style={modalStyles.modalText}>We are fetching the best lessons for you...</Text>
            </View>
          </View>
        </Modal>
      )}

      {/* Lesson List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#fff' }}
      >
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#222',
          marginBottom: 6,
          letterSpacing: 0.2,
        }}>
          {selectedLevel.name} - {selectedLang.name}
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#888',
          marginBottom: 18,
          marginLeft: 2,
        }}>
          Let's complete some lessons.
        </Text>
        <View style={{ height: 18 }} />
        {loadingLessons ? (
          <ActivityIndicator size="large" color="#7f6edb" style={{ marginTop: 40 }} />
        ) : (
          lessons.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 22,
              }}
              activeOpacity={0.8}
              onPress={() => handleLessonPress(item)}
            >
              <View style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: '#edeafd',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 18,
                borderWidth: 2,
                borderColor: '#7f6edb',
                overflow: 'hidden',
              }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{
                fontSize: 18,
                color: '#222',
                fontWeight: 'bold',
                letterSpacing: 0.1,
              }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Lesson Start Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalBox}>
            <TouchableOpacity
              style={modalStyles.closeIcon}
              onPress={() => setModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AntDesign name="close" size={24} color="#7f6edb" />
            </TouchableOpacity>
            <Text style={modalStyles.modalText}>Hi, let's start a lesson!</Text>
            <Text style={{ color: '#666', marginBottom: 20, textAlign: 'center' }}>
              {selectedLesson?.title}
            </Text>
            <TouchableOpacity
              style={modalStyles.startButton}
              onPress={handleStartLesson}
              activeOpacity={0.85}
            >
              <Text style={modalStyles.startButtonText}>Start Lesson</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#edeafd',
    flex: 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 36 : 36,
  },
  headerContainer: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#edeafd',
    zIndex: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#d6d0fa',
    shadowColor: '#7f6edb',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  langCircle: {
    borderRadius: 24,
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
    fontSize: 28,
  },
  iconButton: {
    backgroundColor: '#edeafd',
    borderRadius: 12,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f6ff',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#7f6edb',
  },
  starText: {
    marginLeft: 4,
    color: '#7f6edb',
    fontWeight: 'bold',
  },
  fireContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#ffb366',
    marginLeft: 10
  },
  fireText: {
    marginLeft: 4,
    color: '#ff6d00',
    fontWeight: 'bold',
  },
  levelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#7f6edb',
    shadowColor: '#7f6edb',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  levelText: {
    color: '#7f6edb',
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 70,
    paddingLeft: 18,

  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    minWidth: 180,
    elevation: 8,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    width: 200,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 2,
    backgroundColor: '#edeafd',
    marginTop: 2,
  },
  langName: {
    fontSize: 17,
    color: '#222',
    marginLeft: 12,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  levelName: {
    fontSize: 17,
    color: '#7f6edb',
    fontWeight: 'bold',
    letterSpacing: 0.2,
    marginLeft: 8,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 300,
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
  closeIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 2,
    padding: 4,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginBottom: 28,
    marginTop: 10,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#7f6edb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});