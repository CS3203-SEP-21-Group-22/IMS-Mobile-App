import { StyleSheet, Pressable, ImageBackground, ScrollView } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import SingleItemWithImage from '@/components/SingleItemWithImage';
import { useState, useEffect } from 'react';

interface Reservation {
  id: number | null;
  name: string | null;
  model: string | null;
  serialNumber?: string | null;
  lab: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  imageURL?: string | null;
}

const handleBorrow = ({ item }: { item: Reservation }) => {
  router.replace({ pathname: '/(student)/(reservations)/borrow-item', params: { reservationId: item.id } })
}

export default function ViewReservedItemScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation>({
    id: null,
    name: null,
    model: null,
    serialNumber: null,
    lab: null,
    startDate: null,
    endDate: null,
    status: null,
    imageURL: null,
  });
  useEffect(() => {
    if (reservationId) {
      setReservation({
        id: parseInt(reservationId),
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        serialNumber: 'FOC1234X56Y',
        lab: 'Network Lab',
        startDate: '2021-10-01',
        endDate: '2021-10-10',
        status: 'Accepted',
      });
    } else {
      throw new Error('Missing reservationId');
    }
  }, [reservationId]);
  return (
    <BackgroundLayout>
    <MainHeader title="Reservations" />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="View Reservation" />
      <SingleItemBackground>
        <ScrollView>
        <SingleItemWithImage title={reservation.name ?? ''} link={reservation.imageURL ?? 'equipment'}>
          <Text style={styles.text}>
            Model: {reservation.model}
          </Text>
          { reservation.serialNumber && (
              <Text style={styles.text}>
                Serial Number: {reservation.serialNumber}
              </Text>
            )
          }
          <Text style={styles.text}>
            Lab: {reservation.lab}
          </Text>
          <View style={styles.textSeparator} />
          <Text style={styles.text}>
            Reserved From: {reservation.startDate}
          </Text>
          <Text style={styles.text}>
            Reserved Until: {reservation.endDate}
          </Text>
          <View style={styles.textSeparator} />
          <Text style={styles.text}>
            Status: {reservation.status}
          </Text>
          <View style={styles.textSeparator} />
        </SingleItemWithImage>
        </ScrollView>
      </SingleItemBackground>
      { reservation.status === 'Accepted' && (
        <View style={styles.button}>
            <ImageBackground
              source={require('@/assets/images/blueBtn.webp')}
              style={styles.buttonBackground}
              borderRadius={10}
            >
              <Pressable onPress={() => handleBorrow({ item: reservation })} style={{ width: '100%', alignItems: 'center' }}>
                <Text style={styles.buttonText}>
                  Borrow Item
                </Text>
              </Pressable>
            </ImageBackground>
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
  titleText: {
    color:'white',
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
