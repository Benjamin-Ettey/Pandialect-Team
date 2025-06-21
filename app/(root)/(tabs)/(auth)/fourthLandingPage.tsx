import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, Modal } from 'react-native';

const LEVELS = [
  { label: 'Beginner' },
  { label: 'Intermediate' },
  { label: 'Advanced' },
];

const LevelSelectPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const [modal, setmodal] = useState(false)
  const buttonFontSize = Math.max(16, width * 0.045);
  const buttonPadding = Math.max(12, width * 0.035);

  const handleNext = () => {
    if (selected) {
      // Handle selected level (e.g., store or navigate)
      console.log('Selected level:', selected);
    }
  };

  return (
    <View
    style={{
      flex: 1,
      backgroundColor: 'white',
    }}
    >
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Modal visible={modal} animationType='slide'>
          <View style={{backgroundColor: '#red', justifyContent: 'center', alignItems: 'center', position: 'absolute', height: '95%', width: '100%', bottom: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
            <View
                  style={{
                    width: 350,
                    height: 280,
                    backgroundColor: '#7f6edb',
                    justifyContent:'center',
                    alignItems: 'center',
                    borderBottomLeftRadius: 120,
                    borderBottomRightRadius: 120,
                    borderRadius: 150,
                    bottom: '20%'
                  }}
                  >
                    <Image
                                  source={require('../../../../assets/images/pandaHappy.png')}
                                  style={{width: '100%', height: '90%'}}
                                  resizeMode="contain"
                                  />
                  </View>
            <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    bottom: '5%'
                  }}
                  >Hi! <Text style={{ fontWeight: 'bold', color: '#7f6edb'}}>Pandyy</Text> is happy {"\n"}with your progress. 
                    <Text style={{ fontWeight: 'bold', color: '#7f6edb' }}> Keep it up.</Text></Text>
            <TouchableOpacity
                    style={{
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
                      width: 200
                    }}
            
                    onPress={()=>router.replace("/(root)/(tabs)/(auth)/sixthLandingPage")}


                    // onPress={()=setmodal(true)}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>Next</Text>
                    </TouchableOpacity>
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
          bottom: '0%',
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
              position: 'absolute'
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
          bottom: '15%'
        }}
        ><Text style={{fontWeight: 'bold'}}>Select your level!</Text></Text>

      </View>
      <View style={{ width: '100%', alignItems: 'center', marginBottom: 32 }}>
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
            onPress={() => setSelected(level.label)}
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
      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            width: width * 0.9,
            borderRadius: width * 0.2,
            paddingVertical: buttonPadding + 4,
            marginBottom: 40,
            top: '5%',
          },
          !selected && { backgroundColor: '#ccc' },
        ]}
        // onPress={()=>router.replace("/(root)/(tabs)/(auth)/fifthLandingPage")}
          onPress={() => setmodal(true)}
        disabled={!selected}
        activeOpacity={0.7}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: buttonFontSize }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
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
  levelButton: {
    backgroundColor: '#f0f0f0',
    marginVertical: 7,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    top: '20%'
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
});

export default LevelSelectPage;