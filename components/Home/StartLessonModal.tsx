import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StartLessonModalProps {
    visible: boolean;
    loading: boolean;
    lessonTitle?: string;
    onClose: () => void;
    onStart: () => void;
}

const StartLessonModal: React.FC<StartLessonModalProps> = ({
    visible,
    loading,
    lessonTitle,
    onClose,
    onStart,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    {loading ? (
                        <>
                            <ActivityIndicator size="large" color="#7f6edb" />
                            <Text style={styles.modalText}>We are fetching the best lessons for you...</Text>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.closeIcon}
                                onPress={onClose}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <AntDesign name="close" size={24} color="#7f6edb" />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Hi, let's start a lesson!</Text>
                            <Text style={styles.lessonTitle}>{lessonTitle}</Text>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={onStart}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.startButtonText}>Start Lesson</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(30,30,30,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 28,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#7f6edb',
        shadowOpacity: 0.13,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        position: 'relative',
    },
    closeIcon: {
        position: 'absolute',
        top: 14,
        right: 14,
        zIndex: 2,
        padding: 4,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7f6edb',
        marginBottom: 28,
        marginTop: 10,
        textAlign: 'center',
    },
    lessonTitle: {
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#7f6edb',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 36,
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
    },
    startButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
});

export default StartLessonModal;