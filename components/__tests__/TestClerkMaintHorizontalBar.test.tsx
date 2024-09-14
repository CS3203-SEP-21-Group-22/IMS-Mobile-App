import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ClerkMaintenancesHorizontalBar from '@/components/ClerkMaintHorizontalBar';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Mock necessary dependencies
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children, // Mocking Link component
}));

describe('ClerkMaintenancesHorizontalBar', () => {
  beforeEach(() => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
  });

  it('renders all maintenance statuses', () => {
    const { getByText } = render(
      <ClerkMaintenancesHorizontalBar selectedIndex={0} />,
    );

    // Check if the three maintenance statuses are rendered
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('Ongoing')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
  });

  it('applies the correct background color based on the selected index for light theme', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light'); // Mocking light theme

    const { getByTestId } = render(
      <ClerkMaintenancesHorizontalBar selectedIndex={1} />,
    );

    // Check background color for 'Ongoing'
    const ongoingBackground = getByTestId('ongoing').props.style[1][1];

    expect(ongoingBackground).toHaveProperty(
      'backgroundColor',
      Colors.light.primary.button,
    );
  });

  it('applies the correct background color based on the selected index for dark theme', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark'); // Mocking dark theme

    const { getByTestId } = render(
      <ClerkMaintenancesHorizontalBar selectedIndex={1} />,
    );

    // Check background color for 'Ongoing'
    const ongoingBackground = getByTestId('ongoing').props.style[1][1];

    expect(ongoingBackground).toHaveProperty(
      'backgroundColor',
      Colors.dark.primary.button,
    );
  });
});
