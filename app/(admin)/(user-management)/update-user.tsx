import {
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
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
import Colors from '@/constants/Colors';
import { User } from '@/interfaces/userProfile.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function UpdateUserScreen() {
  const { userId, firstName, lastName, email, role, contactNumber } =
    useLocalSearchParams<{
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      contactNumber: string;
    }>();
  if (!userId || !firstName || !lastName || !email || !role || !contactNumber) {
    throw new Error('Missing user details');
  }
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [user, setUser] = useState<User>({
    userId: parseInt(userId),
    firstName,
    lastName,
    email,
    role,
    contactNumber,
  });
  const userRoles: { displayedName: string; role: string }[] = [
    { displayedName: 'Office Clerk', role: 'Clerk' },
    { displayedName: 'Technician', role: 'Technician' },
    { displayedName: 'Student', role: 'Student' },
    { displayedName: 'Academic Staff', role: 'AcademicStaff' },
    { displayedName: 'System Admin', role: 'SystemAdmin' },
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonPress = async () => {
    setLoading(true);
    try {
      await initializeAxiosApi();
      const response = await axiosApi.patch(
        `/admin/users/${userId}?role=${selectedRole}`,
      );
      if (response.status === 200) {
        Alert.alert('Success', 'User role updated successfully');
        router.back();
      } else Alert.alert('Error', 'Failed to update user role');
    } catch (err: any) {
      if (err.response.status === 400) {
        setError('Failed to update user role');
      }
      Alert.alert('Error', 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <BackgroundLayout>
      <MainHeader title='User Management' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Update User Role' />
          <EditSingleItemBackground>
            <Text style={styles.title}>User Details</Text>
            <View style={styles.textSeparator} />
            <View style={styles.row}>
              <Text style={styles.columnField}>Name :</Text>
              <Text style={styles.columnValue}>
                {user.firstName} {user.lastName}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnField}>Email :</Text>
              <Text style={styles.columnValue}>{user.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnField}>Contact No. :</Text>
              <Text style={styles.columnValue}>{user.contactNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnField}>Current Role :</Text>
              <Text style={styles.columnValue}>{user.role}</Text>
            </View>

            <View style={styles.separator} />
            <Text style={styles.text}>Change User Role to :</Text>
            <Dropdown
              data={userRoles}
              mode='modal'
              search
              searchPlaceholder='Search Item'
              labelField='role'
              valueField='displayedName'
              onChange={(item) => handleSelectRole(item.role)}
              style={styles.dropdown}
              placeholder={selectedRole ? selectedRole : 'Select New Role'}
              placeholderStyle={styles.dropdownText}
              selectedTextStyle={styles.dropdownText}
            />
            <View style={styles.separator} />
          </EditSingleItemBackground>
        </View>
        {loading ? (
          <ActivityIndicator size='large' color='#ffffff' />
        ) : error ? (
          <WideButton text='Retry' buttonClickHandler={handleButtonPress} />
        ) : user.role != selectedRole && user.role != 'SystemAdmin' ? (
          <WideButton
            text='Update User Role'
            buttonClickHandler={handleButtonPress}
          />
        ) : (
          <Text style={styles.errorText}>
            Cannot update System Admin's Role
          </Text>
        )}
      </ContentContainer>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    width: '100%',
  },
  title: {
    fontSize: 18,
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
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: '40%',
  },
  textInput: {
    width: '70%',
    padding: '0.5%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 13,
    marginBottom: '2%',
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
  selectBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginHorizontal: 5,
  },
  singleItemRow: {
    alignSelf: 'flex-start',
    marginHorizontal: '6%',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginHorizontal: 5,
    marginBottom: '2%',
  },
  FieldLine: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  rowField: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingLeft: '5%',
    fontSize: 13,
    alignSelf: 'center',
    paddingBottom: '2%',
    // paddingTop: '3%',
  },
  dateRowField: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingLeft: '5%',
    fontSize: 13,
    alignSelf: 'center',
    paddingBottom: '2%',
    paddingTop: '3%',
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
  textSeparator: {
    marginVertical: '2%',
    height: 0.2,
    width: '80%',
    backgroundColor: 'transparent',
  },
  datePickerButton: {
    backgroundColor: Colors.dark.secondary.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '2%',
    width: '60%',
    marginTop: '2%',
    marginBottom: '1%',
  },
});
