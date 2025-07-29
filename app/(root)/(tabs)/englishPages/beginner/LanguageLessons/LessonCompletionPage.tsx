import { apiFetch } from '@/utils/authUtils';
import { BASE_API_URL } from '@/utils/consts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    SafeAreaView,
    StyleSheet,
    Text,
    Pressable,
    View,
    Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const scaleWidth = (size: number) => (width / 375) * size;
const scaleHeight = (size: number) => (height / 667) * size;

const LessonCompletionPage = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { xpGained, lessonTitle } = params;

    const [animatedTotalXp] = useState(new Animated.Value(0));
    const [displayTotalXp, setDisplayTotalXp] = useState(0);
    const [currentTotalXp, setCurrentTotalXp] = useState(0);
    const parsedXpGained = Number(xpGained || 0);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!userId || !accessToken) return;

                const url = `${BASE_API_URL}/api/user/languages?userId=${userId}`;
                const response = await apiFetch(url, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    const initialTotalXp = data.totalXp || 0;
                    setCurrentTotalXp(initialTotalXp);

                    animatedTotalXp.setValue(initialTotalXp);
                    Animated.timing(animatedTotalXp, {
                        toValue: initialTotalXp + parsedXpGained,
                        duration: 1800,
                        easing: Easing.out(Easing.exp),
                        useNativeDriver: false,
                    }).start();
                }
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchUserStats();

        animatedTotalXp.addListener(({ value }) => {
            setDisplayTotalXp(Math.floor(value));
        });

        return () => {
            animatedTotalXp.removeAllListeners();
        };
    }, [xpGained]);


    const handleContinueHome = () => {
        updateXp(parsedXpGained); // Update XP in backend
        router.replace('/(root)/(tabs)/englishPages/beginner/HomepageTabs/home');
    };

    async function updateXp(xp: number) {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!userId || !accessToken) {
                console.error('User ID or Access Token not found.');
                return;
            }

            const url = `${BASE_API_URL}/api/user/xp?userId=${userId}&xp=${xp}`;
            const response = await apiFetch(url, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!response.ok) {
                console.error('Failed to update XP:', response.status);
            }
        } catch (error) {
            console.error('Error updating XP:', error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>🎉 Lesson Complete</Text>
                <Text style={styles.subtitle}>{lessonTitle || 'Well done!'}</Text>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Total XP</Text>
                    <Text style={styles.cardXP}>
                        <Animated.Text>{displayTotalXp}</Animated.Text>
                    </Text>
                    <Text style={styles.xpGained}>+{parsedXpGained} XP</Text>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && { transform: [{ scale: 0.97 }] },
                    ]}
                    onPress={handleContinueHome}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fb',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scaleWidth(24),
    },
    title: {
        fontSize: scaleWidth(28),
        fontWeight: '700',
        color: '#333',
        marginBottom: scaleHeight(8),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: scaleWidth(16),
        color: '#555',
        marginBottom: scaleHeight(32),
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: scaleHeight(28),
        paddingHorizontal: scaleWidth(32),
        alignItems: 'center',
        width: '85%',
        marginBottom: scaleHeight(40),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    cardLabel: {
        fontSize: scaleWidth(16),
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    cardXP: {
        fontSize: scaleWidth(64),
        fontWeight: '700',
        color: '#333',
    },
    xpGained: {
        fontSize: scaleWidth(18),
        color: '#2ecc71',
        fontWeight: '600',
        marginTop: 6,
    },
    button: {
        backgroundColor: '#7f6edb',
        paddingVertical: scaleHeight(14),
        paddingHorizontal: scaleWidth(40),
        borderRadius: 30,
        shadowColor: '#7f6edb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: scaleWidth(16),
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default LessonCompletionPage;
