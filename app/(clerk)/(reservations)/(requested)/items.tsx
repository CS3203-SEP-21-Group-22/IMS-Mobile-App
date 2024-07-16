import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';

// 4-Port WiFi Router (Cisco SRP541W)
// Lab : Network Lab
// User : John Doe
// Requested At 2024-08-02 12:03

interface Reservation {
  id: number;
  name: string;
  model: string;
  lab: string;
  user: string;
  requestedAt: string;
  imageURL?: string | null;
}

const ItemComponent: React.FC<{ item: Reservation }> = ({ item }) => (
  <Link href={`/(clerk)/(reservations)/(requested)/${item.id}`} asChild>
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
                  Requested At: {item.requestedAt}
                </Text>
                </ListItemWithImage>
              </ListItemBackground>
              )}
          </Pressable>
  </Link>
);

export default function ViewRequestedItemsScreen() {
  const reservations: Reservation[] = [
    {
      id: 1,
      name: '4-Port WiFi Router',
      model: 'Cisco SRP541W',
      lab: 'Network Lab',
      user: 'John Doe',
      requestedAt: '2024-08-02 12:03',
    },
    {
      id: 2,
      name: '8-Port Ethernet Switch',
      model: 'Cisco SG350-10P',
      lab: 'Network Lab',
      user: 'Jane Doe',
      requestedAt: '2024-08-02 12:03',
    },
    {
      id: 3,
      name: '24-Port Ethernet Switch',
      model: 'Cisco SG350-28P',
      lab: 'Network Lab',
      user: 'John Doe',
      requestedAt: '2024-08-02 12:03',
    },
    {
      id: 4,
      name: '16-Port PoE Switch',
      model: 'Cisco SG350-28P',
      lab: 'Network Lab',
      user: 'Jane Doe',
      requestedAt: '2024-08-02 12:03',
    },
    {
      id: 5,
      name: '24-Port PoE Switch',
      model: 'Cisco SG350-28P',
      lab: 'Network Lab',
      user: 'John Doe',
      requestedAt: '2024-08-02 12:03',
    }
  ];
  const colorScheme = useColorScheme();
  return (
    <BackgroundLayout>
      <MainHeader title="Reservations" />
      <ClerkReservationsHorizontalBar selectedIndex = {0} />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="Requested Items" />
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

