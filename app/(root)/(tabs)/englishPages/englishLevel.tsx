import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const LEVELS = [
  { label: 'Beginner' },
  { label: 'Intermediate' },
  { label: 'Advanced' },
];

const LEVEL_ROUTES: Record<string, string> = {
  Beginner: '/(root)/(tabs)/englishPages/beginner/beginnerCreateAccount',
  Intermediate: '/(root)/(tabs)/englishPages/intermediate/intermediateCreateAccount',
  Advanced: '/(root)/(tabs)/englishPages/advanced/advancedCreateAccount',
};

const LevelSelectPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const [modal, setmodal] = useState(false);
  const buttonFontSize = Math.max(16, width * 0.045);
  const buttonPadding = Math.max(12, width * 0.035);

  const handleLevelPress = (level: string) => {
    setSelected(level);
    const route = LEVEL_ROUTES[level];
    if (route) {
      router.push(route);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={28} color="#7f6edb" />
      </TouchableOpacity>

      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Modal visible={modal} animationType='slide' transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  width: 350,
                  height: 280,
                  backgroundColor: '#7f6edb',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomLeftRadius: 120,
                  borderBottomRightRadius: 120,
                  borderRadius: 150,
                  bottom: '20%',
                }}
              >
                <Image
                  source={require('../../../../assets/images/pandaHappy.png')}
                  style={{ width: '100%', height: '90%' }}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  bottom: '5%',
                }}
              >
                Hi! <Text style={{ fontWeight: 'bold', color: '#7f6edb' }}>Pandyy</Text> is happy {"\n"}with your progress.
                <Text style={{ fontWeight: 'bold', color: '#7f6edb' }}> Keep it up.</Text>
              </Text>
              <TouchableOpacity
                style={styles.modalNextButton}
                onPress={() => router.replace("/(root)/(tabs)/(auth)/sixthLandingPage")}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View
          style={{
            width: 350,
            height: 280,
            backgroundColor: '#7f6edb',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 120,
            borderBottomRightRadius: 120,
            borderRadius: 150,
            marginTop: 10,
          }}
        >
          <View
            style={{
              width: 260,
              height: 150,
              backgroundColor: '#b6acf0',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomLeftRadius: 80,
              borderBottomRightRadius: 80,
              borderRadius: 150,
              position: 'absolute',
            }}
          ></View>
          <Image
            source={require('../../../../assets/images/pandaGroup.png')}
            style={{ width: '100%', height: '100%', top: '5%' }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              textAlign: 'center',
              bottom: '15%',
              fontWeight: 'bold',
            }}
          >
            Select your level!
          </Text>
        </View>

        <View style={{ width: '100%', alignItems: 'center', marginBottom: 32, marginTop: 24 }}>
          {LEVELS.map(level => (
            <TouchableOpacity
              key={level.label}
              style={[
                styles.levelButton,
                {
                  width: width * 0.9,
                  paddingVertical: buttonPadding,
                  borderRadius: width * 0.2,
                },
                selected === level.label && styles.selectedLevelButton,
              ]}
              onPress={() => handleLevelPress(level.label)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.levelText,
                  { fontSize: buttonFontSize },
                  selected === level.label && styles.selectedLevelText,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* <TouchableOpacity
          style={[
            styles.nextButton,
            {
              width: width * 0.9,
              borderRadius: width * 0.2,
              paddingVertical: buttonPadding + 4,
              marginBottom: 40,
              marginTop: 10,
            },
            !selected && { backgroundColor: '#ccc' },
          ]}
          onPress={() => setmodal(true)}
          disabled={!selected}
          activeOpacity={0.7}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: buttonFontSize }}>
            Next
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 48,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    width: 340,
    elevation: 8,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    position: 'relative',
  },
  levelButton: {
    backgroundColor: '#f0f0f0',
    marginVertical: 7,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLevelButton: {
    backgroundColor: '#7f6edb',
    borderColor: '#b6acf0',
  },
  levelText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedLevelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#7f6edb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalNextButton: {
    backgroundColor: '#7f6edb',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    top: '15%',
    width: 200,
  },
});

export default LevelSelectPage;