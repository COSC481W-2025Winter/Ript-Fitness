import CustomButton from '@/components/custom/CustomButton';
import CustomTextInput from '@/components/custom/CustomTextInput';
import React, { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions } from 'react-native'

// Navigation imports
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { httpRequests } from '@/api/httpRequests';
import { GlobalContext } from '@/context/GlobalContext';


type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { width } = Dimensions.get('window');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isUsernameFocused, setUsernameFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const context = useContext(GlobalContext)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle the text input change for password
  const handleEmailPOST = (text: string) => {
    setEmail(text);
  };
  // Handle the text input change for Username
  const handleUsernamePOST = (text: string) => {
    setUsername(text);
  };
  // Handle the text input change for password
  const handlePasswordPOST = (text: string) => {
    setPassword(text);
  };

  // Signup handling
  const handleSignup = async () => { 
    const credentials = {
      email,
      username,
      password,
    };
  
    try {
      // Calls POST 
      const response = await httpRequests.post("/accounts/createNewAccount","", credentials);
  
      // Success case
      if (response.status === 201) {
        const text = await response.text()
        await context?.setToken(text)
        navigateToMainApp(); // Navigate to the main app on successful signup
      } else {
        // Failure case
        const text = await response.text();
        console.error("Signup failed:", text);

        let errorMessage = 'Signup failed. Please check your inputs.';
        if (text.includes('Message:')) {
          const startIndex = text.indexOf('Message:') + 'Message:'.length;
          errorMessage = text.substring(startIndex).trim();
        }        
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  //Focus for inputs
  const handleFocusEmail = () => {
    setEmailFocused(true);
  };
  
  const handleBlurEmail = () => {
    setEmailFocused(false);
  };

  const handleFocusUsername = () => {
    setUsernameFocused(true);
  };
  
  const handleBlurUsername = () => {
    setUsernameFocused(false);
  };
  
  const handleFocusPassword = () => {
    setPasswordFocused(true);
  };
  
  const handleBlurPassword = () => {
    setPasswordFocused(false);
  };

  // After logging in, the user cannot go back to the previous screens
  const navigateToMainApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],  // Only 'Home' will be in the stack
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
            <Text style={styles.mainText}>Register</Text>
            <Text style={styles.descText}>Join the Ript community</Text>
          </View>          
          <View style={styles.buttonContainer}>
            <CustomTextInput
              placeholder='Email'
              textContentType='emailAddress'
              width={width * 0.75}
              onChangeText={handleEmailPOST}
              value={email}
              onFocus={handleFocusEmail}
              onBlur={handleBlurEmail}
              style={isEmailFocused ? styles.focusInput : styles.defaultInput}
            />
            <CustomTextInput
              placeholder='Username'
              // textContentType='username'
              width={width * 0.75}
              onChangeText={handleUsernamePOST}
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
                onChangeText={handlePasswordPOST}
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
              title="Sign up" 
              fontSize={16}
              width={width * 0.75} 
              height={45}
              borderRadius={30}
              // onPress={()  => navigation.navigate('Home')}
              onPress={handleSignup}
            />
            <View style={styles.textButtonContainer}>
              <CustomButton
                title="I'm already registered"
                backgroundColor='transparent'
                textColor='#8E8E8E'
                fontSize={12}
                shouldUnderline={true}
                onPress={() => navigation.navigate('Login')}
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
    alignItems: 'center'
  },
  mainText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#21BFBF',
    textAlign: 'center',
    marginTop: 30,
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
  },
  textButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10
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

export default SignupScreen; 