import React from 'react';
import { render } from '@testing-library/react-native';
import ContentContainerHeader from '@/components/ContentContainerHeader'; // Adjust the import path

describe('ContentContainerHeader', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<ContentContainerHeader title='Test Title' />);

    // Check if the title is rendered with the correct text
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('applies correct styles to the title', () => {
    const { getByText } = render(
      <ContentContainerHeader title='Styled Title' />,
    );

    const titleElement = getByText('Styled Title');
    const titleStyles = titleElement.props.style;

    // Verify the styles
    expect(titleStyles).toContainEqual({
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: '4%',
      backgroundColor: 'transparent',
    });
  });
});
