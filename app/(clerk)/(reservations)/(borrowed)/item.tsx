import {
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
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

interface Reservation {
  id: number | null;
  name: string | null;
  model: string | null;
  lab: string | null;
  user: string | null;
  fromDate: string | null;
  toDate: string | null;
  requestedAt: string | null;
  imageURL?: string | null;
  assignedItem: string | null;
  assignedBy: string | null;
  assignedAt: string | null;
  borrowedFrom: string | null;
  borrowedAt: string | null;
}

const handleVerify = ({ item }: { item: Reservation }) => {
  router.replace({
    pathname: '/(clerk)/(reservations)/(borrowed)/verify',
    params: { reservationId: item.id },
  });
};

export default function ViewBorrowedItemScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation>({
    id: null,
    name: null,
    model: null,
    lab: null,
    user: null,
    fromDate: null,
    toDate: null,
    requestedAt: null,
    imageURL: null,
    assignedItem: null,
    assignedBy: null,
    assignedAt: null,
    borrowedFrom: null,
    borrowedAt: null,
  });
  useEffect(() => {
    if (reservationId) {
      setReservation({
        id: parseInt(reservationId),
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        lab: 'Network Lab',
        user: 'John Doe',
        fromDate: '2024-08-02',
        toDate: '2024-08-02',
        requestedAt: '2024-08-02 12:03',
        imageURL: null,
        assignedItem: 'FOC1234X56Y',
        assignedBy: 'Jane Doe',
        assignedAt: '2024-08-02 12:03',
        borrowedFrom: 'John Doe',
        borrowedAt: '2024-08-02 12:03',
      });
    } else {
      throw new Error('Missing reservationId');
    }
  }, [reservationId]);
  return (
    <BackgroundLayout>
      <MainHeader title='Reservations' />
      <ClerkReservationsHorizontalBar selectedIndex={2} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Item Request' />
          <SingleItemBackground>
            <ScrollView>
              <SingleItemWithImage
                title={reservation.name ?? ''}
                link={reservation.imageURL ?? 'equipment'}
              >
                <Text style={styles.text}>Model: {reservation.model}</Text>
                <Text style={styles.text}>Lab: {reservation.lab}</Text>
                <View style={styles.textSeparator} />
                <Text style={styles.text}>
                  Requested By: {reservation.user}
                </Text>
                <Text style={styles.text}>From: {reservation.fromDate}</Text>
                <Text style={styles.text}>To: {reservation.toDate}</Text>
                <View style={styles.textSeparator} />
                <Text style={styles.text}>
                  Requested At: {reservation.requestedAt}
                </Text>
                <View style={styles.textSeparator} />
                <Text style={styles.text}>
                  Assigned Item: {reservation.assignedItem}
                </Text>
                <Text style={styles.text}>
                  Assigned By: {reservation.assignedBy}
                </Text>
                <Text style={styles.text}>
                  Assigned At: {reservation.assignedAt}
                </Text>
                <View style={styles.textSeparator} />
                <Text style={styles.text}>
                  Borrowed From: {reservation.borrowedFrom}
                </Text>
                <Text style={styles.text}>
                  Borrowed At: {reservation.borrowedAt}
                </Text>
                <View style={styles.textSeparator} />
              </SingleItemWithImage>
            </ScrollView>
          </SingleItemBackground>
          <View style={styles.button}>
            <ImageBackground
              source={require('@/assets/images/blueBtn.webp')}
              style={styles.buttonBackground}
              borderRadius={10}
            >
              <Pressable
                onPress={() => handleVerify({ item: reservation })}
                style={{ width: '100%', alignItems: 'center' }}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </Pressable>
            </ImageBackground>
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
