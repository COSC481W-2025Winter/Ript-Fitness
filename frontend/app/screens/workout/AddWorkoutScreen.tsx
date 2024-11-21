import { Image, StyleSheet, Platform, TouchableOpacity, View, FlatList, ScrollView, Dimensions, Modal, Text, KeyboardAvoidingView } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { httpRequests } from '@/api/httpRequests'
import { useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView, Swipeable, TextInput } from 'react-native-gesture-handler';
import { BodyContext } from '@/context/BodyContext';
import { ExerciseButton } from '@/components/custom/ExerciseButton';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutScreenNavigationProp } from '@/app/(tabs)/WorkoutStack';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { isAndroid } from 'react-native-draggable-flatlist/lib/typescript/constants';
import * as Haptics from 'expo-haptics';
import React from 'react';
import CustomChip from '@/components/custom/CustomChip';
import { WorkoutContext } from '@/context/WorkoutContext';

type Exercise = {
  sets: number;
  reps: number[];
  nameOfExercise: string;
  weight: number[]; // Assuming weight is a number array
  typeOfExercise: number;
};

export function AddWorkoutScreen() {
  //Manage the add exercise modal visibility

  const context = useContext(WorkoutContext)

  const navigation = useNavigation<WorkoutScreenNavigationProp >();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [typeOfExercise, setTypeOfExercise] = useState<number | null>(null);
  const [sets, setSets] = useState<{ setNumber: number; reps: string}[]>([{ setNumber: 1, reps: ''}]);


  const handleAddSet = () => {
    setSets((prevSets) => [
      ...prevSets,
      {setNumber: prevSets.length + 1, reps: ''},
    ]);
  };
  const handleRepChange = (index: number, value: string) => {
    setSets((prevSets) =>
      prevSets.map((set, i) =>
        i ===index ? {...set, reps: value} : set
      )
    );
  };

  const removeWorkout = (id : any) => {
  const updatedWorkouts = workouts.filter(workout => workout.id !== id);
  setWorkouts(updatedWorkouts);
  }

  //make modal appear to edit added workout
  const editWorkout = (id : any) => {
  console.log('Opening modal for workout:', id);
  //Open Modal when pencil icon is pressed
  //setAddModalVisible(true);
  context?.setVisible(true);
  }

  //submit button will send users to My Workout page
  const submitWorkout = () => {
  
  }

  //Modal
  const modalComponent = (
    <Modal
      transparent={true}
      visible={context?.modalObject.isVisible}
      animationType='slide'
      onRequestClose={() => context?.setVisible(false)/*setAddModalVisible(false)*/}
    >
      <View style={styles.modalOverlay}>

        <KeyboardAvoidingView
          style={styles.modalContentContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}  
        >

          <View style={styles.modalContent}>
            {/* Title and close modal icon */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput style={{fontSize: 18, fontWeight: '500', }}
                placeholder='Exercise Name'
                placeholderTextColor={'#B6B6B6'}
                maxLength={20}
                autoFocus={true}
                autoCapitalize='words'
                onChangeText={setExerciseName}
              />
              {/* Close/ x button */}
              <TouchableOpacity 
                onPress={() => {
                  context?.setVisible(false)
                  //setAddModalVisible(false);
                  setSets([{ setNumber: 1, reps: '' }]);
                  setExerciseName('');
                  setTypeOfExercise(null);
                  }}
                >
                <Ionicons name='close-circle-outline' size={30} color={'#747474'} />
              </TouchableOpacity>
            </View>
            {/* Upper, Lower, or Rec type - 1, 2, 3 */}
            <CustomChip 
              onTypeSelect={(type) => setTypeOfExercise(type)}
            />
            {/* Each set with rep for the exercise */}
            <ScrollView style={{ maxHeight: 125 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, width: '90%', alignSelf: 'center' }}>
                <Text style={styles.modalLabels}>Set</Text>
                <Text style={styles.modalLabels}>Reps</Text>
              </View>
              {sets.map((set, index) => (
                <View 
                  key={index} 
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    marginBottom: 10, 
                    width: '90%', 
                    alignSelf: 'center' 
                  }}
                >
                  <Text style={{ fontSize: 16, marginLeft: 10 }}>{set.setNumber}</Text>
                  <TextInput 
                    style={styles.repInput}
                    maxLength={3}
                    keyboardType='numeric'
                    value={set.reps}
                    onChangeText={(value) => handleRepChange(index, value)}
                  />
                </View>
              ))}
            </ScrollView>
            
            {/* Buttons for add set or save exercise */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton1} onPress={handleAddSet}>
                <Text style={{ color: '#21BFBF', fontSize: 15 }}>Add Set</Text>
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity 
                style={styles.modalButton2} 
                onPress={() => {
                  // User has to enter exercise name and choose the type
                  if (!exerciseName || typeOfExercise === null) {
                    alert("Exercise name and exercise type are required fields.");
                    return;
                  }        
                  const repNumbers = sets.map((set) => Number(set.reps));

                  const newExercise = {
                    sets: sets.length,
                    reps: repNumbers,
                    nameOfExercise: exerciseName,
                    weight: [],
                    typeOfExercise: typeOfExercise!, // Pass the integer value
                  };
                  console.log('New Exercise:', newExercise);

                  // Update the exercises state with the new exercise
                  setExercises((prev) => {
                    const updatedExercises = [...prev, newExercise];
                    console.log('Updated Exercises:', updatedExercises);  // Log updated exercises array
                    return updatedExercises;
                  });

                  //reset fields
                  setExercises((prev) => [...prev, newExercise]);
                  context?.setVisible(false)
                  //setAddModalVisible(false);
                  setExerciseName('');
                  setSets([{ setNumber: 1, reps: '' }]);
                  setTypeOfExercise(null);
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
  const viewWorkoutDetails = (id : any) => {
    navigation.navigate("ApiScreen", {})
  }

  const data = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
    // Add more items here
  ];

  const sideButtons = [
    {id: '1', icon: 'pencil', func: editWorkout },
    {id: '2', icon: 'arrow-up', func: viewWorkoutDetails, style: styles.viewButton },
  ];

  //Instead of Sets, display
  //Sets last time, Reps for time, weight last time
  const [workouts, setWorkouts ]= useState([
    { id: '1', name: 'Push-Ups', description: "5 Sets", values: ["10", "9", "8", "8", "9"], valueTypes: "Reps", color: "#21BFBF" },
    { id: '2', name: 'Squats', description: "4 Sets", values: ["15", "14", "13", "12"], valueTypes: "Reps", color: "#2493BF" },
    { id: '3', name: 'Lunges', description: "3 Sets", values: ["12", "10", "11"], valueTypes: "Reps", color: "#2493BF" },
    
    { id: '4', name: 'Bicep Curls', description: "5 Sets", values: ["10", "10", "9", "8", "10"], valueTypes: "Reps", color: "#21BFBF" },
    { id: '5', name: 'Plank Hold', description: "3 Sets", values: ["60", "45", "50"], valueTypes: "sec", color: "#ECC275" },
    { id: '6', name: 'Mountain Climbers', description: "4 Sets", values: ["30", "25", "28", "30"], valueTypes: "Reps", color: "#ECC275" },
    
    { id: '7', name: 'Burpees', description: "3 Sets", values: ["12", "10", "12"], valueTypes: "Reps", color: "#ECC275" },
    { id: '8', name: 'Tricep Dips', description: "4 Sets", values: ["15", "14", "13", "15"], valueTypes: "Reps", color: "#21BFBF" },
    { id: '9', name: 'Russian Twists', description: "5 Sets", values: ["20", "18", "20", "19", "18"], valueTypes: "Reps", color: "#ECC275" },
    { id: '10', name: 'Jumping Jacks', description: "3 Sets", values: ["25", "30", "28"], valueTypes: "Reps", color: "#ECC275" }
  ]);
  

  const renderLeftActions = (id: string, maxTheWidth: any) => {
    //console.log(maxTheWidth? "true" : "false")
    return (
      <View style={[styles.swipeContainer, maxTheWidth ? styles.maxWidth : undefined]}>

        <View style={styles.swipeButtonContainer}>
            <ThemedText style={styles.deleteText}>Delete</ThemedText>
        </View>
      </View>
    );
  };
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleLongPress = (id: string, drag: any) => {
    // Trigger your renderCover logic here
    //console.log("f2")
    //renderCover(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsOverlayVisible(true);
    // Then trigger the drag functionality
    drag();
  };

  const [swipeActive, setSwipeActive] = useState(false);


  const handleSwipeableClose = (drag: any) => {
    setSwipeActive(false);
    setIsOverlayVisible(false); // Hide overlay when swipeable closes
  };

  const handlePressOut = (isActive: any) => {
    if (!isActive)
    setIsOverlayVisible(false);
  }

  const [maxWidth, setMaxWidth] = useState(false)
/*
  const testGet = async () => {
    const exampleJson =  //create a json object using the variables set in our textboxes
      {
        "username": "nhalash",
        "password": "password123"
    };
    //make a post request
    const response = await httpRequests.get("/getTestObject", exampleJson)
    console.log(JSON.stringify(response))
  }
*/
  const renderItem = ({ item, drag, isActive }: RenderItemParams<typeof workouts[0]>) => (
    <Swipeable 
    renderLeftActions={() => renderLeftActions(item.id, maxWidth)}

    onSwipeableWillOpen={() => setMaxWidth(true)}     // Swipe started, prevent drag
    onSwipeableWillClose={() => setMaxWidth(false)}



    onSwipeableClose={() => handleSwipeableClose(drag)}       // Swipe ended, allow drag again
    onSwipeableOpen={() => removeWorkout(item.id)}
    containerStyle={styles.test}
    enabled={(!isActive && !isOverlayVisible)}
  >
    <View style={styles.exerciseButtonContainer}>


    {isActive && isOverlayVisible && (
        <View style={styles.dragOverlay}>
          
        </View>
      )}
    <ExerciseButton
      onLongPress={() => handleLongPress(item.id, drag)}
      onPressOut={() => handlePressOut(isActive)}
      id={item.id}
      leftColor={item.color}
      descColor={item.color}
      title={item.name}
      desc={item.description}
      //onLongPress={drag}  // Enable dragging when long-pressed
      isActive={isActive}
      style={styles.myWidth}
      sideButtons={sideButtons}
    >

      
      {item.values.map((value : any, index : any) => (
        <View key={index} style={styles.rowItem}>
          <ThemedText style={styles.floatLeft}>{value}</ThemedText>
          <ThemedText style={styles.floatRight}>{item.valueTypes}</ThemedText>
        </View>
      ))}
    </ExerciseButton>
    </View>
    </Swipeable>
  );

  const [lastDragIndex, setLastDraggedIndex] = useState(null)

  const onDragEnd = (data : any) => {
    setWorkouts(data)
  }


  return (
    <View style={styles.totalView}>
      <View style={styles.flatListView}>
        <DraggableFlatList
        style={styles.flatList}
          data={workouts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => onDragEnd(data)} // Update the order after dragging
          ListFooterComponent={() => <View style={{ height: submitHeight }} />}
        />
        <View style={styles.submitView}>
          <TouchableOpacity onPress={() => navigation.navigate("ApiScreen", {})} activeOpacity={0.9} style={styles.button}><View style={styles.submitButtonView}><ThemedText style={styles.buttonText}>Submit </ThemedText></View></TouchableOpacity>
        </View>
      </View>
    {/* Render Modal */}
    {modalComponent}
    </View>
  );
}//

const submitHeight = Dimensions.get("screen").height * 0.09;
const styles = StyleSheet.create({
  viewButton: {
    transform: [{ rotate: '90deg' }],
  },
  maxWidth: {
    width:'100%',
  },
  exerciseButtonContainer: {
    position: 'relative', // Ensure the overlay is positioned over the button
    zIndex:10,
    // backgroundColor:'green',
  },
  dragOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the overlay is above the button
    marginTop:15,
    borderRadius:15,
    
  },
test: {
  paddingRight:'5%',
  paddingLeft:'5%',
},
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  opaque: {
    opacity:1,
  },
  swipeContainer: {
    width:'90%',
    marginTop:15,
    backgroundColor:'#F22E2E',  //red color
    borderRadius:15,
    //marginRight:'5%',
    marginLeft:'5%',
  },
  swipeButtonContainer: {
    height:'100%',
    width:'20%',
    borderTopLeftRadius:15,
    borderBottomLeftRadius:15,
    position:'absolute',
    left:0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatListView:{
    width:'100%',
  },
  myWidth: {
    width:'100%',
    opacity:1,
    marginRight:'5%',
  },
  innerView: {
    paddingBottom:'23%',
    paddingTop:'3%'
  },
  totalView: {
    height:'50%',
    alignItems:'center',
    flex:1,
    justifyContent: 'center',
    backgroundColor: '#fff', // main background e2e2e2 or f6f6f6
  },
  rowItem:{
    borderTopColor:'grey',
    borderTopWidth:1,
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flatList: {
    //paddingBottom:'100%',
    width:'100%',
  },
  floatLeft: {
    alignSelf:'flex-start',
  },
  floatRight: {
    alignSelf:'flex-end',
  },
  submitView: {
    width:'100%',
    /*borderTopWidth:1,
    borderTopColor:'lightgrey',
    backgroundColor:'#f3f3f2',*/
    alignItems:'center',
    position:'absolute',
    height:submitHeight,
    bottom:0,
    padding:10,
  },
  submitIcon: {
    //position:'absolute',
    //right:50,
    transform: [{ rotate: '90deg' }],
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    height:50,
    width:'90%',
    backgroundColor:'#302c2c',  //submit button color
    borderRadius:10,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
  },
  buttonText: {
    textAlign:'center',
    color:'white',
  },
  submitButtonView: {
    flexDirection:'row',
    //width:'30%',
    // backgroundColor:'red',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    color:'gray',
  },
  container: {
    width:'100%',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabels: {
    fontSize: 16,
    fontWeight: '500'
  },
  repInput: {
    fontSize: 16,
    backgroundColor: '#D9D9D9',
    width: '15%',
    borderRadius: 5,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton1: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#21BFBF',
    borderRadius: 20,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  modalButton2: {
    backgroundColor: '#21BFBF',
    borderRadius: 20,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
});
