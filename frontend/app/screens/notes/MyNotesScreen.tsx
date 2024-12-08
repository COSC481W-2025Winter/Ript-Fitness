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
import { useEffect, useState } from "react";

type MyNotesScreenNavigationProp = StackNavigationProp<WorkoutStackParamList, 'MyNotesScreen'>;

export default function MyNotesScreen() {
  // const { notes, fetchNotes, loading } = useNotes();
  const { notes, fetchNotes } = useNotes();
  const [searchText, setSearchText] = useState("");
  const { width } = Dimensions.get("window");
  const navigation = useNavigation<MyNotesScreenNavigationProp>();

  useEffect(() => {
    fetchNotes(); // Fetch notes on screen load
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
    // <View style={styles.container}>
    //   {/* <View style={{ paddingVertical: 15 }}>
    //     <CustomSearchBar />
    //   </View> */}
    //   <View style={styles.searchContainer}>
    //     <Ionicons
    //       name="search-outline"
    //       size={20}
    //       color="#747474"
    //       style={styles.iconContainer}
    //     />
    //     <CustomTextInput
    //       placeholder="Search"
    //       placeholderTextColor="#999"
    //       width={width * 0.85}
    //       value={searchText}
    //       onChangeText={setSearchText}
    //       style={{
    //         borderWidth: 0,
    //         fontSize: 16,
    //         paddingLeft: 30,
    //         borderRadius: 25,
    //         backgroundColor: "#EDEDED",
    //       }}
    //     />
    //   </View>
    //   <ScrollView
    //     showsVerticalScrollIndicator={false}
    //     contentContainerStyle={{ alignItems: "center", width: "100%" }}
    //     style={styles.scroll}
    //   >
    //     {loading ? (
    //       <Text>Loading...</Text> // Show loading text while fetching
    //     ) : notes.length === 0 ? (
    //       <Text>Notes will be displayed here</Text> // Show when no notes are found
    //     ) : (
    //       <View style={styles.notesContainer}>
    //         {notes.map((note) => (
    //           <Note
    //             key={note.id}
    //             title={note.title}
    //             date={note.date}
    //             text={note.text}
    //             onPress={() => navigation.navigate("EditNoteScreen", { note })}
    //           />
    //         ))}
    //       </View>
    //     )}
    //   </ScrollView>
    // </View>
    <View style={styles.container}>      
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#747474"
          style={styles.iconContainer}
        />
        <CustomTextInput
          placeholder="Search"
          placeholderTextColor="#999"
          width={width * 0.85}
          value={searchText}
          onChangeText={setSearchText}
          style={{
            borderWidth: 0,
            fontSize: 16,
            paddingLeft: 30,
            borderRadius: 25,
            backgroundColor: "#EDEDED",
          }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:"center", width:"100%"}} style={styles.scroll}>
        {filteredNotes.length === 0 ? (
          <Text>Notes will be displayed here</Text>
        ) : (
          <View style={styles.notesContainer}>
          {filteredNotes.map((note) => (
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
  },
  iconContainer: {
    position: "absolute",
    paddingTop: 15,
    paddingLeft: 7,
    zIndex: 1,
  },
});