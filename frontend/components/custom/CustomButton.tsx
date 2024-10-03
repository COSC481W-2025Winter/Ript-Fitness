import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'

type CustomButtonProps = {
  title: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: number,
  textColor?: string;
  fontSize?: number;
  onPress?: () => void;
  underlineOnPress?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, backgroundColor, borderColor, borderWidth, width, textColor, fontSize, onPress, underlineOnPress = false }) => {
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle: ViewStyle = {
    backgroundColor: backgroundColor || '#03A696',
    borderColor: borderColor || 'transparent',
    borderWidth: borderWidth !== undefined ? borderWidth : borderColor ? 1 : 0,
    width: width || 'auto'
  };

  const textStyle: TextStyle = {
    color: textColor || '#fff',
    fontSize: fontSize || 15,
    textDecorationLine: underlineOnPress && isPressed ? 'underline' : 'none'
  };

  return (
    // <TouchableOpacity 
    //   style={[styles.button, buttonStyle]} 
    //   onPress={onPress}
    //   activeOpacity={0.7}
    // >
    //   <Text style={[textStyle]}>{title}</Text>
    // </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPressIn={() => setIsPressed(true)} // Set pressed state to true on press in
      onPressOut={() => {
        setIsPressed(false);
        if (onPress) onPress(); // Call onPress when released
      }}
      activeOpacity={0.7}
    >
      <Text style={[textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 62,
    margin: 5
  }
});

export default CustomButton