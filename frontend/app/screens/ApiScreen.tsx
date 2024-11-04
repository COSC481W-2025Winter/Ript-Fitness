import { Image, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { httpRequests } from '@/api/httpRequests'
import { useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { BodyContext } from '@/context/BodyContext';

export default function ApiScreen() {

  //these are variables with setters
  const [responseText, setResponseText] = useState('') //Response in string format initialized as empty string
  const [firstNamePOST, setFirstNamePOST] = useState(''); //firstName initialized as empty string
  const [lastNamePOST, setLastNamePOST] = useState(''); //lastName initialized as empty string
  const [id, setID] = useState(''); //ID for GET initialized as empty string
  const [Putid, setPutID] = useState(''); //ID for POST initialized as empty string
  const [Deleteid, setDeleteID] = useState(''); //ID for POST initialized as empty string
  const [firstNamePUT, setFirstNamePUT] = useState(''); //firstName initialized as empty string
  const [lastNamePUT, setLastNamePUT] = useState(''); //lastName initialized as empty string

  // Handle the text input change for First Name
  const handleChangeFirstNamePost = (text: string) => {
    setFirstNamePOST(text);
  };
  // Handle the text input change for Last Name
  const handleChangeLastNamePost = (text: string) => {
    setLastNamePOST(text);
  };

  const handleGetID = (text: string) => {
    setID(text);
  };
  const handlePutID = (text: string) => {
    setPutID(text);
  };

  const handleDeleteID = (text: string) => {
    setDeleteID(text);
  };
  const handleChangeFirstNamePut = (text: string) => {
    setFirstNamePUT(text);
  };
  // Handle the text input change for Last Name
  const handleChangeLastNamePut = (text: string) => {
    setLastNamePUT(text);
  };


/* This function is marked as async because HTTP requests to a server involve network delays, 
 so the function needs to wait for the server response. 
 Using async/await ensures the function pauses until the request completes, 
 preventing premature updates to the UI or state.*/

  const postValues = async () => { //run "Post Names" button is pressed
    const exampleJson = { //create a json object using the variables set in our textboxes
      firstName: firstNamePOST,
      lastName: lastNamePOST,
    };
    //make a post request
    const response = await httpRequests.post("/addTestObject", exampleJson)
    //convert the recieved json response to a string for visualizing
    //alternatively, you could get specific information with response.firstName
    setResponseText(JSON.stringify(response))
   }



   const getValues = async () => { //run "Push Names" button is pressed
    const exampleJson = { //create a json object using the variables set in our textboxes
      id: id,
    };
    //make a post request
    const response = await httpRequests.get("/getTestObject", exampleJson)
    //convert the recieved json response to a string for visualizing
    //alternatively, you could get specific information with response.firstName
    setResponseText(JSON.stringify(response))
   }


   const putValues = async () => { //run "Push Names" button is pressed
    const exampleJson = { //create a json object using the variables set in our textboxes
      id: Putid,
      firstName:firstNamePUT,
      lastName:lastNamePUT
    };
    //make a post request
    const response = await httpRequests.put("/editNameTest", exampleJson)
    //convert the recieved json response to a string for visualizing
    //alternatively, you could get specific information with response.firstName
    setResponseText(JSON.stringify(response))
   }

   const deleteValues = async () => { //run "Push Names" button is pressed
    const exampleJson = { //create a json object using the variables set in our textboxes
      id: Deleteid,
    };
    //make a post request
    const response = await httpRequests.delete("/deleteTestObjectById", exampleJson)
    //convert the recieved json response to a string for visualizing
    //alternatively, you could get specific information with response.firstName
    setResponseText(JSON.stringify(response))
   }



  const clearResponse = () => { //sets the response text to be empty
    setResponseText("")
   }


  return (

    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
        {/* This is apparently how you have to leave comments in the return...*/}


        {/*************************POST********************************/}

        {/* TextInput must be in the GestureHandlerRootView it seems */}
        <GestureHandlerRootView style={styles.container}>
              <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="gray"
        value={firstNamePOST}
        onChangeText={handleChangeFirstNamePost}
      />
                    <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="gray"
        value={lastNamePOST}
        onChangeText={handleChangeLastNamePost}
      />
        </GestureHandlerRootView>

        {/* This is the button, on press it runs pushValues() which pushes our username and password. to the
        MYSQL database in Azure. storing it in the test_model database. */}
      <TouchableOpacity style={styles.button} onPress={() => {postValues()}}><ThemedText style={styles.buttonText}>POST Names</ThemedText></TouchableOpacity>
      
      
      




      {/*************************GET********************************/}
      <GestureHandlerRootView style={styles.container}>
              <TextInput
        style={styles.input}
        placeholder="ID"
        placeholderTextColor="gray"
        value={id}
        onChangeText={handleGetID}
      />
        </GestureHandlerRootView>

        {/* This is the button, on press it runs pushValues() which pushes our username and password. to the
        MYSQL database in Azure. storing it in the test_model database. */}
      <TouchableOpacity style={styles.button} onPress={() => {getValues()}}><ThemedText style={styles.buttonText}>GET Names</ThemedText></TouchableOpacity>






        {/*************************PUT********************************/}

        <GestureHandlerRootView style={styles.container}>
              <TextInput
        style={styles.input}
        placeholder="ID of Names to edit"
        placeholderTextColor="gray"
        value={Putid}
        onChangeText={handlePutID}
      />
                    <TextInput
        style={styles.input}
        placeholder="New First Name"
        placeholderTextColor="gray"
        value={firstNamePUT}
        onChangeText={handleChangeFirstNamePut}
      />
                    <TextInput
        style={styles.input}
        placeholder="New Last Name"
        placeholderTextColor="gray"
        value={lastNamePUT}
        onChangeText={handleChangeLastNamePut}
      />
        </GestureHandlerRootView>

        {/* This is the button, on press it runs pushValues() which pushes our username and password. to the
        MYSQL database in Azure. storing it in the test_model database. */}
      <TouchableOpacity style={styles.button} onPress={() => {putValues()}}><ThemedText style={styles.buttonText}>PUT Names</ThemedText></TouchableOpacity>




        {/*************************DELETE********************************/}
        <GestureHandlerRootView style={styles.container}>
              <TextInput
        style={styles.input}
        placeholder="ID"
        placeholderTextColor="gray"
        value={Deleteid}
        onChangeText={handleDeleteID}
      />
        </GestureHandlerRootView>

        {/* This is the button, on press it runs pushValues() which pushes our username and password. to the
        MYSQL database in Azure. storing it in the test_model database. */}
      <TouchableOpacity style={styles.button} onPress={() => {deleteValues()}}><ThemedText style={styles.buttonText}>DELETE Names</ThemedText></TouchableOpacity>




      
      
      
      {/* The Response section. I have it set to just display the entire JSON */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Response:</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          {responseText}
        </ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.button} onPress={() => {clearResponse()}}><ThemedText style={styles.buttonText}>Clear Response</ThemedText></TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    backgroundColor:'green',
    borderRadius:10,
    textAlign:'center',
    justifyContent:'center',
  },
  buttonText: {
    textAlign:'center',
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
});
