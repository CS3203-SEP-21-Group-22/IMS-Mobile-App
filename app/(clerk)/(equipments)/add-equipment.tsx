import {
  StyleSheet,
  TextInput,
  Image,
  Button,
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
import { CreateEquipment } from '@/interfaces/equipment.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';
import { Alert } from 'react-native';

export default function AddEquipmentScreen() {
  const { labId } = useLocalSearchParams<{ labId: string }>();
  if (!labId) throw new Error('Missing labId');
  const [equipment, setEquipment] = useState<CreateEquipment>({
    name: null,
    model: null,
    labId: parseInt(labId),
    imageURL: null,
    specification: null,
    maintenanceIntervalDays: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);

  const handleButtonPress = async () => {
    try {
      setLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.post('/clerk/equipments', equipment);
      if (response.status === 201) {
        Alert.alert('Success', 'Equipment added successfully');
        router.back();
      } else Alert.alert('Error', 'Failed to add equipment');
    } catch (err: any) {
      if (err.response.status === 400) {
        setErrors(Object.entries(err.response.data.errors));
      }
      Alert.alert('Error', 'Failed to add equipment');
    } finally {
      setLoading(false);
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
      setEquipment({ ...equipment, imageURL: result.assets[0].uri });
    }
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Add New Equipment' />
          <EditSingleItemBackground>
            <Text style={styles.title}>Equipment Details</Text>
            <Text style={styles.text}>Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter Equipment Name'
              value={equipment.name ?? ''}
              onChangeText={(text) =>
                setEquipment({ ...equipment, name: text })
              }
            />
            {errors
              .filter(([key, value]) => key === 'name')
              .map(([key, value]) => (
                <Text key={key} style={styles.errorText}>
                  {value}
                </Text>
              ))}
            <Text style={styles.text}>Model</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter Equipment Model'
              value={equipment.model ?? ''}
              onChangeText={(text) =>
                setEquipment({ ...equipment, model: text })
              }
            />
            {errors
              .filter(([key, value]) => key === 'model')
              .map(([key, value]) => (
                <Text key={key} style={styles.errorText}>
                  {value}
                </Text>
              ))}
            <Text style={styles.text}>Maintenance Interval (Days)</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter Maintenance Interval'
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
                equipment.imageURL
                  ? { uri: equipment.imageURL }
                  : require('@/assets/images/equipmentSample.png')
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
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : errors.length > 0 ? (
            <WideButton text='Retry' buttonClickHandler={handleButtonPress} />
          ) : (
            <WideButton
              text='Add Equipment'
              buttonClickHandler={handleButtonPress}
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
});
