import CustomButton from '@/components/custom/CustomButton';
import CustomTextInput from '@/components/custom/CustomTextInput';
import LogoImage from '@/components/custom/LogoImage';
import React, { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity } from 'react-native'

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
  const context = useContext(GlobalContext)
  //const navigation = useNavigation<RootScreenNavigationProp>()

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

  // Login handling
  const handleLogin = async () => {
    const credentials = { username, password }; // Assuming these states are set
  
    try {
      const response = await httpRequests.put("/accounts/login","", credentials); // Ensure this matches your API
  
      // Check if the request was successful
      if (response.status === 200) {
        console.log("foo " + context)
        const text = await response.text()
        await context?.setToken(text)
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
              <LogoImage style={styles.logo}/>
          </View>          
          <View style={styles.buttonContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.descText}>Sign into your Account</Text>
            <CustomTextInput
              placeholder='Username'
              width={width * 0.65}
              onChangeText={handleGetUsername}
              value={username}
            />
            <View style={styles.inputIconContainer}>
              <CustomTextInput
                placeholder='Password'
                secureTextEntry={!showPassword}
                width={width * 0.65}
                onChangeText={handleGetPassword}
                value={password}
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
              width={width * 0.4} 
              // onPress={()  => navigation.navigate('Home')}
              onPress={handleLogin}
            />
            <View style={styles.textButtonContainer}>
              <Text style={{ fontSize: 12}}>Don't have an account?</Text>
              <CustomButton
                title='Sign up'
                backgroundColor='transparent'
                textColor='#03A696'
                fontSize={12}
                underlineOnPress={true}
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContainer: {
    flexGrow: 1, 
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  logo: {
    margin: 25
  },
  welcomeText: {
    fontSize: 24,
    // marginTop: 60,
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
  errorText: {
    marginTop: 10,
    color: 'red', 
    textAlign: 'center', 
  },
});

export default LoginScreen;