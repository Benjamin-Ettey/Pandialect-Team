import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCIAL_LOGINS = [
    {id: 'google', icon: require('../../../../assets/images/google.png')},
];

type LoginResponse = {
    userId: string,
    accessToken: string,
    refreshToken: string
}

const SignUpScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {language, level} = params;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        age: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Validation functions
    const validateField = (field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'name':
                if (!value.trim()) error = 'Full name is required';
                else if (value.length < 3) error = 'Name too short';
                break;
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
            case 'age':
                if (!value) error = 'Age is required';
                else if (isNaN(Number(value))) error = 'Must be a number';
                else if (Number(value) < 13) error = 'Must be 13+';
                break;
        }

        setErrors(prev => ({...prev, [field]: error}));
        return !error;
    };

    const storeTokensAndData = async (userId: string, accessToken: string, refreshToken: string) => {
        try {
            await AsyncStorage.multiSet([
                ['userId', userId],
                ['accessToken', accessToken],
                ['refreshToken', refreshToken],
            ]);
        } catch (error) {
            console.error('Error storing tokens:', error);
        }
    };

    const handleSubmit = async () => {
        // Validate all fields
        const isNameValid = validateField('name', formData.name);
        const isEmailValid = validateField('email', formData.email);
        const isPasswordValid = validateField('password', formData.password);
        const isAgeValid = validateField('age', formData.age);

        if (!termsAccepted) {
            Alert.alert('Error', 'Please accept the terms and conditions');
            return;
        }

        if (isNameValid && isEmailValid && isPasswordValid && isAgeValid) {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: formData.name,
                        email: formData.email,
                        password: formData.password,
                        age: formData.age,
                        language: {
                            language: level
                        },
                        role: "USER"
                    }),
                });

                if (response.ok) {
                    // Start a login process on successful signup
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

                        if (response.ok) {
                            // Login successful
                            // Store tokens and user id in AsyncStorage on successful login
                            let data: LoginResponse = await response.json();
                            console.log(data)
                            await storeTokensAndData(data.userId, data.accessToken, data.refreshToken);

                            // Navigate to home page next
                            router.replace('/(root)/(tabs)/englishPages/beginner/HomepageTabs/home');
                        } else {
                            // Login Failed. Even though registration was successful
                            Alert.alert('Error', 'Login failed. Please log in manually');
                        }
                    } catch (error) {
                        // Login failed
                        console.error('Login error:', error);
                        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
                    } finally {
                        setLoading(false);
                    }
                } else {
                    // Registration was not successful
                    Alert.alert('Error', 'Sign up failed. Please try again.');
                }
            } catch (error) {
                // Registration error
                console.error('Sign up error:', error);
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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#7f6edb"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Create Account</Text>
                    <View style={{width: 24}}/> {/* Spacer */}
                </View>

                {/* Language/Level Indicator */}
                <View style={styles.languageInfo}>
                    <Text style={styles.languageText}>
                        Learning: <Text style={styles.highlight}>{language || ''}</Text>
                    </Text>
                    <Text style={styles.languageText}>
                        Level: <Text style={styles.highlight}>{level || ''}</Text>
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon}/>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => {
                                    setFormData({...formData, name: text});
                                    if (errors.name) validateField('name', text);
                                }}
                                onBlur={() => validateField('name', formData.name)}
                            />
                        </View>
                        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Age</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={20} color="#888" style={styles.inputIcon}/>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={formData.age}
                                onChangeText={(text) => {
                                    setFormData({...formData, age: text});
                                    if (errors.age) validateField('age', text);
                                }}
                                onBlur={() => validateField('age', formData.age)}
                            />
                        </View>
                        {errors.age ? <Text style={styles.error}>{errors.age}</Text> : null}
                    </View>

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

                    {/* Terms Checkbox */}
                    <View style={styles.termsContainer}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setTermsAccepted(!termsAccepted)}
                        >
                            {termsAccepted ? (
                                <Ionicons name="checkbox" size={24} color="#7f6edb"/>
                            ) : (
                                <Ionicons name="square-outline" size={24} color="#888"/>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                            I agree to the <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy
                            Policy</Text>
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!formData.name || !formData.email || !formData.password || !formData.age || !termsAccepted) &&
                            styles.disabledButton
                        ]}
                        onPress={handleSubmit}
                        disabled={!formData.name || !formData.email || !formData.password || !formData.age || !termsAccepted || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.submitButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine}/>
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine}/>
                    </View>

                    {/* Social Logins */}
                    <View style={styles.socialContainer}>
                        {SOCIAL_LOGINS.map((social) => (
                            <TouchableOpacity
                                key={social.id}
                                style={styles.socialButton}
                            >
                                <Image
                                    source={social.icon}
                                    style={styles.socialIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(root)/(tabs)/loginPage/login')}>
                            <Text style={styles.loginLink}>Log in</Text>
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
        top: '10%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        elevation: 3,
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7f6edb',
    },
    languageInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 24,
    },
    languageText: {
        fontSize: 16,
        color: '#666',
    },
    highlight: {
        fontWeight: 'bold',
        color: '#7f6edb',
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    checkbox: {
        marginRight: 12,
    },
    termsText: {
        fontSize: 15,
        color: '#666',
    },
    link: {
        color: '#7f6edb',
        fontWeight: '500',
    },
    submitButton: {
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
    },
    disabledButton: {
        backgroundColor: '#b6acf0',
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
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
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f7f7f7',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    loginText: {
        color: '#666',
        fontSize: 15,
    },
    loginLink: {
        color: '#7f6edb',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default SignUpScreen;