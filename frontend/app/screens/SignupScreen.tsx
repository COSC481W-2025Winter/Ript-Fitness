import CustomButton from '@/components/custom/CustomButton';
import LogoImage from '@/components/custom/LogoImage';
import { View, Text, StyleSheet } from 'react-native'

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <View>
          <LogoImage style={styles.logo}/>
      </View>
      <View>
        <Text style={styles.welcomeText}>Register</Text>
        <Text style={styles.descText}>Create your Account</Text>
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Sign up" 
            fontSize={16}
            width={150} 
            // onPress={()  => navigation.navigate('Login')}
          />
        </View>
        {/* <View style={styles.buttonContainer}>
          <CustomButton
            title="Sign up"
            width={210}
            backgroundColor='#fff'
            borderColor='#03A696'
            borderWidth={2}
            textColor='#03A696'
            // handlePress={() => TabRouter.push('/LoginScreen')}
          />
        </View> */}
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
    // margin: 10,
    textAlign: 'center'
  },
  descText: {
    fontSize: 15,
    margin: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
});