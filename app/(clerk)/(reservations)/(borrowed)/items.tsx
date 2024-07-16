import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';

interface Reservation {
  id: number;
  name: string;
  model: string;
  lab: string;
  user: string;
  dueDate: string;
  imageURL?: string | null;
}

const ItemComponent: React.FC<{ item: Reservation }> = ({ item }) => (
  <Link href={{ pathname: '/(clerk)/(reservations)/(borrowed)/item', params: { reservationId: item.id } }} asChild>
          <Pressable>
            {({ pressed }) => (
              <ListItemBackground>
                <ListItemWithImage link={item.imageURL ?? 'equipment'}>
                <Text style={styles.titleText}>
                  {item.name}
                </Text>
                <Text style={styles.text}>
                  Model: {item.model}
                </Text>
                <Text style={styles.text}>
                  Lab: {item.lab}
                </Text>
                <Text style={styles.text}>
                  User: {item.user}
                </Text>
                <Text style={styles.text}>
                  Due Date: {item.dueDate}
                </Text>
                </ListItemWithImage>
              </ListItemBackground>
              )}
          </Pressable>
  </Link>
);

export default function ViewBorrowedItemsScreen() {
  const reservations: Reservation[] = [
    {
      id: 1,
      name: '4-Port WiFi Router',
      model: 'Cisco SRP541W',
      lab: 'Network Lab',
      user: 'John Doe',
      dueDate: '2024-08-05',
    },
    {
      id: 2,
      name: 'Ethernet Cable',
      model: 'Cat 6',
      lab: 'Network Lab',
      user: 'Jane Doe',
      dueDate: '2024-08-05',
    },
    {
      id: 3,
      name: '8-Port Ethernet Switch',
      model: 'Cisco SG350-10P',
      lab: 'Network Lab',
      user: 'John Doe',
      dueDate: '2024-08-05',
    },
    {
      id: 4,
      name: '4-Port WiFi Router',
      model: 'Cisco SRP541W',
      lab: 'Network Lab',
      user: 'John Doe',
      dueDate: '2024-08-05',
    },
  ];
  return (
    <BackgroundLayout>
      <MainHeader title="Reservations" />
      <ClerkReservationsHorizontalBar selectedIndex = {2} />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="Borrowed Items" />
        <FlatList
            data={reservations}
            renderItem={({ item }) => <ItemComponent item={item} />}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
            contentContainerStyle={{ alignItems: 'stretch', justifyContent: 'center', width: '100%', backgroundColor: 'transparent' }}
            
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
    color:'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 10,
  },
});
