import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
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
import { ReservationDetailed } from '@/interfaces/reservation.interface';
import { initializeAxiosApi, axiosApi } from '@/utils/AxiosApi';

const handleReturn = ({ item }: { item: ReservationDetailed }) => {
  router.replace({
    pathname: '/(student)/(borrowed-items)/return-item',
    params: { reservationId: item.reservationId },
  });
};

export default function ViewBorrowedItemScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  if (!reservationId) throw new Error('Missing reservationId');
  const [reservation, setReservation] = useState<ReservationDetailed | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
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
      <MainHeader title='Borrowed Items' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Reservation' />
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
                  <View style={styles.separator} />

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

                  <View style={styles.textSeparator} />

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
                    <Text style={styles.columnField}>Requested At :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.createdAt.split('T')[0]}{' '}
                      {reservation.createdAt
                        .split('T')[1]
                        .split('.')[0]
                        .slice(0, 5)}
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
                      {reservation.respondedAt
                        ?.split('T')[1]
                        .split('.')[0]
                        .slice(0, 5)}
                    </Text>
                  </View>

                  <View style={styles.textSeparator} />

                  <View style={styles.row}>
                    <Text style={styles.columnField}>Borrowed From :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.lentClerkName}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Borrowed At :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.borrowedAt?.split('T')[0]}{' '}
                      {reservation.borrowedAt
                        ?.split('T')[1]
                        .split('.')[0]
                        .slice(0, 5)}
                    </Text>
                  </View>
                  <View style={styles.textSeparator} />
                </SingleItemWithImage>
              </ScrollView>
            </SingleItemBackground>
          ) : (
            <Text>No reservation found</Text>
          )}
        </View>
        {!loading && reservation && reservation.status === 'Borrowed' && (
          <WideButton
            text='Return Item'
            buttonClickHandler={() => handleReturn({ item: reservation })}
          />
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
  separator: {
    marginVertical: '1%',
    width: '80%',
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
  descriptionContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: '5%',
    marginTop: '2%',
  },
  cHeader: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  descriptionValue: {
    color: 'white',
    fontSize: 13,
  },
});
