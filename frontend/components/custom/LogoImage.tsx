import { Image, StyleProp, StyleSheet, ImageStyle, View } from 'react-native'

interface LogoImageProps {
  style?: StyleProp<ImageStyle>;
}


const LogoImage: React.FC<LogoImageProps> = ({ style }) => {
  return (
    // <View style={[styles.logoContainer]}>
    //   <Image 
    //     style={[styles.logo, style]}
    //     source={require('@/assets/images/Ript-Main-Logo1.png')}
    //   />
    // </View>
    <Image 
        style={[styles.logo, style]}
        source={require('@/assets/images/Ript-Main-Logo1.png')}
    />
  );
};

const styles = StyleSheet.create({
  // logoContainer: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  logo: {
    width: 300,
    height: 110,
  }
});

export default LogoImage;