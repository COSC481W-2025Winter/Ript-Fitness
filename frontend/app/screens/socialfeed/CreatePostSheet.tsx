import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, TextInput, TouchableOpacity, Text, Platform, StyleSheet, Keyboard, Image } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useSocialFeed } from '@/context/SocialFeedContext';

import ProfileImage from '../../../assets/images/profile/Profile.png';

export interface CreatePostSheetRef {
  snapToIndex: (index: number) => void;
  close: () => void;
}

const CreatePostSheet = forwardRef<CreatePostSheetRef>((props, ref) => {
  const [postText, setPostText] = useState('');
  const { addPost } = useSocialFeed();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => {
      setIsOpen(true);
      bottomSheetRef.current?.snapToIndex(index);
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
    close: () => {
      Keyboard.dismiss();
      setIsOpen(false);
      bottomSheetRef.current?.close();
    },
  }));

  const inputRef = useRef<TextInput>(null);
  const snapPoints = React.useMemo(() => ['100%'], []);

  const handlePost = async () => {
    if (postText.trim()) {
      await addPost(postText);
      Keyboard.dismiss();
      setPostText('');
      setIsOpen(false);
      bottomSheetRef.current?.close();
    }
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    setPostText('');
    setIsOpen(false);
    bottomSheetRef.current?.close();
  };

  const handleSheetChange = useCallback((index: number) => {
    setIsOpen(index === 0);
    if (index === -1) {
      Keyboard.dismiss();
    }
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
      keyboardBlurBehavior="none"
      onChange={handleSheetChange}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
          onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Post</Text>
          <TouchableOpacity
              style={[
              styles.shareButton, 
              !postText.trim() && styles.shareButtonDisabled
              ]}
            onPress={handlePost}
            disabled={!postText.trim()}
          >
            <Text style={[styles.shareButtonText, !postText.trim() && styles.shareButtonDisabled]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfoContainer}>
          <Image 
            source={ProfileImage}
            style={styles.profileImage}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            multiline
            placeholder="What's happening?"
            value={postText}
            onChangeText={setPostText}
            autoFocus={true}
          />
        </View>

        <View style={styles.mediaButtonsContainer}>
          <TouchableOpacity style={styles.mediaButton}>
            <MaterialIcons name="photo" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <MaterialIcons name="camera-alt" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    padding: 4,
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#000',
  },
  shareButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: '#21BFBF',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 17,
    letterSpacing: 0.1,
    lineHeight: 24,
  },
  shareButtonDisabled: {
    
    opacity: 0.5,
  },
  userInfoContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
    profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'white',
    marginRight: 12,
    
  },
  userInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingTop: 0,
    minHeight: 40,
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  mediaButton: {
    marginRight: 16,
    padding: 8,
  },
});

export default CreatePostSheet;