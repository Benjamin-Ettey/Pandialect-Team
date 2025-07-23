import Header from '@/components/Home/Header';
import LanguageModal from '@/components/Home/LanguageModal';
import LessonList from '@/components/Home/LessonList';
import LevelModal from '@/components/Home/LevelModal';
import StartLessonModal from '@/components/Home/StartLessonModal';
import { Language, LANGUAGES, Lesson, Level, LEVELS } from '@/components/Home/types';
import { apiFetch } from '@/utils/authUtils';
import { BASE_API_URL } from '@/utils/consts';
import { getLessonImage } from '@/utils/lessonIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, SafeAreaView, StatusBar, View } from 'react-native';

const { width } = Dimensions.get('window');
const bgIllustration = 'https://cdn.pixabay.com/photo/2017/06/10/07/18/panda-2385886_1280.png';

const HomeScreen: React.FC = () => {
    const router = useRouter();
    const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
    const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);
    const [starCount, setStarCount] = useState(0);
    const [fireCount, setFireCount] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loadingLessons, setLoadingLessons] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [fetchingLesson, setFetchingLesson] = useState(false);
    const [langModalVisible, setLangModalVisible] = useState(false);
    const [levelModalVisible, setLevelModalVisible] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                const storedToken = await AsyncStorage.getItem("accessToken");
                setUserId(storedUserId);
                setAccessToken(storedToken);
            } catch (error) {
                console.error("Failed to load user data:", error);
            }
        };
        loadUserData();
    }, []);

    useEffect(() => {
        if (userId && accessToken) {
            fetchLessons();
            fetchLanguageDifficulties();
        }
    }, [selectedLang, selectedLevel, userId, accessToken]);

    const fetchLanguageDifficulties = async () => {
        if (!userId || !accessToken) return;

        try {
            const url = `${BASE_API_URL}/api/user/languages?userId=${userId}`;
            const response = await apiFetch(url, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (response.ok) {
                const data = await response.json();
                setStarCount(data.totalXp || 0);
                setFireCount(data.streakDays || 0);
            }
        } catch (error) {
            console.error("Failed to fetch language difficulties:", error);
        }
    };

    const fetchLessons = async () => {
        if (!userId || !accessToken) return;

        setLoadingLessons(true);

        try {
            const url = `${BASE_API_URL}/api/lessons?language=${selectedLang.name.toUpperCase()}&difficulty=${selectedLevel.name.toUpperCase()}`;
            const response = await apiFetch(url, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (response.ok) {
                const data = await response.json();
                const formattedLessons = data.map((lesson: any) => ({
                    ...lesson,
                    route: lesson.title.toLowerCase().replace(/\s+/g, '-'),
                    image: getLessonImage(lesson.title)
                }));
                setLessons(formattedLessons);
            } else {
                setLessons([]);
            }
        } catch (error) {
            console.error("Failed to fetch lessons:", error);
            setLessons([]);
        } finally {
            setLoadingLessons(false);
        }
    };

    const handleStartLesson = () => {
        setModalVisible(false);
        if (selectedLesson) {
            setFetchingLesson(true);
            router.push({
                pathname: '/(root)/(tabs)/englishPages/beginner/LanguageLessons/LanguageLessonsPage',
                params: {
                    lang: selectedLang.code,
                    level: selectedLevel.code,
                    lessonId: selectedLesson.id,
                },
            });;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#edeafd' }}>
            <Image
                source={{ uri: bgIllustration }}
                style={{
                    position: 'absolute',
                    width: width * 0.7,
                    height: width * 0.7,
                    top: -40,
                    right: -60,
                    opacity: 0.09,
                    zIndex: -1,
                }}
                resizeMode="contain"
            />

            <SafeAreaView style={{
                flex: 0, backgroundColor: '#edeafd',
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 36 : 36
            }}>
                <Header
                    selectedLang={selectedLang}
                    selectedLevel={selectedLevel}
                    starCount={starCount}
                    fireCount={fireCount}
                    onLanguagePress={() => setLangModalVisible(true)}
                    onLevelPress={() => setLevelModalVisible(true)}
                />
            </SafeAreaView>

            <LanguageModal
                visible={langModalVisible}
                languages={LANGUAGES}
                onClose={() => setLangModalVisible(false)}
                onSelect={(lang) => {
                    setLangModalVisible(false);
                    setSelectedLang(lang);
                }}
            />

            <LevelModal
                visible={levelModalVisible}
                levels={LEVELS}
                onClose={() => setLevelModalVisible(false)}
                onSelect={(level) => {
                    setLevelModalVisible(false);
                    setSelectedLevel(level);
                }}
            />

            <LessonList
                lessons={lessons}
                loading={loadingLessons}
                selectedLang={selectedLang}
                selectedLevel={selectedLevel}
                onLessonPress={(lesson) => {
                    setSelectedLesson(lesson);
                    setModalVisible(true);
                }}
            />

            <StartLessonModal
                visible={modalVisible}
                loading={fetchingLesson}
                lessonTitle={selectedLesson?.title}
                onClose={() => setModalVisible(false)}
                onStart={handleStartLesson}
            />
        </View>
    );
};

export default HomeScreen;
