import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import { useState, useEffect } from 'react';
import { Maintenance } from '@/interfaces/maintenance.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';
import Colors from '@/constants/Colors';

export default function ViewMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  if (!itemId) throw new Error('itemId is required');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get(
        `/user/maintenances?itemId=${itemId}`,
      );
      setMaintenances(response.data);
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

  const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
    <ListItemBackground>
      <Text style={styles.titleText}>
        {item.itemName} ({item.itemModel})
      </Text>
      <View style={styles.textSeparator} />
      <View style={styles.row}>
        <Text style={styles.columnField}>Serial Number:</Text>
        <Text style={styles.columnValue}>{item.itemSerialNumber}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.columnField}>Lab:</Text>
        <Text style={styles.columnValue}>{item.labName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.columnField}>Start Date:</Text>
        <Text style={styles.columnValue}>{item.startDate.split('T')[0]}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.columnField}>End Date:</Text>
        <Text style={styles.columnValue}>{item.endDate.split('T')[0]}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.columnField}>Created At:</Text>
        <Text style={styles.columnValue}>
          {item.createdAt.split('T')[0]}{' '}
          {item.createdAt.split('T')[1].split('.')[0].slice(0, 5)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.columnField}>Submitted At:</Text>
        <Text style={styles.columnValue}>
          {item.submittedAt?.split('T')[0]}{' '}
          {item.submittedAt?.split('T')[1].split('.')[0].slice(0, 5)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.columnField}>Reviewed At:</Text>
        <Text style={styles.columnValue}>
          {item.reviewedAt?.split('T')[0]}{' '}
          {item.reviewedAt?.split('T')[1].split('.')[0].slice(0, 5)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.columnField}>Status:</Text>
        <Text style={styles.columnValue}>{item.status}</Text>
      </View>
      <View style={styles.textSeparator} />
    </ListItemBackground>
  );

  return (
    <BackgroundLayout>
      <MainHeader title='Explore Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Maintenances History' />
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
          ) : maintenances ? (
            maintenances.length > 0 ? (
              <FlatList
                data={maintenances}
                renderItem={({ item }) => <ItemComponent item={item} />}
                keyExtractor={(item) => item.maintenanceId.toString()}
                style={styles.flatList}
                contentContainerStyle={{
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchData}
                    tintColor={Colors.light.primary.button}
                  />
                }
              />
            ) : (
              <View
                style={{
                  height: '83%',
                  backgroundColor: 'transparent',
                }}
              >
                <Pressable onPress={fetchData} style={{ marginTop: '70%' }}>
                  <Text style={styles.notFoundText}>No maintenances found</Text>
                </Pressable>
              </View>
            )
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
  flatList: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  titleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 11,
  },
  button: {
    width: '100%',
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
    marginHorizontal: 15,
  },
  columnField: {
    flex: 1,
    paddingLeft: '3%',
    fontSize: 13,
  },
  columnValue: {
    flex: 1,
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
  notFoundText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'semibold',
  },
});
