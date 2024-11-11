import CustomButton from '@/components/custom/CustomButton';
import CustomTextInput from '@/components/custom/CustomTextInput';
import React, { createContext, useState, ReactNode, useEffect, useContext, useRef} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity, TextInput, } from 'react-native'


// Navigation imports
import { RootScreenNavigationProp, RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { httpRequests } from '@/api/httpRequests';
import { GlobalContext } from '@/context/GlobalContext';

import { useNavigation } from '@react-navigation/native';



type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { width } = Dimensions.get('window');
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUsernameFocused, setUsernameFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const context = useContext(GlobalContext)

  // Hiding password when typing
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle the text input change for Username
  const handleGetUsername = (text: string) => {
    setUsername(text);
  };
  // Handle the text input change for password
  const handleGetPassword = (text: string) => {
    setPassword(text);
  };

  //Focus for inputs
  const handleFocusUsername = () => {
    console.log('Username input focused');
    setUsernameFocused(true);
  };
  
  const handleBlurUsername = () => {
    console.log('Username input blurred');
    setUsernameFocused(false);
  };
  
  const handleFocusPassword = () => {
    console.log('Password input focused');
    setPasswordFocused(true);
  };
  
  const handleBlurPassword = () => {
    console.log('Password input blurred');
    setPasswordFocused(false);
  };

  // Login handling
  const handleLogin = async () => {
    const credentials = { username, password }; // Assuming these states are set
  
    try {
      const response = await httpRequests.put("/accounts/login","", credentials); // Ensure this matches your API
  
      // Check if the request was successful
      if (response.status === 200) {

        const text = await response.text();
        await context?.setToken(text);

        navigateToMainApp(); // Navigate to the main app on success
      } else {
        // Attempt to read the error message from the response body
        const text = await response.text(); // Get the response body as text
        console.error('Login failed:', text); // Log the response body for debugging
  
        let errorMessage = 'Login failed. Please check your inputs.';
        if (text.includes('Message:')) {
          const startIndex = text.indexOf('Message:') + 'Message:'.length;
          errorMessage = text.substring(startIndex).trim();
        }
        // Set the error message for the user
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

    // After logging in, the user cannot go back to the previous screens
  const navigateToMainApp = () => {
    console.log(navigation.getState());
    navigation.reset({
      index: 0,
      routes: [{ name:"Home"}],  // Only 'Home' will be in the stack
    });
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
            <Text style={styles.mainText}>Log in</Text>
            <Text style={styles.descText}>Sign into your Account</Text> 
          </View>    
          <View style={styles.buttonContainer}> 
            {/* <Text style={styles.labelUsername}>Username</Text> */}
            <CustomTextInput
              placeholder='Username'
              width={width * 0.75}
              onChangeText={handleGetUsername}
              value={username}
              onFocus={handleFocusUsername}
              onBlur={handleBlurUsername}
              style={isUsernameFocused ? styles.focusInput : styles.defaultInput}
            />
            <View style={styles.inputIconContainer}>
              <CustomTextInput
                placeholder='Password'
                secureTextEntry={!showPassword}
                width={width * 0.75}
                onChangeText={handleGetPassword}
                value={password}
                onFocus={handleFocusPassword}
                onBlur={handleBlurPassword}
                style={isPasswordFocused ? styles.focusInput : styles.defaultInput}
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
              title="Log in" 
              fontSize={16}
              width={width * 0.75} 
              height={45}
              borderRadius={30}
              // style={{
              //   marginTop: 45
              // }}
              onPress={handleLogin}
            />
            <View style={styles.textButtonContainer}>
              <CustomButton
                title="I don't have an account"
                backgroundColor='transparent'
                textColor='#8E8E8E'
                fontSize={12}
                shouldUnderline={true}
                onPress={() => navigation.navigate('Signup')}
              />
            </View>
            {/* Display error message */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  scrollContainer: {
    flexGrow: 1, 
  },
  mainText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#21BFBF',
    textAlign: 'center'
  },
  descText: {
    fontSize: 16,
    color: '#3F4040',
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
    paddingRight: 20
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: '#757575',
  },
  labelUsername:{
    color: '#3F4040',
    fontSize: 16,
    alignSelf: 'flex-start',
    paddingLeft: 24,
  },
  textButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
  },
  defaultInput: {
    marginBottom: 10,
  },
  focusInput: {
    borderColor: '#21BFBF',
    borderWidth: 2,
  },
  errorText: {
    marginTop: 10,
    color: 'red', 
    textAlign: 'center', 
  },
});

export default LoginScreen;