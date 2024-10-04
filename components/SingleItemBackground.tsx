import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface BackgroundProps {
  children: React.ReactNode;
}

const SingleItemBackground: React.FC<BackgroundProps> = ({ children }) => (
  <View style={styles.container}>
    <View
      testID='background-container'
      style={[
        styles.background,
        {
          backgroundColor:
            useColorScheme() === 'light'
              ? Colors.light.primary.cardBackground
              : Colors.dark.primary.cardBackground,
        },
      ]}
    >
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '90%',
    marginTop: '2%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: '2%',
  },
  background: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingVertical: '4%',
    paddingHorizontal: '6%',
    paddingBottom: '6%',
    borderRadius: 16,
  },
});

export default SingleItemBackground;
