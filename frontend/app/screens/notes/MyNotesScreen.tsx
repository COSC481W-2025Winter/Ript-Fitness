// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Text,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import CustomTextInput from "@/components/custom/CustomTextInput";
// import Note from "@/components/MyNotes/Note";
// import { useNavigation } from "@react-navigation/native";
// import { GlobalContext } from "@/context/GlobalContext";
// import { Note as NoteType } from '@/components/MyNotes/NotesContext';
// import { StackNavigationProp } from "@react-navigation/stack";
// import { WorkoutScreenNavigationProp } from "@/app/(tabs)/WorkoutStack";
// import CustomSearchBar from "@/components/custom/CustomSearchBar";

// interface Note {
//   id: string;
//   title: string;
//   description: string;
//   date: string; // Optional
//   text: string; // Optional
// }

// export default function MyNotesScreen() {

//   const context = useContext(GlobalContext);
//   const { width } = Dimensions.get("window");
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const navigation = useNavigation<WorkoutScreenNavigationProp>();

//   // Fetch notes from the backend
//   useEffect(() => {
//     const fetchNotes = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           "http://ript-fitness-app.azurewebsites.net/note/getAllNotesFromLoggedInUser",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${context?.data.token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch notes: ${response.statusText}`);
//         }

//         const data: Note[] = await response.json();
//         setNotes(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching notes:", error);
//         Alert.alert("Error", "Failed to load notes. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotes();
//   }, [context?.data.token]);

//   // Delete note functionality
//   const deleteNote = async (noteId: string) => {
//     try {
//       const response = await fetch(
//         `http://ript-fitness-app.azurewebsites.net/note/deleteNote/${noteId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${context?.data.token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to delete note: ${response.statusText}`);
//       }

//       setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
//       Alert.alert("Success", "Note deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting note:", error);
//       Alert.alert("Error", "Failed to delete note. Please try again.");
//     }
//   };

//   const filteredNotes = notes.filter((note) =>
//     note.title.toLowerCase().includes(searchText.toLowerCase())
//   );

//   if (notes === undefined) {
//     return <Text>Loading...</Text>;  
//   }

//   return (
//     <View style={styles.container}>

//       <View style={styles.searchContainer}>
//         <Ionicons
//           name="search-outline"
//           size={20}
//           color="#747474"
//           style={styles.iconContainer}
//         />
//         <CustomTextInput
//           placeholder="Search"
//           placeholderTextColor="#999"
//           width={width * 0.85}
//           value={searchText}
//           onChangeText={setSearchText}
//           style={{
//             borderWidth: 0,
//             fontSize: 16,
//             paddingLeft: 30,
//             borderRadius: 20,
//             backgroundColor: "#EDEDED",
//           }}
//         />

//       </View>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ alignItems: "center", width: "100%" }}
//         style={styles.scroll}
//       >
//         {loading ? (
//           <Text>Loading notes...</Text>
//         ) : filteredNotes.length === 0 ? (
//           <Text>Notes will be displayed here</Text>
//         ) : (
//           <View style={styles.notesContainer}>

//             {filteredNotes.map((note: Note) => (
//               <Note
//                 key={note.id}
//                 title={note.title}
//                 date={new Date().toLocaleDateString()} // Replace with actual date if available
//                 text={note.description}
//                 onPress={() =>
//                   Alert.alert(
//                     "Note Options",
//                     "Choose an action:",
//                     [
//                       {
//                         text: "Edit",
//                         onPress: () =>
//                           navigation.navigate("EditNoteScreen", { note }),
//                       },
//                       {
//                         text: "Delete",
//                         onPress: () => deleteNote(note.id),
//                         style: "destructive",
//                       },
//                       { text: "Cancel", style: "cancel" },
//                     ],
//                     { cancelable: true }
//                   )
//                 }
//               />
//             ))}

//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   scroll: {
//     width: "100%",
//   },
//   notesContainer: {
//     flex: 1,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-evenly",
//   },
//   container: {
//     width: "100%",
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//   },

//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: 15,
//   },
//   iconContainer: {
//     position: "absolute",
//     paddingTop: 15,
//     paddingLeft: 10,
//     zIndex: 1,
//   },
// });


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
  const { notes, fetchNotes } = useNotes();
  const [searchText, setSearchText] = useState("");
  const { width } = Dimensions.get("window");
  const navigation = useNavigation<MyNotesScreenNavigationProp>();

  useEffect(() => {
    fetchNotes(); // Fetch notes on screen load
  }, [fetchNotes]);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
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
    paddingLeft: 10,
    zIndex: 1,
  },
});