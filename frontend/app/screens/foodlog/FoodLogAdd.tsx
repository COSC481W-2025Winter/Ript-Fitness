
import { TextInput, StyleSheet, ScrollView, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions, Button  } from "react-native";
import React, { useState } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText } from '@/components/ThemedText';
import { useLayoutEffect } from "react";
import Logged from '@/app/screens/foodlog/FoodLogLogged';
import Saved from '@/app/screens/foodlog/FoodLogSaved';
import Add from '@/app/screens/foodlog/FoodLogAdd';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import MacroButton from "@/components/foodlog/MacroButton";



/* 
{
  "name": "Pringles",
  "calories": 290,
  "protein": 20,
  "carbs": 30,
  "fat": 10,
  "multiplier": 1.0,
  "isDeleted": false
}
*/

//const FoodLogAddScreen: React.FC<FoodLogAddProps> = ({navigation}) => {
const FoodLogAddForm = () => {
    const [foodName, setFoodName] = useState('');
    const [foodCalories, setCalories] = useState('');
    const [foodFat, setFat] = useState('');
    const [foodCarbs, setCarbs] = useState('');
    const [foodProtein, setProtein] = useState('');


    const handleFoodData = async () => {
        const foodData = {
            name: foodName, 
            calories: foodCalories, 
            protein: foodProtein,
            carbs: foodCarbs,  
            fat: foodFat, 
            multiplier: 1.0, 
            isDelted: false, 
        };

        try {
            const response = await fetch('https://ript-fitness-app.azurewebsites.net/nutritionCalculator/addFood', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(foodData),
            });
            if (response.status === 200) {
                console.log('Success', 'Food data saved successfully!');
              } else {
                console.log('Error', 'Failed to save food data.');
              }
        } catch (error) {
              console.log('Error', 'An error occurred. Please try again.');
        }
    };
        




//export default function FoodLogScreen() {
    // const calendarBar = (
    //     <View style = {styles.calendarNav}>
    //         <Ionicons name={"chevron-back-outline"} size={24} style={styles.leftArrow}></Ionicons>
    //         <Ionicons name={"calendar-clear-outline"} size={24}></Ionicons>
    //         {/* This will be "today" when it is the current date, if not it will display the date of the data they are viewing*/}
    //         <Text>Today</Text>
    //         <Ionicons name={"chevron-forward-outline"} size={24} style={styles.rightArrow}></Ionicons>
    //     </View>
    // );
    
    const navigation = useNavigation();


    return(
        //<View>
        //  <View style={styles.calendarNav}>
        //             <Ionicons 
        //                 name={"chevron-back-outline"} 
        //                 size={24} 
        //                 style={styles.leftArrow}
        //                 onPress={() => navigation.navigate('ApiScreen')}
        //         />
        //             <Ionicons name={"calendar-clear-outline"} size={24}></Ionicons>
        //             {/* This will be "today" when it is the current date, if not it will display the date of the data they are viewing*/}
        //             <Text>Today</Text>
        //             <Ionicons 
        //                 name={"chevron-forward-outline"} 
        //                 size={24} 
        //                 style={styles.rightArrow}
        //                 onPress={() => navigation.navigate('ApiScreen')}
        //             />
        //         </View>
        //     <View style={styles.macroView}> 
        //         <View style={styles.macroRow}>
        //             <MacroButton
        //                 title="Calories" 
        //                 backgroundColor="#0E598D"
        //                 fontSize={16}
        //                 width={100} 
        //             ></MacroButton>
        //             <MacroButton
        //                 title="Protein" 
        //                 backgroundColor="#F2846C"
        //                 fontSize={16}
        //                 width={100} 
        //             ></MacroButton>
        //             <MacroButton
        //                 title="Carbs" 
        //                 backgroundColor="#088C7F"
        //                 fontSize={16}
        //                 width={100} 
        //             ></MacroButton>
        //         </View>
        //         <View style={styles.macroRow}>
        //             <MacroButton
        //                 title="Fat" 
        //                 backgroundColor="#AC2641"
        //                 fontSize={16}
        //                 width={100} 
        //             ></MacroButton>
        //             <MacroButton
        //                 title="Water" 
        //                 backgroundColor="black"
        //                 fontSize={16}
        //                 width={100} 
        //             ></MacroButton>
        //         </View>
        //     </View> 
        //     <View style={styles.dataBar}>
        //         <Text style={styles.text}
        //             onPress={()  => navigation.navigate('ApiScreen')}>Logged</Text>
        //         <Text style={styles.text}
        //             onPress={()  => navigation.navigate('ApiScreen')}>Saved</Text>
        //         <Text style={styles.text}
        //             onPress={()  => navigation.navigate('ApiScreen')}>Add</Text>
        //     </View>
// {/* THIS IS THE NEW STUFF FOR THE ADD PAGE*/}
<View>
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
            <Button title="Save Food" onPress={handleFoodData} />
            </View>
        </ScrollView>
</View>
    );
    };
const styles = StyleSheet.create({
    calendarNav: {
        height: 50,
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
        height: 200,
        width: '100%',
        backgroundColor: 'white', 
    }, 
    macroRow: {
        flexDirection: 'row',
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
        padding: 10,
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
      }

})

export default FoodLogAddForm;