import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
      name='english'
      options={{headerShown: false}}
      />

      <Stack.Screen
        name='spanish'
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='french'
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='german'
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='italian'
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='mandarin'
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='japanese'
        options={{ headerShown: false }}
      />
    </Stack>
  )
}

export default _layout