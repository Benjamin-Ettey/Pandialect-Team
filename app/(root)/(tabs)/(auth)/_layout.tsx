import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (

    <Stack>
        <Stack.Screen
            name="onboarding"
            options={{ headerShown: false }}
        />

      <Stack.Screen
        name="landingPage"
        options={{ 
          headerShown: false
          
          
        }}
      />

      <Stack.Screen
        name="secondLandingPage"
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
        name="thirdLandingPage"
        options={{
          title: "",
          headerTintColor: '#7f6edb',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerBackTitle: ".."
        }}
      />

      <Stack.Screen
        name="fourthLandingPage"
        options={{
          title: "",
          headerTintColor: '#7f6edb',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerBackTitle: "..."
        }}
      />

      <Stack.Screen
        name="fifthLandingPage"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="sixthLandingPage"
        options={{
          title: "",
          headerTintColor: '#7f6edb',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerBackTitle: "...."
        }}
      />

      <Stack.Screen
        name="createAccount"
        options={{
          title: "",
          headerTintColor: '#7f6edb',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerBackTitle: "....."
        }}
      />

      <Stack.Screen
        name="(homepage)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="loginPage"
        options={{
          title: "",
          headerTintColor: '#7f6edb',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerBackTitle: "back"
        }}
      />
      <Stack.Screen
        name="homepage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="englishPages"
        options={{ headerShown: false }}
      />
      
      
    </Stack> 
        
  )
}

export default _layout