
import { TextInput, StyleSheet, ScrollView, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions, Button, Alert  } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import AddFoodButton from "@/components/foodlog/AddFoodButton";
import { httpRequests } from "@/api/httpRequests";
import { GlobalContext } from "@/context/GlobalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//Need to figure out how to get the day to work on login and then not switch until the next day 


const FoodLogAddPage = () => {
// export default async function FoodLogAddPage() {
    const [foodName, setFoodName] = useState('');
    const [foodCalories, setCalories] = useState('');
    const [foodFat, setFat] = useState('');
    const [foodCarbs, setCarbs] = useState('');
    const [foodProtein, setProtein] = useState('');
    const [foodServings, setServings] = useState('');
    const [foodCholesterol, setCholesterol] = useState('');
    const [foodSaturatedFat, setSaturatedFat] = useState('');
    const [foodTransFat, setTransFat] = useState('');
    const [foodSodium, setSodium] = useState('');
    const [foodFiber, setFiber] = useState('');
    const [foodSugars, setSugars] = useState('');
    const [foodCalcium, setCalcium] = useState('');
    const [foodIron, setIron] = useState('');
    const [foodPotassium, setPotassium] = useState('');

    const [totalCalories, setTotalCalories] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [totalCholesterol, setTotalCholesterol] = useState(0);
    const [totalSaturatedFat, setTotalSaturatedFat] = useState(0);
    const [totalTransFat, setTotalTransFat] = useState(0);
    const [totalSodium, setTotalSodium] = useState(0);
    const [totalFiber, setTotalFiber] = useState(0);
    const [totalSugars, setTotalSugars] = useState(0);
    const [totalCalcium, setTotalCalcium] = useState(0);
    const [totalIron, setTotalIron] = useState(0);
    const [totalPotassium, setTotalPotassium] = useState(0);

    const [day, setDay] = useState();
    const context = useContext(GlobalContext);
    const isDarkMode = context?.isDarkMode;


     // Prefix all keys with user ID (assuming it's stored in context)
     const userID = context?.data.token; 
     if (!userID) throw new Error("User ID not found");

     const foodTodayKey = `${userID}_foodTodayDetails`;
     const foodKey = `${userID}_foodDetails`;
     const dayKey = `${userID}_day`;




    const setTotalForDay = async () => {
        console.log("the day is: ", day);
        const thisDay = await AsyncStorage.getItem(dayKey);
        if (thisDay) {
            setDay(JSON.parse(thisDay));
        } else {
            console.log("Error setting day: ", thisDay);
        }

        try {
            console.log("day", day);
            const getDayResponse = await fetch (`${httpRequests.getBaseURL()}/nutritionCalculator/getDayOfLoggedInUser/0`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                }
            }); 
            console.log(getDayResponse.status);

            if (getDayResponse.status == 200) {
                const dayData = await getDayResponse.json(); 
                console.log(dayData);
                setTotalCalories(dayData.calories); 
                setTotalCarbs(dayData.totalCarbs);
                setTotalProtein(dayData.totalProtein);
                setTotalFat(dayData.totalFat);
                // updateMacros(dayData.calories, dayData.totalFat, dayData.totalCarbs, dayData.totalProtein);
                setTotalCholesterol(dayData.totalCholesterol);
                setTotalSaturatedFat(dayData.totalSaturatedFat);
                setTotalTransFat(dayData.totalTransFat);
                setTotalSodium(dayData.totalSodium);
                setTotalFiber(dayData.totalFiber);
                setTotalSugars(dayData.totalSugars);
                setTotalCalcium(dayData.totalCalcium);
                setTotalIron(dayData.totalIron);
                setTotalPotassium(dayData.totalPotassium);

            } else {
                console.log('Failed to get day');
                return; 
            }
        } catch (error) {
            console.log('Error', 'An error occurred. Please try again.');
        }
    }

    //This is in case we want to ensure food names are unique... i think this is a feature we decided against for now. 

    // const doesFoodExist = async (foodName: string) => {
    //     try {
    //         const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getFoodsOfLoggedInUser/0/200`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${context?.data.token}`,
    //             }
    //         });
    
    //         if (response.status === 200) {
    //             const foods = await response.json(); // Assume this returns an array of food objects
    
    //             // Check if any food's name matches the input foodName
    //             return foods.some((food: any) => food.name && food.name.toLowerCase() === foodName.toLowerCase());
    //         } else {
    //             console.log('Error fetching foods');
    //             return false;
    //         }
    //     } catch (error) {
    //         console.log('Error', 'An error occurred while checking for duplicate food.');
    //         return false;
    //     }
    // };
    
    const handleFoodDataSaveOnly = async () => {
        // Check if food with the same name exists
        // const foodExists = await doesFoodExist(foodName);
        // if (foodExists) {
        //     Alert.alert("Error", "A food with this name already exists. Please use a different name.");
        // return;
        // }
        const foodData = {
            name: foodName, 
            calories: foodCalories, 
            protein: foodProtein,
            carbs: foodCarbs,  
            fat: foodFat, 
            cholestreol: foodCholesterol,
            saturatedfat: foodSaturatedFat,
            transfat: foodTransFat,
            sodium: foodSodium,
            fiber: foodFiber,
            sugar: foodSugars,
            calcium: foodCalcium,
            iron: foodIron,
            potassium: foodPotassium,
            serving: foodServings, 
            isDeleted: false, 
        };
        
        try {
            const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/addFood`, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.data.token}`,
                  },
                  body: JSON.stringify(foodData),
            }, 
            );
            if (response.status === 201) {
                Alert.alert("Success", 'Food data saved successfully!');
              } else {
                Alert.alert("Error", 'Failed to save food data');
              }
        } catch (error) {
              console.log('Error', 'An error occurred. Please try again.');
        }
    };


    const handleFoodDataSaveAddDay = async () => {
    //     const foodExists = await doesFoodExist(foodName);
    //     if (foodExists) {
    //         Alert.alert("Error", "A food with this name already exists. Please use a different name.");
    //     return;
    // }
        const foodData = {
            name: foodName, 
            calories: foodCalories, 
            protein: foodProtein,
            carbs: foodCarbs,  
            fat: foodFat, 
            cholestreol: foodCholesterol,
            saturatedfat: foodSaturatedFat,
            transfat: foodTransFat,
            sodium: foodSodium,
            fiber: foodFiber,
            sugar: foodSugars,
            calcium: foodCalcium,
            iron: foodIron,
            potassium: foodPotassium,
            serving: foodServings, 
            isDeleted: false, 
        };

        console.log("the day is: ", day);
        const thisDay = await AsyncStorage.getItem(dayKey);
        if (thisDay) {
            setDay(JSON.parse(thisDay));
        } else {
            console.log("Error setting day: ", thisDay);
        }

        // first add food to the database
        try {
            console.log("day in foodadd: ", day);
            const foodResponse = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/addFood`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context?.data.token}`,
                },
                body: JSON.stringify(foodData),
            },
            );
            console.log("foodResponseAdd status: ", foodResponse.status);
            console.log("day id: ", day);

            if (foodResponse.status === 201) {
                const foodData = await foodResponse.json();
                const foodID = foodData.id;
                console.log("day in foodlog add: ", day);
                
                const addResponse = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/addFoodsToDay/${day}`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${context?.data.token}`,
                    }, 
                    body: JSON.stringify([foodID]),
                });
                console.log("add to day response status", addResponse.status);
                if (addResponse.status === 201) {
                    console.log('Success', 'Food data added to day successfully!');
                    setTotalForDay();
                    clearInputFields();
                } else {
                    console.log('Error', 'Failed to save food data to day.');
                }
                // console.log('Success', 'Food data saved successfully!');
                Alert.alert("Success", 'Food data saved successfully!');
            } else {    
                // console.log('Error', 'Failed to save food data.');
                Alert.alert("Error", 'Failed to save food data');
            }
        } catch {
            console.log('Error', 'An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        const fetchDayID = async () => {
            const dayID = await AsyncStorage.getItem(dayKey);
            console.log(dayID); // Should print the stored ID
            if(dayID) {
                setDay(JSON.parse(dayID));
            } else {
                console.log("dayID is null");
            }
        };
        fetchDayID();
    }, []);
        
    // Helper function to clear input fields
    const clearInputFields = () => {
        setFoodName('');
        setCalories('');
        setFat('');
        setCarbs('');
        setProtein('');
        setCholesterol('');
        setSaturatedFat('');
        setTransFat('');
        setSodium('');
        setFiber('');
        setSugars('');
        setCalcium('');
        setIron('');
        setPotassium('');

    };


    //Section for validating inputs 
    const [validCals, setValidCals] = useState(true);
    const [validFat, setValidFat] = useState(true);
    const [validCarbs, setValidCarbs] = useState(true);
    const [validProtein, setValidProtein] = useState(true);
    const [validServings, setValidServings] = useState(true);
    const [validCholesterol, setValidCholesterol] = useState(true);
    const [validSaturatedFat, setValidSaturatedFat] = useState(true);
    const [validTransFat, setValidTransFat] = useState(true);
    const [validSodium, setValidSodium] = useState(true);
    const [validFiber, setValidFiber] = useState(true);
    const [validSugars, setValidSugars] = useState(true);
    const [validCalcium, setValidCalcium] = useState(true);
    const [validIron, setValidIron] = useState(true);
    const [validPotassium, setValidPotassium] = useState(true);
    const [validName, setValidName] = useState(true);

    const handleFoodNameChange = (text: string) => {
        setFoodName(text);
        setValidName(text.trim().length > 0);
    }

    const handleCaloriesChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setCalories(text);
            setValidCals(true);
        } else {
            setCalories('');
            setValidCals(false);
        }
    };
    
    const handleFatChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setFat(text);
            setValidFat(true);
        } else {
            setFat('');
            setValidFat(false);
        }
    };
    
    const handleCarbsChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setCarbs(text);
            setValidCarbs(true);
        } else {
            setCarbs('');
            setValidCarbs(false);
        }
    };
    
    const handleProteinChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setProtein(text);
            setValidProtein(true);
        } else {
            setProtein('');
            setValidProtein(false);
        }
    };
    
    const handleServingsChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0) && text.trim().length > 0) {
            setServings(text);
            setValidServings(true);
        } else {
            setServings('');
            setValidServings(false);
        }
    };

    const handleCholesterolChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setCholesterol(text);
            setValidCholesterol(true);
        } else {
            setCholesterol('');
            setValidCholesterol(false);
        }
    };
    
    const handleSaturatedFatChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setSaturatedFat(text);
            setValidSaturatedFat(true);
        } else {
            setSaturatedFat('');
            setValidSaturatedFat(false);
        }
    };
    
    const handleTransFatChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setTransFat(text);
            setValidTransFat(true);
        } else {
            setTransFat('');
            setValidTransFat(false);
        }
    };
    
    const handleSodiumChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setSodium(text);
            setValidSodium(true);
        } else {
            setSodium('');
            setValidSodium(false);
        }
    };
    
    const handleFiberChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setFiber(text);
            setValidFiber(true);
        } else {
            setFiber('');
            setValidFiber(false);
        }
    };
    
    const handleSugarsChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setSugars(text);
            setValidSugars(true);
        } else {
            setSugars('');
            setValidSugars(false);
        }
    };
    
    const handleCalciumChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setCalcium(text);
            setValidCalcium(true);
        } else {
            setCalcium('');
            setValidCalcium(false);
        }
    };
    
    const handleIronChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setIron(text);
            setValidIron(true);
        } else {
            setIron('');
            setValidIron(false);
        }
    };
    
    const handlePotassiumChange = (text: string) => {
        if ((/^\d*\.?\d*$/.test(text) && parseFloat(text) >= 0)) {
            setPotassium(text);
            setValidPotassium(true);
        } else {
            setPotassium('');
            setValidPotassium(false);
        }
    };
    

    const validateAllFields = () => {
        const isNameValid = foodName.trim().length > 0;
    //     const isCalsValid = /^\d*\.?\d*$/.test(foodCalories) && parseFloat(foodCalories) >= 0;
    //     const isFatValid = /^\d*\.?\d*$/.test(foodFat) && parseFloat(foodFat) >= 0;
    //     const isCarbsValid = /^\d*\.?\d*$/.test(foodCarbs) && parseFloat(foodCarbs) >= 0;
    //     const isProteinValid = /^\d*\.?\d*$/.test(foodProtein) && parseFloat(foodProtein) >= 0;
    //     const isServingsValid = /^\d*\.?\d*$/.test(foodServings) && parseFloat(foodServings) >= 0;

        setValidName(isNameValid);
    //     setValidCals(isCalsValid);
    //     setValidFat(isFatValid);
    //     setValidCarbs(isCarbsValid);
    //     setValidProtein(isProteinValid);
    //     setValidServings(isServingsValid);
        
    //     return (
    //         validName &&
    //         validCals &&
    //         validFat &&
    //         validCarbs &&
    //         validProtein &&
    //         validServings
    //     );
        return (validName);
    };

    const handleBlur = (field: string, value: string) => {
        if (field == 'foodName') {
            setValidName(value.trim().length > 0);
        }
        // switch (field) {
        //     case 'foodName':
        //         setValidName(value.trim().length > 0);
        //         break;
        //     case 'calories':
        //         setValidCals(/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0);
        //         break;
        //     case 'fat':
        //         setValidFat(/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0);
        //         break;
        //     case 'carbs':
        //         setValidCarbs(/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0);
        //         break;
        //     case 'protein':
        //         setValidProtein(/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0);
        //         break;
        //     case 'servings':
        //         setValidServings(/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0);
        //         break;
        //     default:
        //         break;
        // }
    };

    return(

        <KeyboardAwareScrollView 
            style={{ flex: 1, backgroundColor: '#fff' }}
            //behavior={Platform.OS === "ios" ? "padding" : "height"} , justifyContent: 'space-between'
            //keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust this value based on your header height
        > 
            <ScrollView 
                style={{maxHeight: '100%', marginTop: 10, marginHorizontal: 5, marginBottom: 0, backgroundColor: '#fff'}} 
                contentContainerStyle={{  }}
            >
                    <Text style={styles.label}>Nutrition Facts</Text>
                    <Text style={styles.description}>Enter the details from the label</Text>

                {/* Input fields */}
                <View style = {styles.rowStart}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={!validName ? "Food name required" : "Add Name"}
                        placeholderTextColor={!validName ? 'red' : '#999'}
                        value={foodName}
                        onChangeText={handleFoodNameChange}
                        onBlur={() => handleBlur('foodName', foodName)}
                    />
                </View>

                <View style = {styles.row}>
                    <Text style={styles.inputLabel}>Calories</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodCalories}
                        onChangeText={handleCaloriesChange}
                        placeholder={"Add Calories"}
                        placeholderTextColor={'#999'}
                        // onBlur={() => handleBlur('calories', foodCalories)}
                    />
                </View>

                <View style = {styles.row}>
                    <Text style={styles.inputLabel}>Fat (g)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodFat}
                        onChangeText={handleFatChange}
                        placeholder={"Add Grams"}
                        placeholderTextColor={'#999'}
                        // onBlur={() => handleBlur('fat', foodFat)}
                    />
                </View>

                <View style = {styles.row}>
                    <Text style={styles.inputLabel}>Carbs (g)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodCarbs}
                        onChangeText={handleCarbsChange}
                        placeholder={"Add Grams"}
                        placeholderTextColor={'#999'}
                        // onBlur={() => handleBlur('carbs', foodCarbs)}
                    />
                </View>

                <View style = {styles.row}>
                    <Text style={styles.inputLabel}>Protein (g)</Text>
                    <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={foodProtein}
                    onChangeText={handleProteinChange}
                    placeholder={"Add Grams"}
                    placeholderTextColor={'#999'}
                    //    onBlur={() => handleBlur('protein', foodProtein)}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Cholesterol (mg)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodCholesterol}
                        onChangeText={handleCholesterolChange}
                        placeholder={"Add Cholesterol"}
                        placeholderTextColor={'#999'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Saturated Fat (g)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodSaturatedFat}
                        onChangeText={handleSaturatedFatChange}
                        placeholder={"Add Saturated Fat"}
                        placeholderTextColor={'#999'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Trans Fat (g)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodTransFat}
                        onChangeText={handleTransFatChange}
                        placeholder={"Add Trans Fat"}
                        placeholderTextColor={'#999'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Sodium (mg)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={sodium}
                        onChangeText={handleSodiumChange}
                        placeholder={"Add Sodium"}
                        placeholderTextColor={'#999'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Fiber (g)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodFiber}
                        onChangeText={handleFiberChange}
                        placeholder={"Add Fiber"}
                        placeholderTextColor={'#999'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Sugars (g)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodSugars}
                        onChangeText={handleSugarsChange}
                        placeholder={"Add Sugars"}
                        placeholderTextColor={'#999'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Calcium (mg)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodCalcium}
                        onChangeText={handleCalciumChange}
                        placeholder={"Add Calcium"}
                        placeholderTextColor={'#999'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Iron (mg)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodIron}
                        onChangeText={handleIronChange}
                        placeholder={"Add Iron"}
                        placeholderTextColor={'#999'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.inputLabel}>Potassium (mg)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodPotassium}
                        onChangeText={handlePotassiumChange}
                        placeholder={"Add Potassium"}
                        placeholderTextColor={'#999'}
                    />
                </View>


                <View style = {styles.row}>
                    <Text style={styles.inputLabel}>Servings:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={foodServings}
                        onChangeText={handleServingsChange}
                        placeholder={"Add Servings"}
                        placeholderTextColor={'#999'}
                        // onBlur={() => handleBlur('servings', foodServings)}
                    />
                </View>
                
            </ScrollView>
            {/* Save button */}
            <View style={styles.buttonRow}>
                    <AddFoodButton   
                            title="Save Food" 
                            textColor="white"
                            backgroundColor="#21BFBF"
                            borderColor="#21BFBF"
                            borderWidth={0}
                            fontSize={16}
                            width={150}
                            onPress={() => {
                                if ((validateAllFields())) {
                                    handleFoodDataSaveOnly();
                                } else {
                                    alert("A food name is required.");
                                }
                            }} 
                    />
                    <AddFoodButton   
                            title="Log Food Today" 
                            textColor="#21BFBF"
                            backgroundColor="white"
                            borderColor="#21BFBF"
                            borderWidth={2}
                            fontSize={16}
                            width={150}
                            onPress={() => {
                                if (validateAllFields()) {
                                    handleFoodDataSaveAddDay();
                                } else {
                                    alert("A food name is required.");
                                }
                            }} 
                    />
                </View>
        </KeyboardAwareScrollView>
    );
};
const styles = StyleSheet.create({
    addFoodContainer: { 
        paddingBottom: 29,
        padding: 5,
        // width:"100%",
        // height: '100%',
        backgroundColor: 'white',
      },
      label: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      description: {
        fontSize: 15,
      },
      input: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'white',
        padding: 5,
        marginVertical: 2,
        // borderRadius: 2,
        textAlign: 'right',
        // backgroundColor:'red'
      },
    //   inputInvalid: {
    //     borderColor: 'red',
    // },
      inputLabel: {
        marginLeft: 20,
        fontSize: 16,
        marginRight: 10, // Space between the label and input
        width: '30%', // Adjust width based on your layout needs
      },
      rowStart: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Vertically center the text and input
        marginTop: 10, 
        padding: 7,
        gap: 20,
        borderTopColor: 'black', 
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        width: '90%',
        alignSelf: 'center',
      },
      row: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Vertically center the text and input
        padding: 7, 
        gap: 20,
        // borderTopColor: 'white', 
        borderBottomColor: 'black',
        borderBottomWidth: 1, 
        width: '90%',
        alignSelf: 'center',
      }, 
      buttonRow: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Vertically center the text and input
        justifyContent: 'center',
        marginVertical: 5,
      }
})

export default FoodLogAddPage;