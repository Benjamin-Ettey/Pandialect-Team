import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const landingPage = () => {
  const { width, height } = useWindowDimensions();
  // const fontSize = Math.max(20, width * 0.06);
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Blue view takes up the top half, with curved bottom edge */}
      <View
        style={{
          width: '100%',
          height: '50%',
          backgroundColor: '#7f6edb',
          borderBottomLeftRadius: '100%',
          borderBottomRightRadius: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Panda Image */}
        <Image
          source={require('../../../../assets/images/panda.png')}
          style={{ width: '80%', height: '80%', marginBottom: 10, top: '15%' }}
          resizeMode="contain"
        />
        <Text style={{
          color: 'black',
          fontWeight: 'bold',
          fontSize: 28,
          textAlign: 'center',
          top: '35%',
          margin: 10,
          fontFamily:'Feather Bold',
        }}>
          Pandialect!
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            textAlign: 'center',
            marginTop: 16,
            width: '80%',
            top: '40%',
            
          }}
        >
          Learning languages is now easier than ever.{"\n"} Get started with more exposure and less {"\n"}hassle. We’ll guide you through {"\n"}a quick 
          <Text style={{ fontWeight: 'bold', color: '#7f6edb', fontStyle: 'italic' }}> account setup.</Text>
          {" "} 
        </Text>
      </View>
      {/* Curl button at the bottom of the page */}
      <View style={{ position: 'absolute',top: '80%', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          style={styles.curlButton}
          onPress={() => router.push('/(root)/(tabs)/(auth)/onboarding')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  curlButton: {
    backgroundColor: '#7f6edb',
    // paddingVertical: 16,
    // paddingHorizontal: 45,
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    width: 180,
    margin: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
});

export default landingPage;