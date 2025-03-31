import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";

const PlateCalculatorScreen = () => {
  const [weight, setWeight] = useState("");
  const [plates, setPlates] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const barbellAnimation = useState(new Animated.Value(0))[0];

  // Define available plate weights (standard)
  const plateSizes = [45, 35, 25, 10, 5, 2.5]; // lbs
  const barbellWeight = 45; // Standard Olympic barbell

  // Function to calculate plates
  const calculatePlates = () => {
    let targetWeight = parseFloat(weight);

    if (isNaN(targetWeight) || targetWeight <= barbellWeight) {
      Alert.alert("Error", "Enter a valid weight above 45 lbs (barbell weight)."
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const weightPerSide = (targetWeight - barbellWeight) / 2; // Each side of bar
      let remainingWeight = weightPerSide;
      let selectedPlates: number[] = [];

      for (let plate of plateSizes) {
        while (remainingWeight >= plate) {
          selectedPlates.push(plate);
          remainingWeight -= plate;
        }
      }

      setPlates(selectedPlates);
      setLoading(false);

      // Trigger animation
      Animated.timing(barbellAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => barbellAnimation.setValue(0)); // Reset animation
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Plate Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter weight (lbs)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity onPress={calculatePlates} style={styles.button}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Calculate Plates</Text>
        )}
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.barbell,
          {
            transform: [
              {
                scaleX: barbellAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.plateContainer}>
          {plates?.map((plate, index) => (
            <View key={index} style={[styles.plate, { width: plate * 2 }]} />
          ))}
        </View>
        <View style={styles.bar} />
        <View style={styles.plateContainer}>
          {plates?.map((plate, index) => (
            <View key={index} style={[styles.plate, { width: plate * 2 }]} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#2493BF",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  barbell: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  bar: {
    width: 100,
    height: 10,
    backgroundColor: "black",
  },
  plateContainer: {
    flexDirection: "row",
  },
  plate: {
    height: 40,
    backgroundColor: "gray",
    marginHorizontal: 2,
  },
});

export default PlateCalculatorScreen;
