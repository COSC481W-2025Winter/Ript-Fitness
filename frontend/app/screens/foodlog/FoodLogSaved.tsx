import { TextInput, StyleSheet, ScrollView, Text, View, FlatList, Alert } from "react-native";
import React,  { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import MacroButton from "@/components/foodlog/MacroButton";
import Logged from "./FoodLogLogged";
import ApiScreen from "../ApiScreen";
import { Ionicons } from "@expo/vector-icons";
import FoodLogAddForm from "./FoodLogAdd";

interface Food {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    multiplier: number;
    isDelted: boolean;
}

const FoodItem: React.FC<{ food: Food }> =  ({ food }) => (
    <View style = {styles.foodItemContainer}>
        <Text style={styles.foodText}>{food.name}</Text>
        <Text style={styles.foodText}>Calories: {food.calories}</Text>
    </View>
);

const FoodLogSavedScreen = () => { 
    const [foodDetails, setFoodDetails] = useState<Food[]>([]);
    const navigation = useNavigation();
    // Function to fetch food details based on the food ID
    const fetchFoodDetails = async (foodID: any) => {
        try {
            const response = await fetch(`https://ript-fitness-app.azurewebsites.net/nutritionCalculator/getFood/${foodID}`);
            if (response.ok) {
                const foodData = await response.json();
                setFoodDetails(foodData);
                return foodData;
            } else {
                console.error('Failed to fetch food detaisl for ID: ', foodID);
                return null; 
            }
        } catch (error) {
            console.error('Error fetching food details: ', error);
        }
    }; 

    // Function to handle detching and displaying food details for all IDs
    const displayFoodItems = async () => {
        try {
            // Get th arrau of food IDs from the PUT method 
            const dayID = 13;
            const putResponse = await fetch(`https://ript-fitness-app.azurewebsites.net/nutritionCalculator/getDay/${dayID}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (putResponse.ok) {
                const responseData = await putResponse.json();
                const foodIDs = responseData.foodIdsInFoodsEatenInDayList;

                // Fetch details for each food ID that we want to display 
                const foodDetailsArray = await Promise.all(foodIDs.map((id: any) => fetchFoodDetails(id)));

                // Filter out any failed fetches and display results 
                const validFoodDetails = foodDetailsArray.filter(food => food != null);

                validFoodDetails.forEach(food => {
                    console.log(`Food: ${food.name}, Calories: ${food.calories}`);
                });
            } else {
                console.error('PUT request failed');
            }
        } catch (error) {
            console.error('Error handling food display:', error);
        }
    };

    useEffect(() => {
        displayFoodItems();
    }, []);


    return(
// {/* THIS IS THE NEW STUFF FOR THE ADD PAGE*/}
<View>
<View>
    {/* Top section with navigation and macro buttons */}
                <View style={styles.calendarNav}>
                    <Ionicons 
                        name={"chevron-back-outline"} 
                        size={24} 
                        style={styles.leftArrow}
                        //onPress={() => navigation.navigate(ApiScreen)}
                />
                    <Ionicons name={"calendar-clear-outline"} size={24}></Ionicons>
                    {/* This will be "today" when it is the current date, if not it will display the date of the data they are viewing*/}
                    <Text>Today</Text>
                    <Ionicons 
                        name={"chevron-forward-outline"} 
                        size={24} 
                        style={styles.rightArrow}
                        //onPress={() => navigation.navigate(ApiScreen)}
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
                    // onPress={()  => navigation.navigate(Logged)}
                    >Logged</Text>
                <Text style={styles.text}
                    // onPress={()  => navigation.navigate('ApiScreen')}
                    >Saved</Text>
                <Text style={styles.textAdd}
                    // onPress={()  => navigation.navigate(FoodLogAddForm)}
                    >Add</Text>
            </View>
    </View>
    <View> 
            {/* Bottom section displaying list of foods */}
            <FlatList
                data={foodDetails}
                renderItem={({item}) => <FoodItem food={item} />}
                keyExtractor={(item) => item.name.toString()}
                contentContainerStyle={styles.foodList}
            />
    </View>

</View>

            );
    };

const styles = StyleSheet.create({
    calendarNav: {
        height: 40,
        backgroundColor: 'lightgray',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
        padding: 5,
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
        backgroundColor: 'white', 
    }, 
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'center', 
    }, 
    dataBar: {
        height: 50,
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
    foodList :{
        paddingBottom: 20, 
    }, 
    foodItemContainer: {
        padding: 15, 
        backgroundColor: 'lightgrey', 
        borderBottomWidth: 1, 
        borderColor: 'black',
    }, 
    foodText: {
        fontSize: 16, 
    },
})

export default FoodLogSavedScreen;