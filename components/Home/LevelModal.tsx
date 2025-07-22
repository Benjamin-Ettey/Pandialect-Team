import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Level } from './types';

interface LevelModalProps {
    visible: boolean;
    levels: Level[];
    onClose: () => void;
    onSelect: (level: Level) => void;
}

const LevelModal: React.FC<LevelModalProps> = ({ visible, levels, onClose, onSelect }) => {
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
                        data={levels}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.levelOption}
                                onPress={() => onSelect(item)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.levelName}>{item.name}</Text>
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
    levelOption: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 2,
        backgroundColor: '#edeafd',
        marginTop: 2,
    },
    levelName: {
        fontSize: 17,
        color: '#7f6edb',
        fontWeight: 'bold',
        letterSpacing: 0.2,
        marginLeft: 8,
    },
});

export default LevelModal;