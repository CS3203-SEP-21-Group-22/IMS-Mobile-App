import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TechnicianMaintHorizontalBar from '@/components/TechnicianMaintHorizontalBar'; // Adjust the path accordingly
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe('TechnicianMaintHorizontalBar', () => {
  it('renders both assigned and completed items', () => {
    const { getByText } = render(
      <TechnicianMaintHorizontalBar selectedIndex={0} />,
    );

    // Check if both assigned and completed buttons are rendered
    expect(getByText('Assigned')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
  });

  it('highlights the selected index correctly', () => {
    const { getByTestId } = render(
      <TechnicianMaintHorizontalBar selectedIndex={1} />,
    );

    // Check if 'Completed' is selected and styled differently
    const completedButtonView = getByTestId('completed');
    expect(completedButtonView.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.light.primary.button,
    );

    // Check if 'Assigned' is not selected and styled differently
    const assignedButtonView = getByTestId('assigned');
    expect(assignedButtonView.props.style[1][1]).toHaveProperty(
      'backgroundColor',
      Colors.light.secondary.background,
    );
  });
});
