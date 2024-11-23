import CustomTextInput from "@/components/custom/CustomTextInput";
import { View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Note from "@/components/MyNotes/Note";
import { useNotes } from "@/components/MyNotes/NotesContext";
import { useNavigation } from "@react-navigation/native";
import { Note as NoteType } from '@/components/MyNotes/NotesContext';
import { StackNavigationProp } from "@react-navigation/stack";
import { WorkoutStackParamList } from "../(tabs)/WorkoutStack";
import CustomSearchBar from "@/components/custom/CustomSearchBar";
import { useEffect } from "react";

type MyNotesScreenNavigationProp = StackNavigationProp<WorkoutStackParamList, 'MyNotesScreen'>;

export default function MyNotesScreen() {
  const { notes, fetchNotes } = useNotes();
  const navigation = useNavigation<MyNotesScreenNavigationProp>();

  useEffect(() => {
    fetchNotes(); // Fetch notes on screen load
  }, [fetchNotes]);

  if (notes === undefined) {
    return <Text>Loading...</Text>;  
  }

  return (
    <View style={styles.container}>
      <View style={{paddingVertical: 15,}}>
        <CustomSearchBar />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:"center", width:"100%"}} style={styles.scroll}>
        {notes.length === 0 ? (
          <Text>Notes will be displayed here</Text>
        ) : (
          <View style={styles.notesContainer}>
          {notes.map((note) => (
            <Note 
              key={note.id} 
              title={note.title} 
              date={note.date} 
              text={note.text} 
              onPress={() => navigation.navigate("EditNoteScreen", { note })}
            />
          ))}
          </View>
        )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width:"100%",
  },
  notesContainer:{
    flex:1,
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent: "space-evenly", // Space items evenly
  },
  container: {
    width:"100%",
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});