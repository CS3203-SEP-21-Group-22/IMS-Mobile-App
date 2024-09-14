import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShortButtonsBar from '@/components/ShortButtonsBar'; // Adjust the import path based on your project structure

describe('ShortButtonsBar', () => {
  const mockPrimaryButtonClickHandler = jest.fn();
  const mockSecondaryButtonClickHandler = jest.fn();

  const primaryButtonText = 'Confirm';
  const secondaryButtonText = 'Cancel';

  it('renders primary and secondary buttons with correct text', () => {
    const { getByText } = render(
      <ShortButtonsBar
        primaryButtonClickHandler={mockPrimaryButtonClickHandler}
        secondaryButtonClickHandler={mockSecondaryButtonClickHandler}
        primaryButtonText={primaryButtonText}
        secondaryButtonText={secondaryButtonText}
      />,
    );

    // Check if both buttons are rendered with the correct text
    expect(getByText(primaryButtonText)).toBeTruthy();
    expect(getByText(secondaryButtonText)).toBeTruthy();
  });

  it('calls the primaryButtonClickHandler when primary button is pressed', () => {
    const { getByText } = render(
      <ShortButtonsBar
        primaryButtonClickHandler={mockPrimaryButtonClickHandler}
        secondaryButtonClickHandler={mockSecondaryButtonClickHandler}
        primaryButtonText={primaryButtonText}
        secondaryButtonText={secondaryButtonText}
      />,
    );

    // Simulate press on the primary button
    fireEvent.press(getByText(primaryButtonText));

    // Ensure the primary button handler is called
    expect(mockPrimaryButtonClickHandler).toHaveBeenCalledTimes(1);
  });

  it('calls the secondaryButtonClickHandler when secondary button is pressed', () => {
    const { getByText } = render(
      <ShortButtonsBar
        primaryButtonClickHandler={mockPrimaryButtonClickHandler}
        secondaryButtonClickHandler={mockSecondaryButtonClickHandler}
        primaryButtonText={primaryButtonText}
        secondaryButtonText={secondaryButtonText}
      />,
    );

    // Simulate press on the secondary button
    fireEvent.press(getByText(secondaryButtonText));

    // Ensure the secondary button handler is called
    expect(mockSecondaryButtonClickHandler).toHaveBeenCalledTimes(1);
  });
});
