import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import SingleItemBackground from '@/components/SingleItemBackground';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Mock the useColorScheme hook
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('SingleItemBackground', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <SingleItemBackground>
        <Text>Test Child</Text>
      </SingleItemBackground>,
    );

    // Check if the child component is rendered
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('applies correct background color for dark mode', () => {
    // Mock useColorScheme to return 'dark'
    (useColorScheme as jest.Mock).mockReturnValue('dark');

    const { getByTestId } = render(
      <SingleItemBackground>
        <Text>Test Child</Text>
      </SingleItemBackground>,
    );

    const backgroundElement = getByTestId('background-container');

    // Verify that the background color for dark mode is applied
    expect(backgroundElement.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.dark.primary.cardBackground,
    );
  });
});
