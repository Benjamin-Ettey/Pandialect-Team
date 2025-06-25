import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen
            name="beginner"
            options={{ headerShown: false }}
            />
            <Stack.Screen
                name="englishLevel"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="intermediate"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="advanced"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                    name="englishPages"
                    options={{ headerShown: false }}
                  />
            <Stack.Screen
                    name="Known"
                    options={{
                      headerShown: false,
                    }}
                  />
            <Stack.Screen
                        name="englishintermediateHomepage"
                        options={{ headerShown: false }}
                    />
            
        </Stack>
    )
}

export default _layout