import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native'

type LogFoodButtonProps = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  multiplier: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: any,
  textColor?: string;
  fontSize?: number;
  onPress?:  any;
  underlineOnPress?: boolean;
};

const LogFoodButton: React.FC<LogFoodButtonProps> = ({ name, calories, protein, carbs, fat, backgroundColor, borderColor, borderWidth, width, textColor, fontSize, onPress, underlineOnPress = false }) => {
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
  };


  return (
    <TouchableOpacity
      style={[styles.foodItemContainer, buttonStyle]}
      // onPressIn={() => setIsPressed(true)} // Set pressed state to true on press in
      // onPressOut={() => {
      //   setIsPressed(false);
      //   if (onPress) onPress(); // Call onPress when released
      // }}
      activeOpacity={0.7}
    >
        <Text style={styles.foodName}>{name}</Text>
          {/* <Text style={styles.foodDetails}>P: {protein} C: {carbs} F: {fat}</Text> */}
        <Text style={styles.foodTextRight}>Calories: {calories}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    circle: {
        width: 100, // Diameter of the circle
        height: 50,
        borderRadius: 20, // Half of the width/height to make it a circle
        justifyContent: 'center', // Center the text vertically
        alignItems: 'center', // Center the text horizontally
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
    },
  foodItemContainer: {
    position: 'relative',
    padding: 30, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderColor: 'black',
    alignItems: 'center',
    flexDirection: 'row',
}, 
    foodName: {
      position: 'absolute',
      fontSize: 16,
      fontWeight: 'bold',
      left: 10, 
  },
  foodTextRight: {
      position: 'absolute',
      fontSize: 16, 
      right: 10, 
  },
  foodDetails: {
    position: 'relative', 
    left: 100,
    fontSize: 16,
  },    
});

export default LogFoodButton; 