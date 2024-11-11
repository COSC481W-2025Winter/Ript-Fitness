import React, { useState } from 'react';
import { Dimensions, TouchableOpacity, View, type ViewProps, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';

export type SavedWorkoutButtonProps = ViewProps & {
    key: any;
    title: string;
    level: string; 
    time: number; 
    // exercises: [{
    //     exercise: string;
    //     sets: number;
    //     reps: number;
    // }];
    children?: React.ReactNode;
    darkColor?: string;
    id?: string;
    onLongPress?: any;
    onPress?: any;
    isActive?: any
    style?: any
};


export function SavedWorkoutButton({title, level, time, children, id, onLongPress, onPress, isActive, style, ...otherProps }: SavedWorkoutButtonProps) {
  
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                style={styles.button}
            >  
                <ThemedText style={styles.text}>{title}</ThemedText>

                <View style={styles.textWrapper}>
                    <ThemedText style={styles.dateText}>{level}: {time} min</ThemedText>
                </View>
            </TouchableOpacity>
        </View>
    )
}
  const { width, height } = Dimensions.get('window');
  const titleSize = width * 0.06;
  const descSize = width * 0.04;

  const styles = StyleSheet.create({ 
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        gap: 15,
        width: width,
    },
    button: {
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        backgroundColor: 'white', 
        padding: 5, 
        margin: 5,
        borderRadius: 20,
        borderColor: 'grey',
        borderWidth: 1, 
        width: width/2-20,
        height: 120,
        alignContent: 'center',
    }, 
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        padding: 20,
        position: 'absolute',
        top: -5, 
    },
    textWrapper: {
        alignItems: 'center',
        backgroundColor: '#2493BF',
        padding: 10, 
        borderRadius: 40, 
        width: '80%',
    }, 
    dateText: {
        color: 'black', 
        fontSize: 10, 
    },
  });
  

