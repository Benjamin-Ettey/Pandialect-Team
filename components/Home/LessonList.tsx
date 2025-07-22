import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import LessonItem from './LessonItem';
import { Language, Lesson, Level } from './types';

interface LessonListProps {
    lessons: Lesson[];
    loading: boolean;
    selectedLang: Language;
    selectedLevel: Level;
    onLessonPress: (lesson: Lesson) => void;
}

const LessonList: React.FC<LessonListProps> = ({
    lessons,
    loading,
    selectedLang,
    selectedLevel,
    onLessonPress,
}) => {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
        >
            <Text style={styles.title}>
                {selectedLevel.name} - {selectedLang.name}
            </Text>
            <Text style={styles.subtitle}>
                Let's complete some lessons.
            </Text>
            <View style={{ height: 18 }} />

            {loading ? (
                <ActivityIndicator size="large" color="#7f6edb" style={{ marginTop: 40 }} />
            ) : lessons.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No lessons available</Text>
                    <Text style={styles.emptySubtext}>Check back later or try a different level</Text>
                </View>
            ) : (
                lessons.map((lesson) => (
                    <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        onPress={onLessonPress}
                    />
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
    },
    scrollView: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 18,
        marginLeft: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default LessonList;