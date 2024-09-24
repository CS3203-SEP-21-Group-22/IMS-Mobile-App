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
import { ReservationDetailed } from '@/interfaces/reservation.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

const handleBorrow = ({ item }: { item: ReservationDetailed }) => {
  router.replace({
    pathname: '/(student)/(reservations)/borrow-item',
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
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

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

  const handleCancelReservation = async ({
    item,
  }: {
    item: ReservationDetailed;
  }) => {
    try {
      setCancelLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.delete(
        `/student/reservations/${reservationId}`,
      );
      if (response.status === 204) {
        Alert.alert('Success', 'Reservation canceled successfully');
        router.back();
      } else Alert.alert('Error', 'Failed to cancel reservation');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to cancel reservation');
    } finally {
      setCancelLoading(false);
    }
  };

  const showAlert = async ({ item }: { item: ReservationDetailed }) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Operation canceled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => handleCancelReservation({ item }),
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Reservations' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Reservation' />
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
                  title={reservation.itemName ?? ''}
                  link={reservation.imageUrl ?? 'equipment'}
                >
                  <Text style={styles.text}>
                    Model: {reservation.itemModel}
                  </Text>
                  {reservation.itemSerialNumber && (
                    <Text style={styles.text}>
                      Serial Number: {reservation.itemSerialNumber}
                    </Text>
                  )}
                  <Text style={styles.text}>Lab: {reservation.labName}</Text>
                  <View style={styles.textSeparator} />
                  <Text style={styles.text}>
                    Start Date: {reservation.startDate.split('T')[0]}
                  </Text>
                  <Text style={styles.text}>
                    End Date: {reservation.endDate.split('T')[0]}
                  </Text>
                  <View style={styles.textSeparator} />
                  {reservation.status === 'Reserved' && (
                    <Text style={styles.text}>
                      Accepted By: {reservation.respondedClerkName}
                    </Text>
                  )}
                  {reservation.status === 'Reserved' && (
                    <Text style={styles.text}>
                      Accepted At: {reservation.respondedAt}
                    </Text>
                  )}
                  <Text style={styles.text}>Status: {reservation.status}</Text>
                  {reservation && reservation.status === 'Rejected' && (
                    <Text style={styles.text}>
                      Rejection Reason: {reservation.responseNote}
                    </Text>
                  )}
                  <View style={styles.textSeparator} />
                </SingleItemWithImage>
              </ScrollView>
            </SingleItemBackground>
          ) : (
            <Text>No reservation found</Text>
          )}
          {reservation && reservation.status === 'Reserved' && (
            <WideButton
              text='Borrow Item'
              buttonClickHandler={() => handleBorrow({ item: reservation })}
            />
          )}
          {cancelError && <Text>Error: {cancelError}</Text>}
          {cancelLoading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : reservation && reservation.status === 'Reserved' ? (
            <WideButton
              text='Cancel Reservation'
              buttonClickHandler={() => showAlert({ item: reservation })}
              danger={true}
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
});
