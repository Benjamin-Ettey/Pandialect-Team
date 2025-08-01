import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
            name="LanguageLessonsPage"
            options={{ headerShown: false }}
                        />

      <Stack.Screen
        name="LessonCompletionPage"
        options={{ headerShown: false }}
      />
    </Stack>
  )
}

export default _layout