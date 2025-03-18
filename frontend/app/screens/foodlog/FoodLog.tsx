
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
import { TouchableOpacity } from "react-native";

// Importing the navigation prop type from BodyStack,
// which defines the type structure for navigation in this stack.
import { BodyScreenNavigationProp } from "@/app/(tabs)/BodyStack"; 
                                                                    


export default function FoodLogScreen() {
    
    // Initializing the navigation object with the BodyScreenNavigationProp type,
    // ensuring type safety when navigating between screens within BodyStack.
    const navigation = useNavigation<BodyScreenNavigationProp>();
    
    const [selectedPage, setSelectedPage] = useState("Logged"); // Track selected page
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [dayIndex, setDayIndex] = useState(0);
    const [totalCholesterol, setTotalCholesterol] = useState(0);
    const [totalSaturatedFat, setTotalSaturatedFat] = useState(0);
    const [totalTransFat, setTotalTransFat] = useState(0);
    const [totalSodium, setTotalSodium] = useState(0);
    const [totalFiber, setTotalFiber] = useState(0);
    const [totalSugars, setTotalSugars] = useState(0);
    const [totalCalcium, setTotalCalcium] = useState(0);
    const [totalIron, setTotalIron] = useState(0);
    const [totalPotassium, setTotalPotassium] = useState(0);
    const [day, setDay] = useState<number | null>(null);
    const context = useContext(GlobalContext);
    const [cached, setCached] = useState(false);
    const [isPressed, setIsPressed] = useState(false);


     // Prefix all keys with user ID (assuming it's stored in context)
     const userID = context?.data.token; 
     if (!userID) throw new Error("User ID not found");

     const foodTodayKey = `${userID}_foodTodayDetails`;
     const dayKey = `${userID}_day`;
     const fullDayKey = `${userID}_fullDay`;

     
    const isDarkMode = context?.isDarkMode;

    
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
                
                await AsyncStorage.setItem(dayKey, JSON.stringify(dayID));
                await AsyncStorage.removeItem(foodTodayKey);
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
        setTotalCholesterol(0);
        setTotalSaturatedFat(0);
        setTotalTransFat(0);
        setTotalSodium(0);
        setTotalFiber(0);
        setTotalSugars(0);
        setTotalCalcium(0);
        setTotalIron(0);
        setTotalPotassium(0);
    };

    const setTotalForDay = async () => {
        const thisDay = await AsyncStorage.getItem(dayKey);
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
                await AsyncStorage.setItem(fullDayKey, JSON.stringify(dayData));

                setTotalCalories(dayData.calories); 
                setTotalCarbs(dayData.totalCarbs);
                setTotalProtein(dayData.totalProtein);
                setTotalFat(dayData.totalFat);
                // setTotalWater(dayData.totalWaterConsumed);
                setTotalCholesterol(dayData.totalCholesterol);
                setTotalSaturatedFat(dayData.totalSaturatedFat);
                setTotalTransFat(dayData.totalTransFat);
                setTotalSodium(dayData.totalSodium);
                setTotalFiber(dayData.totalFiber);
                setTotalSugars(dayData.totalSugars);
                setTotalCalcium(dayData.totalCalcium);
                setTotalIron(dayData.totalIron);
                setTotalPotassium(dayData.totalPotassium);
                setCached(true);

                await AsyncStorage.setItem(dayKey, JSON.stringify(dayData.id));
                setDay(dayData.id);
                // console.log("day item in storage: ", dayData.id);
            } else {
                console.log('Failed to get day');
            }
        } catch (error) {
            console.log('Error', 'An error occurred. Please try again.');
        }
    };

    // Eventually would like to be able to click back to see days in the past

    // const changeDayBackWard = async () => {
    //     const thisDay = await AsyncStorage.getItem(dayKey);
    //     if(thisDay) {
    //         const newDay = JSON.parse(thisDay) - 1;
    //         console.log("New day: ", newDay);
    //         await AsyncStorage.setItem(dayKey, JSON.stringify(newDay));
    //         setDay(newDay);
    //         // await AsyncStorage.setItem(dayKey, JSON.stringify(newDay));
    //         setTotalForDay();
    //     } else {

    //     }
    // }

    // const changeDayForward = async () => {
    //     const thisDay = await AsyncStorage.getItem(dayKey);
    //     if(thisDay) {
    //         const newDay = JSON.parse(thisDay) + 1;
    //         console.log("New day: ", newDay);
    //         await AsyncStorage.setItem(dayKey, JSON.stringify(newDay));
    //         setDay(newDay);
    //         // await AsyncStorage.setItem(dayKey, JSON.stringify(newDay));
    //         setTotalForDay();
    //     }
    // }


    const updateTotalMacros = () => {
        setTotalCalories(totalCalories);
        setTotalFat(totalFat);
        setTotalCarbs(totalCarbs);
        setTotalProtein(totalProtein);
        setTotalWater(totalWater);
        setTotalCholesterol(totalCholesterol);
        setTotalSaturatedFat(totalSaturatedFat);
        setTotalTransFat(totalTransFat);
        setTotalSodium(totalSodium);
        setTotalFiber(totalFiber);
        setTotalSugars(totalSugars);
        setTotalCalcium(totalCalcium);
        setTotalIron(totalIron);
        setTotalPotassium(totalPotassium);
    };


    useFocusEffect(
        useCallback(() => {
            const fetchDayID = async () => {
                const dayData = await AsyncStorage.getItem(fullDayKey);
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

    const getUsername = () => {
        return (context?.userProfile.username);
    }
    return (
        <SafeAreaView style={[isDarkMode? styles.darkFlexContainer : styles.flexContainer]}>
            <View>
                
             {/* Navbar for Logged, Saved, Add */}

              <View style={styles.calendarNav}>
                    {/* <Ionicons 
                        name={"chevron-back-outline"} 
                        color={"white"}
                        size={24} 
                        style={styles.leftArrow}
                        // onPress={() => changeDayBackWard()}
                />
                     <Ionicons name={"calendar-clear-outline"} size={24} color={"white"}></Ionicons> */}
                    
                    <Text style={styles.whiteText}>Food Log</Text>
                    <Text style={styles.newDayButton} onPress={() => newDay()}>Start New Day</Text>
                    
                    {/* <Ionicons color="white" name="add-circle-outline"size={35} style={styles.plusButton} onPress={() => newDay()}></Ionicons> */}
                    {/* <Ionicons 
                        name={"chevron-forward-outline"} 
                        color={"white"}
                        size={24} 
                        style={styles.rightArrow}
                        // onPress={() => changeDayForward()}
                    />  */}
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
                <TouchableOpacity 
                        style={[
                            styles.trendButton, 
                            isPressed && { backgroundColor: "rgba(21, 160, 160, 1)" },{ opacity: 1 }
                        ]}
                        activeOpacity={1}  // Ensure the button does not become transparent when pressed
                        disabled={false}   // Ensure the button is enabled
                        onPress={() => navigation.navigate("NutritionTrendScreen")} // Navigate on press
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                        >
                         {/* Add an upward trend Icon 📈 */}
                        <Ionicons name="trending-up" size={24} color="white" style={{ marginTop: -9 }} />
                        {/* Wrap Text with View and adjust marginTop */}
                        <View style={{ marginTop: -1, alignItems: 'center' }}> 
                            <Text style={styles.trendButtonText}>Nutrition</Text>
                            <Text style={styles.trendButtonText}>Trend</Text>
                        </View> 
                    </TouchableOpacity>
                    
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
                        textColor= { isDarkMode? "white" : "black"}
                        borderColor= { isDarkMode? "white" : "black"}
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <View style={styles.plusMinus}>
                        <Ionicons name="add-circle-outline" size={30} style={[isDarkMode? styles.darkWaterButton : styles.waterButton]} onPress={() => addWater()}></Ionicons>
                        <Ionicons name="remove-circle-outline"size={30} style={[isDarkMode? styles.darkWaterButton : styles.waterButton]}  onPress={() => minusWater()}></Ionicons>
                    </View>
                </View>

                                {/* Add the new variables here */}
                <View style={styles.macroRow}>
                    <MacroButton
                        title="Cholesterol" 
                        label="mg"
                        total={totalCholesterol}
                        textColor="#FF5733"
                        borderColor="#FF5733"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Saturated Fat" 
                        label="g"
                        total={totalSaturatedFat}
                        textColor="#8E44AD"
                        borderColor="#8E44AD"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Trans Fat" 
                        label="g"
                        total={totalTransFat}
                        textColor="#D35400"
                        borderColor="#D35400"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                </View>
                <View style={styles.macroRow}>
                    <MacroButton
                        title="Sodium" 
                        label="mg"
                        total={totalSodium}
                        textColor="#1ABC9C"
                        borderColor="#1ABC9C"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Fiber" 
                        label="g"
                        total={totalFiber}
                        textColor="#2C3E50"
                        borderColor="#2C3E50"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Sugars" 
                        label="g"
                        total={totalSugars}
                        textColor="#F39C12"
                        borderColor="#F39C12"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                </View>
                <View style={styles.macroRow}>
                    <MacroButton
                        title="Calcium" 
                        label="mg"
                        total={totalCalcium}
                        textColor="#16A085"
                        borderColor="#16A085"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Iron" 
                        label="mg"
                        total={totalIron}
                        textColor="#E74C3C"
                        borderColor="#E74C3C"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Potassium" 
                        label="mg"
                        total={totalPotassium}
                        textColor="#2980B9"
                        borderColor="#2980B9"
                        borderWidth={5}
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                </View>
            </View> 
        
            <View style={styles.dataBar}>
                {/* <View style={styles.align}>
                    <Ionicons name="today-outline" size={30} onPress={() => addWater()}></Ionicons>
                    <Text style={styles.text}>Start new day log</Text>
                </View> */}
                <View style={[isDarkMode? styles.darkBox : styles.box, selectedPage === "Logged" && styles.selectedBox]}>
                    <Text 
                        style={[styles.text, selectedPage === "Logged" && styles.selectedText]} 
                        onPress={() => setSelectedPage("Logged")}
                    >
                        Logged
                    </Text>
                </View>
                <View style={[isDarkMode? styles.darkBox : styles.box, selectedPage === "Saved" && styles.selectedBox]}>
                    <Text 
                        style={[styles.text, selectedPage === "Saved" && styles.selectedText]} 
                        onPress={() => setSelectedPage("Saved")}
                    >
                        Saved
                    </Text>
                </View>
                <View style={[isDarkMode? styles.darkBox : styles.box, selectedPage === "Add" && styles.selectedBox]}>
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
        //backgroundColor: 'black',
    },
    darkFlexContainer: {
        flexGrow: 1, 
        backgroundColor: 'black',
    },
    pageContainer: {
        flex: 1, 
    },
    calendarNav: {
        height: 50,
        width: '100%', 
        backgroundColor: '#21BFBF',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
    },
    newDayButton: {
        // position: 'absolute',
        // right: 5,
        marginLeft: 10,
        padding: 10,
        color: '#21BFBF', 
        width: '35%',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        fontSize: 15,
        fontWeight: 'bold',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    whiteText: {
        // backgroundColor: 'white',
        padding: 5,
        color: "white",
        fontSize: 20, 
        paddingLeft: 5, 
        borderRadius: 5,
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
        marginTop: 10,
        height: 220,
        width: '100%',
        // backgroundColor: 'white', 
    }, 
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
        alignItems:"center",
        width: "90%",
        alignSelf: "center",    
    }, 
    dataBar: {
        width: '100%', 
        flexDirection: 'row',
        borderColor: '#21BFBF',
        borderTopWidth:2,
        borderBottomWidth:2,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'space-evenly',
    }, 
    selectedBox: {
        width: '35%',
        alignItems: 'center',
        backgroundColor:'#21BFBF',
        padding: 5, 
    },
    box: {
        width: '34%',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 5,
    },

    darkBox: {
        width: '34%',
        alignItems: 'center',
        backgroundColor: 'black',
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
        fontWeight: 'bold',
    },
    selectedText: {
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#21BFBF',
    },
    plusMinus: {
      paddingTop: 20,
      position: 'absolute',
      right: -12,
    }, 
    waterButton: {
      paddingBottom: 10,
      // color: 'white',
    }, 
    darkWaterButton: {
        paddingBottom: 10,
        color: 'white',
      }, 
    contentContainer: {
        flexGrow: 1,
    },
    startDayButton: {
        alignContent: 'center',
    },

    trendButton: {
        marginLeft: 1,  
        paddingVertical: 30,
        paddingHorizontal: 15,
        backgroundColor: "rgba(8, 228, 228, 0.4)", 
        borderWidth: 4, 
        borderColor: "rgba(33, 191, 191, 0.55)",
        elevation: 5,  // Android shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: 100,
        height:100,
        borderRadius: 50,
        marginTop:5,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10, 
    },
    
    trendButtonText: {
        color: "rgba(0, 51, 102, 1)", 
        fontSize: 14, 
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: "rgba(0, 0, 0, 0.1)", 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    }
})
