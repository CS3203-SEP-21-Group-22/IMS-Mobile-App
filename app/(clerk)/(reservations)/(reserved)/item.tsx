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
          ) : reservation ? (
            <SingleItemBackground>
              <ScrollView style={{ width: '100%' }}>
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
                  <View style={styles.textSeparator} />
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Laboratory :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.labName}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Serial Number :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.itemSerialNumber}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Requested User :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.reservedUserName}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Start Date :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.startDate.split('T')[0]}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>End Date :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.endDate.split('T')[0]}
                    </Text>
                  </View>

                  <View style={styles.textSeparator} />

                  <View style={styles.row}>
                    <Text style={styles.columnField}>Accepted By :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.respondedClerkName}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.columnField}>Accepted At :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.respondedAt?.split('T')[0]}{' '}
                      {reservation.createdAt
                        .split('T')[1]
                        .split('.')[0]
                        .slice(0, 5)}
                    </Text>
                  </View>
                  <View style={styles.textSeparator} />
                </SingleItemWithImage>
              </ScrollView>
              {reservation && reservation.status === 'Reserved' ? (
                <WideButton
                  text='Lend Item'
                  buttonClickHandler={() => handleVerify({ item: reservation })}
                />
              ) : null}
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
  singleItemRow: {
    alignSelf: 'flex-start',
    marginHorizontal: '6%',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8,
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
