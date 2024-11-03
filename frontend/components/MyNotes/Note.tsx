import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

interface NoteProps {
  title: string;
  date: string;
  text: string;
  onPress: () => void;
}

const Note: React.FC<NoteProps> = ({ title, date, text, onPress }) => {
  // const notesData = [
  //   {
  //     title: 'Test',
  //     date: '10/22/2024',
  //     text: 'This is a test note.',
  //   },
  //   {
  //     title: 'Title',
  //     date: '10/19/2024',
  //     text: 'Note',
  //   },
  //   {
  //     title: 'Title',
  //     date: '10/15/2024',
  //     text: 'Note',
  //   },
  //   {
  //     title: 'Title',
  //     date: '10/11/2024',
  //     text: 'Note',
  //   },
  //   {
  //     title: 'Title',
  //     date: '10/2/2024',
  //     text: 'Note',
  //   },
  // ];

  return (
    // <View style={styles.container}>
    //   {notesData.map((note, index) => (
    //     <TouchableOpacity 
    //       key={index}
    //       activeOpacity={0.7}
    //       // onPress={() => navigation.navigate('WorkoutApiScreen')}
    //       style={styles.button}>
    //       <View style={styles.buttonContent}>
    //         <Text style={styles.titleText}>
    //           {note.title}
    //         </Text>
    //         <View style={styles.noteTextContainer}>
    //           <Text style={styles.noteText}>
    //             {note.text}
    //           </Text>
    //           <Text style={styles.dateText}>
    //             {note.date}
    //           </Text>
    //         </View>
    //       </View>
    //     </TouchableOpacity>
    //   ))}
    // </View>
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onPress} 
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.titleText}>
            {title}
          </Text>
          <View style={styles.noteTextContainer}>
            <Text style={styles.noteText}>
              {text}
            </Text>
            <Text style={styles.dateText}>
              {date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'flex-start', 
    gap: 20,
    width: '50%',
    paddingTop: 15,
  },
  button: {
    backgroundColor: '#FFF3AD', 
    padding: 5, 
    marginHorizontal: 10,
    borderRadius: 10,
    flex:1,
    borderWidth: 2,
    borderColor: '#DAD19D',
  }, 
  buttonContent: {
      height: '100%',
  }, 
  dateText: {
      fontSize: 12, 
      textAlign: 'left',
      paddingTop: 10,
      color: '#454343',
  },
  noteText: {
    fontSize: 14, 
    textAlign: 'left',
    paddingBottom: 5,
  },
  titleText: {
    textAlign: 'center',
    color: '#1D1B20',
    fontSize: 20,
    padding: 10, 
    fontWeight: 'bold',
  },
  noteTextContainer: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 5, 
  },
});

export default Note;