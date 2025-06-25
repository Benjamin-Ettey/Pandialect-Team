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
                    let iconName;
                    let IconComponent = MaterialIcons;

                    switch (route.name) {
                        case 'home':
                            iconName = 'home-filled';
                            IconComponent = MaterialIcons;
                            break;
                        case 'lesson':
                            iconName = 'menu-book';
                            IconComponent = MaterialIcons;
                            break;
                        case 'progress':
                            iconName = 'show-chart';
                            IconComponent = MaterialIcons;
                            break;
                        case 'leaderboard':
                            iconName = 'leaderboard';
                            IconComponent = MaterialIcons;
                            break;
                        case 'profile':
                            iconName = 'person';
                            IconComponent = MaterialIcons;
                            break;
                        default:
                            iconName = 'circle';
                            IconComponent = MaterialIcons;
                    }

                    return <IconComponent name={iconName} size={size} color={focused ? '#7f6edb' : '#888'} />;
                },
            })}
        >
            <Tabs.Screen
                name="homeEnglishAdvanced"
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="lessonEnglishAdvanced"
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="progressEnglishAdvanced"
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="leaderboardEnglishAdvanced"
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profileEnglishAdvanced"
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
        </Tabs>
    );
};

export default _layout