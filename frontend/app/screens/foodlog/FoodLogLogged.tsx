import { TextInput, StyleSheet, ScrollView, Text, View, FlatList, Alert, TouchableOpacity } from "react-native";
import React,  { useContext, useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "@/context/GlobalContext";
import { httpRequests } from "@/api/httpRequests";
import LogFoodButton from "@/components/foodlog/FoodLogButton";
import { WorkoutScreenNavigationProp } from "@/app/(tabs)/WorkoutStack";
import AsyncStorage from "@react-native-async-storage/async-storage";


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

const FoodLogLoggedPage = ({ dayId } : any) => { 
    const [foodDetails, setFoodDetails] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [cached, setCached] = useState(false);
    const [days, setDays] = useState([]);
    const [day, setDay] = useState(0);

    const context = useContext(GlobalContext);

    console.log("Today's Day ID: ", dayId);

    // Function to fetch food details based on the food ID
    const fetchFoodIDs = async () => {
        try {
            const cachedFoodTodayDetails = await AsyncStorage.getItem('foodTodayDetails');
            // const cachedDay = await AsyncStorage.getItem('day');
            
            if (cachedFoodTodayDetails) {
                console.log("Using cached food details");
                setFoodDetails(JSON.parse(cachedFoodTodayDetails));
                // setDay(JSON.parse(cachedDay));
                // setDay(JSON.parse(cachedDay));
                setCached(true);
            }
                const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getDay/${day}`, {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${context?.data.token}`,
                    }, 
                });

                if (response.status === 200) {
                    const dayData = await response.json();
                    const foodIDs = dayData.foodIdsInFoodsEatenInDayList;
                    console.log("Food ids today: ", foodIDs);
                    
                    // handle fetching and displaying food details for all IDs 
                    const detailsArray = await Promise.all(foodIDs.map((id: number) => fetchingSingleFoodDetail(id)));

                    // Filter out any failed requests
                    const validDetails = detailsArray.filter((food) => food !== null);
                    
                    setFoodDetails(validDetails);

                    await AsyncStorage.setItem('foodTodayDetails', JSON.stringify(validDetails));

                } else {
                    console.log(response.json());
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


    useEffect(() => {
        fetchFoodIDs();
    }, []);

    const renderItem = ({ item }:{item: Food}) => <FoodItem food={item} />;


    // return cached ? (
    //     <View>
    //         <FlatList<Food>
    //             data={foodDetails}
    //             renderItem={renderItem}
    //             keyExtractor={(item, index) => `${item.name}-${index}`}
    //             contentContainerStyle={styles.foodList}
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
             {/* <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Log New Food</Text>
            </TouchableOpacity> */}
         </View>
     ) : (
// {/* THIS IS THE NEW STUFF FOR THE ADD PAGE*/}
        <View >
            {/* Bottom section displaying list of foods */}
            <FlatList
                data={foodDetails}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                contentContainerStyle={styles.foodList}
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
        //height: '100%',
    }, 
    message: {
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: 20,
        padding: 30,
    },
})

export default FoodLogLoggedPage;
