import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import ListItemBackground from '@/components/ListItemBackground';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Mock the useColorScheme hook
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('ListItemBackground', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ListItemBackground>
        <Text>Test Child</Text>
      </ListItemBackground>,
    );

    // Check if the child component is rendered
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('applies correct background color for light mode', () => {
    // Mock useColorScheme to return 'light'
    (useColorScheme as jest.Mock).mockReturnValue('light');

    const { getByTestId } = render(
      <ListItemBackground>
        <Text>Test Child</Text>
      </ListItemBackground>,
    );

    const backgroundElement = getByTestId('background-container');

    // Verify that the background color for light mode is applied
    expect(backgroundElement.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.light.primary.cardBackground,
    );
  });

  it('applies correct background color for light mode', () => {
    // Mock useColorScheme to return 'light'
    (useColorScheme as jest.Mock).mockReturnValue('light');

    const { getByTestId } = render(
      <ListItemBackground>
        <Text>Test Child</Text>
      </ListItemBackground>,
    );

    const backgroundElement = getByTestId('background-container');

    // Verify that the background color for light mode is applied
    expect(backgroundElement.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.light.primary.cardBackground,
    );
  });

  it('applies correct background color for dark mode', () => {
    // Mock useColorScheme to return 'dark'
    (useColorScheme as jest.Mock).mockReturnValue('dark');

    const { getByTestId } = render(
      <ListItemBackground>
        <Text>Test Child</Text>
      </ListItemBackground>,
    );

    const backgroundElement = getByTestId('background-container');

    // Verify that the background color for dark mode is applied
    expect(backgroundElement.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.dark.primary.cardBackground,
    );
  });
});
