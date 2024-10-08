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
import Colors from '@/constants/Colors';

export default function UpdateLabScreen() {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);
  const { labId, labName, labCode, imageURLProp } = useLocalSearchParams<{
    labId: string;
    labName: string;
    labCode: string;
    imageURLProp: string;
  }>();
  if (!labId || !labName || !labCode) throw new Error('Invalid lab data');
  const [imageURL, setImageURL] = useState<string | null>(imageURLProp);
  const [lab, setLab] = useState<Lab>({
    labId: parseInt(labId),
    labName,
    labCode,
    imageUrl: imageURL,
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
    if (!result.canceled) {
      const pickedImage = await fetch(result.assets[0].uri);
      const imageBody = await pickedImage.blob();
      setUploadLoading(true);
      try {
        const response = await axiosApi.post('/upload-url/lab', {
          extension: imageBody.type.split('/')[1],
        });
        const presignedUrl = response.data.presignedUrl;
        const resp = await fetch(presignedUrl, {
          method: 'PUT',
          body: imageBody,
          headers: {
            'Content-Type': imageBody.type,
            'x-ms-blob-type': 'BlockBlob',
          },
        });
        if (!resp.ok) {
          throw new Error('Failed to upload image');
        }
        setImageURL(result.assets[0].uri);
        setLab({ ...lab, imageUrl: presignedUrl.split('?')[0] });
        setUploadError(null);
      } catch (err: any) {
        setUploadError('Failed to upload image');
      } finally {
        setUploadLoading(false);
      }
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
              <View style={styles.textSeparator} />
              <View style={styles.FieldLine}>
                <View style={styles.selectBoxRow}>
                  <View style={styles.rowField}>
                    <Text>Name :</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Enter Lab Name'
                    value={lab.labName ?? ''}
                    onChangeText={(text) => setLab({ ...lab, labName: text })}
                  />
                </View>
                {errors
                  .filter(([key, value]) => key === 'labName')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
              </View>
              <View style={styles.separator} />
              <View style={styles.FieldLine}>
                <View style={styles.selectBoxRow}>
                  <View style={styles.rowField}>
                    <Text>Code :</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Enter Lab Code'
                    value={lab.labCode ?? ''}
                    onChangeText={(text) => setLab({ ...lab, labCode: text })}
                  />
                </View>
                {errors
                  .filter(([key, value]) => key === 'labCode')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
              </View>
              <View style={styles.textSeparator} />
              <Image
                source={
                  imageURL
                    ? { uri: imageURL }
                    : require('@/assets/images/labSample.png')
                }
                style={styles.image}
              />
              {uploadLoading ? (
                <ActivityIndicator size='large' color='#ffffff' />
              ) : uploadError ? (
                <Text style={styles.errorText}>{uploadError}</Text>
              ) : (
                <Button title='Pick an Image' onPress={pickImage} />
              )}
              {errors
                .filter(([key, value]) => key === 'imageURL')
                .map(([key, value]) => (
                  <Text key={key} style={styles.errorText}>
                    {value}
                  </Text>
                ))}
              <View style={styles.separator} />
              <View style={styles.textSeparator} />
            </EditSingleItemBackground>
          )}
        </View>
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
          <WideButton buttonClickHandler={showAlert} text='Remove Lab' danger />
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
    // marginBottom: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 5,
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
    flex: 1,
    paddingLeft: '5%',
    fontSize: 13,
  },
  columnValue: {
    flex: 0.8,
    textAlign: 'left',
    fontSize: 13,
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
