import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="advancedGreetingsEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="advancedPoliteEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="advancedHowareyouEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="advancedFoodEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="advancedTravelsEnglish"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="advancedMasteringEnglish"
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