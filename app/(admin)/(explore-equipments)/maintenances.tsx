import {
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
  RefreshControl,
} from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
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
      <Text style={styles.titleText}>{item.itemName}</Text>
      <Text style={styles.text}>Model: {item.itemModel}</Text>
      <Text style={styles.text}>Serial Number: {item.itemSerialNumber}</Text>
      <Text style={styles.text}>Lab: {item.labName}</Text>
      <Text style={styles.text}>
        From: {item.startDate.split('T')[0]} To: {item.endDate.split('T')[0]}
      </Text>
      <Text style={styles.text}>
        Created At: {item.createdAt.split('T')[0]}{' '}
        {item.createdAt.split('T')[1].split('.')[0].slice(0, 5)}
      </Text>
      <Text style={styles.text}>
        Submitted At: {item.submittedAt?.split('T')[0]}{' '}
        {item.submittedAt?.split('T')[1].split('.')[0].slice(0, 5)}
      </Text>
      <Text style={styles.text}>
        Reviewed At: {item.reviewedAt?.split('T')[0]}{' '}
        {item.reviewedAt?.split('T')[1].split('.')[0].slice(0, 5)}
      </Text>
      <Text style={styles.text}>Status: {item.status}</Text>
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
              <Text style={styles.text}>No maintenances found</Text>
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
});
