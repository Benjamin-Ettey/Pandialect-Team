import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      
      <Stack.Screen
        name="LanguageLessons"
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
        name= "HomepageTabs"
        options = {{headerShown: false}}
        />
      
    </Stack>
  )
}

export default _layout