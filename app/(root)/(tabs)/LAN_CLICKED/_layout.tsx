import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { HeaderShownContext } from '@react-navigation/elements'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen
        name="greetings"
        options={{ headerShown: false }}
      />

          <Stack.Screen
              name="food"
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="howareyou"
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="polite"
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="mastering"
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="travels"
              options={{ headerShown: false }}
          />
    </Stack>
  )
}

export default _layout