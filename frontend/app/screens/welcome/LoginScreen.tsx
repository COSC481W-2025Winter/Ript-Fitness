import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/custom/CustomButton';
import CustomTextInput from '@/components/custom/CustomTextInput';
import { GlobalContext } from '@/context/GlobalContext';
import { httpRequests } from '@/api/httpRequests';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { height, width } = Dimensions.get('window');
  const context = useContext(GlobalContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [usernameErrorMessage, setusernameErrorMessage] = useState('');
  const [passwordErrorMessage, setpasswordErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  //Use states for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  //States for focused states
  const [isUsernameFocused, setUsernameFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  //Validation states for username and password
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

    //Handle text input change for username
    const handleUsernameChange = (text: string) => {
      setUsername(text);
      if (!isUsernameValid) setIsUsernameValid(true);
      if (usernameErrorMessage) setusernameErrorMessage('');
    };

    //Handle text input change for password
    const handlePasswordChange = (text: string) => {
      setPassword(text);
      if (!isPasswordValid) setIsPasswordValid(true);
      if (passwordErrorMessage) setpasswordErrorMessage('');
    };

  const handleLogin = async () => {
    setSubmitted(true);
    setErrorMessage('');

    const credentials = { username, password };
    try {
      const response = await httpRequests.put("/accounts/login", "", credentials);

      if (response.status === 200) {
        const text = await response.text();
        await context?.setToken(text);
        navigateToMainApp();
      } else {
        const text = await response.text();
        let errorMessage = 'Login failed. Please check your inputs.';
        if (text.includes('Username')) {
          const startIndex = text.indexOf('Message:') + 'Message:'.length;
          errorMessage = text.substring(startIndex).trim();
          setIsUsernameValid(false);
          setusernameErrorMessage(errorMessage);
        } else if (text.includes('Incorrect')) {
          const startIndex = text.indexOf('Message:') + 'Message:'.length;
          errorMessage = text.substring(startIndex).trim();
          setIsPasswordValid(false);
          setpasswordErrorMessage(errorMessage);
        }
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const navigateToMainApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // Adjust layout when keyboard shows
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <View>
              <Text style={styles.mainText} testID='login-header'>Log in</Text>
              <Text style={styles.descText}>Sign into your Account</Text>
            </View>
            {/* Username input */}
            <View style={styles.buttonContainer}>
              <CustomTextInput
                placeholder="Username"
                width={width * 0.75}
                onChangeText={handleUsernameChange}
                value={username}
                autoCapitalize='none'
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                style={
                  isUsernameFocused
                    ? styles.focusInput
                    : !isUsernameValid && submitted
                    ? styles.errorInput
                    : styles.defaultInput
                }
              />
              {/* Username Error Message Popup */}
              {errorMessage ? (
              <View style={{ marginTop: height * -0.01, flexWrap: 'wrap', width: width * 0.75, flexDirection: 'row'  }}>
                <Text style={styles.secondaryErrorText}>{usernameErrorMessage}</Text>
              </View>
              ) : null}
              {/* Password input */}
              <View style={styles.inputIconContainer}>
                <CustomTextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  width={width * 0.75}
                  onChangeText={handlePasswordChange}
                  value={password}
                  autoCapitalize='none'
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  style={
                    isPasswordFocused
                      ? styles.focusInput
                      : !isPasswordValid && submitted
                      ? styles.errorInput
                      : styles.defaultInput
                  }
                />
                {/* Password icon */}
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    color={'#A69B8F'}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
              {/* Username Error Message Popup */}
              {errorMessage ? (
                <View style={{ marginTop: height * -0.01, flexWrap: 'wrap', width: width * 0.75, flexDirection: 'row'  }}>
                  <Text style={styles.secondaryErrorText}>{passwordErrorMessage}</Text>
                </View>
              ) : null}
              {/* Login button */}
              <CustomButton
                title="Log in"
                fontSize={16}
                width={width * 0.75}
                height={45}
                borderRadius={30}
                onPress={handleLogin}
                disabled={!username || !password}
                style={
                  !username || !password ? styles.disabledButton : undefined
                }
              />
              {/* Button to Signup screen */}
              <View style={styles.textButtonContainer}>
                <CustomButton
                  title="I don't have an account"
                  backgroundColor="transparent"
                  textColor="#8E8E8E"
                  fontSize={12}
                  shouldUnderline={true}
                  onPress={() => navigation.navigate('Signup')}
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
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
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
  secondaryErrorText: {
    marginLeft: 20,
    color: '#F2505D',
    fontSize: 14,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  disabledButton: {
    opacity: 0.5,
  },
  defaultInput: {
    marginBottom: 10,
  },
  focusInput: {
    borderColor: '#21BFBF',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: '#F2505D',
    borderWidth: 2,
  },
  textButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
  },
});

export default LoginScreen;
