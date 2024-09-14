import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import ContentContainer from '@/components/ContentContainer'; // Adjust the import path
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Mock useColorScheme hook
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('ContentContainer', () => {
  beforeEach(() => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <ContentContainer>
        <Text>Test Content</Text>
      </ContentContainer>,
    );

    // Check if the child content is rendered
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies correct background color for light theme', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light'); // Mock light mode

    const { getByTestId } = render(
      <ContentContainer>
        <Text>Test Content</Text>
      </ContentContainer>,
    );

    const containerBackground = getByTestId('background').props.style[1][1];

    expect(containerBackground).toHaveProperty(
      'backgroundColor',
      Colors.light.secondary.background,
    );
  });

  it('applies correct background color for dark theme', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark'); // Mock dark mode

    const { getByTestId } = render(
      <ContentContainer>
        <Text>Test Content</Text>
      </ContentContainer>,
    );

    const containerBackground = getByTestId('background').props.style[1][1];

    expect(containerBackground).toHaveProperty(
      'backgroundColor',
      Colors.dark.secondary.background,
    );
  });

  it('has correct layout styles', () => {
    const { getByTestId } = render(
      <ContentContainer>
        <Text>Test Content</Text>
      </ContentContainer>,
    );

    const containerStyles = getByTestId('container').props.style;

    expect(containerStyles).toContainEqual({
      flex: 1,
      overflow: 'scroll',
      width: '90%',
      marginTop: '6%',
      marginBottom: '6%',
      borderRadius: 28,
    });
  });
});
