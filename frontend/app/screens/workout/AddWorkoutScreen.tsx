import { Image, StyleSheet, Platform, TouchableOpacity, View, FlatList, ScrollView, Dimensions, ActivityIndicator, Modal, KeyboardAvoidingView } from 'react-native';

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
import CustomTextInput from '@/components/custom/CustomTextInput';
import { GlobalContext } from '@/context/GlobalContext';
import CustomChip from '@/components/custom/CustomChip';
import { WorkoutContext } from '@/context/WorkoutContext';
import { Text } from 'react-native';


function getColor(type : number) : string  {

  if (type == 1) {
    return ("#21BFBF")
  } else if (type == 2) {
    return ("#2493BF")
  } else if (type == 3) {
    return ("#2493BF")
  }
  return "#fff"
}

export function AddWorkoutScreen() {
  //Manage the add exercise modal visibility

  const context = useContext(WorkoutContext)
  const gblContext = useContext(GlobalContext)

  const navigation = useNavigation<WorkoutScreenNavigationProp >();
  const { width } = Dimensions.get('window');
  const [submitting, setSubmitting] = useState(false);
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
  const handleRemoveSet = () => {
    setSets((prevSets) => {
      if (prevSets.length > 1) {
        return prevSets.slice(0, -1);
      }
      return prevSets;
    });
  };

  const handleRepChange = (index: number, value: string) => {
    setSets((prevSets) =>
      prevSets.map((set, i) =>
        i ===index ? {...set, reps: value} : set
      )
    );
  };

  const removeExercise = (delExercise : Exercise) => {
  const updatedExercises = exercises.filter(exercise => exercise !== delExercise);
  setExercises(updatedExercises);
  }

  //make modal appear to edit added workout
  const editWorkout = (id : any) => {
  console.log('Opening modal for workout:', id);
  //Open Modal when pencil icon is pressed
  //setAddModalVisible(true);
  context?.setVisible(true);
  }

  //submit button will send users to My Workout page

   const submitWorkout = async () => {
    try {
    setSubmitting(true)
    let WorkoutExercises = [];

    for (let i =0; i<Exercises.length; i++) {
      const currentExercise = {
        "sets": Exercises[i].sets,
        "reps": Exercises[i].reps,
        "nameOfExercise": Exercises[i].nameOfExercise,
        "exerciseType": Exercises[i].exerciseType
    }
      try {
        console.log("A " + JSON.stringify(currentExercise))
      const response = await fetch(`${httpRequests.getBaseURL()}/exercises/addExercise`, {
        method: 'POST', // Set method to POST
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          "Authorization": `Bearer ${gblContext?.data.token}`,
        },
        body: JSON.stringify(currentExercise), // Convert the data to a JSON string
      }); // Use endpoint or replace with BASE_URL if needed
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json() //.json(); // Parse the response as JSON
      WorkoutExercises.push(json.exerciseId);
  
      //return json; // Return the JSON data directly
    } catch (error) {
      setSubmitting(false)
      console.error('GET request failed1:', error);
      throw error; // Throw the error for further handling if needed
    }
      
    }
    console.log(WorkoutExercises)
    const pushingWorkout = {name: text, exerciseIds: WorkoutExercises}
    console.log(JSON.stringify(pushingWorkout))
      const response = await fetch(`${httpRequests.getBaseURL()}/workouts/addWorkout`, {
        method: 'POST', // Set method to POST
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          "Authorization": `Bearer ${gblContext?.data.token}`,
        },
        body: JSON.stringify(pushingWorkout), // Convert the data to a JSON string
      }); // Use endpoint or replace with BASE_URL if needed
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json() //.json(); // Parse the response as JSON
      console.log(JSON.stringify(json))
      setSubmitting(false)
      //return json; // Return the JSON data directly
    } catch (error) {
      setSubmitting(false)
      console.error('GET request failed2:', error);
      throw error; // Throw the error for further handling if needed
    }
   }
   
