import { TextInput, StyleSheet, ScrollView, Text, View, FlatList, Alert, TouchableOpacityBase, TouchableOpacity } from "react-native";
import React,  { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GlobalContext } from "@/context/GlobalContext";
import { httpRequests } from "@/api/httpRequests";
import LogFoodButton from "@/components/foodlog/FoodLogButton";
import { WorkoutScreenNavigationProp } from "@/app/(tabs)/WorkoutStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "../SplashScreen";
import { Swipeable } from 'react-native-gesture-handler';
import CustomSearchBar from '@/components/custom/CustomSearchBar';

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

const FoodItem: React.FC<{ food: Food }> =  ({ food }) => {
    const navigation = useNavigation<WorkoutScreenNavigationProp>();
   
    return (
        <LogFoodButton 
            id={food.id}
            name={food.name}
            calories={food.calories}
            protein={food.protein}
            carbs={food.carbs}
            fat={food.fat}
            multiplier={food.multiplier}
            textColor="black"
            backgroundColor='white'
            borderWidth={1}
            fontSize={16}
            width ='100%'
            onPress={() => {}}
            />
    )
};


const FoodLogSavedPage = () => { 
    const [foodDetails, setFoodDetails] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [cached, setCached] = useState(false);
    const context = useContext(GlobalContext);
    const [isFoodModalVisable, setFoodModalVisable] = useState(false);

    const fetchFoodIDs = async () => {
        try {
            console.log("Fetching food details...");
            const cachedFoodDetails = await AsyncStorage.getItem('foodDetails');
            
            if (cachedFoodDetails) {
                console.log("Using cached food details");
                setCached(true);
                setFoodDetails(JSON.parse(cachedFoodDetails));
            } 
                const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getFoodIdsOfLoggedInUser`,
                {
                    method: "GET", 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${context?.data.token}`,
                    }
                });
            
                if (response.status === 200) {
                    const foodIDs = await response.json();
    
                    const detailsArray = await Promise.all(foodIDs.map((id: number) => fetchingSingleFoodDetail(id)));
                    

                    const validDetails = detailsArray.filter((food) => food !== null);
                    validDetails.sort((a,b) => a.name.localeCompare(b.name));

                    console.log("Fetched and sorted food details:", validDetails);
                    setFoodDetails(validDetails);

                    await AsyncStorage.setItem('foodDetails', JSON.stringify(validDetails));
                } else {
                    console.log("Failed to fetch food IDs. Status:", response.status);
                }
            
        } catch (error) {
            console.error("Error fetching food IDs or details:", error);
        } finally {
            setLoading(false);
        }
    };

        const fetchingSingleFoodDetail = async (foodID: number) => {
            try {
                const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getFood/${foodID}`, {
                    method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${context?.data.token}`,
                    }
                });
    
                if (response.status === 200) {
                    return await response.json();
                } else {
                    return null;
                }
            } catch (error) {
                console.log(`Error fetching details for food ID ${foodID}:`, error);
            }
            return null;
        };


        useFocusEffect(
            useCallback(() => {
                fetchFoodIDs();
            }, [])
        );

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
            }
    }

    const renderItem = ({ item }:{item: Food}) => (
        <Swipeable
            renderLeftActions={() => (
                <View style={styles.swipeDeleteButton}>
                    <Text 
                        style={styles.deleteText}
                        onPress={() => confirmDeleteFood(item.id)}
                    >Delete</Text>
                </View>
            )}
        >
        <FoodItem food={item} />
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
})

export default FoodLogSavedPage;