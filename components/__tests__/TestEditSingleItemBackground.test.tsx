import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Mock the useColorScheme hook
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('EditSingleItemBackground', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <EditSingleItemBackground>
        <Text>Test Child</Text>
      </EditSingleItemBackground>,
    );

    // Check if the child component is rendered
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('applies correct background color for light mode', () => {
    // Mock useColorScheme to return 'light'
    (useColorScheme as jest.Mock).mockReturnValue('light');

    const { getByTestId } = render(
      <EditSingleItemBackground>
        <Text>Test Child</Text>
      </EditSingleItemBackground>,
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
      <EditSingleItemBackground>
        <Text>Test Child</Text>
      </EditSingleItemBackground>,
    );

    const backgroundElement = getByTestId('background-container');

    // Verify that the background color for dark mode is applied
    expect(backgroundElement.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.dark.primary.cardBackground,
    );
  });
});
