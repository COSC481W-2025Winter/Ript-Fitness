//Terminal run commands:

  //Running the android app
    //npm run android

  //Running on browser:
    //npm run web

  //Running on IOS
    //To directly install it, looks like we need a mac
    //However using the app Expo Go, we can run a version of it.
    //I don't have an ios device, but it appears just run
    //npm run start
    //then scan QR code that appears in the

//Stop Server with Ctrl+C


//Running your android emulator (yours may vary):
  //emulator -avd Pixel_3a_API_34_extension_level_7_x86_64

import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { httpRequests } from '@/api/httpRequests'
import { useEffect, useState } from 'react';

export default function HomeScreen() {


  const [ myVal, setMyVal ] = useState("")
  const [ val2, setMyVal2 ] = useState("")


  useEffect(() => {
    const setValues = async () => {
      const response = await httpRequests.get("/test")
      const exampleJson = {
        id: 1,
        firstName: "John",
        lastName: "Doe"
      };
      const res2 = await httpRequests.post("/addTestObject", exampleJson)
      setMyVal(response);//[0].text);
      setMyVal2(res2)
     }
    setValues();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <TouchableOpacity onPress={() => alert(myVal)}><ThemedText>buttonHere</ThemedText></TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1:  {myVal} fy it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to {val2} changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
