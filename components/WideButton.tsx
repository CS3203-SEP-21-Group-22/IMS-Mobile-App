import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ButtonProps {
  buttonClickHandler: () => void;
  text: string;
  danger?: boolean;
}

const WideButton: React.FC<ButtonProps> = ({
  buttonClickHandler,
  text,
  danger,
}) => (
  <View style={styles.button}>
    <View
      style={[
        styles.buttonBackground,
        {
          backgroundColor:
            useColorScheme() === 'light'
              ? danger
                ? Colors.light.secondary.button
                : Colors.light.primary.button
              : danger
                ? Colors.dark.secondary.button
                : Colors.dark.primary.button,
        },
      ]}
    >
      <Pressable
        onPress={buttonClickHandler}
        style={{ width: '100%', alignItems: 'center' }}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
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
  button: {
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: '4%',
  },
  buttonBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: '0.5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
  },
});

export default WideButton;
