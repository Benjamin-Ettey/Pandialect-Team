import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const onboarding = () => {
  return (
    <View style={{flex:1, backgroundColor: 'white'}}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
              <Text style={{ color: 'black', fontSize: 13, position: 'absolute', textAlign: 'center', bottom: '40%' }}><Text style={{fontWeight: 'bold', color: '#7f6edb', fontSize: 23, margin: 2}}>Hi!. I'm Pandy</Text>{"\n\n"}Your learning buddy. Learn the easy way.</Text>
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
                      bottom: '25%', 
                      // position: 'absolute',
                      marginHorizontal: '80%'
                  }}
              >
          <View
            style={{
              width: 260,
              height: 200,
              backgroundColor: '#b6acf0',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomLeftRadius: 120,
              borderBottomRightRadius: 120,
              borderRadius: 150,
            }}
          >
            <Image
              source={require('../../../../assets/images/pandaTree.png')}
              style={{ width: '80%', height: '80%' }}
              resizeMode='contain'
            />
          </View></View>       
        

              <View style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, alignItems: 'center', margin: 2 }}>
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
                            width: 300,
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginBottom: 2
                            
                        }}
                        onPress={() => router.push('/(root)/(tabs)/(auth)/secondLandingPage')}
                      >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>CREATE ACCOUNT</Text>
                      </TouchableOpacity>
                    </View>

              <View style={{ position: 'absolute', bottom: '12%', left: 0, right: 0, alignItems: 'center', margin: 2 }}>
                  <TouchableOpacity
                      style={{
                          backgroundColor: 'white',
                          // paddingVertical: 16,
                          // paddingHorizontal: 40,
                          borderRadius: 60,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 6 },
                          shadowOpacity: 0.2,
                          shadowRadius: 8,
                          elevation: 8,
                          borderBottomLeftRadius: 60,
                          borderBottomRightRadius: 60,
                          width: 300,
                          justifyContent: 'center', 
                          alignItems: 'center',
                          height: 55,

                      }}
                      onPress={() => router.push('/(root)/(tabs)/loginPage.tsx/login')}
                  >
                      <Text style={{ color: '#7f6edb', fontWeight: 'bold', fontSize: 14 }}>I ALREADY HAVE AN ACCOUNT</Text>
                  </TouchableOpacity>
              </View>
      </View>
    </View>
  )
}

export default onboarding