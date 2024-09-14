import React from 'react';
import { View, Text } from '@/components/Themed';
import { render } from '@testing-library/react-native';
import BackgroundLayout from '@/components/BackgroundLayout';

describe('BackgroundLayout', () => {
  it('renders the children correctly', () => {
    const { getByText } = render(
      <BackgroundLayout>
        <Text>Test Child</Text>
      </BackgroundLayout>,
    );
    // Check if the child is rendered inside the BackgroundLayout
    expect(getByText('Test Child')).toBeTruthy();
  });
});
