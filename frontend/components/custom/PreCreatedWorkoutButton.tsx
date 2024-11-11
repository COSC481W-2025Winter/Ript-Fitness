import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SocialScreenNavigationProp } from '@/app/(tabs)/SocialStack';


const PreCreatedWorkoutButton: React.FC = () => {
    const navigation = useNavigation<SocialScreenNavigationProp >();

    const buttonTitles = ['Push Day 1', 'Pull Day 1', 'Back/bis', 'Legs: Glutes/Ham', 'Push (Summer)', 'Pull (Summer)', 'Legs (Summer)', 'Upper Body', 'Push Day 2', 'Pull Day 2'];
    return (
        <View style={styles.container}>
            {buttonTitles.map((title, index) => (
                <TouchableOpacity 
                    key={index}
                    //title={title}
                    //lastCompleted={"10/07/2024"}
                    onPress={() => navigation.navigate('SocialFeed')}
                    style={styles.button}>
                    <View>
                        <Text
                            style={styles.text}
                            numberOfLines={2}
                            ellipsizeMode='tail'>
                        {title}
                        </Text>

                        <View style={styles.textWrapper}>
                            <Text style={styles.dateText}>last completed: 10/07/2024</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

        </View>
    )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexWrap: 'wrap',
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 15,
        width: width,
    },
    button: {
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        backgroundColor: 'white', 
        padding: 5, 
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
    // container: {
    //     flexDirection: 'row', 
    //     flexWrap: 'wrap',
    //     justifyContent: 'center', 
    //     gap: 30,
    // },
    // button: {
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     justifyContent: 'center',
    //     backgroundColor: 'grey', 
    //     padding: 5, 
    //     borderRadius: 10,
    //     width: '40%',
    //     height: 120,
    //     position: 'relative',
    // }, 
    // buttonContent: {
    //     flexDirection: 'column', 
    //     position: 'relative',
    // },
    // text: {
    //     textAlign: 'left',
    //     color: 'black',
    //     fontSize: 15,
    //     padding: 20,
    //     position: 'absolute',
    //     top: -5, 
    // },
    // textWrapper: {
    //     position: 'absolute',
    //     bottom: 6, 
    //     right: 0, 
    //     left: 0,
    //     height: '25%', 
    //     alignItems: 'center',
    //     backgroundColor: 'black', 
    //     padding: 10, 
    //     borderRadius: 10, 
    // }, 
    // dateText: {
    //     position: 'relative',
    //     color: 'white', 
    //     fontSize: 7, 
    //     textAlign: 'left',
    // },
})

export default PreCreatedWorkoutButton;