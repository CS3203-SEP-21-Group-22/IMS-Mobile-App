import { StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import { useState, useEffect } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function VerifyReturningItemScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  if (!reservationId) throw new Error('Missing reservationId');
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(
        `/clerk/reservations/${reservationId}/token`,
      );
      setQrValue(response.data.qrToken);
    } catch (err: any) {
      setError('Failed to get QR code');
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
  }, [reservationId]);

  return (
    <BackgroundLayout>
      <MainHeader title='Reservations' />
      <ClerkReservationsHorizontalBar selectedIndex={2} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Verify Returning Item' />
          <View style={styles.subContainer}>
            {loading && (
              <ActivityIndicator
                size='large'
                color='#ffffff'
                style={{ marginTop: '50%' }}
              />
            )}
            {error && <Text>{error}</Text>}
            {!qrValue ? (
              !loading && (
                <Text style={styles.notFoundText}>QR code not found</Text>
              )
            ) : (
              <View style={styles.qrContainer}>
                <Text style={styles.text}>
                  Scan QR code to verify Returning
                </Text>
                <QRCode value={qrValue} size={200} />
              </View>
            )}
          </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  subContainer: {
    width: '100%',
    marginTop: '20%',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  notFoundText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'semibold',
    marginTop: '50%',
  },
});
