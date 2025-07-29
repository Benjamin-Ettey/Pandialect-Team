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
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LessonCompletionPage = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    // Extract parameters passed from LanguageLessonsPage
    const { xpGained, lessonTitle } = params; // Removed totalXpPossible and currentStreak as they won't be displayed directly

    // State for animated XP and total XP
    const [animatedXpGained] = useState(new Animated.Value(0));
    const [displayXpGained, setDisplayXpGained] = useState(0);
    const [animatedTotalXp] = useState(new Animated.Value(0));
    const [displayTotalXp, setDisplayTotalXp] = useState(0);
    // currentTotalXp and currentFireStreak are still fetched to get the initial total XP for animation
    const [currentTotalXp, setCurrentTotalXp] = useState(0);

    const parsedXpGained = Number(xpGained || 0);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!userId || !accessToken) {
                    console.error('User ID or Access Token not found.');
                    return;
                }

                // Fetch current user XP from backend
                const url = `${BASE_API_URL}/api/user/languages?userId=${userId}`;
                const response = await apiFetch(url, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const initialTotalXp = data.totalXp || 0;
                    setCurrentTotalXp(initialTotalXp); // Set actual current total XP

                    // Animate XP gained
                    animatedXpGained.setValue(0);
                    Animated.timing(animatedXpGained, {
                        toValue: parsedXpGained,
                        duration: 1500,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: false,
                    }).start(() => {
                        // After XP gained animation, animate total XP
                        // Start total XP animation from the value *before* adding the new XP gained
                        animatedTotalXp.setValue(initialTotalXp - parsedXpGained);
                        Animated.timing(animatedTotalXp, {
                            toValue: initialTotalXp, // Animate to the new total XP
                            duration: 1000,
                            easing: Easing.out(Easing.ease),
                            useNativeDriver: false,
                        }).start();
                    });
                } else {
                    console.error('Failed to fetch user stats:', response.status);
                }
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchUserStats();

        // Listener for XP gained animation
        animatedXpGained.addListener(({ value }) => {
            setDisplayXpGained(Math.floor(value));
        });

        // Listener for total XP animation
        animatedTotalXp.addListener(({ value }) => {
            setDisplayTotalXp(Math.floor(value));
        });

        return () => {
            animatedXpGained.removeAllListeners();
            animatedTotalXp.removeAllListeners();
        };
    }, [xpGained, animatedXpGained, animatedTotalXp]); // Re-run effect if xpGained changes (for new lessons)


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
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify({ userId, xp })
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
                <Text style={styles.lessonTitle}>Lesson Complete!</Text>
                <Text style={styles.lessonSubtitle}>You've mastered {lessonTitle || "this lesson"}!</Text>

                <View style={styles.xpGainedSection}>
                    <Text style={styles.xpGainedLabel}>XP Gained</Text>
                    <Text style={styles.xpGainedValue}>
                        + <Animated.Text>{displayXpGained}</Animated.Text> XP
                    </Text>
                </View>

                <View style={styles.totalXpSection}>
                    <Text style={styles.totalXpLabel}>Your New Total XP</Text>
                    <Text style={styles.totalXpValue}>
                        <Animated.Text>{displayTotalXp}</Animated.Text> XP
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinueHome}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#edeafd', // Light purple background
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.05, // Responsive horizontal padding
        paddingVertical: height * 0.05, // Responsive vertical padding
    },
    lessonTitle: {
        fontSize: width * 0.08, // Responsive font size
        fontWeight: 'bold',
        color: '#58CC02', // Green for success
        marginBottom: height * 0.01,
        textAlign: 'center',
    },
    lessonSubtitle: {
        fontSize: width * 0.05, // Responsive font size
        color: '#666',
        marginBottom: height * 0.05,
        textAlign: 'center',
    },
    xpGainedSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: width * 0.08, // Responsive padding
        alignItems: 'center',
        marginBottom: height * 0.03,
        width: '90%', // Responsive width
        maxWidth: 400, // Max width for larger screens
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 12,
    },
    xpGainedLabel: {
        fontSize: width * 0.055, // Responsive font size
        fontWeight: '600',
        color: '#333',
        marginBottom: height * 0.01,
    },
    xpGainedValue: {
        fontSize: width * 0.12, // Very large for prominence
        fontWeight: 'bold',
        color: '#FFC800', // Gold for XP
    },
    totalXpSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: width * 0.08, // Responsive padding
        alignItems: 'center',
        marginBottom: height * 0.05,
        width: '90%', // Responsive width
        maxWidth: 400, // Max width for larger screens
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 12,
    },
    totalXpLabel: {
        fontSize: width * 0.055, // Responsive font size
        color: '#666',
        marginBottom: height * 0.01,
    },
    totalXpValue: {
        fontSize: width * 0.1, // Large for prominence
        fontWeight: 'bold',
        color: '#7F5AED', // Purple for total XP
    },
    continueButton: {
        backgroundColor: '#7F5AED', // Purple button
        borderRadius: 12,
        paddingVertical: height * 0.025, // Responsive padding
        paddingHorizontal: width * 0.08, // Responsive padding
        width: '80%', // Responsive width
        maxWidth: 300, // Max width for larger screens
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: width * 0.055, // Responsive font size
        fontWeight: 'bold',
    },
});

export default LessonCompletionPage;
