import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { HeaderShownContext } from '@react-navigation/elements'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen
        name="BasicGrammar"
        options={{ headerShown: false }}
      />    
    </Stack>
  )
}

export default _layout