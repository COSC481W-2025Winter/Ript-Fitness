import { TextInput, StyleSheet, ScrollView, Text, View, FlatList, Alert } from "react-native";
import React,  { useContext, useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "@/context/GlobalContext";
import { httpRequests } from "@/api/httpRequests";
import LogFoodButton from "@/components/foodlog/FoodLogButton";



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
    const navigation = useNavigation();
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
        onPress={() => navigation.navigate('ApiScreen')}
        />
    );
    };

const FoodLogLoggedPage = ({ dayId }) => { 
    const [foodDetails, setFoodDetails] = useState<Food[]>([]);
    const [days, setDays] = useState([]);
    const [day, setDay] = useState(0);

    const context = useContext(GlobalContext);

    console.log("Today's Day ID: ", dayId);

    // Function to fetch food details based on the food ID
    const fetchFoodIDs = async () => {
        try {
            // const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getDayIdsOfLoggedInUser`, {
            //     method: 'GET', 
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${context?.data.token}`,
            //     }
            // });
            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getDay/${dayId}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }, 
            });

            if (response.status === 200) {
                const dayData = await response.json();
                // console.log('Fetched day ID: ', dayData.id);
                const foodIDs = dayData.foodIdsInFoodsEatenInDayList;
                // console.log('Fetched food IDs: ', foodIDs);
                    
                // handle fetching and displaying food details for all IDs 
                const detailsArray = await Promise.all(foodIDs.map((id: number) => fetchingSingleFoodDetail(id)));

                // Filter out any failed requests
                const validDetails = detailsArray.filter((food) => food !== null);
                setFoodDetails(validDetails);

            } else {
                console.log(response.json());
                // console.error('Failed to fetch food details');
            }
        } catch (error) {
            console.log('Error fetching food details: ', error);
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
                // console.log(`Fetched details for food ID ${foodID}: `, foodData);
                return foodData; 
            } else {
                // console.error(`Failed to fetch details for food ID: ${foodID}`);
                return null;
            }
        } catch (error) {
            // console.error(`Error fetching details for food ID ${foodID}:`, error);
            return null;
        }
    };


    useEffect(() => {
        fetchFoodIDs();
    }, [dayId]);

    const renderItem = ({ item }:{item: Food}) => <FoodItem food={item} />;


    return(
// {/* THIS IS THE NEW STUFF FOR THE ADD PAGE*/}
        <View>
            <ScrollView style={styles.bottomContainer}>
                    {/* Bottom section displaying list of foods */}
                    <FlatList<Food>
                        data={foodDetails}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.name}
                        contentContainerStyle={styles.foodList}
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
    }
})

export default FoodLogLoggedPage;
