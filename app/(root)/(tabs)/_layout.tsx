import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen
                name="(auth)"
                options={{ headerShown: false }}
              />
      <Stack.Screen
        name="loginPage.tsx"
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
        name="LAN"
        options={{
          title: "",
          headerTintColor: '#7f6edb',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerBackTitle: "."}}
      />

      <Stack.Screen
        name="LAN_CLICKED"
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
        name="forgotPassword"
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
        name="englishPages"
        options={{
          headerShown: false,
        }}
      />
      

      

    </Stack>
  )
}

export default _layout