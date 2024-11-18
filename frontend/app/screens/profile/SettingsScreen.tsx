import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GlobalContext } from '@/context/GlobalContext';
import { httpRequests } from '@/api/httpRequests';

const SettingsScreen = ({ navigation }: any) => {
    const context = useContext(GlobalContext)
  const [displayName, setDisplayName] = useState(context?.userProfile.username);
  const [bio, setBio] = useState("placeholder");
  const [email, setEmail] = useState("placeholder");
  const [error, setError] = useState("");


  const setEmailChecked = (value: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(value)) {
      setError("");
      setEmail(value);
    } else {
      setError("Please use a valid email address.");
      setEmail(value);
    }
  };

  const saveSettings = async () => {
    if (context?.userProfile.username != displayName) {
        const newProfile : any = {
            ...context?.userProfile,
            username: displayName ?? context?.userProfile.username // Replace `newId` with the desired new Id
    };
    console.log(newProfile)
        try {
        await context?.updateUserProfile(newProfile)
        const response = await fetch(`${httpRequests.getBaseURL()}/userProfile/updateUserProfile`, {
            method: 'PUT', // Set method to POST
            headers: {
              'Content-Type': 'application/json', // Set content type to JSON
              "Authorization": `Bearer ${context?.data.token}`,
            },
            body: `${JSON.stringify(newProfile)}`, // Convert the data to a JSON string
          }); // Use endpoint or replace with BASE_URL if needed
          if (!response.ok) {

          }
          //const json = await response.text() //.json(); // Parse the response as JSON;
          //return json; // Return the JSON data directly
          console.log(await response.text())
        } catch (error) {
        
          console.error('GET request failed:', error);
          throw error; // Throw the error for further handling if needed
        }
        };
  };

  const changePicture = () => {
    // Handle picture change logic here
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true}
      extraScrollHeight={80} // Adjust to match the height of the bottom tab bar if needed
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Account Settings</Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        <Image
          source={require('../../../assets/images/profile/Profile.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraIcon} onPress={changePicture}>
          <Ionicons name="camera" size={50} color="white" style={{ opacity: 0.75 }} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorLabel}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            multiline
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmailChecked}
            keyboardType="email-address"
          />
        </View>
        <TouchableOpacity style={styles.infoRow} onPress={() => navigation.navigate("ChangePasswordScreen")}>
          <Text style={styles.label}>Change password</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saveButtonText: { color: '#00796B', fontWeight: 'bold' },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  errorContainer: {
    marginHorizontal: '10%',
    alignItems: 'center',
    marginVertical: 8,
  },
  errorLabel: { fontSize: 16, color: 'red' },
  infoContainer: { paddingHorizontal: 16, flexGrow: 1 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: { fontSize: 16, fontWeight: '500', color: '#333' },
  input: { fontSize: 16, color: '#333', flex: 1, textAlign: 'right' },
});

export default SettingsScreen;
