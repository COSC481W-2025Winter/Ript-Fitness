
import { TextInput, StyleSheet, ScrollView, Text, View, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import MacroButton from "@/components/foodlog/MacroButton";
import { httpRequests } from "@/api/httpRequests";
import { GlobalContext } from "@/context/GlobalContext";
import FoodLogAddPage from "./FoodLogAdd";
import FoodLogSavedPage from "./FoodLogSaved";
import FoodLogLoggedPage from "./FoodLogLogged";
import { WorkoutScreenNavigationProp } from "@/app/(tabs)/WorkoutStack";
import { ProfileScreenNavigationProp } from "@/app/(tabs)/ProfileStack";
import addFoodButton from '@/components/foodlog/AddFoodButton';
import AddFoodButton from "@/components/foodlog/AddFoodButton";


export default function FoodLogScreen() {

    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [selectedPage, setSelectedPage] = useState("Logged"); // Track selected page
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [day, setDay] = useState();
    const context = useContext(GlobalContext);



    //const currentDate = new Date(); 
    //const formattedDate = `${currentDate.getMonth() +1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

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
            console.log(dayResponse.status);

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
    
    // const checkDay = async () => {
    //     console.log("Current Date: ", formattedDate);
    //     console.log("Current day: ", day);
        
    //     if (formattedDate == day) {
    //         console.log("The date is today");
    //     } else {
    //         console.log("We need a new day");
    //         newDay();
    //     }
    // }

    const clearMacroFields = () => {
        setTotalCalories(0);
        setTotalProtein(0);
        setTotalCarbs(0);
        setTotalFat(0); 
        setTotalWater(0);
    };

    const setTotalForDay = async () => {
        try {
            console.log(day)
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
        setTotalWater(totalWater);
    };

    useEffect(() => {
        setTotalForDay();
        updateTotalMacros();
        updateWater();
    }, [selectedPage]);

 
    
let amount = totalWater;

const addWater = async () => {
    amount += 8; 
    setTotalWater(amount);
}
const minusWater = async () => {
    if (amount!= 0) {
        amount -= 8; 
        setTotalWater(amount);
    }
}

const updateWater = async () => {
    try {
        const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/editWaterIntake/${day}/${amount}`, {
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
}

    const renderContent = () => {
        if (selectedPage === "Logged") return <FoodLogLoggedPage dayId={day}/>;
        if (selectedPage === "Saved") return <FoodLogSavedPage />;
        if (selectedPage === "Add") return <FoodLogAddPage dayId={day} />;
    };

    return(
        <SafeAreaView style={styles.flexContainer}>
            <View>
            {/* <View style={styles.align}>
                    <Ionicons name="today-outline" size={30} onPress={() => addWater()}></Ionicons>
                    <Text style={styles.text}>Start new day log</Text>
            </View> */}
                <View style={styles.calendarNav}>
                    <Ionicons 
                        name={"chevron-back-outline"} 
                        color={"white"}
                        size={24} 
                        style={styles.leftArrow}
                        onPress={() => navigation.navigate('ApiScreen')}
                />
                     <Ionicons name={"calendar-clear-outline"} size={24} color={"white"}></Ionicons>
                    <Text style={styles.whiteText} onPress={() => newDay()}>Today</Text>
                    <Ionicons 
                        name={"chevron-forward-outline"} 
                        color={"white"}
                        size={24} 
                        style={styles.rightArrow}
                        onPress={() => navigation.navigate('ApiScreen')}
                    /> 
                </View>
            
            <View style={styles.macroView}> 
                <View style={styles.macroRow}>
                    <MacroButton
                        title="Calories"
                        label=""
                        total={totalCalories}
                        textColor="#F2D06B"
                        borderColor="#F2D06B"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Protein" 
                        label="g"
                        total={totalProtein}
                        textColor="#2493BF"
                        borderColor="#2493BF"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Carbs" 
                        label="g"
                        total={totalCarbs}
                        textColor="#56C97B"
                        borderColor="#56C97B"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                </View>
                <View style={styles.macroRow}>
                    <MacroButton
                        title="Fat" 
                        label="g"
                        total={totalFat}
                        textColor="#F22E2E"
                        borderColor="#F22E2E"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Water" 
                        label="oz"
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
                {/* <View style={styles.align}>
                    <Ionicons name="today-outline" size={30} onPress={() => addWater()}></Ionicons>
                    <Text style={styles.text}>Start new day log</Text>
                </View> */}
                <View style={[styles.box, selectedPage === "Logged" && styles.selectedBox]}>
                    <Text 
                        style={[styles.text, selectedPage === "Logged" && styles.selectedText]} 
                        onPress={() => setSelectedPage("Logged")}
                    >
                        Logged
                    </Text>
                </View>
                <View style={[styles.box, selectedPage === "Saved" && styles.selectedBox]}>
                    <Text 
                        style={[styles.text, selectedPage === "Saved" && styles.selectedText]} 
                        onPress={() => setSelectedPage("Saved")}
                    >
                        Saved
                    </Text>
                </View>
                <View style={[styles.box, selectedPage === "Add" && styles.selectedBox]}>
                    <Text 
                        style={[styles.text, selectedPage === "Add" && styles.selectedText]} 
                        onPress={() => setSelectedPage("Add")}
                    >
                        Add
                    </Text>
                </View>
                </View>
        </View>
         {/* Display Selected Page Content */}
        <View style={{}}>
                {renderContent()}
        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        flexGrow: 1, 
    },
    calendarNav: {
        height: 40,
        width: '100%', 
        backgroundColor: '#21BFBF',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
    },
    whiteText: {
        color: "white",
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
        height: 210,
        width: '100%',
        backgroundColor: 'white', 
    }, 
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'center', 
    }, 
    dataBar: {
        width: '100%', 
        flexDirection: 'row',
        borderColor: '#21BFBF',
        borderWidth:1,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'space-evenly',
    }, 
    selectedBox: {
        width: '33%',
        alignItems: 'center',
        backgroundColor:'#21BFBF',
        padding: 5, 
    },
    box: {
        width: '33%',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 5,
    },

    align: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    text: {
        padding: 10,
        color: '#21BFBF',
    },
    selectedText: {
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#21BFBF',
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
    startDayButton: {
        alignContent: 'center',
    }

})