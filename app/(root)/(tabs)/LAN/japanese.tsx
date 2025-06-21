import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const fifthLandingPage = () => {
  return (
    <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
    }}
    >
      <View
      style={{
        width: 300,
        height: 230,
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
              source={require('../../../../assets/images/pandaBamboo.png')}
              style={{width: '60%', height: '60%'}}
              resizeMode="contain"
              />
      </View>

      <Text
      style={{
        textAlign: 'center',
        fontSize: 18,
        bottom: '10%'
      }}
      >Let's help you learn English with ease</Text>

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
          bottom: '0%',
          width: 200
        }}

        onPress={()=>router.push("/(root)/(tabs)/(auth)/sixthLandingPage")}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>Let's go</Text>
        </TouchableOpacity>
    </View>
  )
}

export default fifthLandingPage