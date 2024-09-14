import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface BackgroundProps {
  children: React.ReactNode;
}

const ContentContainer: React.FC<BackgroundProps> = ({ children }) => (
  <View testID='container' style={styles.container}>
    <View
      testID='background'
      style={[
        styles.background,
        {
          backgroundColor:
            useColorScheme() === 'light'
              ? Colors.light.secondary.background
              : Colors.dark.secondary.background,
        },
      ]}
    >
      {children}
    </View>
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
