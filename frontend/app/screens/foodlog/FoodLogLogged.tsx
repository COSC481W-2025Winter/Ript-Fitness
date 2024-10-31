import AddFoodButton from "@/components/foodlog/AddFoodButton";
import { useState } from "react";
import { TextInput, StyleSheet, ScrollView, Text, View, Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import MacroButton from "@/components/foodlog/MacroButton";
import { useNavigation } from "@react-navigation/native";

const Logged = () => {
    const [foodArray, setFoodArray] = useState([]);
    const [foodName, setFoodName] = useState('');
    const [foodCalories, setFoodCalories] = useState('');
    const [foodProtein, setFoodProtein] = useState('');
    const [foodCarbs, setFoodCarbs] = useState('');
    const [foodFat, setFoodFat] = useState('');
    const [day, setDay] = useState('');

    const printFoodLogged = async () => {
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

        try {
            const response = await fetch(`https://ript-fitness-app.azurewebsites.net/nutritionCalculator/getDay/13`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                }, 
            });
            if (response.status === 201) {
                const data = await response.json();
                setFoodArray(data.foodIdsInFoodsEatenInDayList);
                console.log(foodArray);
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

    const navigation = useNavigation();

    return (
// {/* THIS IS THE NEW STUFF FOR THE ADD PAGE*/}
<View>
<View>
                <View style={styles.calendarNav}>
                    <Ionicons 
                        name={"chevron-back-outline"} 
                        size={24} 
                        style={styles.leftArrow}
                        onPress={() => navigation.navigate('ApiScreen')}
                />
                    <Ionicons name={"calendar-clear-outline"} size={24}></Ionicons>
                    {/* This will be "today" when it is the current date, if not it will display the date of the data they are viewing*/}
                    <Text>Today</Text>
                    <Ionicons 
                        name={"chevron-forward-outline"} 
                        size={24} 
                        style={styles.rightArrow}
                        onPress={() => navigation.navigate('ApiScreen')}
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
                    onPress={()  => navigation.navigate('Logged')}>Logged</Text>
                <Text style={styles.text}
                    onPress={()  => navigation.navigate('ApiScreen')}>Saved</Text>
                <Text style={styles.textAdd}
                    onPress={()  => navigation.navigate('Add')}>Add</Text>
            </View>
        </View>
        <ScrollView>
            <View >
                <AddFoodButton   
                        title="Log Food Today" 
                        textColor="white"
                        backgroundColor="#088C7F"
                        borderWidth={1}
                        fontSize={16}
                        width={150}
                        onPress={printFoodLogged} 
                />
            {/* </View> */}
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
    }

})

 export default Logged;
