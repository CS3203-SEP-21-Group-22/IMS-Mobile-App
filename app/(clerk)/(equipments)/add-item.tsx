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
            <Image
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require('@/assets/images/equipmentSample.png')
              }
              style={styles.image}
            />

            <View style={styles.textSeparator} />
            <View style={styles.row}>
              <Text style={styles.columnField}>Item Name :</Text>
              <Text style={styles.columnValue}>{name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnField}>Model Name :</Text>
              <Text style={styles.columnValue}>{model}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.columnField}>Maintenance Interval :</Text>
              <Text style={styles.columnValue}>
                {maintenanceIntervalDays} days
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.separator} />
            <View style={styles.selectBoxRow}>
              <View style={styles.rowField}>
                <Text>Serial Number</Text>
              </View>
            </View>
            <TextInput
              style={styles.longTextInput}
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
            <View style={styles.separator} />
          </EditSingleItemBackground>
        </View>
        {loading ? (
          <ActivityIndicator size='large' color='#ffffff' />
        ) : errors.length > 0 ? (
          <WideButton text='Retry' buttonClickHandler={handleButtonPress} />
        ) : (
          <WideButton text='Add Item' buttonClickHandler={handleButtonPress} />
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
    marginBottom: '5%',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 5,
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
    height: 0.1,
    width: '80%',
    backgroundColor: 'transparent',
  },
  selectBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginHorizontal: 5,
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
  longTextInput: {
    width: '90%',
    padding: '0.5%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 15,
    marginLeft: '3%',
    marginBottom: '2%',
  },
});
