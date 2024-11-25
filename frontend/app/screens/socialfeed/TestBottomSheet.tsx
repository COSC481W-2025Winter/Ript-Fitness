import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

export default function TestBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  React.useEffect(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  return (
    <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={['50%']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Hello, I am a Bottom Sheet!</Text>
      </View>
    </BottomSheet>
  );
}
