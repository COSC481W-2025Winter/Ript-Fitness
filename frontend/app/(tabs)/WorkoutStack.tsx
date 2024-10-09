import { StyleSheet } from 'react-native';


import { createStackNavigator } from '@react-navigation/stack';
import ApiScreen from '@/app/screens/ApiScreen';
import MyWorkoutsScreen from '@/app/screens/MyWorkoutsScreen';
import WorkoutApiScreen from '@/app/screens/WorkoutApiScreen';
import { WorkoutProvider } from '@/context/WorkoutContext';
import { StackNavigationProp } from '@react-navigation/stack';
import ApiScreen from '../screens/ApiScreen';
import StartWorkoutScreen from '../screens/StartWorkoutScreen';


const Stack = createStackNavigator();


export type WorkoutStackParamList = {
  ApiScreen: {};
  StartWorkoutScreen: {};
};

export type WorkoutScreenNavigationProp = StackNavigationProp<WorkoutStackParamList>;

export default function WorkoutStack(props : any) {
  return (
    <WorkoutProvider>
    <Stack.Navigator initialRouteName="WorkoutApiScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutApiScreen" component={WorkoutApiScreen} />
      <Stack.Screen name="ApiScreen" component={ApiScreen} />
      <Stack.Screen name="StartWorkoutScreen" component={StartWorkoutScreen} />
      <Stack.Screen name="MyHomeScreen123" component={MyWorkoutsScreen} />
      {/* Put any additional screens for your tab here. This allows us to use a stack.
        A stack allows us to easily navigate back a page when we're in a secondary screen on a certain tab.

      */}
    </Stack.Navigator>
    </WorkoutProvider>
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
