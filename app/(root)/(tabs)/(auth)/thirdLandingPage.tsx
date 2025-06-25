import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Chinese',
  'Japanese',
];

const FLAGS: Record<string, string> = {
  English: '🇬🇧',
  Spanish: '🇪🇸',
  French: '🇫🇷',
  German: '🇩🇪',
  Italian: '🇮🇹',
  Chinese: '🇨🇳',
  Japanese: '🇯🇵',
};

const LANGUAGE_ROUTES: Record<string, string> = {
  English: '/(root)/(tabs)/englishPages/englishLevel',
  Spanish: '/(root)/(tabs)/(auth)/spanishLandingPage',
  French: '/(root)/(tabs)/(auth)/frenchLandingPage',
  German: '/(root)/(tabs)/(auth)/germanLandingPage',
  Italian: '/(root)/(tabs)/(auth)/italianLandingPage',
  Chinese: '/(root)/(tabs)/(auth)/chineseLandingPage',
  Japanese: '/(root)/(tabs)/(auth)/japaneseLandingPage',
};

const ThirdLandingPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const [modal, setmodal] = useState(false)
  const buttonFontSize = Math.max(16, width * 0.045);
  const buttonPadding = Math.max(12, width * 0.035);

  const renderItem = ({ item: lang }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.langButton,
        {
          width: width * 0.9,
          paddingVertical: buttonPadding,
          borderRadius: width * 0.2,
        },
        selected === lang && styles.selectedLangButton,
      ]}
      onPress={() => {
        setSelected(lang);
        const route = LANGUAGE_ROUTES[lang];
        if (route) {
          router.push(route);
        }
      }}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.langText,
          { fontSize: buttonFontSize },
          selected === lang && styles.selectedLangText,
        ]}
      >
        {lang}{' '}
        <Text style={styles.flag}>
          {FLAGS[lang]}
        </Text>
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
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

      <View style={{ width: '40%', height: '7%', top: '0%', position: 'absolute' }}>
        <Image
          source={require('../../../../assets/images/pandaYes.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode='contain'
        />
      </View>

      <Text style={[styles.header, { fontSize: Math.max(20, width * 0.03), top: '5%', marginBottom: '10%' }]}>
        Which language do you prefer?
      </Text>
      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    textAlign: 'center',
  },
  langButton: {
    backgroundColor: '#f0f0f0',
    marginVertical: 7,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    top: '50%'
  },
  selectedLangButton: {
    backgroundColor: '#7f6edb',
    borderColor: '#b6acf0',
  },
  langText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedLangText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flag: {
    fontSize: 18,
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: '#7f6edb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ThirdLandingPage;