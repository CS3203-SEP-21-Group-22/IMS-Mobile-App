import { StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';
import { UserProfile } from '@/interfaces/userProfile.interface';
import {
  setLoginStatusLoggedOut,
  removeTokens,
  clearUserProfile,
  getUserProfile,
} from '@/utils/AsyncStorage';

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile: UserProfile = await getUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await removeTokens();
    await clearUserProfile();
    await setLoginStatusLoggedOut();
    router.replace('/login');
  };
  return (
    <BackgroundLayout>
      <MainHeader title='User Profile' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='User Details' />
          {user && (
            <SingleItemBackground>
              <View style={styles.contentContainer}>
                <View style={styles.textSeparator} />
                <View style={styles.textSeparator} />
                <Text style={styles.titleText}>
                  {user.firstName} {user.lastName}
                </Text>
                <View style={styles.textSeparator} />
                <View style={styles.textSeparator} />
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    marginBottom: '4%',
                  }}
                  source={require('@/assets/images/profile.jpg')}
                />
                <View style={styles.textSeparator} />
                <View style={styles.textSeparator} />
                <View style={styles.row}>
                  <Text style={styles.columnField}>Email : </Text>
                  <Text style={styles.columnValue}>{user.email}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>Contact No. : </Text>
                  <Text style={styles.columnValue}>{user.contactNumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>User Role : </Text>
                  <Text style={styles.columnValue}>{user.role}</Text>
                </View>
                <View style={styles.textSeparator} />
                <View style={styles.textSeparator} />
              </View>
              <WideButton
                text='Logout'
                buttonClickHandler={handleLogout}
                danger={true}
              />
            </SingleItemBackground>
          )}
        </View>
      </ContentContainer>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    width: '100%',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    marginBottom: '0.2%',
  },
  textSeparator: {
    marginVertical: '2%',
    height: 0.1,
    width: '80%',
    backgroundColor: 'transparent',
  },
  dropdown: {
    marginTop: '2%',
    marginBottom: '4%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    width: 200,
  },
  dropdownText: {
    color: 'black',
    fontSize: 13,
    alignSelf: 'center',
    paddingLeft: '3%',
    paddingVertical: '1%',
  },
  multilineInput: {
    backgroundColor: 'white',
    width: 200,
    height: 60,
    borderRadius: 8,
    paddingLeft: '3%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '3%',
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    marginHorizontal: '5%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: '4%',
  },
  buttonBackground: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8,
    backgroundColor: 'transparent',
    marginHorizontal: '1%',
    marginBottom: '2%',
  },
  columnField: {
    flex: 0.7,
    paddingLeft: '5%',
    fontSize: 14,
  },
  columnValue: {
    flex: 1,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'semibold',
  },
});
