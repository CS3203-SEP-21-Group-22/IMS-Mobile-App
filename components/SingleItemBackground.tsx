import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { View } from './Themed';

interface BackgroundProps {
  children: React.ReactNode;
}

const SingleItemBackground: React.FC<BackgroundProps> = ({ children }) => (
  <View style={styles.container}>
    <ImageBackground
      source={require('@/assets/images/greenLarge.webp')}
      style={styles.background}
      borderRadius={10}
    >
      {children}
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: '2%',
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingVertical: '4%',
  },
});

export default SingleItemBackground;
