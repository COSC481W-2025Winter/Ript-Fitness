
import { TextInput, StyleSheet, ScrollView, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions, Button, Alert  } from "react-native";
import React, { useContext, useState } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText } from '@/components/ThemedText';
import { useLayoutEffect } from "react";
import Logged from '@/app/screens/foodlog/FoodLogLogged';
// import Saved from '@/app/screens/foodlog/FoodLogSaved';
import Add from '@/app/screens/foodlog/FoodLogAdd';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import MacroButton from "@/components/foodlog/MacroButton";
import AddFoodButton from "@/components/foodlog/AddFoodButton";
import ApiScreen from "../ApiScreen";
import FoodLogSavedScreen from "@/app/screens/foodlog/FoodLogSaved";
import { httpRequests } from "@/api/httpRequests";
import { GlobalContext } from "@/context/GlobalContext";



const FoodLogAddForm = () => {
    const [foodName, setFoodName] = useState('');
    const [foodCalories, setCalories] = useState('');
    const [foodFat, setFat] = useState('');
    const [foodCarbs, setCarbs] = useState('');
    const [foodProtein, setProtein] = useState('');
    const [day, setDay] = useState('');


    const handleFoodDataSaveOnly = async () => {
        const foodData = {
            name: foodName, 
            calories: foodCalories, 
            protein: foodProtein,
            carbs: foodCarbs,  
            fat: foodFat, 
            multiplier: 1.0, 
            isDeleted: false, 
        };
        
        const context = useContext(GlobalContext);

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
            if (response.ok) {
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
        const foodData = {
            name: foodName, 
            calories: foodCalories, 
            protein: foodProtein,
            carbs: foodCarbs,  
            fat: foodFat, 
            multiplier: 1.0, 
            isDeleted: false, 
        };

        const dayData = {
            foodsEatenInDay: [],
            foodIdsInFoodsEatenInDayList: []
        }

        //This will create a new day everytime the user logs a new food today so will need to change this later.
        try {
            const dayResponse = await fetch('https://ript-fitness-app.azurewebsites.net/nutritionCalculator/addDay', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(dayData),
            });

            if (dayResponse.ok) {
                const data = await dayResponse.json();
                setDay(data.id);
                console.log('New Day ID: ', day);

                const foodResponse = await fetch('https://ript-fitness-app.azurewebsites.net/nutritionCalculator/addFood', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(foodData),
                },
                );
                if (foodResponse.ok) {
                    const foodData = await foodResponse.json();
                    const foodID = foodData.id;
                    
                    const addResponse = await fetch(`https://ript-fitness-app.azurewebsites.net/nutritionCalculator/addFoodsToDay/${day}`, {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                        body: JSON.stringify([foodID]),
                    });
                    if (addResponse.ok) {
                        console.log('Success', 'Food data added to day successfully!');
                        Alert.alert("Success", 'Food data added to day successfully!');
                    } else {
                        console.log('Error', 'Failed to save food data to day.');
                        Alert.alert("Error", 'Failed to save food data to day');
                    }
                    console.log('Success', 'Food data saved successfully!');
                     Alert.alert("Success", 'Food data saved successfully!');
                } else {    
                    console.log('Error', 'Failed to save food data.');
                    Alert.alert("Error", 'Failed to save food data');
                }
            } else {
                console.log('Error', 'Failed to add day.');
                Alert.alert("Error", 'Failed to add day.');
            }
        } catch {
            console.log('Error', 'An error occurred. Please try again.');
        }
     };
        
    
    const navigation = useNavigation();


    return(
// {/* THIS IS THE NEW STUFF FOR THE ADD PAGE*/}
<View>
<View>
                <View style={styles.calendarNav}>
                    <Ionicons 
                        name={"chevron-back-outline"} 
                        size={24} 
                        style={styles.leftArrow}
                        onPress={() => navigation.navigate(ApiScreen)}
                />
                    <Ionicons name={"calendar-clear-outline"} size={24}></Ionicons>
                    {/* This will be "today" when it is the current date, if not it will display the date of the data they are viewing*/}
                    <Text>Today</Text>
                    <Ionicons 
                        name={"chevron-forward-outline"} 
                        size={24} 
                        style={styles.rightArrow}
                        onPress={() => navigation.navigate(ApiScreen)}
                    />
                </View>
            <View style={styles.macroView}> 
                <View style={styles.macroRow}>
                    <MacroButton
                        title="Calories"
                        textColor="#0E598D"
                        borderColor="#0E598D"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Protein" 
                        textColor="#F2846C"
                        borderColor="#F2846C"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Carbs" 
                        textColor="#088C7F"
                        borderColor="#088C7F"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                </View>
                <View style={styles.macroRow}>
                    <MacroButton
                        title="Fat" 
                        textColor="#AC2641"
                        borderColor="#AC2641"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Water" 
                        textColor="black"
                        borderColor="black"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                </View>
            </View> 
            <View style={styles.dataBar}>
                <Text style={styles.text}
                    onPress={()  => navigation.navigate('ApiScreen')}>Logged</Text>
                <Text style={styles.text}
                    onPress={()  => navigation.navigate('FoodLogSaved')}>Saved</Text>
                <Text style={styles.textAdd}
                    onPress={()  => navigation.navigate('ApiScreen')}>Add</Text>
            </View>
        
        {/* <FoodLogAddForm></FoodLogAddForm> */}
        </View>

        <ScrollView>
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
                onChangeText={setCalories}
                placeholder="Calories"
            /></View>

            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Fat (g):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={foodFat}
                onChangeText={setFat}
                placeholder="Total Fat"
            /></View>

            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Carbs (g):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={foodCarbs}
                onChangeText={setCarbs}
                placeholder="Total Carbohydrates"
            /></View>

            <View style = {styles.row}>
            <Text style={styles.inputLabel}>Protein (g):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={foodProtein}
                onChangeText={setProtein}
                placeholder="Total Protein"
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
</View>
    );
    };
const styles = StyleSheet.create({
    calendarNav: {
        height: 40,
        width: '100%', 
        backgroundColor: 'lightgray',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
    },
    rightArrow: {
        position: 'absolute',
        right: 0,
    }, 
    leftArrow: {
        position: 'absolute',
        left: 0,
    },
    macroView: {
        height: 220,
        width: '100%',
        backgroundColor: 'white', 
    }, 
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'center', 
    }, 
    dataBar: {
        height: 50,
        width: '100%', 
        backgroundColor: 'lightgray',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'space-between',
    }, 
    text: {
        padding: 10,
    },
    textAdd: {
        padding: 10,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    addFoodContainer: {
        padding: 20,
      },
      label: {
        fontSize: 20,
        marginBottom: 10,
      },
      input: {
        flex: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        marginVertical: 5,
        borderRadius: 5,
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
      }, 
})

export default FoodLogAddForm;