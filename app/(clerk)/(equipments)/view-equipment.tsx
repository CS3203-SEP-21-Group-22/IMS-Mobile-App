import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import SingleItemWithImage from '@/components/SingleItemWithImage';
import { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';
import { EquipmentDetailed } from '@/interfaces/equipment.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function ViewEquipmentScreen() {
  const { equipmentId, labId } = useLocalSearchParams<{
    equipmentId: string;
    labId: string;
  }>();
  if (!labId || !equipmentId) throw new Error('Missing labId or equipmentId');
  const [equipment, setEquipment] = useState<EquipmentDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get(`/user/equipments/${equipmentId}`);
      setEquipment(response.data);
    } catch (err: any) {
      setError('Failed to fetch data');
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Axios and fetch data on component mount
  useEffect(() => {
    const initializeAndFetch = async () => {
      await initializeAxiosApi(); // Initialize Axios instance
      fetchData(); // Fetch data from the API
    };

    initializeAndFetch();
  }, []);

  const handleViewItems = ({ item }: { item: EquipmentDetailed }) => {
    router.push({
      pathname: '/(clerk)/(equipments)/view-items',
      params: {
        equipmentId: item.equipmentId,
        labId,
        name: item.name,
        imageUrl: item.imageUrl,
        model: item.model,
        maintenanceIntervalDays: item.maintenanceIntervalDays,
      },
    });
  };

  const handleUpdateEquipment = async ({
    item,
  }: {
    item: EquipmentDetailed;
  }) => {
    router.replace({
      pathname: '/(clerk)/(equipments)/update-equipment',
      params: {
        labId,
        equipmentId: item.equipmentId,
        name: item.name,
        model: item.model,
        imageURLProp: item.imageUrl,
        specification: item.specification,
        maintenanceIntervalDays: item.maintenanceIntervalDays,
      },
    });
  };

  const handleDeleteEquipment = async ({
    item,
  }: {
    item: EquipmentDetailed;
  }) => {
    try {
      setDeleteLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.delete(
        `/clerk/equipments/${item.equipmentId}`,
      );
      if (response.status === 204) {
        Alert.alert('Success', 'Equipment deleted successfully');
        router.back();
      } else Alert.alert('Error', 'Failed to delete Equipment');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to delete Equipment');
    } finally {
      setDeleteLoading(false);
    }
  };

  const showAlert = async ({ item }: { item: EquipmentDetailed }) => {
    Alert.alert(
      'Delete Equipment',
      'Are you sure you want to delete this Equipment?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Operation canceled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => handleDeleteEquipment({ item }),
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Equipment' />
          {loading ? (
            <ActivityIndicator
              size='large'
              color='#ffffff'
              style={{ marginTop: '50%' }}
            />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : equipment ? (
            <SingleItemBackground>
              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{
                  flexGrow: 1,
                }}
              >
                <SingleItemWithImage
                  title={equipment.name ?? ''}
                  link={equipment.imageUrl ?? 'equipment'}
                >
                  <View style={styles.textSeparator} />
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Model Name :</Text>
                    <Text style={styles.columnValue}>{equipment.model}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Laboratory :</Text>
                    <Text style={styles.columnValue}>{equipment.labName}</Text>
                  </View>
                  {equipment.maintenanceIntervalDays && (
                    <View style={styles.row}>
                      <Text style={styles.columnField}>
                        Maintenance Interval :
                      </Text>
                      <Text style={styles.columnValue}>
                        {equipment.maintenanceIntervalDays} days
                      </Text>
                    </View>
                  )}
                  <View style={styles.textSeparator} />
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Total Item Count :</Text>
                    <Text style={styles.columnValue}>
                      {equipment.totalCount}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Reservation Count :</Text>
                    <Text style={styles.columnValue}>
                      {equipment.reservedCount}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>
                      Available Item Count :
                    </Text>
                    <Text style={styles.columnValue}>
                      {equipment.availableCount}
                    </Text>
                  </View>
                  <View style={styles.textSeparator} />
                </SingleItemWithImage>
              </ScrollView>
              <View style={styles.bottomContainer}>
                <WideButton
                  text='View Items'
                  buttonClickHandler={() =>
                    handleViewItems({ item: equipment })
                  }
                />
                <WideButton
                  text='Update Equipment'
                  buttonClickHandler={() =>
                    handleUpdateEquipment({ item: equipment })
                  }
                />
                {deleteLoading ? (
                  <ActivityIndicator size='large' color='black' />
                ) : (
                  <WideButton
                    text='Delete Equipment'
                    buttonClickHandler={() => showAlert({ item: equipment })}
                    danger={true}
                  />
                )}
              </View>
            </SingleItemBackground>
          ) : null}
        </View>
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
  titleText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 12,
    marginBottom: '0.2%',
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
  bottomContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    width: '100%',
    bottom: 0,
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
});
