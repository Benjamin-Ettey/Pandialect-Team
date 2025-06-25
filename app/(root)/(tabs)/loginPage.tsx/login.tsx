import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const SOCIALS = [
  { name: 'Google', key: 'google', api: 'https://img.icons8.com/color/48/000000/google-logo.png' },
  { name: 'Facebook', key: 'facebook', api: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
  { name: 'Apple', key: 'apple', api: 'https://img.icons8.com/ios-filled/50/000000/mac-os.png' },
];

const login = () => {
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (value: string) => {
    const hasCapital = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isProperLength = value.length >= 8 && value.length <= 16;
    if (!hasCapital || !hasNumber || !isProperLength) {
      setPasswordError(
        'Password must be 8-16 characters, include a capital letter and a number.'
      );
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateEmail = (value: string) => {
    const isValidEmail = /\S+@gmail\.com$/.test(value);
    if (!isValidEmail) {
      setEmailError('Please enter a valid @gmail.com email address.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          <View
            style={{
              width: 250,
              height: 160,
              backgroundColor: '#7f6edb',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomLeftRadius: 120,
              borderBottomRightRadius: 120,
              borderRadius: 150,
            }}>
            <Image
              source={require('../../../../assets/images/pandaCup.png')}
              style={{ width: '80%', height: '80%' }}
              resizeMode='contain'
            />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', top: '10%', color: '#7f6edb' }}>Sign In</Text>
          <View style={{ width: '100%', alignItems: 'center', marginTop: 24, top: '10%' }}>
            <TextInput
              placeholder="Email"
              placeholderTextColor='gray'
              value={email}
              onChangeText={text => {
                setEmail(text);
                validateEmail(text);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, { width: width * 0.9 }]}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <View style={{ width: width * 0.9, position: 'relative', marginBottom: 6 }}>
              <TextInput
                placeholder="Password"
                placeholderTextColor='gray'
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  validatePassword(text);
                }}
                secureTextEntry={!showPassword}
                style={[styles.input, { width: '100%', marginBottom: 0 }]}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
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
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!email || !password || emailError || passwordError) && { backgroundColor: '#ccc' },
              ]}
              onPress={() => {
                const emailValid = validateEmail(email);
                const passwordValid = validatePassword(password);
                if (!email || !password || !emailValid || !passwordValid) {
                  return;
                }
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  router.replace("/(root)/(tabs)/(auth)/homepage/home");
                }, 2000); // 2 second delay
              }}
              disabled={!email || !password || !!emailError || !!passwordError || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Login
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
                  onPress={() => setRememberMe(prev => !prev)}
                >
                  {rememberMe ? (
                    <Ionicons name="checkmark" size={16} color="#7f6edb" />
                  ) : null}
                </TouchableOpacity>
                <Text style={{ color: '#222', fontSize: 15 }}>Remember me</Text>
              </View>
              <TouchableOpacity onPress={() => {router.push('/(root)/(tabs)/forgotPassword/forgotpassword');
                // Add your forgot password logic here
              }}>
                <Text style={{ color: '#7f6edb', fontWeight: 'bold', fontSize: 15 }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ top: '40%', marginHorizontal: 10, textAlign: 'center', color: 'gray' }}>By signing in, you agree to our Terms and Privacy Policy.</Text>
          {/* Social sign-in options at the bottom */}
          <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#888', marginBottom: 10, top: '40%' }}>or sign in with</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', top: '50%' }}>
              {SOCIALS.map(social => (
                <TouchableOpacity key={social.key} style={styles.iconButton}>
                  <Image
                    source={{ uri: social.api }}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#7f6edb',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 16,
    alignItems: 'center',
    width: '90%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
    padding: 2,
  },
  errorText: {
    color: 'red',
    marginBottom: 4,
    marginTop: -2,
    alignSelf: 'flex-start',
    marginLeft: '5%',
    fontSize: 13,
  },
  iconButton: {
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  socialIcon: {
    width: 28,
    height: 28,
  },
});

export default login