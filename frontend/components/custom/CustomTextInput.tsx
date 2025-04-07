import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

type CustomTextInputProps = {
  placeholder: string;
  placeholderTextColor?: string;
  width?: number;
  style?: ViewStyle;
  color?: string;
} & TextInputProps;

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: '#EDEDED',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingLeft: 20,
    marginVertical: 10,
  },
});

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  placeholderTextColor,
  width,
  style,
  color,
  ...props
}) => {
  const containerStyle: ViewStyle = {
    width: width || '100%',
  };

  console.log(' w ', width);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={containerStyle}>
        <TextInput
          style={[styles.input, style, { color }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          {...props}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomTextInput;
