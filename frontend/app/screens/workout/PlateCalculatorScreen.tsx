import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

const PlateCalculatorScreen = () => {
  const [weight, setWeight] = useState("");
  const [plates, setPlates] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Define available plate weights (standard)
  const plateSizes = [45, 35, 25, 10, 5, 2.5]; // lbs
  const barbellWeight = 45; // Standard Olympic barbell

  // Function to calculate plates
  const calculatePlates = () => {
    let targetWeight = parseFloat(weight);

    if (isNaN(targetWeight) || targetWeight <= barbellWeight) {
      Alert.alert("Error", "Enter a valid weight above 45 lbs (barbell weight).");
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
    }, 500); // Simulate small delay for better UI feedback
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

      {plates !== null && (
        <View style={styles.plateList}>
          {plates.length > 0 ? (
            <>
              <Text style={styles.resultTitle}>Plates Needed (One Side):</Text>
              {plates.map((plate, index) => (
                <Text key={index} style={styles.resultText}>
                  {plate} lbs
                </Text>
              ))}
            </>
          ) : (
            <Text style={styles.resultText}>No plates needed. The bar itself is enough.</Text>
          )}
        </View>
      )}
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
  plateList: {
    marginTop: 20,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 16,
  },
});

export default PlateCalculatorScreen;
