import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
            name="intermediateCreateAccount"
            options={{ headerShown: false }}
        />
      <Stack.Screen
        name="englishintermediateHomepage"
        options={{ headerShown: false }}
      />
      <Stack.Screen
              name="intermediateClickedBottoms"
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
    </Stack>
  )
}

export default _layout