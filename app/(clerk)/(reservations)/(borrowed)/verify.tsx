import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, router, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import { useState, useEffect } from 'react';
import QRCode from 'react-native-qrcode-svg';

export default function VerifyReturningItemScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  const [qrValue, setQrValue] = useState('sample');
  useEffect(() => {
    if (!reservationId) throw new Error('Missing reservationId');
    const qrValue = `{
      "verifyToken": "verifyReturningItem"
    }`;
    setQrValue(qrValue);
  }, [reservationId]);
  return (
    <BackgroundLayout>
      <MainHeader title='Reservations' />
      <ClerkReservationsHorizontalBar selectedIndex={2} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Verify Returning Item' />
          <Text style={styles.text}>Scan QR code to verify item return</Text>
          <QRCode value={qrValue} size={200} />
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
