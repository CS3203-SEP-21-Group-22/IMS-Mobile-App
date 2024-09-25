import {
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import { useState, useEffect } from 'react';
import { Reservation } from '@/interfaces/reservation.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function ViewReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  if (!itemId) throw new Error('Missing itemId');

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(
        `/user/reservations?itemId=${itemId}`,
      );
      setReservations(response.data);
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

  const ItemComponent: React.FC<{ item: Reservation }> = ({ item }) => (
    <ListItemBackground>
      <Text style={styles.titleText}>{item.itemName}</Text>
      <Text style={styles.text}>Model: {item.itemModel}</Text>
      {item.itemSerialNumber ? (
        <Text style={styles.text}>Serial Number: {item.itemSerialNumber}</Text>
      ) : null}
      <Text style={styles.text}>Lab: {item.labName}</Text>
      <Text style={styles.text}>Reserved By: {item.reservedUserName}</Text>
      <Text style={styles.text}>
        From: {item.startDate.split('T')[0]} To: {item.endDate.split('T')[0]}
      </Text>
      <Text style={styles.text}>
        Requested At: {item.createdAt.split('T')[0]}{' '}
        {item.createdAt.split('T')[1].split('.')[0].slice(0, 5)}
      </Text>
      {item.status === 'Reserved' ? (
        <Text style={styles.text}>
          Responded At: {item.respondedAt?.split('T')[0]}{' '}
          {item.respondedAt?.split('T')[1].split('.')[0].slice(0, 5)}
        </Text>
      ) : null}
      {item.status === 'Rejected' ? (
        <Text style={styles.text}>
          Responded At: {item.respondedAt?.split('T')[0]}{' '}
          {item.respondedAt?.split('T')[1].split('.')[0].slice(0, 5)}
        </Text>
      ) : null}
      {item.status === 'Borrowed' ? (
        <Text style={styles.text}>
          Borrowed At: {item.borrowedAt?.split('T')[0]}{' '}
          {item.borrowedAt?.split('T')[1].split('.')[0].slice(0, 5)}
        </Text>
      ) : null}
      {item.status === 'Returned' ? (
        <Text style={styles.text}>
          Returned At: {item.returnedAt?.split('T')[0]}{' '}
          {item.returnedAt?.split('T')[1].split('.')[0].slice(0, 5)}
        </Text>
      ) : null}
      {item.status === 'Canceled' ? (
        <Text style={styles.text}>
          Cancelled At: {item.cancelledAt?.split('T')[0]}{' '}
          {item.cancelledAt?.split('T')[1].split('.')[0].slice(0, 5)}
        </Text>
      ) : null}
      <Text style={styles.text}>Status: {item.status}</Text>
    </ListItemBackground>
  );

  return (
    <BackgroundLayout>
      <MainHeader title='Explore Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Reservations History' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : reservations ? (
            reservations.length > 0 ? (
              <FlatList
                data={reservations}
                renderItem={({ item }) => <ItemComponent item={item} />}
                keyExtractor={(item) => item.reservationId.toString()}
                style={styles.flatList}
                contentContainerStyle={{
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <Text>No reservations found</Text>
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
    justifyContent: 'center',
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
