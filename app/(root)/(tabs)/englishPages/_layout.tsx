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
                    name="englishPages"
                    options={{ headerShown: false }}
                  />
            
        </Stack>
    )
}

export default _layout