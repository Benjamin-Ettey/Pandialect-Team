import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  Animated,
  Platform,
  useWindowDimensions
} from 'react-native';

const LEVELS = [
  { id: 'beginner', name: 'Beginner', description: 'New to the language' },
  { id: 'intermediate', name: 'Intermediate', description: 'Know some basics' },
  { id: 'advanced', name: 'Advanced', description: 'Comfortable with conversation' },
];

const LevelSelectionScreen = () => {
  const params = useLocalSearchParams();
  const { language } = params;
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [buttonScale] = useState(new Animated.Value(1));
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const handleNext = () => {
    if (selectedLevel) {
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        })
      ]).start(() => {
        router.push({
          pathname: '/signup',
          params: {
            language,
            level: selectedLevel
          }
        });
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Panda and Organic Bubble */}
      <TouchableOpacity
              style={{
                position: 'absolute',
                top: '10%',
                left: 24,
                zIndex: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 4,
                elevation: 3,
                shadowColor: '#7f6edb',
                shadowOpacity: 0.12,
                shadowRadius: 6,
              }}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={28} color="#7f6edb" />
            </TouchableOpacity>

      <View style={styles.header}>
        <View style={[
          styles.bubbleContainer,
          {
            width: width * 0.4,
            height: width * 0.4,
            borderRadius: width * 0.2
          }
        ]}>
          <View style={[
            styles.organicBubble,
            {
              borderRadius: width * 0.5,
              borderBottomLeftRadius: width * 0.7,
              borderBottomRightRadius: width * 0.3,
              borderTopLeftRadius: width * 0.3,
              borderTopRightRadius: width * 0.7
            }
          ]}>
            <Image
              source={require('../../../../assets/images/pandaGroup.png')}
              style={styles.pandaImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={[
          styles.title,
          {
            fontSize: isSmallScreen ? 20 : 24,
            paddingHorizontal: width * 0.1
          }
        ]}>
          What's your level?
        </Text>
        <Text style={[
          styles.subtitle,
          {
            fontSize: isSmallScreen ? 14 : 16,
            paddingHorizontal: width * 0.1
          }
        ]}>
          We'll personalize your learning experience
        </Text>
      </View>

      {/* Level Selection */}
      <ScrollView
        contentContainerStyle={[
          styles.levelContainer,
          {
            paddingHorizontal: width * 0.06,
            paddingBottom: isSmallScreen ? 16 : 24
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {LEVELS.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelButton,
              selectedLevel === level.id && styles.selectedLevelButton,
              { padding: isSmallScreen ? 16 : 20 }
            ]}
            onPress={() => setSelectedLevel(level.id)}
            activeOpacity={0.7}
          >
            <View style={styles.levelContent}>
              <Text style={[
                styles.levelName,
                { fontSize: isSmallScreen ? 16 : 18 }
              ]}>
                {level.name}
              </Text>
              <Text style={[
                styles.levelDescription,
                { fontSize: isSmallScreen ? 13 : 14 }
              ]}>
                {level.description}
              </Text>
            </View>
            {selectedLevel === level.id && (
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={isSmallScreen ? 16 : 20} color="#58CC02" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Next Button */}
      <View style={[
        styles.footer,
        {
          paddingHorizontal: width * 0.06,
          paddingBottom: Platform.OS === 'ios' ? (isSmallScreen ? 16 : 24) : 24
        }
      ]}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedLevel && styles.disabledButton,
              {
                paddingVertical: isSmallScreen ? 14 : 16,
                borderRadius: isSmallScreen ? 12 : 14
              }
            ]}
            onPress={()=>router.push('/(root)/(tabs)/(auth)/createAccount')}
            disabled={!selectedLevel}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.nextButtonText,
              { fontSize: isSmallScreen ? 16 : 18 }
            ]}>
              Continue Learning
            </Text>
            <Ionicons
              name="arrow-forward"
              size={isSmallScreen ? 16 : 20}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  bubbleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#d6d0fa',
    borderWidth: 1,
    borderColor: '#7f6edb',
  },
  organicBubble: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7f6edb',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pandaImage: {
    width: '80%',
    height: '80%',
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#7f6edb',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#7A7A7A',
    textAlign: 'center',
  },
  levelContainer: {
    paddingTop: 16,
  },
  levelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    marginBottom: 16,
  },
  selectedLevelButton: {
    backgroundColor: '#F0F7FF',
    borderColor: '#58CC02',
  },
  levelContent: {
    flex: 1,
  },
  levelName: {
    color: '#333333',
    fontWeight: '600',
    marginBottom: 4,
  },
  levelDescription: {
    color: '#7A7A7A',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6F7E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7f6edb',
    shadowColor: '#7f6edb',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default LevelSelectionScreen;