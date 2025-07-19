import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';

const { width } = Dimensions.get('window');

type PracticeCategory = {
  id: string;
  title: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'writing';
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  color: string;
  completion: number;
  unlocked: boolean;
};

const MOCK_PRACTICE_DATA: PracticeCategory[] = [
  {
    id: 'vocab-1',
    title: 'Daily Vocabulary',
    type: 'vocabulary',
    description: 'Learn 20 essential words for everyday conversations',
    difficulty: 'beginner',
    icon: 'book',
    color: '#7f6edb',
    completion: 65,
    unlocked: true,
  },
  {
    id: 'grammar-1',
    title: 'Basic Grammar',
    type: 'grammar',
    description: 'Master present tense conjugation',
    difficulty: 'beginner',
    icon: 'edit',
    color: '#4caf50',
    completion: 30,
    unlocked: true,
  },
  {
    id: 'listen-1',
    title: 'Listening Challenge',
    type: 'listening',
    description: 'Train your ear with native speaker audio',
    difficulty: 'intermediate',
    icon: 'headphones',
    color: '#ff9800',
    completion: 0,
    unlocked: false,
  },
  {
    id: 'speak-1',
    title: 'Speaking Practice',
    type: 'speaking',
    description: 'Record and compare your pronunciation',
    difficulty: 'beginner',
    icon: 'mic',
    color: '#e91e63',
    completion: 0,
    unlocked: false,
  },
  {
    id: 'write-1',
    title: 'Writing Drills',
    type: 'writing',
    description: 'Practice character writing with stroke order',
    difficulty: 'beginner',
    icon: 'create',
    color: '#2196f3',
    completion: 0,
    unlocked: false,
  },
];

const review = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lang = 'ja', level = 'beginner' } = params;

  const [practiceCategories, setPracticeCategories] = useState<PracticeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked'>('all');
  const [showChallengeModal, setShowChallengeModal] = useState(true);
  const [lockedModalVisible, setLockedModalVisible] = useState(false);
  const [selectedLockedCategory, setSelectedLockedCategory] = useState<PracticeCategory | null>(null);

  useEffect(() => {
    const fetchPracticeData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setPracticeCategories(MOCK_PRACTICE_DATA);
      } catch (err) {
        setError('Failed to load practice data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeData();
  }, [lang, level]);

  const handleLockedPress = (category: PracticeCategory) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSelectedLockedCategory(category);
    setLockedModalVisible(true);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'book': return <Feather name="book" size={24} color="#fff" />;
      case 'edit': return <Feather name="edit" size={24} color="#fff" />;
      case 'headphones': return <Feather name="headphones" size={24} color="#fff" />;
      case 'mic': return <Feather name="mic" size={24} color="#fff" />;
      case 'create': return <Ionicons name="create-outline" size={24} color="#fff" />;
      default: return <Feather name="activity" size={24} color="#fff" />;
    }
  };

  const filteredCategories = activeFilter === 'all'
    ? practiceCategories
    : practiceCategories.filter(cat => cat.unlocked);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7f6edb" />
        <Text style={styles.loadingText}>Loading Practice Modules...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && styles.activeFilterButton
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveFilter('all');
          }}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'all' && styles.activeFilterText
          ]}>
            All Exercises
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'unlocked' && styles.activeFilterButton
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveFilter('unlocked');
          }}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'unlocked' && styles.activeFilterText
          ]}>
            Unlocked
          </Text>
        </TouchableOpacity>
      </View>

      {/* Practice Categories Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.map((category) => (
          <View
            key={category.id}
            style={[
              styles.categoryCard,
              { backgroundColor: category.color },
              !category.unlocked && styles.lockedCard
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                {getIconComponent(category.icon)}
              </View>

              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{category.title}</Text>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(category.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>
                    {category.difficulty.charAt(0).toUpperCase() + category.difficulty.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Card Description */}
            <Text style={styles.cardDescription}>{category.description}</Text>

            {/* Progress Bar */}
            {category.unlocked ? (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill,
                    { width: `${category.completion}%` }
                  ]} />
                </View>
                <Text style={styles.progressText}>
                  {category.completion}% Complete
                </Text>
              </View>
            ) : (
              <View style={styles.lockedOverlay}>
                <MaterialIcons name="lock-outline" size={28} color="#fff" />
                <Text style={styles.lockedText}>Complete more exercises to unlock</Text>
              </View>
            )}

            {/* Start Button - Only pressable element */}
            <TouchableOpacity
              style={[
                styles.startButton,
                !category.unlocked && { backgroundColor: 'rgba(255,255,255,0.3)' }
              ]}
              onPress={() => {
                if (!category.unlocked) {
                  handleLockedPress(category);
                  return;
                }
                router.push('/(root)/(tabs)/TargetPractice/BasicGrammar');
              }}
            >
              <Text style={styles.startButtonText}>
                {category.unlocked ? 'Start Practice' : 'Locked'}
              </Text>
              {category.unlocked && (
                <AntDesign name="arrowright" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Locked Category Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={lockedModalVisible}
        onRequestClose={() => setLockedModalVisible(false)}
      >
        <View style={styles.lockedModalContainer}>
          <View style={styles.lockedModalContent}>
            <TouchableOpacity
              style={styles.lockedModalCloseButton}
              onPress={() => setLockedModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <View style={[styles.lockedModalIcon, { backgroundColor: selectedLockedCategory?.color }]}>
              {selectedLockedCategory && getIconComponent(selectedLockedCategory.icon)}
            </View>

            <Text style={styles.lockedModalTitle}>{selectedLockedCategory?.title} is Locked</Text>
            <Text style={styles.lockedModalText}>
              Complete more exercises to unlock this practice module.
              You're doing great - keep going!
            </Text>

            <TouchableOpacity
              style={[styles.lockedModalButton, { backgroundColor: selectedLockedCategory?.color }]}
              onPress={() => setLockedModalVisible(false)}
            >
              <Text style={styles.lockedModalButtonText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Daily Challenge Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChallengeModal}
        onRequestClose={() => setShowChallengeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowChallengeModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <Image
              source={{ uri: 'https://cdn.pixabay.com/photo/2016/03/31/19/13/check-mark-1294787_1280.png' }}
              style={styles.modalIcon}
            />

            <Text style={styles.modalTitle}>Daily Challenge Available!</Text>
            <Text style={styles.modalText}>Complete 3 exercises to earn bonus points</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowChallengeModal(false);
              }}
            >
              <Text style={styles.modalButtonText}>Start Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'intermediate': return '#ff9800';
    case 'advanced': return '#f44336';
    default: return '#4caf50';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    top: '5%'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f6edb',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#7f6edb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#7f6edb',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  lockedCard: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 1,
    textAlign: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  // Locked Modal styles
  lockedModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  lockedModalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  lockedModalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  lockedModalIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockedModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  lockedModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  lockedModalButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Daily Challenge Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#7f6edb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default review;