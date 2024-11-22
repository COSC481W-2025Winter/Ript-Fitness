import { TextInput, StyleSheet, ScrollView, Text, View, FlatList, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import React,  { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GlobalContext } from "@/context/GlobalContext";
import { httpRequests } from "@/api/httpRequests";
import LogFoodButton from "@/components/foodlog/FoodLogButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from 'react-native-gesture-handler';
import CustomSearchBar from '@/components/custom/CustomSearchBar';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Food {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    multiplier: number;
    isDeleted: boolean;
    // onPress: {};
}

const FoodItem: React.FC<{ food: Food; saveFoodChanges: (food: Food) => void}> =  ({ food, saveFoodChanges}) => {
    // const navigation = useNavigation<WorkoutScreenNavigationProp>();
    return(
        <LogFoodButton 
            id={food.id}
            name={food.name}
            calories={food.calories}
            protein={food.protein}
            carbs={food.carbs}
            fat={food.fat}
            multiplier={food.multiplier}
            saveFoodChanges={(updatedFood) => saveFoodChanges(updatedFood)}
            textColor="black"
            backgroundColor='white'
            borderWidth={1}
            fontSize={16}
            width ='100%'
            />
    );
    };


const FoodLogSavedPage: React.FC<{ foods: Food[] }> = ({ foods }) => { 
    const [foodDetails, setFoodDetails] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [cached, setCached] = useState(false);
    const context = useContext(GlobalContext);
    const [isFoodModalVisible, setFoodModalVisible] = useState(false);
    const [foodText, setFoodText] = useState("");
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    
    const fetchFoods = async () => {
        try {
            console.log("Fetching food details...");
            const cachedFoodDetails = await AsyncStorage.getItem('foodDetails');
            
            if (cachedFoodDetails) {
                console.log("Using cached food details");
                setCached(true);
                setFoodDetails(JSON.parse(cachedFoodDetails));
            } 
                const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getFoodsOfLoggedInUser/0/200`,
                {
                    method: "GET", 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${context?.data.token}`,
                    }
                });
            
                if (response.status === 200) {

                    const foodArray = await response.json();

                    // Ensure the array is sorted by food name alphabetically
                    foodArray.sort((a: Food, b: Food) => a.name.localeCompare(b.name));

                    console.log("Fetched and sorted food details:", foodArray);
                    setFoodDetails(foodArray);

                     // Cache the sorted food details
                    await AsyncStorage.setItem('foodDetails', JSON.stringify(foodArray));
                } else {
                    console.log("Failed to fetch food IDs. Status:", response.status);
                }
            
        } catch (error) {
            console.error("Error fetching food IDs or details:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveFoodChanges = async (updatedFood: Food) => {
        console.log("UPdated food: ", updatedFood);
        // const orderedFood = {
        //     name: updatedFood.name,
        //     calories: updatedFood.calories,
        //     protein: updatedFood.protein,
        //     carbs: updatedFood.carbs,
        //     fat: updatedFood.fat,
        //     multiplier: updatedFood.multiplier,
        //     isDeleted: updatedFood.isDeleted,
        // };
        function customJSONStringify(obj: any, keysOrder: string[]): string {
            const orderedObj: any = {};
            for (const key of keysOrder) {
              if (key in obj) {
                orderedObj[key] = obj[key];
              }
            }
            return JSON.stringify(orderedObj);
          }
          
          // Specify the desired order of keys
          const keysOrder = ["name", "calories", "protein", "carbs", "fat", "multiplier", "isDeleted"];
          
          // Serialize updatedFood with the desired key order
          const body = customJSONStringify(updatedFood, keysOrder);

          console.log("UpdatedFoodID", updatedFood.id);
          
        try {
            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/editFood/${updatedFood.id}`, {
                method: "PUT", 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${context?.data.token}`,
                }, 
                body: body, 
            });

            console.log(body);
            console.log(response.status);

            if (response.status === 200) {
                //update local state with the updated food details 
                setFoodDetails((prev) => 
                prev.map((food) => (food.id === updatedFood.id ? updatedFood : food))
                );
            } else {
                console.error("Failed to save food changes");
            }
        } catch (error) {
            console.error("Error saving food changes: ", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFoods();
        }, [])
    );

    // useEffect(() => {
    //     fetchFoods();
    // }, []);

        // Show a confirmation before deleting a food
  const confirmDeleteFood = (id: number) => {
    Alert.alert(
      "Delete Food",
      "Are you sure you want to delete this food?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => removeFood(id) }
      ]
    );
  };

    // Remove a food by ID
    const removeFood = (id: number) => {
        setFoodDetails(foodDetails.filter((food) => food.id !== id));   
        removeFromDatabase(id);
      };

    const removeFromDatabase = async (id: number) => {
        try {
         const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/deleteFood/${id}`,
                {
                    method: "DELETE", 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${context?.data.token}`,
                    }
                });
                console.log("Response status: ", response.status);
                if (response.status === 200) {
                    Alert.alert("Successfully deleted.");
                } else {
                    console.log("did not delete");
                }
            } catch (error) {
                console.error(error);
            };
    };


    const renderItem = ({ item }:{item: Food}) => (
        <Swipeable
            renderLeftActions={() => (
            <View style={styles.swipeDeleteButton}>
                <Text
                    style={styles.deleteText}
                    onPress={() => confirmDeleteFood(item.id)}
                >
                Delete
                </Text>
            </View>
        )}
        >
            {/* <LogFoodButton {...item} saveFoodChanges={saveFoodChanges} /> */}
        <FoodItem food={item} saveFoodChanges={saveFoodChanges}/> 
        {/* {foodDetails.map((food) => (
        <FoodItem key={food.id} food={food} saveFoodChanges={saveFoodChanges} /> */}
      {/* ))} */}
            
        </Swipeable>
    );


    return cached ? (
        <View style={styles.bottomContainer}>
            <CustomSearchBar></CustomSearchBar>
            <FlatList 
                data={foodDetails}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
            />
        </View>
    ) : loading ? (
        <View style={styles.bottomContainer}>
            <CustomSearchBar></CustomSearchBar>
            <Text style={styles.message}>Loading...</Text>
       </View>
    ) : foodDetails.length === 0 ? (
        <View style={styles.bottomContainer}>
            <CustomSearchBar></CustomSearchBar>
            <Text style={styles.message}>No food items logged.</Text>
        </View>
    ) : (
        <View style={styles.bottomContainer}>
            <CustomSearchBar></CustomSearchBar>
            <FlatList 
                data={foodDetails}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
                
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20,
    },
    foodList :{
        paddingBottom: 20, 
    }, 
    foodItemContainer: {
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
    bottomContainer: {
        height: '100%',
    }, 
    message: {
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: 20,
        padding: 30,
    }, 
    swipeDeleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        borderRadius: 10,
      },
      deleteText: {
        color: 'white',
        fontWeight: 'bold',
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
})

export default FoodLogSavedPage;