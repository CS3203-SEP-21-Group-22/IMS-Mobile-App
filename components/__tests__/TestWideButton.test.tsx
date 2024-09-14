import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WideButton from '@/components/WideButton'; // Adjust the path based on your structure
import Colors from '@/constants/Colors';

jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn().mockReturnValue('light'), // Mocking color scheme as light for testing
}));

describe('WideButton', () => {
  it('renders the button text correctly', () => {
    const { getByText } = render(
      <WideButton buttonClickHandler={() => {}} text='Test Button' />,
    );

    // Check if the button text is rendered correctly
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls the buttonClickHandler when pressed', () => {
    const mockClickHandler = jest.fn();
    const { getByText } = render(
      <WideButton buttonClickHandler={mockClickHandler} text='Test Button' />,
    );

    // Simulate pressing the button
    fireEvent.press(getByText('Test Button'));

    // Verify that the click handler was called
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  it('renders with the correct primary background color in light mode', () => {
    const { getByTestId } = render(
      <WideButton buttonClickHandler={() => {}} text='Primary Button' />,
    );

    const button = getByTestId('buttonBackground');
    expect(button.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.light.primary.button,
    );
  });

  it('renders with the correct secondary (danger) background color in light mode', () => {
    const { getByTestId } = render(
      <WideButton buttonClickHandler={() => {}} text='Danger Button' danger />,
    );

    const button = getByTestId('buttonBackground');
    expect(button.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.light.secondary.button,
    );
  });
});
