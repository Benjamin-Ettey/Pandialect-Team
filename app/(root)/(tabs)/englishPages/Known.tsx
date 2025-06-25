import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const Known = () => {
  const SOURCES = [
    'YouTube',
    'App Store / Play Store',
    'Facebook / Instagram',
    'Google Search',
    'TikTok',
    'Others',
  ];
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 40 }}>
      {/* Custom Back Button */}
      <TouchableOpacity
        style={{
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
        }}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={28} color="#7f6edb" />
      </TouchableOpacity>

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
          style={{ width: '70%', height: '70%', bottom: '5%' }}
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
            bottom: '10%',
            opacity: selectedSource ? 1 : 0.6,
          }}
          disabled={!selectedSource}
          onPress={() => router.push('/(root)/(tabs)/(auth)/thirdLandingPage')}
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
          marginTop: 40, // <-- push content downwards
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
              marginTop: '2%',
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

export default Known;