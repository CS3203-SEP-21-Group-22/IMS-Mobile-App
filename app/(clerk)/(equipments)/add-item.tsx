import {
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import { useState } from 'react';
import WideButton from '@/components/WideButton';
import { CreateItem } from '@/interfaces/item.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function AddItemScreen() {
  const { equipmentId, name, model, imageUrl, maintenanceIntervalDays } =
    useLocalSearchParams<{
      equipmentId: string;
      name: string;
      model: string;
      imageUrl: string;
      maintenanceIntervalDays: string;
    }>();
  if (!equipmentId || !name || !model)
    throw new Error('Missing equipmentId, name or model');
  const [createItem, setCreateItem] = useState<CreateItem>({
    equipmentId: parseInt(equipmentId),
    serialNumber: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);

  const handleButtonPress = async () => {
    try {
      setLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.post('/clerk/items', createItem);
      if (response.status === 201) {
        Alert.alert('Success', 'Item added successfully');
        router.back();
      } else Alert.alert('Error', 'Failed to add item');
    } catch (err: any) {
      if (err.response.status === 400) {
        setErrors(Object.entries(err.response.data.errors));
      }
      Alert.alert('Error', 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Add New Item' />
          <EditSingleItemBackground>
            <Text style={styles.title}>Item Details</Text>
            <Text style={styles.text}>{name}</Text>
            <Image
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require('@/assets/images/equipmentSample.png')
              }
              style={styles.image}
            />
            <Text style={styles.text}>Model: {model}</Text>
            <Text style={styles.text}>
              Maintenance Interval: {maintenanceIntervalDays} days
            </Text>
            <View style={styles.separator} />
            <Text style={styles.text}>Serial Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter Serial Number'
              value={createItem.serialNumber ?? ''}
              onChangeText={(text) =>
                setCreateItem({ ...createItem, serialNumber: text })
              }
            />
            {errors
              .filter(([key, value]) => key === 'serialNumber')
              .map(([key, value]) => (
                <Text key={key} style={styles.errorText}>
                  {value}
                </Text>
              ))}
          </EditSingleItemBackground>
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : errors.length > 0 ? (
            <WideButton text='Retry' buttonClickHandler={handleButtonPress} />
          ) : (
            <WideButton
              text='Add Item'
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
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
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
