import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, Modal } from 'react-native';

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
      onPress={() => setSelected(lang)}
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
      <View style={{ width: '40%', height: '7%',top:'0%', position: 'absolute' }}>
        <Image
        source={require('../../../../assets/images/pandaYes.png')}
        style={{width: '100%', height: '100%'}}
        resizeMode='contain'
        />
      </View>
      
      <Text style={[styles.header, { fontSize: Math.max(20, width * 0.03) , top: '5%', marginBottom: '10%'}]}>
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
      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            width: width * 0.9,
            borderRadius: width * 0.2,
            paddingVertical: buttonPadding + 4,
            marginBottom: 50, // Added space below the button
            bottom: '5%'
          },
          !selected && { backgroundColor: '#ccc' },
        ]}
        onPress={() => router.push('/(root)/(tabs)/(auth)/fourthLandingPage')}
        disabled={!selected}
        activeOpacity={0.7}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: buttonFontSize }}>
          Next
        </Text>
      </TouchableOpacity>
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