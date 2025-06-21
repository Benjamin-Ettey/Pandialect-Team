import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface CurlButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const CurlButton: React.FC<CurlButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[
      styles.curlButton,
      disabled && { backgroundColor: '#ccc' },
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={disabled}
  >
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  curlButton: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CurlButton;