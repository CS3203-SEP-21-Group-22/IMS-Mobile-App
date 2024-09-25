import {
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Button,
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
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
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
      pathname: '/(technician)/(explore-equipments)/view-items',
      params: {
        equipmentId: item.equipmentId,
        labId,
        name: item.name,
        imageUrl: item.imageURL,
        model: item.model,
        maintenanceIntervalDays: item.maintenanceIntervalDays,
      },
    });
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Explore Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Equipment' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : equipment ? (
            <SingleItemBackground>
              <ScrollView style={{ width: '100%' }}>
                <SingleItemWithImage
                  title={equipment.name ?? ''}
                  link={equipment.imageURL ?? 'equipment'}
                >
                  <Text style={styles.text}>Model: {equipment.model}</Text>
                  <Text style={styles.text}>Lab: {equipment.labName}</Text>
                  {equipment.maintenanceIntervalDays && (
                    <Text style={styles.text}>
                      Maintenance Interval: {equipment.maintenanceIntervalDays}{' '}
                      days
                    </Text>
                  )}
                  <View style={styles.textSeparator} />
                  <Text style={styles.text}>
                    Total Items: {equipment.totalCount}
                  </Text>
                  <Text style={styles.text}>
                    Reservations Count: {equipment.reservedCount}
                  </Text>
                  <Text style={styles.text}>
                    Available Items: {equipment.availableCount}
                  </Text>
                  <View style={styles.textSeparator} />
                </SingleItemWithImage>
                <WideButton
                  text='View Items'
                  buttonClickHandler={() =>
                    handleViewItems({ item: equipment })
                  }
                />
                <View style={styles.textSeparator} />
              </ScrollView>
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
    justifyContent: 'center',
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
