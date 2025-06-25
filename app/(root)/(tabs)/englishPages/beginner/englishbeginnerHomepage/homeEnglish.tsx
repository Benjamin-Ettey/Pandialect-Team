import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
  { name: 'English', flag: '🇬🇧', route: '/LAN/english' },
  { name: 'Spanish', flag: '🇪🇸', route: '/LAN/spanish' },
  { name: 'French', flag: '🇫🇷', route: '/LAN/french' },
  { name: 'German', flag: '🇩🇪', route: '/LAN/german' },
  { name: 'Italian', flag: '🇮🇹', route: '/LAN/italian' },
  { name: 'Mandarin', flag: '🇨🇳', route: '/LAN/mandarin' },
  { name: 'Japanese', flag: '🇯🇵', route: '/LAN/japanese' },
];

// Add trusted image URLs for each lesson
const lessonItems = [
  {
    title: 'Greetings',
    route: '../beginnerClickedBottoms/beginnerGreetingsEnglish',
    image: 'https://cdn-icons-png.flaticon.com/512/1973/1973807.png', // greetings
  },
  {
    title: 'Being Polite',
    route: '../beginnerClickedBottoms/beginnerPoliteEnglish',
    image: 'https://cdn-icons-png.flaticon.com/512/190/190411.png', // polite
  },
  {
    title: 'Asking someone how they are',
    route: '../beginnerClickedBottoms/beginnerHowareyouEnglish',
    image: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png', // how are you
  },
  {
    title: 'Food',
    route: '../beginnerClickedBottoms/beginnerFoodEnglish',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png', // food
  },
  {
    title: 'Travels',
    route: '../beginnerClickedBottoms/beginnerTravelsEnglish',
    image: 'https://cdn-icons-png.flaticon.com/512/201/201623.png', // travels
  },
  {
    title: 'Mastering the language',
    route: '../beginnerClickedBottoms/beginnerMasteringEnglish',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // mastering
  },
];

const HomeHeader = ({
  selectedLang = LANGUAGES[0],
  onSelectLang,
  starCount = 0,
  fireCount = 0,
  onNotificationPress,
}) => {
  const [langModal, setLangModal] = useState(false);
  const router = useRouter();

  const handleLangSelect = (lang) => {
    setLangModal(false);
    onSelectLang && onSelectLang(lang);
    router.push(lang.route);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Language Circle & Dropdown */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.langCircle}
            onPress={() => setLangModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.langFlag}>{selectedLang.flag}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLangModal(true)} activeOpacity={0.7}>
            <Ionicons name="chevron-down" size={22} color="#222" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        {/* Right Icons */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={26} color="#222" />
          </TouchableOpacity>
          {/* Star */}
          <View style={styles.starContainer}>
            <MaterialCommunityIcons name="star" size={22} color="#f7c948" />
            <Text style={styles.starText}>{starCount}/30</Text>
          </View>
          {/* Fire */}
          <View style={styles.fireContainer}>
            <FontAwesome5 name="fire" size={20} color="#ff6d00" />
            <Text style={styles.fireText}>{fireCount}</Text>
          </View>
        </View>

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
      </View>
    </SafeAreaView>
  );
};

const LessonList = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{ title: string; route: string } | null>(null);

  const handleLessonPress = (lesson: { title: string; route: string }) => {
    setSelectedLesson(lesson);
    setModalVisible(true);
  };

  const handleStartLesson = () => {
    if (selectedLesson) {
      setModalVisible(false);
      router.push(selectedLesson.route);
    }
  };

  return (
    <>
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
          Beginner
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
        {lessonItems.map((item) => (
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
        ))}
      </ScrollView>

      {/* Modal for lesson start */}
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
    </>
  );
};

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

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    zIndex: 10,
  },
  langCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#edeafd',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#7f6edb',
  },
  langFlag: {
    fontSize: 26,
  },
  iconButton: {
    marginLeft: 10,
    marginRight: 6,
    padding: 6,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f6ff',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 6,
    marginRight: 6,
  },
  starText: {
    marginLeft: 4,
    color: '#7f6edb',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fireContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 6,
  },
  fireText: {
    marginLeft: 4,
    color: '#ff6d00',
    fontWeight: 'bold',
    fontSize: 14,
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
    width: 20
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  langName: {
    fontSize: 16,
    color: '#222',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HomeHeader />
      <LessonList />
    </View>
  );
};

export default HomeScreen;