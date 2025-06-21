import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { router, Router } from 'expo-router';

const sixthLandingPage = () => {
  const SOURCES = [
    'YouTube',
    'App Store / Play Store',
    'Facebook / Instagram',
    'Google Search',
    'TikTok',
    'Others', // Added "Others"
  ];
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff'
      }}
    >
      <View
        style={{
          width: '100%',
          height: '43%',
          backgroundColor: '#7f6edb',
          bottom: 0,
          position: 'absolute',
          borderTopLeftRadius: '100%',
          borderTopRightRadius: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
              source={require('../../../../assets/images/pandaLike.png')}
              style={{width: '70%', height: '70%', bottom: '5%'}}
              resizeMode="contain"
              />
        <TouchableOpacity
          style={{
            width: 150,
            height: 50,
            backgroundColor: selectedSource ? 'white' : 'white',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            bottom: '10%'
          }}
          disabled={!selectedSource}
          onPress={() => router.push('/(root)/(tabs)/(auth)/createAccount')}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#7f6edb' }}>
            Next
          </Text>
        </TouchableOpacity>    
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          bottom: '30%',
        }}
      >
        
        <View style={{ width: '100%', alignItems: 'center', top: '20%' }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 20,
              color: '#222',
              bottom: '20%', 
              marginTop: '2%'
            }}
          >
            How did you hear about us?
          </Text>

          {SOURCES.map((source) => (
            <TouchableOpacity
              key={source}
              style={{
                width: '90%',
                paddingVertical: 12,
                borderRadius: 30,
                backgroundColor: selectedSource === source ? '#7f6edb' : '#f0f0f0',
                marginVertical: 5,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: selectedSource === source ? '#b6acf0' : 'transparent',
                bottom: '20%',
              }}
              onPress={() => setSelectedSource(source)}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: selectedSource === source ? 'white' : '#333',
                  fontWeight: selectedSource === source ? 'bold' : '500',
                }}
              >
                {source}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        
      </View>
    </View>
  );
};

export default sixthLandingPage;