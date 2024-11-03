
import { TextInput, StyleSheet, ScrollView, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions, Button, Alert  } from "react-native";
import React, { useContext, useState } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText } from '@/components/ThemedText';
import { useLayoutEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import MacroButton from "@/components/foodlog/MacroButton";
import AddFoodButton from "@/components/foodlog/AddFoodButton";
import ApiScreen from "../ApiScreen";
import FoodLogSaved from "@/app/screens/foodlog/FoodLogSaved";
import { httpRequests } from "@/api/httpRequests";
import { GlobalContext } from "@/context/GlobalContext";
import { SafeAreaView } from "react-native-safe-area-context";

//Need to figure out how to get the day to work on login and then not switch until the next day 



export default function FoodLogAddPage({ dayId }) {
    const [foodName, setFoodName] = useState('');
    const [foodCalories, setCalories] = useState('');
    const [foodFat, setFat] = useState('');
    const [foodCarbs, setCarbs] = useState('');
    const [foodProtein, setProtein] = useState('');
    const [foodServings, setServings] = useState('');
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    // const [day, setDay] = useState(0);
    const context = useContext(GlobalContext);



    const setTotalForDay = async () => {
        try {
            const getDayResponse = await fetch (`${httpRequests.getBaseURL()}/nutritionCalculator/getDay/${dayId}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }
            }); 
            console.log(getDayResponse.status);

            if (getDayResponse.status == 201 || getDayResponse.status == 200) {
                const dayData = await getDayResponse.json(); 
                console.log(dayData);
                setTotalCalories(dayData.calories); 
                setTotalCarbs(dayData.totalCarbs);
                setTotalProtein(dayData.totalProtein);
                setTotalFat(dayData.totalFat);
                // updateMacros(dayData.calories, dayData.totalFat, dayData.totalCarbs, dayData.totalProtein);
            } else {
                console.log('Failed to get day');
            }
        } catch (error) {
            console.log('Error', 'An error occurred. Please try again.');
        }
    }

    const doesFoodExist = async (foodName: string) => {
        try {
            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getFoodIdsOfLoggedInUser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }
            });
    
            if (response.status === 200) {
                const foodIds = await response.json();

                 // Use Promise.all to fetch details for all food IDs in parallel
                const foodPromises = foodIds.map((foodId: any) => 
                fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getFood/${foodId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${context?.data.token}`,
                    }
                }).then(foodResponse => foodResponse.status === 200 ? foodResponse.json() : null)
            );

            // Wait for all fetches to complete and filter out any unsuccessful responses (null)
            const foods = (await Promise.all(foodPromises)).filter(food => food !== null);

            // Check if any food's name matches the input foodName
            return foods.some(food => food.name && food.name.toLowerCase() === foodName.toLowerCase());
            } else {
                console.log('Error fetching foods');
                Alert.alert("Error", 'Failed to fetch foods');
                return false;
            }
        } catch (error) {
            console.log('Error', 'An error occurred while checking for duplicate food.');
            return false;
        }
    };

    const handleFoodDataSaveOnly = async () => {
        // Check if food with the same name exists
        const foodExists = await doesFoodExist(foodName);
        if (foodExists) {
            Alert.alert("Error", "A food with this name already exists. Please use a different name.");
        return;
    }
        const foodData = {
            name: foodName, 
            calories: foodCalories, 
            protein: foodProtein,
            carbs: foodCarbs,  
            fat: foodFat, 
            multiplier: foodServings, 
            isDeleted: false, 
        };
        
        try {
            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/addFood`, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                  },
                  body: JSON.stringify(foodData),
            }, 
            );
            if (response.status === 201) {
                console.log('Success', 'Food data saved successfully!');
                Alert.alert("Success", 'Food data saved successfully!');
              } else {
                console.log('Error', 'Failed to save food data.');
                Alert.alert("Error", 'Failed to save food data');
              }
        } catch (error) {
              console.log('Error', 'An error occurred. Please try again.');
        }
    };


    const handleFoodDataSaveAddDay = async () => {
        const foodExists = await doesFoodExist(foodName);
        if (foodExists) {
            Alert.alert("Error", "A food with this name already exists. Please use a different name.");
        return;
    }
        const foodData = {
            name: foodName, 
            calories: foodCalories, 
            protein: foodProtein,
            carbs: foodCarbs,  
            fat: foodFat, 
            multiplier: foodServings, 
            isDeleted: false, 
        };


        try {
                const foodResponse = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/addFood`, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                  },
                  body: JSON.stringify(foodData),
                },
                );
                if (foodResponse.status === 201) {
                    const foodData = await foodResponse.json();
                    const foodID = [foodData.id];
                    console.log("FoodID: ", foodID);
                    console.log("Day ID: ", dayId)
                    
                    const addResponse = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/addFoodsToDay/${dayId}`, {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${context?.data.token}`,
                        }, 
                        body:JSON.stringify(foodID),
                    });
                    if (addResponse.status === 201) {
                        console.log('Success', 'Food data added to day successfully!');
                        setTotalForDay();
                        clearInputFields();
                    } else {
                        console.log('Error', 'Failed to save food data to day.');
                    }
                    console.log('Success', 'Food data saved successfully!');
                    Alert.alert("Success", 'Food data saved successfully!');
                } else {    
                    console.log('Error', 'Failed to save food data.');
                    Alert.alert("Error", 'Failed to save food data');
                }
        } catch {
            console.log('Error', 'An error occurred. Please try again.');
        }
     };
        
    // Helper function to clear input fields
    const clearInputFields = () => {
        setFoodName('');
        setCalories('');
        setFat('');
        setCarbs('');
        setProtein('');
    };
    
    const navigation = useNavigation();

    const handleCaloriesChange = (text: string) => {
        if (text === '' || (/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setCalories(text);
        }
    };
    
    const handleFatChange = (text: string) => {
        if (text === '' || (/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setFat(text);
        }
    };
    
    const handleCarbsChange = (text: string) => {
        if (text === '' || (/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setCarbs(text);
        }
    };
    
    const handleProteinChange = (text: string) => {
        if (text === '' || (/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setProtein(text);
        }
    };
    
    const handleServingsChange = (text: string) => {
        if (text === '' || (/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setServings(text);
        }
    };

    return(
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0} // Adjust this value based on your header height
        >
        <ScrollView style={styles.addFoodContainer}>
            <View style={styles.addFoodContainer}>
                <Text style={styles.label}>New Food:</Text>

            {/* Input fields */}
            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Name:</Text>
            <TextInput
                style={styles.input}
                value={foodName}
                onChangeText={setFoodName}
                placeholder="Food Name"
                
            /></View>

            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Calories:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={foodCalories}
                onChangeText={handleCaloriesChange}
                placeholder="Calories"
            /></View>

            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Fat (g):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={foodFat}
                onChangeText={handleFatChange}
                placeholder="Total Fat"
            /></View>

            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Carbs (g):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={foodCarbs}
                onChangeText={handleCarbsChange}
                placeholder="Total Carbohydrates"
            /></View>

            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Protein (g):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={foodProtein}
                onChangeText={handleProteinChange}
                placeholder="Total Protein"
            /></View>

            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Servings:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={foodServings}
                onChangeText={handleServingsChange}
                placeholder="Number of Servings"
            /></View>

            {/* Save button */}
            <View style={styles.row}>
                <AddFoodButton   
                        title="Save Food" 
                        textColor="white"
                        backgroundColor="#F2846C"
                        borderWidth={1}
                        fontSize={16}
                        width={150}
                        onPress={handleFoodDataSaveOnly} />
                <AddFoodButton   
                        title="Log Food Today" 
                        textColor="white"
                        backgroundColor="#088C7F"
                        borderWidth={1}
                        fontSize={16}
                        width={150}
                        onPress={handleFoodDataSaveAddDay} />
            </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
    };
const styles = StyleSheet.create({
    addFoodContainer: { 
        paddingBottom: 29,
        padding: 5,
      },
      label: {
        fontSize: 20,
        marginBottom: 5,
      },
      input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 3,
        marginVertical: 2,
        borderRadius: 2,
      },
      inputLabel: {
        fontSize: 16,
        marginRight: 10, // Space between the label and input
        width: 100, // Adjust width based on your layout needs
      },
      row: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Vertically center the text and input
        marginBottom: 10,
        gap: 20,
      }, 
})
