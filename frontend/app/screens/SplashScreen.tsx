import { Image, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { httpRequests } from '@/api/httpRequests'
import { useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { GlobalContext } from '@/context/GlobalContext';

export default function SplashScreen() {
    const [isLoaded, setLoaded] = useState(false)
    const myGlobalContext = useContext(GlobalContext)
    myGlobalContext?.loadInitialData()

    useEffect(() => {
        const loadData = async () => {
        console.log("Eff")
        console.log(myGlobalContext)
          if (myGlobalContext)
            setLoaded(myGlobalContext.isLoaded);
        };
    
        loadData();
      }, [myGlobalContext?.isLoaded]);

if (!isLoaded) {
    return (<ThemedView style={styles.view}><ThemedText>Loading...</ThemedText></ThemedView>);
} else {
  return (
    <></>
  );
}
}

const styles = StyleSheet.create({
  view: {
    height:'100%',
  },
});
