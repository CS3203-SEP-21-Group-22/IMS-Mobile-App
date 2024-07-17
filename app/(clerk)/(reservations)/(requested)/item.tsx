import { StyleSheet, Pressable, Image, TextInput, ImageBackground, ScrollView } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import SingleItemWithImage from '@/components/SingleItemWithImage';
import { Dropdown } from 'react-native-element-dropdown';
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
}

interface Item {
  id: number;
  serialNumber: string;
}

const handleAccept = () => {
  router.replace('/(clerk)/(reservations)/(requested)/items');
}

const handleReject = () => {
  router.replace('/(clerk)/(reservations)/(requested)/items');
}

export default function ViewRequestedItemScreen() {
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
  });
  const [itemsList, setItemsList] = useState<Item[]>([]);
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
      })
      setItemsList([
        { id: 1, serialNumber: 'FOC1234X56Y' },
        { id: 2, serialNumber: 'FOC1234X56Z' },
        { id: 3, serialNumber: 'FOC1234X56A' },
      ]);
    } else {
      throw new Error('Reservation ID is required');
    }
  }, [reservationId]);
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  return (
    <BackgroundLayout>
    <MainHeader title="Reservations" />
    <ClerkReservationsHorizontalBar selectedIndex = {0} />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="Item Request" />
      <SingleItemBackground>
        <ScrollView>
        <SingleItemWithImage title={reservation.name ?? ''} link={reservation.imageURL ?? 'equipment'}>
          <Text style={styles.text}>
            Model: {reservation.model}
          </Text>
          <Text style={styles.text}>
            Lab: {reservation.lab}
          </Text>
          <View style={styles.textSeparator} />
          <Text style={styles.text}>
            Requested By: {reservation.user}
          </Text>
          <Text style={styles.text}>
            From: {reservation.fromDate}
          </Text>
          <Text style={styles.text}>
            To: {reservation.toDate}
          </Text>
          <View style={styles.textSeparator} />
          <Text style={styles.text}>
            Requested At: {reservation.requestedAt}
          </Text>
          <View style={styles.textSeparator} />
          <Text style={styles.text}>
            Assigned Item:
          </Text>
          <Dropdown
            data={itemsList}
            mode='modal'
            search
            searchPlaceholder='Search Item'
            labelField="serialNumber"
            valueField="id"
            onChange={(item) => setSelectedItem(item)}
            style={styles.dropdown}
            placeholder={ selectedItem ? selectedItem.serialNumber : 'Select Item' }
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
          />
          <TextInput
            style={styles.multilineInput}
            placeholder="Notes"
            multiline
          />
          <View style={styles.textSeparator} />
          <View style={styles.buttonsContainer}>
            <View style={styles.button}>
              <ImageBackground
                source={require('@/assets/images/redBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={12}
              >
                <Pressable onPress={handleReject}>
                  <Text style={styles.buttonText}>
                    Reject
                  </Text>
                </Pressable>
              </ImageBackground>
            </View>
            <View style={styles.button}>
              <ImageBackground
                source={require('@/assets/images/blueBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={12}
              >
                <Pressable onPress={handleAccept}>
                  <Text style={styles.buttonText}>
                    Assign
                  </Text>
                </Pressable>
              </ImageBackground>
            </View>
          </View>
        </SingleItemWithImage>
        </ScrollView>
      </SingleItemBackground>
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
    marginVertical: '1%',
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
    width: '45%',
    backgroundColor: 'transparent',
  },
  buttonBackground: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    paddingTop: '4%',
    paddingBottom: '6%',
  },
});
