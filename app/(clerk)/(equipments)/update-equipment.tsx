import {
  StyleSheet,
  TextInput,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import WideButton from '@/components/WideButton';
import { UpdateEquipment } from '@/interfaces/equipment.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';
import Colors from '@/constants/Colors';

export default function UpdateEquipmentScreen() {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);
  const {
    equipmentId,
    labId,
    name,
    model,
    imageURLProp,
    specification,
    maintenanceIntervalDays,
  } = useLocalSearchParams<{
    labId: string;
    equipmentId: string;
    name: string;
    model: string;
    imageURLProp: string;
    specification: string;
    maintenanceIntervalDays: string;
  }>();
  if (!labId || !equipmentId || !name || !model)
    throw new Error('Invalid params');
  const [imageURL, setImageURL] = useState<string | null>(imageURLProp);
  const [equipment, setEquipment] = useState<UpdateEquipment>({
    name: name,
    model: model,
    imageURL: imageURL,
    specification: specification,
    maintenanceIntervalDays: parseInt(maintenanceIntervalDays),
  });

  const handleUpdateEquipment = async () => {
    try {
      setUpdateLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.patch(
        `/clerk/equipments/${equipmentId}`,
        equipment,
      );
      if (response.status === 200) {
        Alert.alert('Success', 'Equipment updated successfully');
        router.replace({
          pathname: '/(clerk)/(equipments)/view-equipment',
          params: { equipmentId, labId },
        });
      } else Alert.alert('Error', 'Failed to update Equipment');
    } catch (err: any) {
      if (err.response.status === 400) {
        setErrors(Object.entries(err.response.data.errors));
      }
      Alert.alert('Error', 'Failed to update Equipment');
    } finally {
      setUpdateLoading(false);
    }
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
        const response = await axiosApi.post('/upload-url/equipment', {
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
        setEquipment({ ...equipment, imageURL: presignedUrl.split('?')[0] });
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
      <MainHeader title='Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Update Equipment' />
          {equipment && (
            <EditSingleItemBackground>
              <View style={styles.separator} />
              <Text style={styles.title}>Equipment Details</Text>
              <View style={styles.textSeparator} />
              <View style={styles.FieldLine}>
                <View style={styles.selectBoxRow}>
                  <View style={styles.rowField}>
                    <Text>Name :</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Enter Equipment Name'
                    value={equipment.name ?? ''}
                    onChangeText={(text) =>
                      setEquipment({ ...equipment, name: text })
                    }
                  />
                </View>
                {errors
                  .filter(([key, value]) => key === 'name')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
              </View>

              <View style={styles.FieldLine}>
                <View style={styles.selectBoxRow}>
                  <View style={styles.rowField}>
                    <Text>Model :</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Enter Equipment Model'
                    value={equipment.model ?? ''}
                    onChangeText={(text) =>
                      setEquipment({ ...equipment, model: text })
                    }
                  />
                </View>
                {errors
                  .filter(([key, value]) => key === 'model')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
              </View>
              <View style={styles.selectBoxRow}>
                <View style={styles.rowField}>
                  <Text>Maintenance Interval :</Text>
                </View>
              </View>
              <TextInput
                style={styles.longTextInput}
                placeholder='Enter Number of Days'
                keyboardType='numeric'
                value={
                  equipment.maintenanceIntervalDays
                    ? equipment.maintenanceIntervalDays.toString()
                    : ''
                }
                onChangeText={(text) =>
                  setEquipment({
                    ...equipment,
                    maintenanceIntervalDays: parseInt(text),
                  })
                }
              />
              {errors
                .filter(([key, value]) => key === 'maintenanceIntervalDays')
                .map(([key, value]) => (
                  <Text key={key} style={styles.errorText}>
                    {value}
                  </Text>
                ))}
              <Image
                source={
                  imageURL
                    ? { uri: imageURL }
                    : require('@/assets/images/equipmentSample.png')
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
              <View style={styles.separator} />
            </EditSingleItemBackground>
          )}
          {updateLoading ? (
            <ActivityIndicator size='large' color='black' />
          ) : (
            <WideButton
              text='Update Equipment'
              buttonClickHandler={handleUpdateEquipment}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '5%',
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'center',
    marginBottom: '3%',
  },
  textInput: {
    width: '70%',
    padding: '0.5%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 13,
    marginBottom: '2%',
  },
  longTextInput: {
    width: '90%',
    padding: '0.5%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 15,
    marginLeft: '3%',
    marginBottom: '2%',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
  },
  image: {
    marginTop: '4%',
    marginBottom: '3%',
    width: 100,
    height: 100,
  },
  button: {
    width: '100%',
    marginTop: '1%',
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
    marginVertical: '1%',
    height: 0.1,
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
