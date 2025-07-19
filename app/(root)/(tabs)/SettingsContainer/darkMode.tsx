import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HelpAndSupport = () => {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name="tools" size={64} color="#7f6edb" />
            <Text style={styles.title}>Coming Soon</Text>
            <Text style={styles.message}>
                Oops! Our Dark Mode screen isn’t ready yet. We’re working hard to bring it to you soon!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: '#7f6edb',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        lineHeight: 22,
    },
});

export default HelpAndSupport;
