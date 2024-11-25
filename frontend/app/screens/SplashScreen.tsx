import { Image, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { httpRequests } from '@/api/httpRequests'
import { useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { GlobalContext } from '@/context/GlobalContext';

export default function SplashScreen() {
    const [isLoading, setLoading] = useState(false)
    const [isLoaded, setLoaded] = useState(false)
    const context = useContext(GlobalContext)
    const [isLoading2, setLoading2] = useState(false)
    const [isLoaded2, setLoaded2] = useState(false)

    console.log(context?.additionalLoadingRequired)

    if (!isLoading && !isLoaded && context) {
      setLoading(true)
      context.loadInitialData()
      setLoaded(true)
      setLoading(false)
    }

    if (!isLoading2 && !isLoaded2 && context?.additionalLoadingRequired) {
      setLoading2(true)
      context.loadAdditionalData();
      setLoaded2(true)
      setLoading2(false)
    }

if (!context?.isLoaded || context?.additionalLoadingRequired) {
    return (<ThemedView style={styles.view}><Image 
      style={[styles.logo]}
       resizeMode="contain"
      source={require('@/assets/images/Ript_logo.png')}
  /></ThemedView>);
} else {
  return (
    <></>
  );
}
}

const styles = StyleSheet.create({
  view: {
    flex:1,
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center",
  },
  logo: {
    width:"80%",
  },
});
