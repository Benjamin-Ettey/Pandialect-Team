import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'


const secondLandingPage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
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
      <Text style={{
        textAlign: 'center',
        marginTop: 16,
        width: '80%',
        fontSize: 19,
        bottom: '8%'
      }}>
        Just <Text style={{ fontWeight: 'bold', color:'#7f6edb' }}>some few questions</Text> {""}before we start your first lesson!
      </Text>
      
      {/* PandaBye Image in the center */}
      <View style={{ alignItems: 'center', marginBottom: 24, width: '90%', height: '30%' }}>
        <Image
          source={require('../../../../assets/images/pandaBye.png')}
          style={{ width: '90%', height: '90%' }}
          resizeMode="contain"
        />
        {/* Shadow below the panda */}
        <View
          style={{
            width: '30%',
            height: '10%',
            backgroundColor: '#000',
            opacity: 0.15,
            borderRadius: 20,
            position: 'absolute',
            top:'90%',
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.curlButton}
        onPress={() => router.push('/(root)/(tabs)/(auth)/Known')}
        activeOpacity={0.7}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  curlButton: {
    backgroundColor: '#7f6edb',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 40,
    width: '50%',
    alignItems: 'center',
    top: '10%',
  },
});

export default secondLandingPage