import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const RECT_HEIGHT = height * 0.3;
const PLACEHOLDER = null;

// Sample images for modals (replace with your own or use URLs)
const overviewImage = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
const achievementsImage = 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png';
const summaryImage = 'https://cdn-icons-png.flaticon.com/512/190/190411.png';

const ProfileImageRectangle = () => {
  const router = useRouter();

  // Initial values can be empty or from user data
  const [imageUri, setImageUri] = useState<string | null>(PLACEHOLDER);
  const [name, setName] = useState('Your Name');
  const [email, setEmail] = useState('your@email.com');
  const [phone, setPhone] = useState('+1234567890');
  const [password, setPassword] = useState('Password123');
  const [dateJoined] = useState('2025-06-19');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhone, setEditPhone] = useState(phone);
  const [editPassword, setEditPassword] = useState(password);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Terms modal state
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  // Section modals
  const [overviewModal, setOverviewModal] = useState(false);
  const [achievementsModal, setAchievementsModal] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const openEditModal = () => {
    setEditName(name);
    setEditEmail(email);
    setEditPhone(phone);
    setEditPassword(password);
    setPasswordError('');
    setModalVisible(true);
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

  const handleSave = () => {
    if (!validatePassword(editPassword)) return;
    setName(editName);
    setEmail(editEmail);
    setPhone(editPhone);
    setPassword(editPassword);
    setModalVisible(false);
  };

  const handleLogout = () => {
    router.replace('/(root)/(tabs)/(auth)/login');
  };

  const termsText = `
Welcome to our app! By using this application, you agree to the following terms:

1. Your data is stored securely and will not be shared without your consent.
2. You are responsible for keeping your login credentials safe.
3. The app is provided as-is without any warranties.
4. You agree not to misuse the app or attempt to access data that does not belong to you.

Privacy Policy:
- We collect only the information necessary to provide our services.
- Your personal information is never sold to third parties.
- You can request deletion of your account and data at any time.

For more information, contact support@duolingoclone.com.
`;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 120 }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.rectangle} activeOpacity={0.8} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <Ionicons name="person-outline" size={80} color="#bbb" />
          )}
          <TouchableOpacity style={styles.plusButton} onPress={pickImage} activeOpacity={0.7}>
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
          {imageUri && (
            <TouchableOpacity style={styles.removeButton} onPress={removeImage} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.emailText}>{email}</Text>
          <Text style={styles.phoneText}>{phone}</Text>
          <Text style={styles.dateText}>Joined: {dateJoined}</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton} onPress={openEditModal} activeOpacity={0.8}>
          <Ionicons name="pencil" size={18} color="#7f6edb" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Terms & Privacy Policy Rectangle */}
        <TouchableOpacity
          style={styles.termsRectangle}
          activeOpacity={0.85}
          onPress={() => setTermsModalVisible(true)}
        >
          <Ionicons name="document-text-outline" size={22} color="#7f6edb" />
          <Text style={styles.termsText}>Terms & Privacy Policy</Text>
        </TouchableOpacity>

        {/* Section Rectangles */}
        <TouchableOpacity
          style={styles.sectionRectangle}
          activeOpacity={0.85}
          onPress={() => setOverviewModal(true)}
        >
          <Text style={styles.sectionText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionRectangle}
          activeOpacity={0.85}
          onPress={() => setAchievementsModal(true)}
        >
          <Text style={styles.sectionText}>Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionRectangle}
          activeOpacity={0.85}
          onPress={() => setSummaryModal(true)}
        >
          <Text style={styles.sectionText}>Summary</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.modalInput}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.modalInput}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
            />
            <View style={{ width: '100%', position: 'relative' }}>
              <TextInput
                style={[styles.modalInput, { paddingRight: 44, marginBottom: 0 }]}
                value={editPassword}
                onChangeText={text => {
                  setEditPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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
            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#7f6edb' }]}
                onPress={handleSave}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Terms & Privacy Policy Modal */}
      <Modal
        visible={termsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.termsModalOverlay}>
          <View style={styles.termsModalContent}>
            <Text style={styles.termsModalHeader}>Terms & Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 300, marginBottom: 18 }}>
              <Text style={styles.termsModalText}>{termsText}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.termsCloseButton}
              onPress={() => setTermsModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.termsCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Overview Modal */}
      <Modal
        visible={overviewModal}
        animationType="slide"
        transparent
        onRequestClose={() => setOverviewModal(false)}
      >
        <View style={styles.sectionModalOverlay}>
          <View style={styles.sectionModalContent}>
            <Image source={{ uri: overviewImage }} style={styles.sectionModalImage} />
            <Text style={styles.sectionModalHeader}>Overview</Text>
            <Text style={styles.sectionModalText}>
              Your overview is in progress. Keep learning and your stats will appear here soon!
            </Text>
            <TouchableOpacity
              style={styles.sectionCloseButton}
              onPress={() => setOverviewModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionCloseButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Achievements Modal */}
      <Modal
        visible={achievementsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setAchievementsModal(false)}
      >
        <View style={styles.sectionModalOverlay}>
          <View style={styles.sectionModalContent}>
            <Image source={{ uri: achievementsImage }} style={styles.sectionModalImage} />
            <Text style={styles.sectionModalHeader}>Achievements</Text>
            <Text style={styles.sectionModalText}>
              No achievements yet. Complete lessons and earn badges to unlock achievements!
            </Text>
            <TouchableOpacity
              style={styles.sectionCloseButton}
              onPress={() => setAchievementsModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionCloseButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Summary Modal */}
      <Modal
        visible={summaryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setSummaryModal(false)}
      >
        <View style={styles.sectionModalOverlay}>
          <View style={styles.sectionModalContent}>
            <Image source={{ uri: summaryImage }} style={styles.sectionModalImage} />
            <Text style={styles.sectionModalHeader}>Summary</Text>
            <Text style={styles.sectionModalText}>
              Your summary will be available soon. Keep up the great work!
            </Text>
            <TouchableOpacity
              style={styles.sectionCloseButton}
              onPress={() => setSummaryModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionCloseButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
    backgroundColor: '#fff',
  },
  rectangle: {
    width: width * 0.9,
    height: RECT_HEIGHT,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginTop: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  plusButton: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    backgroundColor: '#7f6edb',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#7f6edb',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  removeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: '#e74c3c',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#e74c3c',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  infoContainer: {
    marginTop: 18,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: '#edeafd',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    elevation: 2,
  },
  editProfileText: {
    color: '#7f6edb',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 7,
    letterSpacing: 0.5,
  },
  // Terms Rectangle
  termsRectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    backgroundColor: '#f7f7f7',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 22,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: width * 0.9,
    justifyContent: 'center',
  },
  termsText: {
    color: '#7f6edb',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  // Section Rectangles
  sectionRectangle: {
    width: width * 0.9,
    backgroundColor: '#edeafd',
    borderRadius: 18,
    paddingVertical: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionText: {
    color: '#7f6edb',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginBottom: 18,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 14,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    color: '#e74c3c',
    marginTop: 4,
    marginLeft: 10,
    alignSelf: 'flex-start',
    fontSize: 13,
    marginBottom: 8,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
  },
  // Terms Modal
  termsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsModalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  termsModalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginBottom: 16,
    textAlign: 'center',
  },
  termsModalText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    textAlign: 'left',
  },
  termsCloseButton: {
    marginTop: 10,
    backgroundColor: '#7f6edb',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  termsCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Section Modals
  sectionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionModalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  sectionModalImage: {
    width: 80,
    height: 80,
    marginBottom: 18,
    borderRadius: 18,
  },
  sectionModalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionModalText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 18,
  },
  sectionCloseButton: {
    marginTop: 10,
    backgroundColor: '#7f6edb',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  sectionCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    left: width * 0.05,
    width: width * 0.9,
    backgroundColor: '#e74c3c',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#e74c3c',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProfileImageRectangle;