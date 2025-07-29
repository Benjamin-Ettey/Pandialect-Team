import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  useWindowDimensions
} from 'react-native';

const LANGUAGES = [
  { name: 'Spanish', flag: '🇪🇸', code: 'es' },
  { name: 'French', flag: '🇫🇷', code: 'fr' },
  { name: 'German', flag: '🇩🇪', code: 'de' },
  { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
];

const LanguageSelectionScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375; // iPhone SE and similar small devices

  const handleNext = () => {
    if (selectedLanguage) {
      router.push({
        pathname: '/level-selection',
        params: { language: selectedLanguage }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Panda */}
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
        <View style={[styles.pandaContainer, { width: width * 0.25, height: width * 0.25 }]}>
          <Image
            source={require('../../../../assets/images/pandaYes.png')}
            style={styles.pandaImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[
          styles.title,
          {
            fontSize: isSmallScreen ? 20 : 24,
            paddingHorizontal: width * 0.1
          }
        ]}>
          What language would you like to learn?
        </Text>
        <Text style={[
          styles.subtitle,
          {
            fontSize: isSmallScreen ? 14 : 16,
            paddingHorizontal: width * 0.1
          }
        ]}>
          Select your target language to begin
        </Text>
      </View>

      {/* Language Selection */}
      <ScrollView
        contentContainerStyle={[
          styles.languageContainer,
          { paddingHorizontal: width * 0.06 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              selectedLanguage === language.code && styles.selectedLanguageButton,
              { paddingVertical: isSmallScreen ? 14 : 18 }
            ]}
            onPress={() => setSelectedLanguage(language.code)}
            activeOpacity={0.7}
          >
            <Text style={styles.languageFlag}>{language.flag}</Text>
            <Text style={[
              styles.languageName,
              { fontSize: isSmallScreen ? 16 : 18 }
            ]}>
              {language.name}
            </Text>
            {selectedLanguage === language.code && (
              <Ionicons
                name="checkmark-circle"
                size={isSmallScreen ? 20 : 24}
                color="#58CC02"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Next Button */}
      <View style={[
        styles.footer,
        {
          paddingBottom: Platform.OS === 'ios' ? (isSmallScreen ? 16 : 24) : 24,
          paddingHorizontal: width * 0.06
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedLanguage && styles.disabledButton,
            { paddingVertical: isSmallScreen ? 14 : 16 }
          ]}
          onPress={() => router.push('/(root)/(tabs)/(auth)/fourthLandingPage')}
          disabled={!selectedLanguage}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.nextButtonText,
            { fontSize: isSmallScreen ? 16 : 18 }
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
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
  pandaContainer: {
    marginBottom: 10,
  },
  pandaImage: {
    width: '100%',
    height: '100%',
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
  languageContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  selectedLanguageButton: {
    backgroundColor: '#F0F7FF',
    borderColor: '#58CC02',
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageName: {
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  nextButton: {
    backgroundColor: '#7f6edb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});

export default LanguageSelectionScreen;