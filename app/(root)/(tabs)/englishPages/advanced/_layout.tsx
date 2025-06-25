import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="advancedCreateAccount"
        options={{ headerShown: false }}
              />
      <Stack.Screen
              name="advancedClickedBottoms"
              options={{
                title: "",
                headerTintColor: '#7f6edb',
                headerStyle: {
                  backgroundColor: '#fff',
                },
                headerShadowVisible: false,
                headerBackTitle: "."
              }}
              />
      
      <Stack.Screen
        name="englishadvancedHomepage"
        options={{ headerShown: false }}
      />
    </Stack>
  )
}

export default _layout