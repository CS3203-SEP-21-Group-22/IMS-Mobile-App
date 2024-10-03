import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import { useState, useEffect } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function ReservedItemsScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  if (!reservationId) throw new Error('Missing reservationId');
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(
        `/student/reservations/${reservationId}/token`,
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
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Borrow Item' />
          {loading && <ActivityIndicator />}
          {error && <Text>{error}</Text>}
          {!qrValue ? (
            <Text>QR code not found</Text>
          ) : (
            <View>
              <Text style={styles.text}>Scan QR code to verify borrowing</Text>
              <QRCode value={qrValue} size={200} />
            </View>
          )}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: '3%',
  },
});
