import CustomButton from '@/components/custom/CustomButton';
import CustomTextInput from '@/components/custom/CustomTextInput';
import LogoImage from '@/components/custom/LogoImage';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View>
              <LogoImage style={styles.logo}/>
          </View>          
          <View style={styles.buttonContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.descText}>Sign into your Account</Text>
            <CustomTextInput
              placeholder='Username'
              width={240}
            />
            <CustomTextInput
              placeholder='Password'
              width={240}
            />
            <CustomButton 
              title="Log in" 
              fontSize={16}
              width={150} 
              // onPress={()  => navigation.navigate('Login')}
            />
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
  buttonContainer: {
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
});