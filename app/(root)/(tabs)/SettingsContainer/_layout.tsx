import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
      name='accountSettings'
      options={{headerShown: false}}
      />
      <Stack.Screen
      name='notifications'
      options={{headerShown: false}}
      />
      <Stack.Screen
      name='HelpAndSupport'
      options={{headerShown: false}} />
      <Stack.Screen
        name='darkMode'
        options={{ headerShown: false }} />

    </Stack>
  )
}

export default _layout