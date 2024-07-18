import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import TechnicianMaintHorizontalBar from '@/components/TechnicianMaintHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import { useState, useEffect } from 'react';

interface Maintenance {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  lab: string;
  endDate: string;
  status: string;
  imageURL?: string;
}

const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
  <Link href={{ pathname: '/(technician)/(maintenances)/update-maintenance', params: { maintenanceId: item.id } }} asChild>
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
                  Serial Number: {item.serialNumber}
                </Text>
                <Text style={styles.text}>
                  Lab: {item.lab}
                </Text>
                <Text style={styles.text}>
                  Due Date: {item.endDate}
                </Text>
                <Text style={styles.text}>
                  Status: {item.status}
                </Text>
                </ListItemWithImage>
              </ListItemBackground>
              )}
          </Pressable>
  </Link>
);

export default function AssignedMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  useEffect(() => {
    setMaintenances([
      {
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        serialNumber: '123456',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'ongoing',
      },
      {
        id: 2,
        name: '8-Port Ethernet Switch',
        model: 'Cisco SG350-10P',
        serialNumber: '123456',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'ongoing',
      },
      {
        id: 3,
        name: '24-Port Ethernet Switch',
        model: 'Cisco SG350-28P',
        serialNumber: '123456',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'under review',
      },
      {
        id: 4,
        name: '16-Port PoE Switch',
        model: 'Cisco SG350-28P',
        serialNumber: '123456',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'under review',
      },
      {
        id: 5,
        name: '24-Port PoE Switch',
        model: 'Cisco SG350-28P',
        serialNumber: '123456',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'ongoing',
      },
    ]);
  }, []);

  return (
    <BackgroundLayout>
      <MainHeader title="Maintenances" />
      <TechnicianMaintHorizontalBar selectedIndex={0} />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="Assigned Maintenances" />
        <FlatList
            data={maintenances}
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

