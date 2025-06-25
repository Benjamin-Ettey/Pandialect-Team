import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const SOCIALS = [
    { key: 'google', api: 'https://img.icons8.com/color/48/000000/google-logo.png' },
    { key: 'facebook', api: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
    { key: 'apple', api: 'https://img.icons8.com/ios-filled/50/000000/mac-os.png' },
];

const CreateAccountForm = () => {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const [fullname, setFullname] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const validateEmail = (value: string) => {
        if (!value.includes('@') || !value.includes('.')) {
            setEmailError('Please enter a valid email address.');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    const validatePassword = (value: string) => {
        const hasCapital = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const isProperLength = value.length >= 8 && value.length <= 16;
        if (!hasCapital || !hasNumber || !isProperLength) {
            setPasswordError('8-16 chars, 1 capital letter, and 1 number.');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const handleCreateAccount = () => {
        if (!fullname || !age || !email || !password || emailError || passwordError) {
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace('/(root)/(tabs)/englishPages/beginner/englishbeginnerHomepage/homeEnglish');
        }, 2000);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
            <View style={styles.headerWrapper}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={26} color="#7f6edb" />
                </TouchableOpacity>
                {/* Centered Sign Up Title */}
                <View style={styles.headerTitleWrapper}>
                    <Text style={styles.headerTitle}>Sign Up</Text>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Full Name Input */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Full Name"
                        value={fullname}
                        onChangeText={setFullname}
                        style={[styles.input, { width: width * 0.9 }]}
                        placeholderTextColor="#aaa"
                    />
                </View>
                {/* Age Input */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Age"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        style={[styles.input, { width: width * 0.9 }]}
                        placeholderTextColor="#aaa"
                    />
                </View>
                {/* Email Input */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Email Address"
                        value={email}
                        onChangeText={text => {
                            setEmail(text);
                            if (emailError) validateEmail(text);
                        }}
                        onBlur={() => validateEmail(email)}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={[styles.input, { width: width * 0.9 }]}
                        placeholderTextColor="#aaa"
                    />
                    {emailError ? (
                        <Text style={styles.errorText}>{emailError}</Text>
                    ) : null}
                </View>
                {/* Password Input */}
                <View style={styles.inputWrapper}>
                    <View style={[styles.passwordContainer, { width: width * 0.9 }]}>
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={text => {
                                setPassword(text);
                                if (passwordError) validatePassword(text);
                            }}
                            onBlur={() => validatePassword(password)}
                            secureTextEntry={!showPassword}
                            style={[styles.input, styles.passwordInput]}
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={22}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? (
                        <Text style={styles.errorText}>{passwordError}</Text>
                    ) : null}
                </View>
                {/* Create Account Button */}
                <TouchableOpacity
                    style={[
                        styles.createButton,
                        (!fullname || !age || !email || !password || emailError || passwordError) && { backgroundColor: '#ccc' },
                    ]}
                    disabled={!fullname || !age || !email || !password || !!emailError || !!passwordError || loading}
                    onPress={handleCreateAccount}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.createButtonText}>
                            Create Account
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Remember Me and Forgot Password */}
                <View style={styles.rememberForgotRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.rememberBox}
                            onPress={() => setRememberMe?.(prev => !prev)}
                        >
                            {rememberMe ? (
                                <Ionicons name="checkmark" size={16} color="#7f6edb" />
                            ) : null}
                        </TouchableOpacity>
                        <Text style={{ color: '#222', fontSize: 15 }}>Remember me</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        router.push('/(root)/(tabs)/forgotPassword/forgotpassword');
                    }}>
                        <Text style={{ color: '#7f6edb', fontWeight: 'bold', fontSize: 15 }}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Other sign up options */}
                <Text style={{ marginVertical: 24, color: '#888', fontSize: 15 }}>or sign up with</Text>
                <View style={styles.socialRow}>
                    {SOCIALS.map(social => (
                        <TouchableOpacity key={social.key} style={styles.iconButton} activeOpacity={0.8}>
                            <Image
                                source={{ uri: social.api }}
                                style={styles.socialIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                {/* Terms at the bottom */}
                <Text style={styles.termsTextBottom}>
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 36,
        paddingBottom: 10,
        paddingHorizontal: 18,
        backgroundColor: '#fff',
        width: '100%',
        zIndex: 10,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 18,
        padding: 4,
        borderRadius: 20,
        backgroundColor: '#f7f7f7',
        elevation: 2,
        zIndex: 2,
    },
    headerTitleWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#7f6edb',
        textAlign: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        paddingBottom: 40,
        backgroundColor: '#fff',
    },
    termsText: {
        display: 'none', // Hide the old terms text at the top
    },
    termsTextBottom: {
        textAlign: 'center',
        marginTop: 30,
        color: 'gray',
        fontSize: 14,
        marginHorizontal: 20,
    },
    inputWrapper: {
        marginBottom: 22,
        width: '100%',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#f7f7f7',
        borderRadius: 30,
        paddingVertical: 14,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#222',
        borderWidth: 1,
        borderColor: '#b6acf0',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#f7f7f7',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#b6acf0',
    },
    passwordInput: {
        flex: 1,
        borderWidth: 0,
        marginVertical: 0,
        paddingRight: 44,
        backgroundColor: 'transparent',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 0,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    errorText: {
        color: '#e74c3c',
        marginTop: 6,
        marginLeft: 10,
        alignSelf: 'flex-start',
        fontSize: 13,
        left: 20,
    },
    createButton: {
        backgroundColor: '#7f6edb',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 40,
        marginTop: 8,
        alignItems: 'center',
        width: '90%',
        shadowColor: '#7f6edb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 0.5,
    },
    rememberForgotRow: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    rememberBox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#7f6edb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '90%',
        marginBottom: 10,
    },
    iconButton: {
        borderRadius: 30,
        padding: 12,
        marginHorizontal: 12,
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        shadowColor: '#b6acf0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.13,
        shadowRadius: 4,
        elevation: 2,
    },
    socialIcon: {
        width: 32,
        height: 32,
    }
});

export default CreateAccountForm;