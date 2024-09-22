import {
  StyleSheet,
  TextInput,
  Image,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import * as ImagePicker from 'expo-image-picker';
import WideButton from '@/components/WideButton';
import { useState } from 'react';
import { Lab } from '@/interfaces/lab.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function UpdateLabScreen() {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);
  const { labId, labName, labCode, imageURL } = useLocalSearchParams<{
    labId: string;
    labName: string;
    labCode: string;
    imageURL: string;
  }>();
  if (!labId || !labName || !labCode) throw new Error('Invalid lab data');
  const [lab, setLab] = useState<Lab>({
    labId: parseInt(labId),
    labName,
    labCode,
    imageURL,
  });
  const handleUpdateButtonPress = async () => {
    try {
      setUpdateLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.patch(`/admin/labs/${labId}`, lab);
      if (response.status === 200) {
        Alert.alert('Success', 'Lab updated successfully');
        router.back();
        router.replace({ pathname: '/(admin)/(lab-management)/view-labs' });
      } else Alert.alert('Error', 'Failed to update lab');
    } catch (err: any) {
      if (err.response.status === 400) {
        setErrors(Object.entries(err.response.data.errors));
      }
      Alert.alert('Error', 'Failed to update lab');
    } finally {
      setUpdateLoading(false);
    }
  };
  const handleDeleteButtonPress = async () => {
    try {
      setDeleteLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.delete(`/admin/labs/${labId}`);
      if (response.status === 204) {
        Alert.alert('Success', 'Lab deleted successfully');
        router.back();
      } else Alert.alert('Error', 'Failed to delete lab');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to delete lab');
    } finally {
      setDeleteLoading(false);
    }
  };
  const showAlert = async () => {
    Alert.alert(
      'Delete Lab',
      'Are you sure you want to delete this lab?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Operation canceled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: handleDeleteButtonPress,
        },
      ],
      { cancelable: true },
    );
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && lab) {
      setLab({ ...lab, imageURL: result.assets[0].uri });
    }
  };
  return (
    <BackgroundLayout>
      <MainHeader title='Lab Management' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Update Lab' />
          {lab && (
            <EditSingleItemBackground>
              <Text style={styles.title}>Lab Details</Text>
              <Text style={styles.text}>Lab Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder='Enter Lab Name'
                value={lab.labName ?? ''}
                onChangeText={(text) => setLab({ ...lab, labName: text })}
              />
              {errors
                .filter(([key, value]) => key === 'labName')
                .map(([key, value]) => (
                  <Text key={key} style={styles.errorText}>
                    {value}
                  </Text>
                ))}
              <Text style={styles.text}>Lab Code</Text>
              <TextInput
                style={styles.textInput}
                placeholder='Enter Lab Code'
                value={lab.labCode ?? ''}
                onChangeText={(text) => setLab({ ...lab, labCode: text })}
              />
              {errors
                .filter(([key, value]) => key === 'labCode')
                .map(([key, value]) => (
                  <Text key={key} style={styles.errorText}>
                    {value}
                  </Text>
                ))}
              <Image
                source={
                  lab.imageURL
                    ? { uri: lab.imageURL }
                    : require('@/assets/images/labSample.png')
                }
                style={styles.image}
              />
              <Button title='Pick an Image' onPress={pickImage} />
              {errors
                .filter(([key, value]) => key === 'imageURL')
                .map(([key, value]) => (
                  <Text key={key} style={styles.errorText}>
                    {value}
                  </Text>
                ))}
              <View style={styles.separator} />
            </EditSingleItemBackground>
          )}
          {updateLoading ? (
            <ActivityIndicator size='large' color='black' />
          ) : (
            <WideButton
              buttonClickHandler={handleUpdateButtonPress}
              text='Update Lab'
            />
          )}
          {deleteLoading ? (
            <ActivityIndicator size='large' color='black' />
          ) : (
            <WideButton
              buttonClickHandler={showAlert}
              text='Remove Lab'
              danger
            />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
  },
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
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
});
