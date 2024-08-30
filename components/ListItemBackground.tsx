import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface BackgroundProps {
  children: React.ReactNode;
}

const ListItemBackground: React.FC<BackgroundProps> = ({ children }) => (
  <View style={styles.container}>
    <View
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
    borderRadius: 16,
  },
});

export default ListItemBackground;
