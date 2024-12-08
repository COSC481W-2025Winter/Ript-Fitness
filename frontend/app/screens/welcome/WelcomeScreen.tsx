import CustomButton from '@/components/custom/CustomButton';
import LogoImage from '@/components/custom/LogoImage';
import { View, Text, StyleSheet, Dimensions } from 'react-native'

// Navigation imports
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { width } = Dimensions.get('window');
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
            width={width * 0.75} 
            fontSize={16}
            borderRadius={30}
            onPress={()  => navigation.navigate('Login')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Sign up"
            width={width * 0.75}
            backgroundColor='#fff'
            borderColor='#21BFBF'
            borderWidth={2}
            borderRadius={30}
            textColor='#21BFBF'
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
    color: '#3F4040',
    margin: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;