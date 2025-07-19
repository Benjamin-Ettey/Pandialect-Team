import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Types for our data structure
type AlphabetCharacter = {
  id: string;
  character: string;
  name: string;
  pronunciation: string;
  audioUrl: string;
  ipa?: string; // International Phonetic Alphabet notation
  mouthPosition?: string; // Description of mouth position
  tonguePosition?: string; // Description of tongue position
  commonMispronunciations?: string[]; // Common mistakes
  audioUrlSlow?: string; // Slow pronunciation
  audioUrlNative?: string; // Native speaker example
  examples: {
    word: string;
    meaning: string;
    audioUrl?: string;
  }[];
  similarTo?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
};

// Mock data - this would come from your backend API
const MOCK_ALPHABET_DATA: AlphabetCharacter[] = [
  {
    id: 'a1',
    character: 'あ',
    name: 'Hiragana A',
    pronunciation: 'ah',
    ipa: '/a/',
    mouthPosition: 'Open your mouth wide, lips relaxed',
    tonguePosition: 'Tongue low in mouth, tip behind lower teeth',
    commonMispronunciations: ['like "a" in "cat" (too short)', 'like "a" in "cake" (diphthong)'],
    audioUrl: 'https://example.com/audio/a.mp3',
    audioUrlSlow: 'https://example.com/audio/a_slow.mp3',
    audioUrlNative: 'https://example.com/audio/a_native.mp3',
    examples: [
      { word: 'あめ', meaning: 'rain', audioUrl: 'https://example.com/audio/ame.mp3' },
      { word: 'あき', meaning: 'autumn', audioUrl: 'https://example.com/audio/aki.mp3' },
    ],
    similarTo: 'like "a" in "father"',
    difficulty: 'easy'
  },
  {
    id: 'k1',
    character: 'か',
    name: 'Hiragana Ka',
    pronunciation: 'kah',
    ipa: '/ka/',
    mouthPosition: 'Start with back of tongue touching soft palate, then release',
    tonguePosition: 'Back of tongue raised, then drops suddenly',
    commonMispronunciations: ['adding aspiration (like English "k")', 'making it too soft'],
    audioUrl: 'https://example.com/audio/ka.mp3',
    audioUrlSlow: 'https://example.com/audio/ka_slow.mp3',
    audioUrlNative: 'https://example.com/audio/ka_native.mp3',
    examples: [
      { word: 'かさ', meaning: 'umbrella', audioUrl: 'https://example.com/audio/kasa.mp3' },
      { word: 'かばん', meaning: 'bag', audioUrl: 'https://example.com/audio/kaban.mp3' },
    ],
    difficulty: 'easy'
  },
  // More characters would follow...
];

