import { StyleSheet, Pressable, Button } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';

export default function ReturnItemScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  if (!reservationId) throw new Error('Missing reservationId');
  const [scanned, setScanned] = useState(false);
  const [scannedValue, setScannedValue] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          Requires permission to access the camera
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (data) {
      setScanned(true);
      setScannedValue(data);
    }
  };

  const handleResult = () => {
    if (scannedValue) {
      try {
        const { verifyToken } = JSON.parse(scannedValue);
        console.log(verifyToken);
        return (
          <Text style={styles.resulttext}>
            {'Successfully, verified returning item'}
          </Text>
        );
      } catch (e) {
        return (
          <Text style={styles.resulttext}>
            {'Invalid QR code. Please scan a valid QR code'}
          </Text>
        );
      }
    }
    return <Text style={styles.resulttext}>No QR code scanned</Text>;
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Borrowed Items' />
      <ClerkReservationsHorizontalBar selectedIndex={1} />
      <ContentContainer>
        <View style={styles.container}>
          <View style={styles.camerabox}>
            <CameraView
              barcodeScannerSettings={{
                barcodeTypes: [
                  'aztec',
                  'ean13',
                  'ean8',
                  'qr',
                  'pdf417',
                  'upc_e',
                  'datamatrix',
                  'code39',
                  'code93',
                  'itf14',
                  'codabar',
                  'code128',
                  'upc_a',
                ],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
              <Button
                title={'Tap to Scan Again'}
                onPress={() => setScanned(false)}
              />
            )}
          </View>
          <View style={styles.textbox}>{handleResult()}</View>
          <ContentContainerHeader title='Verify Returning Item' />
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
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  camerabox: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  resultlink: {
    color: 'blue',
    flexWrap: 'wrap',
    fontFamily: 'monospace',
    padding: 20,
    textDecorationLine: 'underline',
  },
  resulttext: {
    color: 'white',
    flexWrap: 'wrap',
    fontFamily: 'monospace',
    padding: 20,
  },
  textbox: {
    borderTopColor: 'blue',
    borderTopWidth: 3,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
