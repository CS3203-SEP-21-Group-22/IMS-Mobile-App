import React from 'react';
import { StyleSheet,ImageBackground, Dimensions } from 'react-native';
import { View } from './Themed';

const screenHeight = Dimensions.get('window').height; 
const screenWidth = Dimensions.get('window').width; 

interface BackgroundProps {
  children: React.ReactNode;
}

const BackgroundLayout: React.FC<BackgroundProps> = ({ children }) => (
  <ImageBackground
    source={require('../assets/images/background.webp')}
    style={styles.background}
  >
    {children}
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'stretch',
    justifyContent: 'center',
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
  }
});

export default BackgroundLayout;