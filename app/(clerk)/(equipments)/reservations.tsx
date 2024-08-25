import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import { useState, useEffect } from 'react';

interface Reservation {
  id: number;
  reservedBy: string;
  FromDate: string;
  ToDate: string;
  RequestedAt: string;
  AcceptedBy: string;
  BorrowedFrom: string;
  BorrowedAt: string;
  ReturnedTo: string;
  ReturnedAt: string;
}

export default function ViewReservationsScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  useEffect(() => {
    if (itemId) {
      setReservations([
        {
          id: 1,
          reservedBy: 'John Doe',
          FromDate: '2021-09-01',
          ToDate: '2021-09-02',
          RequestedAt: '2021-08-30 10:00',
          AcceptedBy: 'Jane Doe',
          BorrowedFrom: 'John Doe',
          BorrowedAt: '2021-09-01 10:00',
          ReturnedTo: 'Jane Doe',
          ReturnedAt: '2021-09-02 10:00',
        },
        {
          id: 2,
          reservedBy: 'John Doe',
          FromDate: '2021-09-01',
          ToDate: '2021-09-02',
          RequestedAt: '2021-08-30 10:00',
          AcceptedBy: 'Jane Doe',
          BorrowedFrom: 'John Doe',
          BorrowedAt: '2021-09-01 10:00',
          ReturnedTo: 'Jane Doe',
          ReturnedAt: '2021-09-02 10:00',
        },
        {
          id: 3,
          reservedBy: 'John Doe',
          FromDate: '2021-09-01',
          ToDate: '2021-09-02',
          RequestedAt: '2021-08-30 10:00',
          AcceptedBy: 'Jane Doe',
          BorrowedFrom: 'John Doe',
          BorrowedAt: '2021-09-01 10:00',
          ReturnedTo: 'Jane Doe',
          ReturnedAt: '2021-09-02 10:00',
        },
        {
          id: 4,
          reservedBy: 'John Doe',
          FromDate: '2021-09-01',
          ToDate: '2021-09-02',
          RequestedAt: '2021-08-30 10:00',
          AcceptedBy: 'Jane Doe',
          BorrowedFrom: 'John Doe',
          BorrowedAt: '2021-09-01 10:00',
          ReturnedTo: 'Jane Doe',
          ReturnedAt: '2021-09-02 10:00',
        },
        {
          id: 5,
          reservedBy: 'John Doe',
          FromDate: '2021-09-01',
          ToDate: '2021-09-02',
          RequestedAt: '2021-08-30 10:00',
          AcceptedBy: 'Jane Doe',
          BorrowedFrom: 'John Doe',
          BorrowedAt: '2021-09-01 10:00',
          ReturnedTo: 'Jane Doe',
          ReturnedAt: '2021-09-02 10:00',
        },
      ]);
    } else {
      throw new Error('Missing itemId');
    }
  }, []);
  const ItemComponent: React.FC<{ item: Reservation }> = ({ item }) => (
    <ListItemBackground>
      <Text style={styles.text}>Reserved By: {item.reservedBy}</Text>
      <Text style={styles.text}>From Date: {item.FromDate}</Text>
      <Text style={styles.text}>To Date: {item.ToDate}</Text>
      <Text style={styles.text}>Requested At: {item.RequestedAt}</Text>
      <Text style={styles.text}>Accepted By: {item.AcceptedBy}</Text>
      <Text style={styles.text}>Borrowed From: {item.BorrowedFrom}</Text>
      <Text style={styles.text}>Borrowed At: {item.BorrowedAt}</Text>
      <Text style={styles.text}>Returned To: {item.ReturnedTo}</Text>
      <Text style={styles.text}>Returned At: {item.ReturnedAt}</Text>
    </ListItemBackground>
  );
  return (
    <BackgroundLayout>
      <MainHeader title='Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Reservations History' />
          <FlatList
            data={reservations}
            renderItem={({ item }) => <ItemComponent item={item} />}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
            contentContainerStyle={{
              alignItems: 'stretch',
              justifyContent: 'center',
              width: '100%',
              backgroundColor: 'transparent',
            }}
          />
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
  flatList: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  titleText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 10,
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
