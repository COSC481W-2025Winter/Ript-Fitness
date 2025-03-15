import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const PlateCalculatorScreen = () => {
  const [weight, setWeight] = useState('');
  const [plates, setPlates] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle weight plate calculation
  const calculatePlates = async () => {
    const parsedWeight = parseFloat(weight);
    
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      Alert.alert('Error', 'Please enter a valid weight greater than 0.');
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual backend URL
      const response = await fetch(`https://ript-fitness.azurewebsites.net/api/plates?weight=${parsedWeight}`);

      if (response.ok) {
        const data = await response.json();

        // Ensure correct response format
        if (!data || !Array.isArray(data.platesOnOneSide)) {
          throw new Error("Invalid response from server.");
        }

        setPlates(data.platesOnOneSide);
      } else {
        Alert.alert('Error', 'Failed to calculate plates. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
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
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Calculate Plates</Text>}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#2493BF',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  plateList: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 16,
  },
});

export default PlateCalculatorScreen;
