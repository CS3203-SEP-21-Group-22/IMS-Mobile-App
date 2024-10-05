import {
  StyleSheet,
  Alert,
  ScrollView,
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
    setLoading(true);
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
      pathname: '/(technician)/(explore-equipments)/reservations',
      params: { itemId: item.itemId },
    });
  };

  const handleViewMaintHistory = ({ item }: { item: ItemDetailed }) => {
    router.push({
      pathname: '/(technician)/(explore-equipments)/maintenances',
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
          ) : item ? (
            <SingleItemBackground>
              <ScrollView style={{ width: '100%' }}>
                <SingleItemWithImage
                  title={item.itemName ?? ''}
                  link={item.imageUrl ?? 'equipment'}
                >
                  <View style={styles.textSeparator} />
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Model Name:</Text>
                    <Text style={styles.columnValue}>{item.itemModel}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Laboratory:</Text>
                    <Text style={styles.columnValue}>{item.labName}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Serial Number:</Text>
                    <Text style={styles.columnValue}>{item.serialNumber}</Text>
                  </View>
                  {item.lastMaintenanceOn && (
                    <View style={styles.row}>
                      <Text style={styles.columnField}>Last Repair Date:</Text>
                      <Text style={styles.columnValue}>
                        {item.lastMaintenanceOn.split('T')[0]}
                      </Text>
                    </View>
                  )}
                  {item.lastMaintenanceBy && (
                    <View style={styles.row}>
                      <Text style={styles.columnField}>Last Repair By:</Text>
                      <Text style={styles.columnValue}>
                        {item.lastMaintenanceBy}
                      </Text>
                    </View>
                  )}
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Status:</Text>
                    <Text style={styles.columnValue}>{item.status}</Text>
                  </View>

                  <View style={styles.textSeparator} />
                </SingleItemWithImage>
              </ScrollView>
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
    marginVertical: '1%',
    height: 0.1,
    width: '80%',
    backgroundColor: 'transparent',
  },
});
