import React from 'react';
import { TextInput, TextInputProps, StyleSheet, ViewStyle, View } from 'react-native';

type CustomTextInputProps = {
  placeholder: string;
  placeholderTextColor?: string;
  width?: number;
} & TextInputProps; 

const CustomTextInput: React.FC<CustomTextInputProps> = ({ placeholder, placeholderTextColor, width, ...props }) => {
  const containerStyle: ViewStyle = {
    width:  width || '100%',
  };

  return (
    <TextInput
      style={[styles.input, containerStyle]} 
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      {...props} 
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default CustomTextInput;