const Progress = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lang = 'ja', level = 'beginner' } = params;

  const [alphabet, setAlphabet] = useState<AlphabetCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<AlphabetCharacter | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [showPronunciationTips, setShowPronunciationTips] = useState(false);

  // Calculate responsive dimensions
  const numColumns = Math.floor(width / 100); // Adjust based on screen width
  const characterCardSize = (width - 32 - (numColumns - 1) * 12) / numColumns;

  // Fetch alphabet data from backend
  useEffect(() => {
    const fetchAlphabet = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call:
        // const response = await fetch(`your-api-url/alphabets/${lang}/${level}`);
        // const data = await response.json();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setAlphabet(MOCK_ALPHABET_DATA);

        // Select first character by default on small screens
        if (width < 400 && MOCK_ALPHABET_DATA.length > 0) {
          setSelectedChar(MOCK_ALPHABET_DATA[0]);
        }
      } catch (err) {
        setError('Failed to load alphabet data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlphabet();
  }, [lang, level]);

  // Play pronunciation audio
  const playSound = async (audioUrl: string, type: 'normal' | 'slow' | 'native' = 'normal') => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Determine which audio URL to use based on type
      const urlToPlay = type === 'slow' ? selectedChar?.audioUrlSlow :
        type === 'native' ? selectedChar?.audioUrlNative : audioUrl;

      if (!urlToPlay) return;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: urlToPlay },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      setActiveAudio(type);

      newSound.setOnPlaybackStatusUpdate(status => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setIsPlaying(false);
          setActiveAudio(null);
        }
      });
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleCharacterPress = (char: AlphabetCharacter) => {
    setSelectedChar(char);
    playSound(char.audioUrl);
    setShowPronunciationTips(false);
  };

  const renderCharacter = ({ item }: { item: AlphabetCharacter }) => (
    <TouchableOpacity
      style={[
        styles.characterCard,
        selectedChar?.id === item.id && styles.selectedCharacter,
        {
          backgroundColor: getDifficultyColor(item.difficulty),
          width: characterCardSize,
          height: characterCardSize
        }
      ]}
      onPress={() => handleCharacterPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.character}>{item.character}</Text>
      <Text style={styles.pronunciation}>{item.pronunciation}</Text>
      {selectedChar?.id === item.id && isPlaying && activeAudio === 'normal' && (
        <View style={styles.playingIndicator}>
          <Feather name="activity" size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'hard': return '#ff6b6b';
      case 'medium': return '#ffd166';
      default: return '#7f6edb';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7f6edb" />
        <Text style={styles.loadingText}>Loading {lang.toUpperCase()} Alphabet...</Text>
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
      {/* Main Content */}
      <View style={styles.content}>
        {/* Alphabet Grid */}
        <FlatList
          data={alphabet}
          renderItem={renderCharacter}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.characterRow}
          contentContainerStyle={styles.characterGrid}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.gridTitle}>{lang === 'ja' ? 'Hiragana Characters' : 'Alphabet'}</Text>
          }
        />

        {/* Selected Character Details */}
        {selectedChar && (
          <ScrollView
            style={styles.detailCard}
            contentContainerStyle={styles.detailCardContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.detailHeader}>
              <Text style={styles.detailCharacter}>{selectedChar.character}</Text>
              <View style={styles.pronunciationButtons}>
                <TouchableOpacity
                  onPress={() => playSound(selectedChar.audioUrl, 'slow')}
                  style={[
                    styles.playButton,
                    activeAudio === 'slow' && styles.activePlayButton
                  ]}
                >
                  <Ionicons name="speedometer" size={18} color="#fff" />
                  <Text style={styles.playButtonText}>Slow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => playSound(selectedChar.audioUrl)}
                  style={[
                    styles.playButton,
                    activeAudio === 'normal' && styles.activePlayButton
                  ]}
                >
                  <Ionicons
                    name={isPlaying && activeAudio === 'normal' ? "pause" : "play"}
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.playButtonText}>Normal</Text>
                </TouchableOpacity>
                {selectedChar.audioUrlNative && (
                  <TouchableOpacity
                    onPress={() => playSound(selectedChar.audioUrl, 'native')}
                    style={[
                      styles.playButton,
                      activeAudio === 'native' && styles.activePlayButton
                    ]}
                  >
                    <Ionicons name="person" size={18} color="#fff" />
                    <Text style={styles.playButtonText}>Native</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <Text style={styles.detailName}>{selectedChar.name}</Text>

            <View style={styles.pronunciationSection}>
              <Text style={styles.detailPronunciation}>
                <Text style={styles.sectionLabel}>Pronunciation: </Text>
                {selectedChar.pronunciation}
              </Text>
              {selectedChar.ipa && (
                <Text style={styles.ipaText}>
                  <Text style={styles.sectionLabel}>IPA: </Text>
                  {selectedChar.ipa}
                </Text>
              )}
            </View>

            {selectedChar.similarTo && (
              <Text style={styles.similarText}>
                <Text style={styles.sectionLabel}>Similar to: </Text>
                {selectedChar.similarTo}
              </Text>
            )}

            {/* Pronunciation Tips Toggle */}
            <TouchableOpacity
              style={styles.tipsToggle}
              onPress={() => setShowPronunciationTips(!showPronunciationTips)}
            >
              <Text style={styles.tipsToggleText}>
                {showPronunciationTips ? 'Hide' : 'Show'} Pronunciation Tips
              </Text>
              <Feather
                name={showPronunciationTips ? "chevron-up" : "chevron-down"}
                size={20}
                color="#7f6edb"
              />
            </TouchableOpacity>

            {/* Pronunciation Tips */}
            {showPronunciationTips && (
              <View style={styles.pronunciationTips}>
                {selectedChar.mouthPosition && (
                  <View style={styles.tipItem}>
                    <Ionicons name="happy-outline" size={20} color="#7f6edb" />
                    <Text style={styles.tipText}>{selectedChar.mouthPosition}</Text>
                  </View>
                )}
                {selectedChar.tonguePosition && (
                  <View style={styles.tipItem}>
                    <Ionicons name="language-outline" size={20} color="#7f6edb" />
                    <Text style={styles.tipText}>{selectedChar.tonguePosition}</Text>
                  </View>
                )}
                {selectedChar.commonMispronunciations && selectedChar.commonMispronunciations.length > 0 && (
                  <View style={styles.tipItem}>
                    <Ionicons name="warning-outline" size={20} color="#ff6b6b" />
                    <View>
                      <Text style={[styles.tipText, { fontWeight: 'bold' }]}>Common mistakes:</Text>
                      {selectedChar.commonMispronunciations.map((mistake, index) => (
                        <Text key={index} style={[styles.tipText, { marginLeft: 20, marginTop: 4 }]}>
                          • {mistake}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Examples */}
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Example Words:</Text>
              {selectedChar.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <View style={styles.exampleTextContainer}>
                    <Text style={styles.exampleWord}>{example.word}</Text>
                    <Text style={styles.exampleMeaning}>{example.meaning}</Text>
                  </View>
                  {example.audioUrl && (
                    <TouchableOpacity
                      onPress={() => playSound(example.audioUrl!)}
                      style={styles.examplePlayButton}
                    >
                      <Ionicons name="volume-high" size={20} color="#7f6edb" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Floating Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${10}%` }]} />
        </View>
        <Text style={styles.progressText}>10% Mastered</Text>
      </View>
    </SafeAreaView>
  );
};

export default Progress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    top: '5%'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f6edb',
    fontWeight: '500',
    textAlign: 'center',
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
  content: {
    flex: 1,
    paddingBottom: 80, // Space for progress indicator
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
    top: '80%',
    color: '#7f6edb'
  },
  characterRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  characterGrid: {
    paddingBottom: 16,
  },
  characterCard: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7f6edb',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    top: '30%'
  },
  selectedCharacter: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#7f6edb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  character: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  pronunciation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  playingIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 2,
  },
  detailCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    maxHeight: height * 0.5, // Limit height on larger screens
  },
  detailCardContent: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailCharacter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginRight: 16,
  },
  pronunciationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  playButton: {
    backgroundColor: '#7f6edb',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 80,
  },
  activePlayButton: {
    backgroundColor: '#5e4cb0',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  detailName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pronunciationSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontWeight: '600',
    color: '#555',
  },
  detailPronunciation: {
    fontSize: 16,
    color: '#666',
  },
  ipaText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  similarText: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
  },
  tipsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
  },
  tipsToggleText: {
    color: '#7f6edb',
    fontWeight: '600',
    fontSize: 15,
  },
  pronunciationTips: {
    marginBottom: 16,
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  examplesContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 6,
  },
  exampleTextContainer: {
    flex: 1,
  },
  exampleWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f6edb',
  },
  exampleMeaning: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  examplePlayButton: {
    marginLeft: 8,
    padding: 8,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7f6edb',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#7f6edb',
    fontWeight: '500',
  },
});