import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MOCK_USER = {
  email: 'user@gmail.com',
  securityAnswer: 'panda', // Example answer for demonstration
};

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simple password validation
  const validatePassword = (value: string) => {
    const hasCapital = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isProperLength = value.length >= 8 && value.length <= 16;
    return hasCapital && hasNumber && isProperLength;
  };

  const handleEmailSubmit = () => {
    setError('');
    if (!/\S+@gmail\.com$/.test(email)) {
      setError('Please enter a valid @gmail.com email address.');
      return;
    }
    if (email !== MOCK_USER.email) {
      setError('No account found with this email.');
      return;
    }
    setStep(2);
  };

  const handleSecurityAnswer = () => {
    setError('');
    if (securityAnswer.trim().toLowerCase() !== MOCK_USER.securityAnswer) {
      setError('Incorrect answer. Please try again.');
      return;
    }
    setStep(3);
  };

  const handlePasswordReset = () => {
    setError('');
    if (!validatePassword(newPassword)) {
      setError('Password must be 8-16 characters, include a capital letter and a number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Password reset successful!');
      router.replace('/(root)/(tabs)/(auth)/homepage/home');
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.header}>Forgot Password</Text>
        {step === 1 && (
          <>
            <Text style={styles.label}>Enter your registered email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.label}>What is your favorite animal?</Text>
            <TextInput
              style={styles.input}
              placeholder="Security Answer"
              placeholderTextColor="#aaa"
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
              autoCapitalize="none"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSecurityAnswer}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 3 && (
          <>
            <Text style={styles.label}>Enter your new password:</Text>
            <ScrollView horizontal style={{ width: '100%' }} contentContainerStyle={{ flexGrow: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#aaa"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={false}
                autoCapitalize="none"
                multiline={false}
              />
            </ScrollView>
            <Text style={styles.hint}>8-16 chars, 1 capital letter, 1 number</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginBottom: 28,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#7f6edb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 8,
    fontSize: 14,
    alignSelf: 'flex-start',
  },
  hint: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
});