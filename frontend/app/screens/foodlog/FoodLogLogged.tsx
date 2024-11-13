import { TextInput, StyleSheet, ScrollView, Text, View, FlatList, Alert, TouchableOpacity } from "react-native";
import React,  { useCallback, useContext, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GlobalContext } from "@/context/GlobalContext";
import { httpRequests } from "@/api/httpRequests";
import LogFoodButton from "@/components/foodlog/FoodLogButton";
import { WorkoutScreenNavigationProp } from "@/app/(tabs)/WorkoutStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";


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
    return(
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
    );
    };

const FoodLogLoggedPage = () => { 
    const [foodDetails, setFoodDetails] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [cached, setCached] = useState(false);
    const [day, setDay] = useState(0);
    const [lastDay, setLastDay] = useState(0);
    const context = useContext(GlobalContext);


    // Function to fetch food details based on the food ID
    const fetchFoodIDs = async () => {
        try {
            const cachedFoodTodayDetails = await AsyncStorage.getItem('foodTodayDetails');
            const cachedDay = await AsyncStorage.getItem('day');
            const lastCachedDay = await AsyncStorage.getItem('lastDay');

            if(cachedDay) {
                console.log("There is a cached day: ", JSON.parse(cachedDay));
                try {
                    setDay(JSON.parse(cachedDay));
                } catch (error) {
                    console.error('error parsing cached day:', error);
                }
            }

            if(lastCachedDay) {
                setLastDay(JSON.parse(lastCachedDay));
            }
            
            if (cachedFoodTodayDetails && day === lastDay) {
                console.log("Using cached food details");
                setFoodDetails(JSON.parse(cachedFoodTodayDetails));
                setCached(true);
            } else {
                setFoodDetails([]);
                setCached(false);
            }

            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getDay/${day}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }
            });
            console.log("response status for get Day : ", response.status);

            if (response.status === 200 || response.status === 201 || response.status === 204) {
                const dayData = await response.json();
                const foodIDs = dayData.foodIdsInFoodsEatenInDayList;
                console.log("Food ids today: ", foodIDs);
                
                // handle fetching and displaying food details for all IDs 
                const detailsArray = await Promise.all(foodIDs.map((id: number) => fetchingSingleFoodDetail(id)));

                // Filter out any failed requests
                const validDetails = detailsArray.filter((food) => food !== null);
                
                console.log("Fetched and sorted food logged details:", validDetails);
                setFoodDetails(validDetails);

                await AsyncStorage.setItem('foodTodayDetails', JSON.stringify(validDetails));
                await AsyncStorage.setItem('lastDay', JSON.stringify(day));

                console.log("cached", cached);
                console.log("loading", loading);

            } else {
                console.log("error getting day");
                console.log("day response: ", response.status);
                console.log("day json: ", response.json());
            }
            
        } catch (error) {
            console.log('Error fetching food details: ', error);
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
                const foodData = await response.json();
                return foodData; 
            } else {
                return null;
            }
        } catch (error) {
            // console.error(`Error fetching details for food ID ${foodID}:`, error);
            return null;
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchFoodIDs();
        }, [])
    );

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
            removeFoodFromDay(id);
          };
    
    const removeFoodFromDay = async (id: number) => {
        try {
            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/deleteFoodsInDay/${day}`,
                   {
                       method: "POST", 
                       headers: {
                           'Content-Type': 'application/json',
                           'Authorization': `Bearer ${context?.data.token}`,
                       }, 
                       body: JSON.stringify([id]),
                   });
                   console.log("Response status: ", response.status);
                   if (response.status === 201) {
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


    // return cached ? (
    //     <View style={styles.bottomContainer}>
    //         <FlatList<Food>
    //             data={foodDetails}
    //             renderItem={renderItem}
    //             keyExtractor={(item) => `${item.name}`}
    //         />
    //     </View>
    // ) :  
    return loading ? (
        <View>
             <Text style={styles.message}>Loading...</Text>
        </View>
     ) : foodDetails.length === 0 ? (
         <View>
             <Text style={styles.message}>No food items found.</Text>
         </View>
     ) : (
// {/* THIS IS THE NEW STUFF FOR THE ADD PAGE*/}
        <View style={styles.bottomContainer}>
            {/* Bottom section displaying list of foods */}
            <FlatList
                data={foodDetails}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.name}`}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    foodList :{
        paddingBottom: 20, 
    }, 
    foodItemContainer: {
        // position: 'relative',
        padding: 15, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderColor: 'black',
        alignItems: 'center',
        flexDirection: 'row',
    }, 
    foodName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    foodTextRight: {
        position: 'absolute',
        fontSize: 16, 
        right: 5, 
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

export default FoodLogLoggedPage;
