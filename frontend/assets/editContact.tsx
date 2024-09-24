import { Image, StyleSheet, Platform, Touchable, TouchableOpacity } from 'react-native';


import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useContext, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ContactsContext } from '@/context/ContactsContext';

export default function EditContactScreen(props : any) {
const navigation = useNavigation();
const [contact, setContact] = useState(props.route.params.contact)
const contactsContext = useContext(ContactsContext);

const handleNameChange = (text: string) => {
  setContact({ ...contact, name: text });
};

const handleTitleChange = (text: string) => {
  setContact({ ...contact, title: text });
};

const handleEmployerChange = (text: string) => {
  setContact({ ...contact, employer: text });
};

const backButton = () => {
  contactsContext?.updateContact(contact)
  props.navigation.goBack(); // Go back to the previous screen
}

  return (
      <>
      
      <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
        
      <GestureHandlerRootView style={styles.container}>
        <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="gray"
        value={contact.name}
        onChangeText={handleNameChange}
        
      />
        </GestureHandlerRootView>


      <TouchableOpacity onPress={backButton}>
        <ThemedText>Go Back Button</ThemedText>
      </TouchableOpacity>

      </ParallaxScrollView>

      
      </>
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
  container: {
    width:'100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    color:'gray',
  },
});
