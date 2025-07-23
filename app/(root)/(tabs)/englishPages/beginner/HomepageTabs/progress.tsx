import { apiFetch } from '@/utils/authUtils';
import { BASE_API_URL } from '@/utils/consts';
import { getAlphabetTitle, LanguageCode } from '@/utils/language';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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

type AlphabetListCharacter = {
  id: string;
  character: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

type AlphabetDetailCharacter = {
  id: string;
  character: string;
  name: string;
  pronunciation: string;
  ipa?: string;
  mouthPosition?: string;
  tonguePosition?: string;
  commonMispronunciations?: string[];
  audioUrl: string;
  audioUrlSlow?: string;
  audioUrlNative?: string;
  examples: {
    word: string;
    meaning: string;
    audioUrl?: string;
  }[];
  similarTo?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
};

const API_BASE_URL = `${BASE_API_URL}/api/alphabets`;

const Progress = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lang = 'fr', level = 'beginner' } = params;
  const languageCode = lang as LanguageCode;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [alphabetList, setAlphabetList] = useState<AlphabetListCharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<AlphabetDetailCharacter | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [showPronunciationTips, setShowPronunciationTips] = useState(false);


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        setAccessToken(storedToken);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Fetch alphabet list
  useEffect(() => {
    if (!accessToken) return; 

    const fetchAlphabetList = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`${API_BASE_URL}/list?lang=${languageCode}`,{
            method: 'GET',
            headers: {Authorization: `Bearer ${accessToken}`}
          }
        );

        if (!response.ok) throw new Error('Failed to fetch alphabet list');

        const data = await response.json();
        setAlphabetList(data);

        if (data.length > 0) {
          handleCharacterPress(data[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load alphabet data');
      } finally {
        setLoading(false);
      }
    };

    fetchAlphabetList();
  }, [languageCode, accessToken]);

  // Handle character selection
  const handleCharacterPress = async (char: AlphabetListCharacter) => {
    try {
      setLoadingDetails(true);
      const response = await apiFetch(`${API_BASE_URL}/${char.id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch character details');
      }

      const details = await response.json();
      setSelectedChar(details);
      playSound(details.audioUrl);
    } catch (err) {
      console.error('Failed to load character details', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Play pronunciation audio
  const playSound = async (audioUrl: string, type: 'normal' | 'slow' | 'native' = 'normal') => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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

  const renderAlphabetItem = ({ item }: { item: AlphabetListCharacter }) => (
    <TouchableOpacity
      style={[
        styles.alphabetItem,
        selectedChar?.id === item.id && styles.selectedAlphabetItem,
        { backgroundColor: getDifficultyColor(item.difficulty) }
      ]}
      onPress={() => handleCharacterPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.alphabetCharacter}>{item.character}</Text>
      <Text style={styles.alphabetPronunciation}>{item.pronunciation}</Text>
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
        <Text style={styles.loadingText}>Loading {Array.isArray(lang) ? lang[0].toUpperCase() : lang.toUpperCase()} Alphabet...</Text>
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
      {/* Alphabet Horizontal Scroll */}
      <View style={styles.alphabetScrollContainer}>
        <FlatList
          data={alphabetList}
          renderItem={renderAlphabetItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.alphabetScrollContent}
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.gridTitle}>{lang === 'ja' ? 'Hiragana Characters' : 'Alphabet'}</Text>

        {/* Selected Character Details */}
        {loadingDetails ? (
          <View style={styles.detailCard}>
            <Text style={styles.gridTitle}>
              {getAlphabetTitle(languageCode)} {languageCode === 'ja' ? 'Characters' : ''}
            </Text>
          </View>
        ) : selectedChar && (
          <ScrollView
            style={styles.detailCard}S
            contentContainerStyle={styles.detailCardContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.detailHeader}>
              <Text style={styles.detailCharacter}>{selectedChar.character}</Text>
              <View style={styles.pronunciationButtons}>
                {selectedChar.audioUrlSlow && (
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
                )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  alphabetScrollContainer: {
    height: 100,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  alphabetScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  alphabetItem: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  selectedAlphabetItem: {
    transform: [{ scale: 1.1 }],
    shadowColor: '#7f6edb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  alphabetCharacter: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  alphabetPronunciation: {
    fontSize: 12,
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
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
    color: '#7f6edb'
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
    maxHeight: height * 0.7,
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

export default Progress;