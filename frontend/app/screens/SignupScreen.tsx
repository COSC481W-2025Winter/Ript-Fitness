import CustomButton from '@/components/custom/CustomButton';
import CustomTextInput from '@/components/custom/CustomTextInput';
import LogoImage from '@/components/custom/LogoImage';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions } from 'react-native'

// Navigation imports
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { width } = Dimensions.get('window');
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View>
              <LogoImage style={styles.logo}/>
          </View>          
          <View style={styles.buttonContainer}>
            <Text style={styles.welcomeText}>Register</Text>
            <Text style={styles.descText}>Create your Account</Text>
            <CustomTextInput
              placeholder='Email'
              textContentType='emailAddress'
              width={width * 0.65}
            />
            <CustomTextInput
              placeholder='Username'
              // textContentType='username'
              width={width * 0.65}
            />
            <View style={styles.inputIconContainer}>
              <CustomTextInput
                placeholder='Password'
                secureTextEntry={!showPassword}
                width={width * 0.65}
              />
              <TouchableOpacity onPress={toggleShowPassword} style={styles.iconContainer}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  color={'#A69B8F'}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <CustomButton 
              title="Sign up" 
              fontSize={16}
              width={width * 0.4} 
              onPress={()  => navigation.navigate('Home')}
            />
            <View style={styles.textButtonContainer}>
              <Text style={{ fontSize: 12}}>Don't have an account?</Text>
              <CustomButton
                title='Log in'
                backgroundColor='transparent'
                textColor='#03A696'
                fontSize={12}
                underlineOnPress={true}
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </View>       
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContainer: {
    flexGrow: 1, 
    alignItems: 'center'
  },
  logo: {
    margin: 25
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center'
  },
  descText: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center'
  },
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // position: 'relative',
    justifyContent: 'flex-end'
  },
  iconContainer: {
    position: 'absolute',
    paddingRight: 7
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 20
  },
  textButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10
  },
});

export default SignupScreen; 