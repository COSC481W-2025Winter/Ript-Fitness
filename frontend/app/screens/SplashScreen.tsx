import { Image, StyleSheet, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '@/context/GlobalContext';
import { ThemedView } from '@/components/ThemedView';

export default function SplashScreen() {
  const [isLoading, setLoading] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [isLoaded2, setLoaded2] = useState(false);
  const context = useContext(GlobalContext);

  useEffect(() => {
    console.log("additionalLoadingRequired:", context?.additionalLoadingRequired);
  }, [context?.additionalLoadingRequired]);

  useEffect(() => {
    if (!isLoading && !isLoaded && context) {
      setLoading(true);
      context.loadInitialData();
      setLoaded(true);
      setLoading(false);
    }
  }, [context, isLoading, isLoaded]);

  useEffect(() => {
    if (!isLoading2 && !isLoaded2 && context?.additionalLoadingRequired) {
      setLoading2(true);
      context.loadAdditionalData();
      setLoaded2(true);
      setLoading2(false);
    }
  }, [context?.additionalLoadingRequired, isLoading2, isLoaded2]);

  if (!context?.isLoaded || context?.additionalLoadingRequired) {
    return (
      <ThemedView style={styles.view}>
        <Image
          style={styles.logo}
          source={require('@/assets/images/splash-icon.png')}
        />
      </ThemedView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21BFBF',
  },
  logo: {
    width: 100,
    height: 118,
  },
});
