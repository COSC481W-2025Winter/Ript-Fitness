import { Image, StyleSheet, Platform, ScrollView, View, TouchableOpacity } from 'react-native';


import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator, HeaderStyleInterpolators, StackNavigationProp } from '@react-navigation/stack';
import { BodyProvider } from '@/context/BodyContext';
import ApiScreen from '@/app/screens/ApiScreen';
import { useContext } from 'react';
import { GlobalContext } from '@/context/GlobalContext';
import GraphScreen from '../screens/profile/GraphScreen';
import foodLog from '@/app/screens/foodlog/FoodLog';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';



const Stack = createStackNavigator();

export type BodyStackParamList = {
  ApiScreen: {};
}

export type BodyScreenNavigationProp = StackNavigationProp<BodyStackParamList>;

export default function BodyStack(props : any) {
  const navigation = useNavigation<BodyScreenNavigationProp >();

  
  return (
    <BodyProvider>
    <Stack.Navigator initialRouteName="Food Log" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Food Log" component={foodLog} 
      // options={{
      //   headerRight:() => (
      //     <TouchableOpacity
      //       onPress={() => { navigation.navigate("ApiScreen", {})}}>
      //         <Ionicons name="add-circle-outline" size={30}></Ionicons>
      //     </TouchableOpacity>
      //   )
      // }}
      />
      {/* Put any additional screens for your tab here. This allows us to use a stack.
        A stack allows us to easily navigate back a page when we're in a secondary screen on a certain tab.
      */}
    </Stack.Navigator>
    </BodyProvider>
  );
}

/*
      {contacts.map((contact, index) => (
                <Tile key={contact.key}
                index={index}
                onTileLoad={() => setTilesLoaded(prevTilesLoaded => prevTilesLoaded + 1)}
                //contactOnPress={() => navigation.navigate(Contact, {key:Tiles.length, contactInfo: contactsList[Tiles.length]})} 
                navigation={navigation}/>
            ))}

*/

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor:'#005500',
    padding:0,
    margin:0,
    width:'100%',
    },
    
    centerContentContainer: {
      alignItems:'center',
    },
      SafeAreaView: {

        //alignItems: 'center',
        backgroundColor: '#0ffff0',
        height:'100%',
        width:'100%',
        //overflow:'scroll',
        paddingTop:20,
        justifyContent: 'flex-start',
        flexDirection:'column',
      },
    
      sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
      },
      sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
      },
      highlight: {
        fontWeight: '700',
      },
    
      size40x40: {
        height:40,
        width:40,
      },
    });
