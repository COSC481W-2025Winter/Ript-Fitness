import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BodyPart } from '@/app/screens/workout/BodyFocusScreen'; // Import the BodyPart type

// Define the props interface
interface BodyDiagramProps {
  onBodyPartClick: (part: BodyPart) => void; // Use BodyPart type
  imageSource: any; 
}

const BodyDiagram: React.FC<BodyDiagramProps> = ({ onBodyPartClick,imageSource }) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handlePress = (part: BodyPart) => {
    setSelectedPart(part);
    onBodyPartClick(part);
  };

  return (
    <View style={styles.container}>
      {/* Background PNG body diagram */}
      <Image 
        source={imageSource}  
        style={styles.image}
        resizeMode="contain"
      />

      {/* Transparent touch area - Abdomen */}
      <TouchableOpacity 
        style={[styles.touchable, styles.abdomen, selectedPart === "Abdomen" && styles.selected]} 
        onPress={() => handlePress("Abdomen")} 
      />
      
      {/* Transparent touch area - Left leg */}
      <TouchableOpacity 
        style={[styles.touchable, styles.legsLeft, selectedPart === "Legs" && styles.selected]} 
        onPress={() => handlePress("Legs")} 
      />

      {/* Transparent touch area - Right leg */}
      <TouchableOpacity 
        style={[styles.touchable, styles.legsRight, selectedPart === "Legs" && styles.selected]} 
        onPress={() => handlePress("Legs")} 
      />

      {/* Transparent touch area - Left arm */}
      <TouchableOpacity 
        style={[styles.touchable, styles.armsLeft, selectedPart === "Arms" && styles.selected]} 
        onPress={() => handlePress("Arms")} 
      />

      {/* Transparent touch area - Right arm */}
      <TouchableOpacity 
        style={[styles.touchable, styles.armsRight, selectedPart === "Arms" && styles.selected]} 
        onPress={() => handlePress("Arms")} 
      />

      {/* Transparent touch area - Back */}
      <TouchableOpacity 
        style={[styles.touchable, styles.back, selectedPart === "Back" && styles.selected]} 
        onPress={() => handlePress("Back")} 
      />

      {/* Transparent touch area - Left shoulder */}
      <TouchableOpacity 
        style={[styles.touchable, styles.shouldersLeft, selectedPart === "Shoulders" && styles.selected]} 
        onPress={() => handlePress("Shoulders")} 
      />

      {/* Transparent touch area - Right shoulder */}
      <TouchableOpacity 
        style={[styles.touchable, styles.shouldersRight, selectedPart === "Shoulders" && styles.selected]} 
        onPress={() => handlePress("Shoulders")} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, 
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 500,
    height: 450,
    opacity: 0.9,
  },
  touchable: {
    position: 'absolute',
    width: 80, // Increased size for better touchability
    height: 80, // Increased size for better touchability
    backgroundColor: 'rgba(0,0,0,0)',  // Transparent clickable area
  },
  abdomen: {
    top: '35%',
    left: '40%',
  },
  legsRight: {
    top: '70%',
    left: '53%',
  },
  legsLeft: {
    top: '70%',
    left: '25%',
  },
  armsLeft: {
    top: '25%',
    left: '18%',
  },
  armsRight: {
    top: '25%',
    left: '62%',
  },
  back: {
    top: '15%', // Adjust this value based on your image
    left: '42%', // Adjust this value based on your image
  },
  shouldersLeft: {
    top: '5%', // Adjust this value based on your image
    left: '25%', // Adjust this value based on your image
  },
  shouldersRight: {
    top: '5%', // Adjust this value based on your image
    left: '55%', // Adjust this value based on your image
  },
  selected: {
    backgroundColor: 'rgba(173, 216, 230, 0.3)', // Lighter blue highlight color with more transparency
  }
});

export default BodyDiagram;
