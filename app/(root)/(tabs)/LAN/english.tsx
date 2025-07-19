import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const SAMPLE_SENTENCES = [
  "I want to learn English",
  "The quick brown fox jumps over the lazy dog",
  "How much wood would a woodchuck chuck",
  "She sells seashells by the seashore",
  "Practice makes perfect"
];

export default function PronunciationPractice() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [expectedText, setExpectedText] = useState(SAMPLE_SENTENCES[0]);
  const [similarity, setSimilarity] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [audioPermission, setAudioPermission] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const permission = await Audio.requestPermissionsAsync();
        setAudioPermission(permission.granted);
        if (!permission.granted) {
          setError("Microphone access is required for this feature");
        }

        // Set up audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } catch (err) {
        console.error("Permission error", err);
        setError("Failed to get microphone permissions");
      }
    })();

    return () => {
      if (timer) clearInterval(timer);
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setTimer(interval);
    } else {
      if (timer) clearInterval(timer);
      setTimer(null);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (!audioPermission) {
        Alert.alert(
          "Permission Required",
          "Please enable microphone access in settings",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
      setError("Failed to start recording. Please try again.");
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      await handleTranscription(uri);
    } catch (err) {
      console.error("Failed to stop recording", err);
      setError("Failed to stop recording. Please try again.");
    }
  };

  const handleTranscription = async (uri) => {
    try {
      setIsLoading(true);
      setTranscript("");
      setSimilarity(null);

      const fileInfo = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Simulate API call - replace with your actual backend
      // This timeout is just to show loading state
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response - replace with actual API call
      const mockTranscript = getMockTranscript(expectedText);
      setTranscript(mockTranscript);
      compareText(mockTranscript);

      // Actual implementation would look like:
      /*
      const response = await fetch("https://your-backend.com/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: fileInfo }),
      });
      const data = await response.json();
      setTranscript(data.transcript);
      compareText(data.transcript);
      */
    } catch (err) {
      console.error("Transcription error", err);
      setError("Failed to transcribe audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for demo purposes - returns a mock transcript with slight variations
  const getMockTranscript = (expected) => {
    const words = expected.split(" ");
    const variations = words.map(word => {
      if (Math.random() > 0.7) { // 30% chance to modify the word
        if (word.length > 3 && Math.random() > 0.5) {
          return word.substring(0, word.length - 1); // remove last letter
        }
        return word + (Math.random() > 0.5 ? "s" : "e"); // add letter
      }
      return word;
    });
    return variations.join(" ");
  };

  const compareText = (spokenText) => {
    const spoken = spokenText.toLowerCase().split(/\s+/);
    const expected = expectedText.toLowerCase().split(/\s+/);

    // Count matching words in correct position
    const matchCount = spoken.filter((word, i) => word === expected[i]).length;

    // Calculate similarity score
    const similarityScore = Math.round((matchCount / expected.length) * 100);
    setSimilarity(similarityScore);

    // Haptic feedback based on score
    if (similarityScore > 80) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (similarityScore > 50) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNewSentence = () => {
    const currentIndex = SAMPLE_SENTENCES.indexOf(expectedText);
    const nextIndex = (currentIndex + 1) % SAMPLE_SENTENCES.length;
    setExpectedText(SAMPLE_SENTENCES[nextIndex]);
    setTranscript("");
    setSimilarity(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Pronunciation Practice</Text>
        <Text style={styles.subtitle}>Improve your English pronunciation</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Try saying this sentence:</Text>
        <Text style={styles.sentenceText}>"{expectedText}"</Text>

        <TouchableOpacity
          style={styles.changeButton}
          onPress={handleNewSentence}
        >
          <Ionicons name="refresh" size={16} color="#007AFF" />
          <Text style={styles.changeButtonText}>Change Sentence</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processing your recording...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordingButton
          ]}
          onPress={isRecording ? stopRecording : startRecording}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            {isRecording ? (
              <>
                <FontAwesome name="stop" size={24} color="white" />
                <Text style={styles.recordButtonText}>Stop Recording</Text>
                <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
              </>
            ) : (
              <>
                <FontAwesome name="microphone" size={24} color="white" />
                <Text style={styles.recordButtonText}>Start Recording</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      )}

      {transcript && (
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Your Results</Text>

          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>You said:</Text>
            <Text style={styles.transcriptText}>"{transcript}"</Text>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Accuracy:</Text>
            <View style={styles.scoreContainer}>
              <Text style={[
                styles.scoreText,
                similarity > 80 && styles.highScore,
                similarity <= 80 && similarity > 50 && styles.mediumScore,
                similarity <= 50 && styles.lowScore
              ]}>
                {similarity}%
              </Text>
              <View style={styles.scoreBarContainer}>
                <View
                  style={[
                    styles.scoreBar,
                    { width: `${similarity}%` },
                    similarity > 80 && styles.highScoreBar,
                    similarity <= 80 && similarity > 50 && styles.mediumScoreBar,
                    similarity <= 50 && styles.lowScoreBar
                  ]}
                />
              </View>
            </View>
          </View>

          {similarity < 90 && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips to improve:</Text>
              <View style={styles.tipItem}>
                <MaterialIcons name="volume-up" size={18} color="#007AFF" />
                <Text style={styles.tipText}>Speak slowly and clearly</Text>
              </View>
              <View style={styles.tipItem}>
                <MaterialIcons name="repeat" size={18} color="#007AFF" />
                <Text style={styles.tipText}>Practice the difficult words separately</Text>
              </View>
              <View style={styles.tipItem}>
                <MaterialIcons name="hearing" size={18} color="#007AFF" />
                <Text style={styles.tipText}>Listen to native speakers pronounce this sentence</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to practice:</Text>
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Read the sentence carefully</Text>
        </View>
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Press the microphone button and speak</Text>
        </View>
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Compare your pronunciation with the expected text</Text>
        </View>
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>Repeat to improve your score</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#007AFF",
    textAlign: "center",
    marginVertical: 12,
    lineHeight: 28,
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  changeButtonText: {
    color: "#007AFF",
    marginLeft: 6,
    fontSize: 14,
  },
  recordButton: {
    backgroundColor: "#007AFF",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  recordingButton: {
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  recordButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  recordingTime: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 16,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  resultsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  resultSection: {
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 18,
    color: "#333",
    fontStyle: "italic",
    lineHeight: 26,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    width: 80,
  },
  highScore: {
    color: "#34C759", // Green
  },
  mediumScore: {
    color: "#FF9500", // Orange
  },
  lowScore: {
    color: "#FF3B30", // Red
  },
  scoreBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginLeft: 16,
    overflow: "hidden",
  },
  scoreBar: {
    height: "100%",
    borderRadius: 4,
  },
  highScoreBar: {
    backgroundColor: "#34C759",
  },
  mediumScoreBar: {
    backgroundColor: "#FF9500",
  },
  lowScoreBar: {
    backgroundColor: "#FF3B30",
  },
  tipsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  instructions: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  instructionStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: "#007AFF",
    color: "white",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "bold",
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    flex: 1,
  },
});