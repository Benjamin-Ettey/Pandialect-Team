import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Language, Level } from './types';

interface HeaderProps {
    selectedLang: Language;
    selectedLevel: Level;
    starCount: number;
    fireCount: number;
    onLanguagePress: () => void;
    onLevelPress: () => void;
}

const Header: React.FC<HeaderProps> = ({
    selectedLang,
    selectedLevel,
    starCount,
    fireCount,
    onLanguagePress,
    onLevelPress,
}) => {
    return (
        <View style={styles.headerContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '30%' }}>
                <TouchableOpacity
                    style={[styles.langCircle, { width: 40, height: 40 }]}
                    onPress={onLanguagePress}
                    activeOpacity={0.8}
                >
                    <Text style={styles.langFlag}>{selectedLang.flag}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onLanguagePress} activeOpacity={0.7}>
                    <Ionicons name="chevron-down" size={18} color="#222" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.levelSelector, { paddingHorizontal: 10, paddingVertical: 5 }]}
                onPress={onLevelPress}
                activeOpacity={0.8}
            >
                <Text style={[styles.levelText, { fontSize: 14 }]}>{selectedLevel.name}</Text>
                <Ionicons name="chevron-down" size={14} color="#7f6edb" style={{ marginLeft: 2 }} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '40%' }}>
                <View style={[styles.starContainer, { paddingHorizontal: 8, paddingVertical: 3 }]}>
                    <MaterialCommunityIcons name="star" size={18} color="#f7c948" />
                    <Text style={[styles.starText, { fontSize: 13 }]}>{starCount}/30</Text>
                </View>
                <View style={[styles.fireContainer, { paddingHorizontal: 8, paddingVertical: 3 }]}>
                    <FontAwesome5 name="fire" size={16} color="#ff6d00" />
                    <Text style={[styles.fireText, { fontSize: 13 }]}>{fireCount}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
        backgroundColor: '#edeafd',
        zIndex: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: '#d6d0fa',
        shadowColor: '#7f6edb',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
    },
    langCircle: {
        borderRadius: 24,
        backgroundColor: '#edeafd',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2.5,
        borderColor: '#7f6edb',
        shadowColor: '#7f6edb',
        shadowOpacity: 0.10,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    langFlag: {
        fontSize: 28,
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f6ff',
        borderRadius: 14,
        borderWidth: 1.2,
        borderColor: '#7f6edb',
    },
    starText: {
        marginLeft: 4,
        color: '#7f6edb',
        fontWeight: 'bold',
    },
    fireContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff5e6',
        borderRadius: 14,
        borderWidth: 1.2,
        borderColor: '#ffb366',
        marginLeft: 10
    },
    fireText: {
        marginLeft: 4,
        color: '#ff6d00',
        fontWeight: 'bold',
    },
    levelSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1.2,
        borderColor: '#7f6edb',
        shadowColor: '#7f6edb',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,
    },
    levelText: {
        color: '#7f6edb',
        fontWeight: 'bold',
        marginRight: 4,
        fontSize: 16
    },
});

export default Header;