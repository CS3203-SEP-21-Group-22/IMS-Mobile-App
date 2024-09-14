import React from 'react';
import { render } from '@testing-library/react-native';
import ListItemWithImage from '@/components/ListItemWithImage'; // Adjust the import path based on your project structure
import { Text } from '@/components/Themed';

describe('ListItemWithImage', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ListItemWithImage link='lab'>
        <Text>Test Child</Text>
      </ListItemWithImage>,
    );

    // Check if the child component is rendered
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('renders lab image when link is "lab"', () => {
    const { getByTestId } = render(
      <ListItemWithImage link='lab'>
        <Text>Test Child</Text>
      </ListItemWithImage>,
    );

    const imageElement = getByTestId('list-item-image');
    expect(imageElement.props.source).toEqual(
      require('@/assets/images/labSample.png'),
    );
  });

  it('renders equipment image when link is "equipment"', () => {
    const { getByTestId } = render(
      <ListItemWithImage link='equipment'>
        <Text>Test Child</Text>
      </ListItemWithImage>,
    );

    const imageElement = getByTestId('list-item-image');
    expect(imageElement.props.source).toEqual(
      require('@/assets/images/equipmentSample.png'),
    );
  });

  it('renders custom image when link is a URL', () => {
    const imageUrl = 'https://example.com/image.png';
    const { getByTestId } = render(
      <ListItemWithImage link={imageUrl}>
        <Text>Test Child</Text>
      </ListItemWithImage>,
    );

    const imageElement = getByTestId('list-item-image');
    expect(imageElement.props.source).toEqual({ uri: imageUrl });
  });
});
