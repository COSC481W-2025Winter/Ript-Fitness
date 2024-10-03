import CustomButton from '@/components/custom/CustomButton';
import LogoImage from '@/components/custom/LogoImage';
import { View, Text, StyleSheet } from 'react-native'

// Navigation imports
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View>
          <LogoImage style={styles.logo}/>
      </View>
      <View>
        <Text style={styles.welcomeText}>Welcome to Ript Fitness</Text>
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Log in" 
            width={210} 
            fontSize={16}
            onPress={()  => navigation.navigate('Login')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Sign up"
            width={210}
            backgroundColor='#fff'
            borderColor='#03A696'
            borderWidth={2}
            textColor='#03A696'
            fontSize={16}
            onPress={()  => navigation.navigate('Signup')}
          />
        </View>
      </View>        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  logo: {
    margin: 25
  },
  welcomeText: {
    fontSize: 24,
    margin: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;