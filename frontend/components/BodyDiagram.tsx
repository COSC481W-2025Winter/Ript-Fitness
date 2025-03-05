import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BodyPart } from '@/app/screens/workout/BodyFocusScreen';

interface BodyDiagramProps {
  onBodyPartClick: (part: BodyPart) => void;
  imageSource: any;
  isFrontView: boolean;  // Newly added isFrontView
}

const BodyDiagram: React.FC<BodyDiagramProps> = ({ onBodyPartClick, imageSource, isFrontView }) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePress = (part: BodyPart) => {
    setSelectedPart(part);
    onBodyPartClick(part);
    startCircleAnimation();
  };

  const circleAnimations = useRef(
    Array.from({ length: 8 }, () => new Animated.Value(0))
  ).current;

  const startCircleAnimation = () => {
    setIsAnimating(true);

    const animateCircle = (animatedValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
    };

    circleAnimations.forEach((anim, index) => {
      animateCircle(anim, index * 200).start();
    });
  };

  useEffect(() => {
    if (!isAnimating) {
      startCircleAnimation();
    }
  }, []);

  const animatedStyle = (animatedValue: Animated.Value) => ({
    transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }],
    opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
  });

  // **Dynamic circles for the front view**
  const frontCircles = [
    { id: 1, style: styles.circle1, animation: circleAnimations[0] },
    { id: 2, style: styles.circle2, animation: circleAnimations[1] },
    { id: 3, style: styles.circle3, animation: circleAnimations[2] },
    { id: 4, style: styles.circle4, animation: circleAnimations[3] },
    { id: 5, style: styles.circle5, animation: circleAnimations[4] },
  ];

  // **Dynamic circles for the back view**
  const backCircles = [
    { id: 6, style: styles.circle6, animation: circleAnimations[5] },
    { id: 7, style: styles.circle7, animation: circleAnimations[6] },
    { id: 8, style: styles.circle8, animation: circleAnimations[7] },
  ];

  return (
    <View style={styles.container}>
      {/* Background human body image */}
      <Image source={imageSource} style={styles.image} resizeMode="contain" />

      {/* Transparent touch areas */}
      <TouchableOpacity style={[styles.touchable, styles.abdomen, selectedPart === "Abdomen" && styles.selected]} onPress={() => handlePress("Abdomen")} />
      <TouchableOpacity style={[styles.touchable, styles.legsLeft, selectedPart === "Legs" && styles.selected]} onPress={() => handlePress("Legs")} />
      <TouchableOpacity style={[styles.touchable, styles.legsRight, selectedPart === "Legs" && styles.selected]} onPress={() => handlePress("Legs")} />
      <TouchableOpacity style={[styles.touchable, styles.armsLeft, selectedPart === "Arms" && styles.selected]} onPress={() => handlePress("Arms")} />
      <TouchableOpacity style={[styles.touchable, styles.armsRight, selectedPart === "Arms" && styles.selected]} onPress={() => handlePress("Arms")} />
      <TouchableOpacity style={[styles.touchable, styles.back, selectedPart === "Back" && styles.selected]} onPress={() => handlePress("Back")} />
      <TouchableOpacity style={[styles.touchable, styles.shouldersLeft, selectedPart === "Shoulders" && styles.selected]} onPress={() => handlePress("Shoulders")} />
      <TouchableOpacity style={[styles.touchable, styles.shouldersRight, selectedPart === "Shoulders" && styles.selected]} onPress={() => handlePress("Shoulders")} />

      {/* Render circles only for the current view */}
      {(isFrontView ? frontCircles : backCircles).map(({ id, style, animation }) => (
        <Animated.View key={id} style={[styles.circle, style, animatedStyle(animation)]} />
      ))}
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
    width: 450,
    height: 420,
    opacity: 0.9,
  },
  touchable: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  abdomen: { top: '31%', left: '40%' },
  legsRight: { top: '65%', left: '53%' },
  legsLeft: { top: '65%', left: '28%' },
  armsLeft: { top: '25%', left: '20%' },
  armsRight: { top: '25%', left: '60%' },
  back: { top: '20%', left: '40%' },
  shouldersLeft: { top: '5%', left: '25%' },
  shouldersRight: { top: '5%', left: '55%' },
  selected: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  // Dynamic circle styles
  circle: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 25,
    backgroundColor: 'rgb(6, 245, 209)',
  },
  circle1: { top: '33%', left: '34%' }, //left arm
  circle2: { top: '76%', left: '55%' }, //right leg
  circle3: { top: '76%', left: '42%' }, // left leg
  circle4: { top: '33%', left: '63%' }, //right arm
  circle5: { top: '43%', left: '49%' }, //abdomen 
  circle6: { top: '18%', left: '39%' }, //left shoulder
  circle7: { top: '18%', left: '58%' }, //right shoulder
  circle8: { top: '30%', left: '49%' }, //back
});

export default BodyDiagram;
