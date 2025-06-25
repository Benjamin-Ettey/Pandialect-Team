import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="beginnerGreetingsEnglish"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="beginnerPoliteEnglish"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="beginnerHowareyouEnglish"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="beginnerFoodEnglish"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="beginnerTravelsEnglish"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="beginnerMasteringEnglish"
        options={{ headerShown: false }}
      />
      <Stack.Screen
            name="englishClickedBottoms"
            options={{ headerShown: false }}
                        />
    </Stack>
  )
}

export default _layout