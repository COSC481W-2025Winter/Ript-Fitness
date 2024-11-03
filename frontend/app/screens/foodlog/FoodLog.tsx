
import { TextInput, StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import MacroButton from "@/components/foodlog/MacroButton";
import { httpRequests } from "@/api/httpRequests";
import { GlobalContext } from "@/context/GlobalContext";
import FoodLogAddPage from "./FoodLogAdd";
import FoodLogSavedPage from "./FoodLogSaved";
import FoodLogLoggedPage from "./FoodLogLogged";

// import FoodLogSaved from "@/app/screens/foodlog/FoodLogSaved";

export default function FoodLogScreen() {
    
    const navigation = useNavigation();
    const [selectedPage, setSelectedPage] = useState("Logged"); // Track selected page
    const [foodName, setFoodName] = useState('');
    const [foodCalories, setCalories] = useState('');
    const [foodFat, setFat] = useState('');
    const [foodCarbs, setCarbs] = useState('');
    const [foodProtein, setProtein] = useState('');
    const [foodServings, setServings] = useState('');
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [day, setDay] = useState();
    const context = useContext(GlobalContext);
    
    const dayData = {
        "foodsEatenInDay": [],
        "foodIdsInFoodsEatenInDayList": []
    }

    const newDay = async () => {
        try {
            const dayResponse = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/addDay`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }, 
                body: JSON.stringify(dayData),
            });

            if (dayResponse.status === 201) {
                const data = await dayResponse.json(); 
                setDay(data.id);
                console.log("Day ID: ", data.id);
                clearMacroFields();
            }
        } catch (error) {
            console.log("Failed to create day", error);
        }
    };

    const clearMacroFields = () => {
        setTotalCalories(0);
        setTotalProtein(0);
        setTotalCarbs(0);
        setTotalFat(0); 
        setTotalWater(0);
    };

    const setTotalForDay = async () => {
        try {
            const getDayResponse = await fetch (`${httpRequests.getBaseURL()}/nutritionCalculator/getDay/${day}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }
            }); 
            console.log(getDayResponse.status);

            if (getDayResponse.status == 201 || getDayResponse.status == 200) {
                const dayData = await getDayResponse.json(); 
                console.log(dayData);
                setTotalCalories(dayData.calories); 
                setTotalCarbs(dayData.totalCarbs);
                setTotalProtein(dayData.totalProtein);
                setTotalFat(dayData.totalFat);
            } else {
                console.log('Failed to get day');
            }
        } catch (error) {
            console.log('Error', 'An error occurred. Please try again.');
        }
    };

    const updateTotalMacros = () => {
        setTotalCalories(totalCalories);
        setTotalFat(totalFat);
        setTotalCarbs(totalCarbs);
        setTotalProtein(totalProtein);
    };

    useEffect(() => {
        setTotalForDay();
        updateTotalMacros();
    }, [selectedPage]);


    
    const addWater = async () => {
        try {
            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/editWaterIntake/${day}/10`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }
            });

            if(response.status == 200 || response.status == 201) {
                const dayData = await response.json();
                setTotalWater(dayData.totalWaterConsumed);
            } else {
                console.log('Failed to edit water');
            }
        } catch (error) {
            console.log('Error', 'An error occurred. Please try again.');
        }
    };

    const minusWater = async () => {
        try {
            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/editWaterIntake/${day}/-10`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }
            });

            if(response.status == 200 || response.status == 201) {
                const dayData = await response.json();
                setTotalWater(dayData.totalWaterConsumed);
            } else {
                console.log('Failed to edit water');
            }
        } catch (error) {
            console.log('Error', 'An error occurred. Please try again.');
        }
    };

    const renderContent = () => {
        if (selectedPage === "Logged") return <FoodLogLoggedPage dayId={day}/>;
        if (selectedPage === "Saved") return <FoodLogSavedPage />;
        if (selectedPage === "Add") return <FoodLogAddPage dayId={day} />;
    };

    return(
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
                    <Text onPress={() => newDay()}>Today</Text>
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
                        total={totalCalories}
                        textColor="#0E598D"
                        borderColor="#0E598D"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Protein" 
                        total={totalProtein}
                        textColor="#F2846C"
                        borderColor="#F2846C"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Carbs" 
                        total={totalCarbs}
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
                        total={totalFat}
                        textColor="#AC2641"
                        borderColor="#AC2641"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Water" 
                        total={totalWater}
                        textColor="black"
                        borderColor="black"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <View style={styles.plusMinus}>
                        <Ionicons name="add-circle-outline" size={30} style={styles.waterButton} onPress={() => addWater()}></Ionicons>
                        <Ionicons name="remove-circle-outline"size={30} style={styles.waterButton} onPress={() => minusWater()}></Ionicons>
                    </View>
                </View>
            </View> 
             {/* Navbar for Logged, Saved, Add */}
             <View style={styles.dataBar}>
                    <Text 
                        style={[styles.text, selectedPage === "Logged" && styles.selectedText]} 
                        onPress={() => setSelectedPage("Logged")}
                    >
                        Logged
                    </Text>
                    <Text 
                        style={[styles.text, selectedPage === "Saved" && styles.selectedText]} 
                        onPress={() => setSelectedPage("Saved")}
                    >
                        Saved
                    </Text>
                    <Text 
                        style={[styles.text, selectedPage === "Add" && styles.selectedText]} 
                        onPress={() => setSelectedPage("Add")}
                    >
                        Add
                    </Text>
                </View>
        </View>
         {/* Display Selected Page Content */}
         <ScrollView style={styles.contentContainer} contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled={true}>
                {renderContent()}
        </ScrollView>
    </View>
    );
}

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
    selectedText: {
        fontWeight: 'bold',
        textDecorationLine: 'underline', // Selected style
    },
    plusMinus: {
      paddingTop: 20,
      position: 'absolute',
      right: 50,
    }, 
    waterButton: {
      paddingBottom: 10,
    }, 
    contentContainer: {
        flexGrow: 1,
    },

})