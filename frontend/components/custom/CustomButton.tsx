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
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, backgroundColor, borderColor, borderWidth, width, textColor, fontSize, onPress }) => {
  const buttonStyle: ViewStyle = {
    backgroundColor: backgroundColor || '#03A696',
    borderColor: borderColor || 'transparent',
    borderWidth: borderWidth !== undefined ? borderWidth : borderColor ? 1 : 0,
    width: width || '70%'
  };

  const textStyle: TextStyle = {
    color: textColor || '#fff',
    fontSize: fontSize || 15,
  };

  return (
    <TouchableOpacity 
      style={[styles.button, buttonStyle]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

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