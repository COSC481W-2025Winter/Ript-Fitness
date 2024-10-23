import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native'

type MacroButtonProps = {
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

const MacroButton: React.FC<MacroButtonProps> = ({ title, backgroundColor, borderColor, borderWidth, width, textColor, fontSize, onPress, underlineOnPress = false }) => {
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
    //   onPressIn={() => setIsPressed(true)} // Set pressed state to true on press in
    //   onPressOut={() => {
    //     setIsPressed(false);
    //     if (onPress) onPress(); // Call onPress when released
    //   }}
    //   activeOpacity={0.7}
    // >
    //   <Text style={[textStyle]}>{title}</Text>
    // </TouchableOpacity>
    <View style={[styles.circle, buttonStyle]}>
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // button: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 8,
  //   minHeight: 62,
  //   margin: 5
  // }, 
  circle: {
    width: 100, // Diameter of the circle
    height: 100,
    borderRadius: 50, // Half of the width/height to make it a circle
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    marginRight: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MacroButton 