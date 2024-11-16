import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WorkoutScreenNavigationProp } from '../../(tabs)/WorkoutStack';

//https://ionic.io/ionicons
// used this for icons npm install react-native-vector-icons
// npm install --save-dev @types/react-native-vector-icons
// https://www.youtube.com/watch?v=ooEFRONfq_s just a good watch
// https://www.youtube.com/watch?v=q2s6VTHl2kE went off this video 
// https://reactnativeelements.com/docs/1.2.0/icon
 
 
export default function WorkoutApiScreen() { 
  
  const navigation = useNavigation<WorkoutScreenNavigationProp >();
  // TouchableOpacity is what gives the fade effect
  // view is calling the container that helps the layout
    
// makes button clickable 
  return (
    <View style={styles.container}>
      {/* My Workouts */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyWorkoutsScreen', { })}  > 
        {/* <Ionicons name="heart" size={35} color="#F2505D" /> */}
        <Image 
        style={styles.image}
          source={require('@/assets/images/my_workouts.png')}
        />
        <Text style={styles.buttonText}>My Workouts</Text>
      </TouchableOpacity>

      {/* Add Workout */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddWorkoutScreen', { })}  >
        <Image 
        style={styles.image}
          source={require('@/assets/images/dashboard-widgets-add.png')}
        />
        <Text style={styles.buttonText}>Add Workout</Text>
      </TouchableOpacity>
      
      {/* Ript Workouts */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ApiScreen', { })}  >
      <Image 
        style={styles.image}
        source={require('@/assets/images/secondary.png')}
        />
        <Text style={styles.buttonText}>Ript Workouts</Text>
      </TouchableOpacity>
      
      {/* My Notes */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyNotesScreen', { })} >
      <Image 
        style={styles.image}
        source={require('@/assets/images/my-notes.png')}
        />
        <Text style={styles.buttonText}>My Notes</Text>
      </TouchableOpacity>

      {/* Start Workout */}
      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('StartWorkoutScreen', { })} >
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

// talk to team about adujust position to look more/less like figma
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 50,
    paddingTop: 30,
    backgroundColor: '#FFFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center'
  },

  // add a button for ript fitness influencer links
  button: {
    width: '45%',
    height: 150,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 25,
    // backgroundColor: '#F5F5F5',
    backgroundColor: '#2493BF',
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#46B5E1',
    //'#000000', this is black border check with team
  },
  startButton: {
    width: '90%',
    height: '7%',
    backgroundColor: '#5CC4BD',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    // justifyContent: 'center'
  },
  // can add more button colors if needed for each button 
  // overall I like the UI tho
  buttonText: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFF',
  },
  image: {
    width: 75,
    height: 75,

  }
});
