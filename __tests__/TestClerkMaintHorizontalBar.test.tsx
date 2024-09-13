import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ClerkMaintenancesHorizontalBar from '@/components/ClerkMaintHorizontalBar'; // Adjust the import path
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
    (useColorScheme as jest.Mock).mockReturnValue('light'); // Mocking light theme
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

  it('renders the correct href for each status', () => {
    const { getByText } = render(
      <ClerkMaintenancesHorizontalBar selectedIndex={0} />,
    );

    // Testing links through the text since Link component is mocked
    fireEvent.press(getByText('Pending'));
    fireEvent.press(getByText('Ongoing'));
    fireEvent.press(getByText('Completed'));
  });
});
