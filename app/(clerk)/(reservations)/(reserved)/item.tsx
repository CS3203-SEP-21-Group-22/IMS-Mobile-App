import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import SingleItemWithImage from '@/components/SingleItemWithImage';
import { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';
import { ReservationDetailed } from '@/interfaces/reservation.interface';
import { initializeAxiosApi, axiosApi } from '@/utils/AxiosApi';

const handleVerify = ({ item }: { item: ReservationDetailed }) => {
  router.replace({
    pathname: '/(clerk)/(reservations)/(reserved)/verify',
    params: { reservationId: item.reservationId },
  });
};

export default function ViewReservedItemScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  if (!reservationId) throw new Error('Missing reservationId');
  const [reservation, setReservation] = useState<ReservationDetailed | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(
        `/user/reservations/${reservationId}`,
      );
      setReservation(response.data);
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

  return (
    <BackgroundLayout>
      <MainHeader title='Reservations' />
      <ClerkReservationsHorizontalBar selectedIndex={1} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Item Request' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : reservation ? (
            <SingleItemBackground>
              <ScrollView>
                <SingleItemWithImage
                  title={
                    reservation.itemName
                      ? reservation.itemName +
                        ' (' +
                        reservation.itemModel +
                        ')'
                      : ''
                  }
                  link={reservation.imageUrl ?? 'equipment'}
                >
                  <Text style={styles.text}>Lab: {reservation.labName}</Text>
                  <View style={styles.textSeparator} />
                  <Text style={styles.text}>
                    Requested By: {reservation.reservedUserName}
                  </Text>
                  <Text style={styles.text}>
                    From: {reservation.startDate.split('T')[0]}
                  </Text>
                  <Text style={styles.text}>
                    To: {reservation.endDate.split('T')[0]}
                  </Text>
                  <View style={styles.textSeparator} />
                  <Text style={styles.text}>
                    Requested At: {reservation.createdAt.split('T')[0]}{' '}
                    {reservation.createdAt
                      .split('T')[1]
                      .split('.')[0]
                      .slice(0, 5)}
                  </Text>
                  <View style={styles.textSeparator} />
                  <Text style={styles.text}>
                    Assigned Item: {reservation.itemSerialNumber}
                  </Text>
                  <Text style={styles.text}>
                    Assigned By: {reservation.respondedClerkName}
                  </Text>
                  <Text style={styles.text}>
                    Assigned At: {reservation.respondedAt?.split('T')[0]}{' '}
                    {reservation.respondedAt
                      ?.split('T')[1]
                      .split('.')[0]
                      .slice(0, 5)}
                  </Text>
                  <View style={styles.textSeparator} />
                </SingleItemWithImage>
              </ScrollView>
            </SingleItemBackground>
          ) : null}
          {reservation && reservation.status === 'Reserved' ? (
            <WideButton
              text='Lend Item'
              buttonClickHandler={() => handleVerify({ item: reservation })}
            />
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
