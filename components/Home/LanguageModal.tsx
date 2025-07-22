import React from 'react';
import { Modal, TouchableOpacity, View, FlatList, Text, StyleSheet } from 'react-native';
import { Language } from './types';

interface LanguageModalProps {
    visible: boolean;
    languages: Language[];
    onClose: () => void;
    onSelect: (lang: Language) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, languages, onClose, onSelect }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={onClose}
            >
                <View style={styles.modalContent}>
                    <FlatList
                        data={languages}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.langOption}
                                onPress={() => onSelect(item)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.langFlag}>{item.flag}</Text>
                                <Text style={styles.langName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(30,30,30,0.18)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 70,
        paddingLeft: 18,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        minWidth: 180,
        elevation: 8,
        shadowColor: '#7f6edb',
        shadowOpacity: 0.13,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        width: 200,
    },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 2,
        backgroundColor: '#edeafd',
        marginTop: 2,
    },
    langFlag: {
        fontSize: 28,
    },
    langName: {
        fontSize: 17,
        color: '#222',
        marginLeft: 12,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
});

export default LanguageModal;