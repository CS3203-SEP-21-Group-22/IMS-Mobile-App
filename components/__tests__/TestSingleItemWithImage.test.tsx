import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import SingleItemWithImage from '@/components/SingleItemWithImage'; // Adjust the path accordingly

describe('SingleItemWithImage', () => {
  const title = 'Lab Item';
  const childrenText = 'Some additional information';

  it('renders with the correct title and image for lab', () => {
    const { getByText, getByTestId } = render(
      <SingleItemWithImage title={title} link='lab'>
        <Text>{childrenText}</Text>
      </SingleItemWithImage>,
    );

    // Check if the title is rendered
    expect(getByText(title)).toBeTruthy();

    // Check if the image is rendered (alt text cannot be checked directly in React Native)
    const image = getByTestId('single-item-image');
    expect(image.props.source).toEqual(
      require('@/assets/images/labSample.png'),
    );

    // Check if the children are rendered
    expect(getByText(childrenText)).toBeTruthy();
  });

  it('renders with the correct image for equipment', () => {
    const { getByTestId } = render(
      <SingleItemWithImage title={title} link='equipment'>
        <Text>{childrenText}</Text>
      </SingleItemWithImage>,
    );

    // Check if the correct equipment image is rendered
    const image = getByTestId('single-item-image');
    expect(image.props.source).toEqual(
      require('@/assets/images/equipmentSample.png'),
    );
  });

  it('renders with a dynamic image link', () => {
    const dynamicImageLink = 'https://example.com/sample-image.jpg';
    const { getByTestId } = render(
      <SingleItemWithImage title={title} link={dynamicImageLink}>
        <Text>{childrenText}</Text>
      </SingleItemWithImage>,
    );

    // Check if the dynamic image is rendered
    const image = getByTestId('single-item-image');
    expect(image.props.source).toEqual({ uri: dynamicImageLink });
  });
});
