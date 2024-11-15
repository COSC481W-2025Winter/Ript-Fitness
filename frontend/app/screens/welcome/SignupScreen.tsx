import CustomButton from '@/components/custom/CustomButton';
import CustomTextInput from '@/components/custom/CustomTextInput';
import React, { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';

// Navigation imports
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { httpRequests } from '@/api/httpRequests';
import { GlobalContext } from '@/context/GlobalContext';

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { height, width } = Dimensions.get('window');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false); 

  //States for inputs
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //States for focused states
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isUsernameFocused, setUsernameFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  //Validation states
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const context = useContext(GlobalContext);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //Regex for email, username, and password validation
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  const usernameRegex = /^[a-zA-Z0-9]([.-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //Handle text input change for email
  const handleEmailPOST = (text: string) => {
    setEmail(text);
    setIsEmailValid(emailRegex.test(text));
  };

  //Handle text input change for username
  const handleUsernamePOST = (text: string) => {
    setUsername(text);
    setIsUsernameValid(usernameRegex.test(text));
  };

  //Handle text input change for password
  const handlePasswordPOST = (text: string) => {
    setPassword(text);
    setIsPasswordValid(passwordRegex.test(text));
  };

  //Handle form submission
  const handleSignup = async () => {
    setSubmitted(true); // Mark form as submitted

    // Check if any field is empty and show a general error message
    if (!isEmailValid && !isUsernameValid && !isPasswordValid) {
      setErrorMessage('Please enter valid information.');
      return;
    }

    // Reset error messages
    setErrorMessage('');

    // Validate email, username, and password, and show specific error messages
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!isUsernameValid) {
      setErrorMessage('does not meet requirements.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password does not meet requirements.');
      return;
    }

    // Prepare credentials for POST request
    const credentials = { email, username, password };

    try {
      const response = await httpRequests.post("/accounts/createNewAccount", "", credentials);

      if (response.status === 201) {
        const text = await response.text();
        await context?.setToken(text);
        navigateToMainApp(); // Navigate to the home screen after successful signup
      } else {
        const text = await response.text();

        let errorMessage = 'Signup failed. Please check your inputs.';
        if (text.includes('Message:')) {
          const startIndex = text.indexOf('Message:') + 'Message:'.length;
          errorMessage = text.substring(startIndex).trim();
        }
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  //Focus handling
  const handleFocusEmail = () => setEmailFocused(true);
  const handleBlurEmail = () => setEmailFocused(false);
  const handleFocusUsername = () => setUsernameFocused(true);
  const handleBlurUsername = () => setUsernameFocused(false);
  const handleFocusPassword = () => setPasswordFocused(true);
  const handleBlurPassword = () => setPasswordFocused(false);

  //Navigate to Home screen after successful signup
  const navigateToMainApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <View>
              <Text style={styles.mainText}>Register</Text>
              <Text style={styles.descText}>Join the Ript community</Text>
            </View>
            {/* Error message */}
            {submitted && errorMessage ? (
              <View style={[styles.errorContainer, { marginTop: height * -0.01, marginBottom: height * 0.01 }]}>
                <Ionicons name="alert-circle" size={24} color={'#F2505D'} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}
            {/* Email input */}
            <View style={styles.buttonContainer}>
              <CustomTextInput
                placeholder='Email'
                textContentType='emailAddress'
                width={width * 0.75}
                onChangeText={handleEmailPOST}
                value={email}
                autoCapitalize='none'
                keyboardType='email-address'
                onFocus={handleFocusEmail}
                onBlur={handleBlurEmail}
                style={
                  isEmailFocused
                    ? styles.focusInput
                    : !isEmailValid && submitted
                    ? styles.errorInput
                    : styles.defaultInput
                }
              />
              {/* Username input */}
              <CustomTextInput
                placeholder='Username'
                width={width * 0.75}
                onChangeText={handleUsernamePOST}
                value={username}
                autoCapitalize='none'
                onFocus={handleFocusUsername}
                onBlur={handleBlurUsername}
                style={
                  isUsernameFocused
                    ? styles.focusInput
                    : !isUsernameValid && submitted
                    ? styles.errorInput
                    : styles.defaultInput
                }
              />
              {/* Password input */}
              <View style={styles.inputIconContainer}>
                <CustomTextInput
                  placeholder='Password'
                  secureTextEntry={!showPassword}
                  width={width * 0.75}
                  onChangeText={handlePasswordPOST}
                  value={password}
                  autoCapitalize='none'
                  onFocus={handleFocusPassword}
                  onBlur={handleBlurPassword}
                  style={
                    isPasswordFocused
                      ? styles.focusInput
                      : !isPasswordValid && submitted
                      ? styles.errorInput
                      : styles.defaultInput
                  }
                />
                {/* Password icon */}
                <TouchableOpacity onPress={toggleShowPassword} style={styles.iconContainer}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} color={'#A69B8F'} size={24} />
                </TouchableOpacity>
              </View>
              {/* Signup button */}
              <CustomButton
                title="Sign up"
                fontSize={16}
                width={width * 0.75}
                height={45}
                borderRadius={30}
                onPress={handleSignup}
                disabled={!email || !username || !password} //Disable button if any input is empty
                style={
                  !email || !username || !password ? styles.disabledButton : undefined
                }
              />
              {/* Button to Login screen */}
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
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 20,
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
    textAlign: 'center',
  },
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconContainer: {
    position: 'absolute',
    paddingRight: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  textButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  defaultInput: {
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  focusInput: {
    borderColor: '#21BFBF',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: '#F2505D',
    borderWidth: 2,
  },
  errorContainer: {
    backgroundColor: '#FCD3D6',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  errorText: {
    marginLeft: 10,
    color: '#F2505D',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SignupScreen;
