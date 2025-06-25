import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const SOCIALS = [
    { key: 'google', api: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' },
    { key: 'facebook', api: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
    { key: 'apple', api: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
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
            router.replace('/(root)/(tabs)/englishPages/intermediate/englishintermediateHomepage/homeEnglishIntermediate');
        }, 2000);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 40,
                }}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={{ position: 'absolute', bottom: '100%', fontSize: 22, fontWeight: 'bold', color: '#7f6edb' }}>Sign Up</Text>

                <Text style={{ position: 'absolute', bottom: '10%', textAlign: 'center', marginHorizontal: 20, color: 'gray' }}>By signing up, you agree to our Terms of Service and Privacy Policy.</Text>

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
                <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                borderWidth: 1.5,
                                borderColor: '#7f6edb',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 6,
                            }}
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
                        // Add your forgot password logic here
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
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
        paddingRight: 44, // space for the eye icon
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