import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

const _layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#7f6edb',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: '#eee' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'circle';

          switch (route.name) {
            case 'homeEnglish':
              iconName = 'home-filled';
              break;
            case 'lessonEnglish':
              iconName = 'menu-book';
              break;
            case 'progressEnglish':
              iconName = 'show-chart';
              break;
            case 'leaderboardEnglish':
              iconName = 'leaderboard';
              break;
            case 'profileEnglish':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <MaterialIcons
              name={iconName}
              size={size}
              color={focused ? '#7f6edb' : '#888'}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="homeEnglish"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="lessonEnglish"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="progressEnglish"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="leaderboardEnglish"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profileEnglish"
        options={{
          title: "",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;