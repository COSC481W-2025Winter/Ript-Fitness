import CustomTextInput from "@/components/custom/CustomTextInput";
import { View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Note from "@/components/MyNotes/Note";
import { useNotes } from "@/components/MyNotes/NotesContext";
import { useNavigation } from "@react-navigation/native";
import { Note as NoteType } from '@/components/MyNotes/NotesContext';
import { StackNavigationProp } from "@react-navigation/stack";
import { WorkoutStackParamList } from "../(tabs)/WorkoutStack";

type MyNotesScreenNavigationProp = StackNavigationProp<WorkoutStackParamList, 'MyNotesScreen'>;

export default function MyNotesScreen() {
  const { notes } = useNotes();
  console.log("Current notes:", notes);
  const { width } = Dimensions.get('window');
  const navigation = useNavigation<MyNotesScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#747474" style={styles.iconContainer} />
        <CustomTextInput
          placeholder="Search"
          placeholderTextColor="#999"
          width={width * 0.85}
          style={{
            borderWidth: 0,
            fontSize: 16,
            paddingLeft: 30,
            borderRadius: 20,
            backgroundColor: '#EDEDED',
          }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {notes.length === 0 ? (
          <Text>Notes will be displayed here</Text>
        ) : (
          notes.map((note: NoteType) => (
            <Note 
              key={note.id} 
              title={note.title} 
              date={note.date} 
              text={note.text} 
              onPress={() => navigation.navigate("EditNoteScreen", { note })}
            />
          ))
        )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
  },
  iconContainer: {
    position: 'absolute',
    paddingTop: 15,
    paddingLeft: 10,
    zIndex: 1,
  },
});