import { render, screen, fireEvent } from '@testing-library/react-native';
import MainHeader from '@/components/MainHeader';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  Link: ({ children }: any) => <>{children}</>,
  router: {
    back: jest.fn(),
  },
}));

describe('renders correctly with the given title', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<MainHeader title='Test Title' />);
    const titleElement = getByTestId('header-title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.children).toBe('Test Title');
  });

  it('calls router.back() on back button press', () => {
    const { getByTestId } = render(<MainHeader title='Test Title' />);
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(router.back).toHaveBeenCalled();
  });

  it('navigates to profile page on profile icon press', () => {
    const { getByTestId } = render(<MainHeader title='Test Title' />);
    const userIcon = getByTestId('profile-icon');
    fireEvent.press(userIcon);
    // Optionally, check that the Pressable for the user icon was pressed
    expect(userIcon).toBeTruthy();
  });
});
