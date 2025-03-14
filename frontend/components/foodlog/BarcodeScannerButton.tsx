import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native'

type barcodeScannerProps = {
  title: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: number,
  height?: number,
  textColor?: string;
  fontSize?: number;
  onPress?: () => void;
  underlineOnPress?: boolean;
};

const barcodeScannerButton: React.FC<barcodeScannerProps> = ({ title, backgroundColor, borderColor, borderWidth, width, textColor, fontSize, onPress, underlineOnPress = false }) => {
    const [isPressed, setIsPressed] = useState(false);
  
    const buttonStyle: ViewStyle = {
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
    width: width || 'auto'
  };

  const textStyle: TextStyle = {
    color: textColor || '#fff',
    fontSize: fontSize || 15,
    fontWeight: 'bold',
  };

  return (
    <TouchableOpacity
      style={[styles.circle, buttonStyle]}
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
    circle: {
        width: 100, // Diameter of the circle
        height: 50,
        borderRadius: 30, // Half of the width/height to make it a circle
        justifyContent: 'center', // Center the text vertically
        alignItems: 'center', // Center the text horizontally
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
    },
   
});

export default barcodeScannerButton 