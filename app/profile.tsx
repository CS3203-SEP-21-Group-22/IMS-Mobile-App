import { StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import SingleItemWithImage from '@/components/SingleItemWithImage';
import { useState, useEffect } from 'react';

interface UserProfile {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null;
  contactNumber: string | null;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile>({
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    role: null,
    contactNumber: null,
  });
  useEffect(() => {
    setUser({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'JohnDoe@uok.uk',
      role: 'Technician',
      contactNumber: '+4412345673',
    });
  }, []);
  const handleLogout = () => {
    router.replace('/login');
  }
  return (
    <BackgroundLayout>
    <MainHeader title="User Profile" />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="User Details" />
      <SingleItemBackground>
          <Text style={styles.text}>Name: {user.firstName} {user.lastName}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Role: {user.role}</Text>
          <Text style={styles.text}>Contact Number: {user.contactNumber}</Text>
          <View style={styles.textSeparator} />
        <View style={styles.button}>
              <ImageBackground
                source={require('@/assets/images/blueBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={10}
              >
                <Pressable onPress={handleLogout} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.buttonText}>
                    ↩️Logout
                  </Text>
                </Pressable>
              </ImageBackground>
          </View>
          <View style={styles.textSeparator} />
      </SingleItemBackground>
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
  titleText: {
    color:'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 12,
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
    width: '90%',
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
});

