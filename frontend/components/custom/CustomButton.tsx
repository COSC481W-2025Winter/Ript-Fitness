import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'

type CustomButtonProps = {
  title: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: number,
  height?: number,
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  onPress?: () => void;
  shouldUnderline?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, backgroundColor, borderColor, borderWidth, width, height, textColor, fontSize, borderRadius, onPress, shouldUnderline = false, disabled= false, style, textStyle, }) => {
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle: ViewStyle = {
    backgroundColor: backgroundColor || '#21BFBF',
    borderColor: borderColor || 'transparent',
    borderWidth: borderWidth !== undefined ? borderWidth : borderColor ? 1 : 0,
    borderRadius: borderRadius,
    width: width || 'auto',
    height: height || 'auto',
  };

  const textStyleObj: TextStyle = {
    color: textColor || '#fff',
    fontSize: fontSize || 15,
    // textDecorationLine: underlineOnPress && isPressed ? 'underline' : 'none'
    textDecorationLine: shouldUnderline ? 'underline' : 'none',  
  };
  const combinedButtonStyle = [styles.button, buttonStyle, style]; 
  const combinedTextStyle = [textStyleObj, textStyle];

  return (
    <TouchableOpacity
      // style={[styles.button, buttonStyle]}
      style={combinedButtonStyle}
      onPressIn={() => setIsPressed(true)} // Set pressed state to true on press in
      onPressOut={() => {
        setIsPressed(false);
        if (onPress) onPress(); // Call onPress when released
      }}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {/* <Text style={[textStyle]}>{title}</Text> */}
      <Text style={combinedTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
    margin: 5
  }
});

export default CustomButton