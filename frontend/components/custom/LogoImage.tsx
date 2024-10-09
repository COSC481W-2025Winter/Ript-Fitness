import { Image, StyleProp, StyleSheet, ImageStyle } from 'react-native'

interface LogoImageProps {
  style?: StyleProp<ImageStyle>;
}


const LogoImage: React.FC<LogoImageProps> = ({ style }) => {
  return (
    <Image 
        style={[styles.logo, style]}
        source={require('@/assets/images/Ript-Main-Logo1.png')}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 110,
  }
});

export default LogoImage;