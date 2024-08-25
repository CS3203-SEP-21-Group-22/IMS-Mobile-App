import React from 'react';
import { StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { View } from './Themed';

interface BackgroundProps {
  children: React.ReactNode;
}

const ContentContainer: React.FC<BackgroundProps> = ({ children }) => (
  <View style={styles.container}>
    <ImageBackground
      source={require('@/assets/images/scrollContainer.webp')}
      style={styles.background}
      borderRadius={28}
    >
      {children}
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'scroll',
    width: '90%',
    marginTop: '6%',
    marginBottom: '6%',
    borderRadius: 28,
  },
  background: {
    flex: 1,
    resizeMode: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
    paddingTop: '7%',
    paddingBottom: '8%',
  },
});

export default ContentContainer;
