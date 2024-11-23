
import { TextInput, StyleSheet, ScrollView, Text, View, SafeAreaView } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MacroButton from "@/components/foodlog/MacroButton";
import { httpRequests } from "@/api/httpRequests";
import { GlobalContext } from "@/context/GlobalContext";
import FoodLogAddPage from "./FoodLogAdd";
import FoodLogSavedPage from "./FoodLogSaved";
import FoodLogLoggedPage from "./FoodLogLogged";
import { ProfileScreenNavigationProp } from "@/app/(tabs)/ProfileStack";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function FoodLogScreen() {

    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [selectedPage, setSelectedPage] = useState("Logged"); // Track selected page
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [dayIndex, setDayIndex] = useState(0);
    const [day, setDay] = useState();
    const context = useContext(GlobalContext);
    const [cached, setCached] = useState(false);

    
    const newDay = async () => {
        try {
            const dayResponse = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/addDay`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }, 
                body: '{}',
            });
            console.log(dayResponse.status);

            if (dayResponse.status === 201) {
                const data = await dayResponse.json(); 
                const dayID = data.id;
                setDay(dayID);
                // console.log("Day ID: ", dayID);
                clearMacroFields();
                
                await AsyncStorage.setItem('day', JSON.stringify(dayID));
                await AsyncStorage.removeItem('foodTodayDetails');
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
        const thisDay = await AsyncStorage.getItem('day');
        if (thisDay) {
            setDay(JSON.parse(thisDay));
        } else {
            console.log("Error setting day: ", thisDay);
        }

        try {
            console.log("day", day);
            const getDayResponse = await fetch (`${httpRequests.getBaseURL()}/nutritionCalculator/getDay/${day}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }
            }); 
            console.log(getDayResponse.status);

            if (getDayResponse.status == 200) {
                const dayData = await getDayResponse.json(); 
                // console.log(dayData);
                await AsyncStorage.setItem('fullDay', JSON.stringify(dayData));

                setTotalCalories(dayData.calories); 
                setTotalCarbs(dayData.totalCarbs);
                setTotalProtein(dayData.totalProtein);
                setTotalFat(dayData.totalFat);
                setCached(true);

                await AsyncStorage.setItem('day', JSON.stringify(dayData.id));
                setDay(dayData.id);
                // console.log("day item in storage: ", dayData.id);
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


    useFocusEffect(
        useCallback(() => {
            const fetchDayID = async () => {
                const dayData = await AsyncStorage.getItem('fullDay');
                // console.log(dayData); // Should print the stored ID
                if (dayData) {
                    const dayID = JSON.parse(dayData).id;
                    setDay(dayID);
                } else {
                    console.log("dayID is null");
                }
            };

            fetchDayID();
            setTotalForDay();
            updateTotalMacros();
            updateWater();
    
            // Optionally clean up resources here
        }, [totalCalories, selectedPage])
    );
    
 
    
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
        if (selectedPage === "Logged") return <FoodLogLoggedPage />;
        if (selectedPage === "Saved") return <FoodLogSavedPage />;
        if (selectedPage === "Add") return <FoodLogAddPage />;
    };

    return (
        <SafeAreaView style={styles.flexContainer}>
            <View>
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
        <View style={styles.pageContainer}>
                {renderContent()}
        </View>
    </SafeAreaView> 
    );
};

const styles = StyleSheet.create({
    flexContainer: {
        flexGrow: 1, 
    },
    pageContainer: {
        flex: 1, 
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
