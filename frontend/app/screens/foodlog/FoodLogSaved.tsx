import { TextInput, StyleSheet, ScrollView, Text, View, FlatList, Alert } from "react-native";
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
        onPress={() => navigation.navigate('ApiScreen', {})}
        />
    )
};


const FoodLogSavedPage = () => { 
    const [foodDetails, setFoodDetails] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const context = useContext(GlobalContext);

    const fetchFoodIDs = async () => {
        try {
            console.log("Fetching food details...");
            const cachedFoodDetails = await AsyncStorage.getItem('foodDetails');
            
            if (cachedFoodDetails) {
                console.log("Using cached food details");
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
                } 
            } catch (error) {
                console.log(`Error fetching details for food ID ${foodID}:`, error);
            }
            return null;
        };

        const addNewFood = (newFood: Food) => {
            setFoodDetails((prev) => [...prev, newFood].sort((a,b) => a.name.localeCompare(b.name)));
        };

        useFocusEffect(
            useCallback(() => {
                fetchFoodIDs();
            }, [])
        );


    const renderItem = ({ item }:{item: Food}) => <FoodItem food={item} />;


    return loading ? (
       <View>
            <CustomSearchBar></CustomSearchBar>
            <Text style={styles.message}>Loading...</Text>
       </View>
    ) : foodDetails.length === 0 ? (
        <View>
            <CustomSearchBar></CustomSearchBar>
            <Text style={styles.message}>No food items found.</Text>
        </View>
    ) : (
        <View>
            <CustomSearchBar></CustomSearchBar>
            <ScrollView nestedScrollEnabled={true}>   
            <FlatList 
                data={foodDetails}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={styles.foodList}
                scrollEnabled={false}
            />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    foodList :{
        paddingBottom: 20, 
    }, 
    foodItemContainer: {
        position: 'relative',
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
        paddingBottom: 29,
        height: '100%',
    }, 
    message: {
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: 20,
        padding: 30,
    }
})

export default FoodLogSavedPage;