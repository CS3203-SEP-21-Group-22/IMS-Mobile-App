import React from 'react';
import { render } from '@testing-library/react-native';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Mock necessary dependencies
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children, // Mocking Link component
}));

describe('ClerkReservationsHorizontalBar', () => {
  beforeEach(() => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
  });

  it('renders all reservation statuses', () => {
    const { getByText } = render(
      <ClerkReservationsHorizontalBar selectedIndex={0} />,
    );

    // Check if the three reservation statuses are rendered
    expect(getByText('Requested')).toBeTruthy();
    expect(getByText('Reserved')).toBeTruthy();
    expect(getByText('Borrowed')).toBeTruthy();
  });

  it('applies the correct background color based on the selected index for dark theme', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark'); // Mocking dark theme

    const { getByTestId } = render(
      <ClerkReservationsHorizontalBar selectedIndex={1} />,
    );

    // Check background color for 'Reserved'
    const reservedBackground = getByTestId('reserved').props.style[1][1];

    expect(reservedBackground).toHaveProperty(
      'backgroundColor',
      Colors.dark.primary.button,
    );
  });
});
