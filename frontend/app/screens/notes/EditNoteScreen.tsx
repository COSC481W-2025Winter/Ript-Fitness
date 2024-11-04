import CustomTextInput from '@/components/custom/CustomTextInput';
import { useNotes } from '@/components/MyNotes/NotesContext';
import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Note } from '@/components/MyNotes/NotesContext'; 
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function EditNoteScreen() {
  const navigation = useNavigation();

  const route = useRoute();
  const { note } = route.params as { note: Note } || { title: '', text: '', date: new Date().toLocaleDateString() || null};
  const { addNote, updateNote } = useNotes();

  const [title, setTitle] = useState(note ? note.title : ''); // Initialize with note's title or empty
  const [text, setText] = useState(note ? note.text : '');

  const handleSave = () => {
    console.log("handleSave triggered");
    //updating note
    if (note) {
      const updatedNote: Note = {
        ...note,
        title,
        date: new Date().toLocaleDateString(), 
        text,
      };
      updateNote(updatedNote); 
      console.log("Saving actual note1:", note);
      console.log("Saving updateNote:", updatedNote);
    } else {
      // creating a new note
      const newNote: Note = {
        id: Date.now().toString(), // 
        title,
        date: new Date().toLocaleDateString(), // Set the current date
        text,
      };
      //needs work
      addNote(newNote); // Add new note to the context
      console.log("Saving actual note 2:", note); //shows null in terminal
      console.log("Saving addNote:", addNote);  //shows function addNote
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
          <CustomTextInput 
              placeholder= "Title"
              value={title}
              onChangeText={setTitle}
              autoCapitalize='words'
              color="#1D1B20"
              style={{
                borderColor: '#B9B6B6',
                borderWidth: 0,
                width: '80%',
                fontSize: 24,          
                // backgroundColor: '#EDEDED',
                marginBottom: 0,
              }}
          />
          <CustomTextInput 
              placeholder= "Note" 
              value={text}
              onChangeText={setText}  
              color="#454343"             
              multiline={true}
              style={{
                borderColor: '#B9B6B6',
                borderWidth: 0,
                width: '100%',
                flex: 1,
                fontSize: 14,
                // backgroundColor: '#EDEDED',
              }}
          />
          <Button title="Save Note" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#FFF3AD",
    },
    scrollContainer: {
      flexGrow: 1, 
      justifyContent: 'flex-start', 
    },
    container: {
      flex: 1, 
      padding: 10,
    },
});