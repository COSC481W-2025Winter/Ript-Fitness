import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, StyleSheet, TouchableOpacity, Text, Platform, Image } from "react-native";

const Tab = createMaterialTopTabNavigator();

function FrontendScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Front-end</ThemedText>
    </ThemedView>
  );
}

function BackendScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Back-end</ThemedText>
    </ThemedView>
  );
}

const RiptTeamScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* <Text style={styles.title}>Ript Team</Text> */}
      </View>
      <View>
        <Text style={styles.heading}>Meet the{"\n"} Ript Fitness Team</Text>
        <Image />
      </View>
      <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', color: 'black' },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIndicatorStyle: { backgroundColor: '#21BFBF', height: 3, },
      }}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Front-end" component={FrontendScreen} />
      <Tab.Screen name="Back-end" component={BackendScreen} />
    </Tab.Navigator>
    </View>
  );
};

export default RiptTeamScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 12,
    // borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: Platform.OS === "ios" ? '10%' : 0
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold',
    marginLeft: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  }
});