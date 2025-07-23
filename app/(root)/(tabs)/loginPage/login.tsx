import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const LoginScreen = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const validateField = (field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'email':
                if (!value.includes('@') || !value.includes('.')) {
                    error = 'Please enter a valid email';
                }
                break;
            case 'password':
                if (value.length < 8) error = 'Minimum 8 characters';
                else if (!/[A-Z]/.test(value)) error = 'Needs 1 uppercase letter';
                else if (!/\d/.test(value)) error = 'Needs 1 number';
                break;
        }

        setErrors(prev => ({...prev, [field]: error}));
        return !error;
    };

    const storeTokensAndData = async (userId: string, accessToken: string, refreshToken: string) => {
        console.log('Storing tokens:', {userId, accessToken, refreshToken, rememberMe});
        try {
            await AsyncStorage.multiSet([
                ['userId', userId],
                ['accessToken', accessToken],
                ['refreshToken', refreshToken],
            ]);
            if (rememberMe) {
                await AsyncStorage.setItem('rememberMe', 'true');
            }
            console.log('Tokens stored successfully - ' + AsyncStorage.getItem('accessToken'));
        } catch (error) {
            console.error('Error storing tokens:', error);
        }
    };

    const handleLogin = async () => {
        const isEmailValid = validateField('email', formData.email);
        const isPasswordValid = validateField('password', formData.password);

        if (isEmailValid && isPasswordValid) {
            setLoading(true);
            try {
                // Replace this with your actual API call
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Store tokens in AsyncStorage
                    await storeTokensAndData(data.userId, data.accessToken, data.refreshToken);

                    // Navigate to home page on successful login
                    router.replace('/(root)/(tabs)/englishPages/beginner/HomepageTabs/home');
                } else {
                    Alert.alert('Error', data.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                console.error('Login error:', error);
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header with Panda */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../../assets/images/pandaCup.png')}
                            style={styles.logoImage}
                            resizeMode='contain'
                        />
                    </View>
                    <Text style={styles.title}>Sign In</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon}/>
                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={(text) => {
                                    setFormData({...formData, email: text});
                                    if (errors.email) validateField('email', text);
                                }}
                                onBlur={() => validateField('email', formData.email)}
                            />
                        </View>
                        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon}/>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                secureTextEntry={!showPassword}
                                value={formData.password}
                                onChangeText={(text) => {
                                    setFormData({...formData, password: text});
                                    if (errors.password) validateField('password', text);
                                }}
                                onBlur={() => validateField('password', formData.password)}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password ? (
                            <Text style={styles.error}>{errors.password}</Text>
                        ) : (
                            <Text style={styles.hint}>Minimum 8 characters with 1 uppercase and number</Text>
                        )}
                    </View>

                    {/* Remember Me & Forgot Password */}
                    <View style={styles.rememberContainer}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            {rememberMe ? (
                                <Ionicons name="checkbox" size={24} color="#7f6edb"/>
                            ) : (
                                <Ionicons name="square-outline" size={24} color="#888"/>
                            )}
                            <Text style={styles.rememberText}>Remember me</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/(root)/(tabs)/forgotPassword/forgotpassword')}>
                            <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            (!formData.email || !formData.password || errors.email || errors.password) &&
                            styles.disabledButton
                        ]}
                        onPress={handleLogin}
                        disabled={!formData.email || !formData.password || errors.email || errors.password || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine}/>
                        <Text style={styles.dividerText}>or sign in with</Text>
                        <View style={styles.dividerLine}/>
                    </View>

                    {/* Google Login */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.googleButton}>
                            <View style={styles.googleIconContainer}>
                                <Image
                                    source={require('../../../../assets/images/google.png')}
                                    style={styles.googleIcon}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(root)/(tabs)/(auth)/secondLandingPage')}>
                            <Text style={styles.signupLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    logoContainer: {
        width: 150,
        height: 150,
        backgroundColor: '#7f6edb',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginBottom: 20,
    },
    logoImage: {
        width: '80%',
        height: '80%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7f6edb',
        marginBottom: 10,
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    inputIcon: {
        marginLeft: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#222',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 14,
    },
    error: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 6,
        marginLeft: 4,
    },
    hint: {
        color: '#888',
        fontSize: 14,
        marginTop: 6,
        marginLeft: 4,
    },
    rememberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberText: {
        fontSize: 15,
        color: '#666',
        marginLeft: 8,
    },
    forgotPassword: {
        color: '#7f6edb',
        fontWeight: '500',
        fontSize: 15,
    },
    loginButton: {
        backgroundColor: '#7f6edb',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#7f6edb',
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#b6acf0',
        shadowOpacity: 0,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e5e5',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#888',
        fontSize: 14,
    },
    socialContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    googleButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    googleIconContainer: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    googleText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    signupText: {
        color: '#666',
        fontSize: 15,
    },
    signupLink: {
        color: '#7f6edb',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default LoginScreen;