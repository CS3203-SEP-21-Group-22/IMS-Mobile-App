import {
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import WideButton from '@/components/WideButton';

interface User {
  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  contactNumber: string | null;
}

interface UserRole {
  id: number;
  role: string;
}

export default function UpdateUserScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User>({
    id: null,
    email: null,
    firstName: null,
    lastName: null,
    role: null,
    contactNumber: null,
  });
  const userRoles: UserRole[] = [
    { id: 1, role: 'Student/Academic Staff' },
    { id: 2, role: 'Office Clerk' },
    { id: 3, role: 'Technician' },
    { id: 4, role: 'Administrator' },
  ];
  useEffect(() => {
    if (userId) {
      setUser({
        id: 1,
        email: 'JohnDoe@uok.uk',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Student/Academic Staff',
        contactNumber: '+4423456765',
      });
      setRole('Student/Academic Staff');
    } else {
      throw new Error('Missing user ID');
    }
  }, [userId]);
  const handleUpdateButtonPress = () => {
    router.back();
  };
  const handleSelectRole = (role: UserRole) => {
    setRole(role.role);
  };
  return (
    <BackgroundLayout>
      <MainHeader title='User Management' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Update User Role' />
          <EditSingleItemBackground>
            <Text style={styles.title}>User Details</Text>
            <View style={styles.separator} />
            <Text style={styles.text}>
              Name: {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Current Role: {user.role}</Text>
            <Text style={styles.text}>
              Contact Number: {user.contactNumber}
            </Text>
            <View style={styles.separator} />
            <Text style={styles.text}>Change User Role to:</Text>
            <Dropdown
              data={userRoles}
              mode='modal'
              search
              searchPlaceholder='Search Item'
              labelField='role'
              valueField='id'
              onChange={(item) => handleSelectRole(item)}
              style={styles.dropdown}
              placeholder={role ? role : 'Select Role'}
              placeholderStyle={styles.dropdownText}
              selectedTextStyle={styles.dropdownText}
            />
            <View style={styles.separator} />
          </EditSingleItemBackground>
          <WideButton
            text='Update User Role'
            buttonClickHandler={handleUpdateButtonPress}
          />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
  },
  separator: {
    marginVertical: '2%',
    width: '80%',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: '2%',
    // marginBottom: '1%',
  },
  textInput: {
    width: '80%',
    padding: '1%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
  },
  image: {
    marginTop: '4%',
    marginBottom: '3%',
    width: 100,
    height: 100,
  },
  dropdown: {
    marginTop: '2%',
    marginBottom: '2%',
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
    // paddingVertical: '1%',
  },
  button: {
    width: '100%',
    marginTop: '1%',
    backgroundColor: 'transparent',
  },
  buttonBackground: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2.5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
