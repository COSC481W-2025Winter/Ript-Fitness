// import CustomButton from '@/components/custom/CustomButton';
// import CustomTextInput from '@/components/custom/CustomTextInput';
// import LogoImage from '@/components/custom/LogoImage';
// import React, { useState } from 'react';
// import { Ionicons } from '@expo/vector-icons';
// import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity } from 'react-native'

// // Navigation imports
// import { RootStackParamList } from '../../App';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';


// type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

// const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
//   const [showPassword, setShowPassword] = useState(false);

//   const { width } = Dimensions.get('window');
//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };
  
//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.container}>
//           <View>
//               <LogoImage style={styles.logo}/>
//           </View>          
//           <View style={styles.buttonContainer}>
//             <Text style={styles.welcomeText}>Welcome Back</Text>
//             <Text style={styles.descText}>Sign into your Account</Text>
//             <CustomTextInput
//               placeholder='Username'
//               width={width * 0.65}
//             />
//             <View style={styles.inputIconContainer}>
//               <CustomTextInput
//                 placeholder='Password'
//                 secureTextEntry={!showPassword}
//                 width={width * 0.65}
//               />
//               <TouchableOpacity onPress={toggleShowPassword} style={styles.iconContainer}>
//                 <Ionicons 
//                   name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
//                   color={'#A69B8F'}
//                   size={24}
//                 />
//               </TouchableOpacity>
//             </View>
//             <CustomButton 
//               title="Log in" 
//               fontSize={16}
//               width={width * 0.4} 
//               onPress={()  => navigation.navigate('Home')}
//             />
//             <View style={styles.textButtonContainer}>
//               <Text style={{ fontSize: 12}}>Don't have an account?</Text>
//               <CustomButton
//                 title='Sign up'
//                 backgroundColor='transparent'
//                 textColor='#03A696'
//                 fontSize={12}
//                 underlineOnPress={true}
//                 onPress={() => navigation.navigate('Signup')}
//               />
//             </View>
//           </View>       
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   scrollContainer: {
//     flexGrow: 1, 
//     // justifyContent: 'center',
//     // alignItems: 'center',
//   },
//   logo: {
//     margin: 25
//   },
//   welcomeText: {
//     fontSize: 24,
//     // marginTop: 60,
//     textAlign: 'center'
//   },
//   descText: {
//     fontSize: 15,
//     marginTop: 10,
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   inputIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // position: 'relative',
//     justifyContent: 'flex-end'
//   },
//   iconContainer: {
//     position: 'absolute',
//     paddingRight: 7
//   },
//   buttonContainer: {
//     flexDirection: 'column',
//     // justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 20
//   },
//   textButtonContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: -10
//   },
// });

// export default LoginScreen; 

import CustomButton from '@/components/custom/CustomButton';
import CustomTextInput from '@/components/custom/CustomTextInput';
import LogoImage from '@/components/custom/LogoImage';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity } from 'react-native'

// Navigation imports
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { httpRequests } from '@/api/httpRequests';


type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { width } = Dimensions.get('window');
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


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
    const credentials = { //create a json object using the variables set in our textboxes
      "username": username,
      "password": password,
    };
    console.log(username);
    console.log(password);
    try {
      // Make GET request
      const response = await httpRequests.put("/accounts/login", credentials);

      // Check if login was successful
      if (response && response.status === 200) {
        // Go to Home page
        navigation.navigate('Home');
      }
      else {
        // Unsuccessful login
        console.error("Login failed:", response.data.message || "Unknown error");
        setErrorMessage(response.data.message || "Login failed. Please check your username and password.");
      }
      // setResponseText(JSON.stringify(response))
    }
    catch (error) {
      console.error("Login error:", error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  }
  
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
    // justifyContent: 'center',
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