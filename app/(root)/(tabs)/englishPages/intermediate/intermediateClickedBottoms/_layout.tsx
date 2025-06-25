import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="intermediateGreetingsEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="intermediatePoliteEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="intermediateHowareyouEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="intermediateFoodEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="intermediateTravelsEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="intermediateMasteringEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="englishClickedBottoms"
                options={{ headerShown: false }}
            />
        </Stack>
    )
}

export default _layout