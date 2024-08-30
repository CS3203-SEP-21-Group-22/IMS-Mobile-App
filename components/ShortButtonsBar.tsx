import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ButtonProps {
  primaryButtonClickHandler: () => void;
  secondaryButtonClickHandler: () => void;
  primaryButtonText: string;
  secondaryButtonText: string;
}

const ShortButtonsBar: React.FC<ButtonProps> = ({
  primaryButtonClickHandler,
  secondaryButtonClickHandler,
  primaryButtonText,
  secondaryButtonText,
}) => (
  <View style={styles.buttonsContainer}>
    <View style={styles.button}>
      <View
        style={[
          styles.buttonBackground,
          {
            backgroundColor:
              useColorScheme() === 'light'
                ? Colors.light.secondary.button
                : Colors.dark.secondary.button,
          },
        ]}
      >
        <Pressable
          onPress={secondaryButtonClickHandler}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <Text style={styles.buttonText}>{secondaryButtonText}</Text>
        </Pressable>
      </View>
    </View>
    <View style={styles.button}>
      <View
        style={[
          styles.buttonBackground,
          {
            backgroundColor:
              useColorScheme() === 'light'
                ? Colors.light.primary.button
                : Colors.dark.primary.button,
          },
        ]}
      >
        <Pressable
          onPress={primaryButtonClickHandler}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <Text style={styles.buttonText}>{primaryButtonText}</Text>
        </Pressable>
      </View>
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '3%',
    backgroundColor: 'transparent',
  },
  button: {
    width: '45%',
    backgroundColor: 'transparent',
  },
  buttonBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    paddingTop: '4%',
    paddingBottom: '6%',
  },
});

export default ShortButtonsBar;
