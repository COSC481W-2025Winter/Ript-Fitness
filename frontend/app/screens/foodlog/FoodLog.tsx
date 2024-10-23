
import { TextInput, StyleSheet, ScrollView, Text, View } from "react-native";
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import MacroButton from "@/components/foodlog/MacroButton";
import FoodLogAddFrom from "@/app/screens/foodlog/FoodLogAdd";

export default function FoodLogScreen() {
    // const calendarBar = (
    //     <View style = {styles.calendarNav}>
    //         <Ionicons name={"chevron-back-outline"} size={24} style={styles.leftArrow}></Ionicons>
    //         <Ionicons name={"calendar-clear-outline"} size={24}></Ionicons>
    //         {/* This will be "today" when it is the current date, if not it will display the date of the data they are viewing*/}
    //         <Text>Today</Text>
    //         <Ionicons name={"chevron-forward-outline"} size={24} style={styles.rightArrow}></Ionicons>
    //     </View>
    // );
    
    const navigation = useNavigation();


    return(
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
                        backgroundColor="#0E598D"
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Protein" 
                        backgroundColor="#F2846C"
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Carbs" 
                        backgroundColor="#088C7F"
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                </View>
                <View style={styles.macroRow}>
                    <MacroButton
                        title="Fat" 
                        backgroundColor="#AC2641"
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                    <MacroButton
                        title="Water" 
                        backgroundColor="black"
                        fontSize={16}
                        width={100} 
                    ></MacroButton>
                </View>
            </View> 
            <View style={styles.dataBar}>
                <Text style={styles.text}
                    onPress={()  => navigation.navigate('ApiScreen')}>Logged</Text>
                <Text style={styles.text}
                    onPress={()  => navigation.navigate('ApiScreen')}>Saved</Text>
                <Text style={styles.textAdd}
                    onPress={()  => navigation.navigate('ApiScreen')}>Add</Text>
            </View>
        <FoodLogAddFrom></FoodLogAddFrom>
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
        height: 200,
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