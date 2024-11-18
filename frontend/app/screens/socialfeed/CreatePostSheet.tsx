import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Platform, 
  Keyboard, 
  Image,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
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
  const inputRef = useRef<TextInput>(null);
  const snapPoints = React.useMemo(() => ['100%'], []);

  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => {
      setIsOpen(true);
      bottomSheetRef.current?.snapToIndex(index);
      
      if (index === 0) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    },
    close: () => {
      Keyboard.dismiss();
      setIsOpen(false);
      bottomSheetRef.current?.close();
    },
  }));

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
    if (index === -1) {
      Keyboard.dismiss();
      setIsOpen(false);
    } else {
      setIsOpen(index === 0);
    }
  }, []);

  const handleSheetAnimate = useCallback((_fromIndex: number, toIndex: number) => {
    if (toIndex === -1) {
      Keyboard.dismiss();
    }
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChange}
      onAnimate={handleSheetAnimate}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
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
              <Text 
                style={[
                  styles.shareButtonText, 
                  !postText.trim() && styles.shareButtonDisabled
                ]}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
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
                autoFocus={false}
                scrollEnabled={true}
              />
            </View>
          </View>

          <View style={styles.mediaButtonsContainer}>
            <TouchableOpacity style={styles.mediaButton}>
              <MaterialIcons name="photo" size={24} color="#21BFBF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton}>
              <MaterialIcons name="camera-alt" size={24} color="#21BFBF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
    keyboardAvoidingView: {
    flex: 1,
  },
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
  mainContent: {
    flexShrink: 1,
  },
  userInfoContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingTop: 0,
    minHeight: 230,
    maxHeight: 230,
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  mediaButton: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePostSheet;

