import CustomButton from '@/components/custom/CustomButton';
import LogoImage from '@/components/custom/LogoImage';
import { View, Text, Image, StyleSheet } from 'react-native'

// const logoMainImg = require("./assets/final-main-logo.png")
// import { images } from 'frontend/assets/images'

export default function App() {
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
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Sign up"
            width={210}
            backgroundColor='#fff'
            borderColor='#03A696'
            borderWidth={3}
            textColor='#03A696'
          />
        </View>
      </View>
      {/* <View >
        <Text style={{fontSize:24, margin: 10}}>Welcome to Ript Fitness</Text>
        <CustomButton
          title="Log in"
          width={200}
        />
        <CustomButton
          title="Sign up"
          backgroundColor='#fff'
          borderColor='#03A696'
          borderWidth={3}
          width={200}
          textColor='#03A696'
        />
      </View> */}
        
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
    margin: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});