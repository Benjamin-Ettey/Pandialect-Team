import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Lesson } from './types';

interface LessonItemProps {
    lesson: Lesson;
    onPress: (lesson: Lesson) => void;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.8}
            onPress={() => onPress(lesson)}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: lesson.image }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{lesson.title}</Text>
                <View style={styles.xpContainer}>
                    <MaterialCommunityIcons name="star" size={16} color="#f7c948" />
                    <Text style={styles.xpText}>{lesson.xpReward} XP</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 22,
    },
    imageContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#edeafd',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
        borderWidth: 2,
        borderColor: '#7f6edb',
        overflow: 'hidden',
    },
    image: {
        width: 32,
        height: 32,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        color: '#222',
        fontWeight: 'bold',
        letterSpacing: 0.1,
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    xpText: {
        fontSize: 14,
        color: '#888',
        marginLeft: 4,
    },
});

export default LessonItem;