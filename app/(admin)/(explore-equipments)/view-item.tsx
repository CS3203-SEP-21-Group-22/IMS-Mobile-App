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
import { ItemDetailed } from '@/interfaces/item.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function ViewItemScreen() {
  const [item, setItem] = useState<ItemDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { itemId, equipmentId, labId } = useLocalSearchParams<{
    itemId: string;
    equipmentId: string;
    labId: string;
  }>();
  if (!equipmentId || !itemId) throw new Error('Missing equipmentId or itemId');

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(`/user/items/${itemId}`);
      setItem(response.data);
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

  const handleViewReservHistory = ({ item }: { item: ItemDetailed }) => {
    router.push({
      pathname: '/(admin)/(explore-equipments)/reservations',
      params: { itemId: item.itemId },
    });
  };

  const handleViewMaintHistory = ({ item }: { item: ItemDetailed }) => {
    router.push({
      pathname: '/(admin)/(explore-equipments)/maintenances',
      params: { itemId: item.itemId },
    });
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Explore Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Item' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : item ? (
            <SingleItemBackground>
              <ScrollView style={{ width: '100%' }}>
                <SingleItemWithImage
                  title={item.itemName ?? ''}
                  link={item.imageUrl ?? 'equipment'}
                >
                  <Text style={styles.text}>Model: {item.itemModel}</Text>
                  <Text style={styles.text}>Lab: {item.labName}</Text>
                  <View style={styles.textSeparator} />
                  <Text style={styles.text}>
                    Serial Number: {item.serialNumber}
                  </Text>
                  {item.lastMaintenanceOn && (
                    <Text style={styles.text}>
                      Last Maintenance On:{' '}
                      {item.lastMaintenanceOn.split('T')[0]}
                    </Text>
                  )}
                  {item.lastMaintenanceBy && (
                    <Text style={styles.text}>
                      Last Maintenance By: {item.lastMaintenanceBy}
                    </Text>
                  )}
                  <Text style={styles.text}>Status: {item.status}</Text>
                  <View style={styles.textSeparator} />
                </SingleItemWithImage>
                <WideButton
                  text='View Reservations History'
                  buttonClickHandler={() =>
                    handleViewReservHistory({ item: item })
                  }
                />
                <WideButton
                  text='View Maintenance History'
                  buttonClickHandler={() =>
                    handleViewMaintHistory({ item: item })
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
});
