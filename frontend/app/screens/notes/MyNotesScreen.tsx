import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/components/custom/CustomTextInput";
import Note from "@/components/MyNotes/Note";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "@/context/GlobalContext";

interface Note {
  id: number;
  title: string;
  description: string;
}

export default function MyNotesScreen() {
  const context = useContext(GlobalContext);
  const { width } = Dimensions.get("window");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://ript-fitness-app.azurewebsites.net/note/getAllNotesFromLoggedInUser",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${context?.data.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch notes: ${response.statusText}`);
        }

        const data: Note[] = await response.json();
        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        Alert.alert("Error", "Failed to load notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [context?.data.token]);

  // Delete note functionality
  const deleteNote = async (noteId: number) => {
    try {
      const response = await fetch(
        `http://ript-fitness-app.azurewebsites.net/note/deleteNote/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${context?.data.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.statusText}`);
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      Alert.alert("Success", "Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "Failed to delete note. Please try again.");
    }
  };

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
            borderRadius: 20,
            backgroundColor: "#EDEDED",
          }}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", width: "100%" }}
        style={styles.scroll}
      >
        {loading ? (
          <Text>Loading notes...</Text>
        ) : filteredNotes.length === 0 ? (
          <Text>Notes will be displayed here</Text>
        ) : (
          <View style={styles.notesContainer}>
            {filteredNotes.map((note: Note) => (
              <Note
                key={note.id}
                title={note.title}
                date={new Date().toLocaleDateString()} // Replace with actual date if available
                text={note.description}
                onPress={() =>
                  Alert.alert(
                    "Note Options",
                    "Choose an action:",
                    [
                      {
                        text: "Edit",
                        onPress: () =>
                          navigation.navigate("EditNoteScreen", { note }),
                      },
                      {
                        text: "Delete",
                        onPress: () => deleteNote(note.id),
                        style: "destructive",
                      },
                      { text: "Cancel", style: "cancel" },
                    ],
                    { cancelable: true }
                  )
                }
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
    width: "100%",
  },
  notesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