const viewWorkoutDetails = (id : any) => {
  navigation.navigate("ApiScreen", {})
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
              testID='close-modal'
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
            <ScrollView style={{ maxHeight: 150 }}>
              {/* Header Row */}
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  marginBottom: 5, 
                  width: '90%', 
                  alignSelf: 'center', 
                }}
              >
                <Text style={styles.modalLabels}>Set</Text>
                <Text style={styles.modalLabels}>Reps</Text>
              </View>

              {sets.map((set, index) => (
                <View 
                  key={index} 
                  style={{ 
                    flexDirection: 'column', 
                    marginBottom: 10, 
                    width: '90%', 
                    alignSelf: 'center', 
                  }}
                >
                  {/* Row for Set Number and Input */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginLeft: 10 }}>{set.setNumber}</Text>
                    <TextInput 
                      style={styles.repInput}
                      maxLength={3}
                      keyboardType='numeric'
                      value={set.reps}
                      onChangeText={(value) => handleRepChange(index, value)}
                    />
                  </View>

                  {/* Delete Set Button for the Last Set */}
                  {index === sets.length - 1 && sets.length > 1 && (
                    <TouchableOpacity 
                      style={{ 
                        flexDirection: 'row', 
                        alignItems: 'flex-end', 
                        marginTop: 10, 
                        // marginLeft: 5, 
                      }} 
                      onPress={handleRemoveSet}
                    >
                      <Ionicons name="trash-outline" size={20} color="#F22E2E" />
                      <Text style={{ fontSize: 14, color: '#F22E2E', marginLeft: 3 }}>Delete Set</Text>
                    </TouchableOpacity>
                  )}
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

                  const newExercise : Exercise = {
                    sets: sets.length,
                    reps: repNumbers,
                    nameOfExercise: exerciseName,
                    weight: [],
                    exerciseType: typeOfExercise!,
                    description: '',
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

  const sideButtons = [
    {id: '1', icon: 'pencil', func: editWorkout },
    {id: '2', icon: 'arrow-up', func: viewWorkoutDetails, style: styles.viewButton },
  ];

  //Instead of Sets, display
  //Sets last time, Reps for time, weight last time


  interface Exercise {
    sets: number;
    reps: number[];
    nameOfExercise: string;
    description: string;
    exerciseType: number;
    weight: number[];
  }

  const Exercises : Exercise[] = [];

  const renderLeftActions = (maxTheWidth: any) => {
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

  const handleLongPress = (drag: any) => {
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
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Exercise>) => (
    <Swipeable 
    renderLeftActions={() => renderLeftActions(maxWidth)}

    onSwipeableWillOpen={() => setMaxWidth(true)}     // Swipe started, prevent drag
    onSwipeableWillClose={() => setMaxWidth(false)}



    onSwipeableClose={() => handleSwipeableClose(drag)}       // Swipe ended, allow drag again
    onSwipeableOpen={() => removeExercise(item)}
    containerStyle={styles.test}
    enabled={(!isActive && !isOverlayVisible)}
  >
    <View style={styles.exerciseButtonContainer}>


    {isActive && isOverlayVisible && (
        <View style={styles.dragOverlay}>
          
        </View>
      )}
    <ExerciseButton
      onLongPress={() => handleLongPress(drag)}
      onPressOut={() => handlePressOut(isActive)}
      leftColor={getColor(item.exerciseType)}
      title={item.nameOfExercise}
      descColor={getColor(item.exerciseType)}
      desc={item.reps.length.toString()}
      //onLongPress={drag}  // Enable dragging when long-pressed
      isActive={isActive}
      style={styles.myWidth}
      sideButtons={sideButtons}
    >

      
      {item.reps.map((rep : any, index : any) => (
        <View key={index} style={styles.rowItem}>
          <ThemedText style={styles.floatLeft}>{rep}</ThemedText>
          <ThemedText style={styles.floatRight}>{"Reps"}</ThemedText>
        </View>
      ))}
    </ExerciseButton>
    </View>
    </Swipeable>
  );


  const [text, setText] = useState("")
  const [lastDragIndex, setLastDraggedIndex] = useState(null)

  const onDragEnd = (data : any) => {
    setExercises(data)
  }


  return (    <View style={styles.totalView}>




    <View style={styles.flatListView}>
    

    <DraggableFlatList
    style={styles.flatList}
      data={Exercises}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      onDragEnd={({ data }) => onDragEnd(data)} // Update the order after dragging
      ListHeaderComponent={      <View style={{marginTop:10, alignSelf:"center"}}>
      <CustomTextInput
          onChangeText={setText}
          placeholder="Workout Name"
          placeholderTextColor="#999"
          width={width*0.85}
          style={{
            borderWidth: 0,
            fontSize: 16,
            paddingLeft: 15,
            borderRadius: 20,
            backgroundColor: '#EDEDED',
          }}
        />
      
      </View>}
      ListFooterComponent={() => <View style={{ height: submitHeight }} />}
    />
    <View style={styles.submitView}>
      <TouchableOpacity onPress={submitWorkout} style={styles.button}><View style={styles.submitButtonView}><ThemedText style={styles.buttonText}>{submitting ? <ActivityIndicator size="small" color="#ffffff" /> : "Submit"}</ThemedText>{submitting ? <></> : <Ionicons name="chevron-up" style={[styles.submitIcon]} size={20} color="white"/>}</View></TouchableOpacity>
    </View>
  {modalComponent}
  </View></View>)

}

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
    width: '85%',
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
