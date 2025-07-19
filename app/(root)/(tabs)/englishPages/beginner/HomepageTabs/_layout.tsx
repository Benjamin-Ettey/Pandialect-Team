import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const _layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#7f6edb',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 90,
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#eee',
          paddingBottom: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'circle';

          switch (route.name) {
            case 'home':
              iconName = 'home';
              break;
            case 'review':
              iconName = 'menu-book';
              break;
            case 'progress':
              iconName = 'show-chart';
              break;
            case 'leaderboard':
              iconName = 'leaderboard';
              break;
            case 'profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <MaterialIcons
              name={iconName}
              size={28}
              color={color}
            />
          );
        },
        tabBarLabel: ({ focused, color }) => {
          let label = '';

          switch (route.name) {
            case 'home':
              label = 'Home';
              break;
            case 'review':
              label = 'Lessons';
              break;
            case 'progress':
              label = 'Progress';
              break;
            case 'leaderboard':
              label = 'Leaderboard';
              break;
            case 'profile':
              label = 'Profile';
              break;
          }

          return (
            <Text
              style={[
                styles.tabLabel,
                { color: color, fontWeight: focused ? '600' : '400' }
              ]}
            >
              {label}
            </Text>
          );
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default _layout;