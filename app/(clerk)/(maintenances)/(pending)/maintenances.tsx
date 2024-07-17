import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkMaintenancesHorizontalBar from '@/components/ClerkMaintHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import React, { useState, useEffect } from 'react';

interface Maintenance {
  id: number;
  name: string;
  model: string;
  lab: string;
  serialNumber: string;
  imageURL?: string | null;
}

const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
  <Link href={{ pathname: '/(clerk)/(maintenances)/(ongoing)/add-maintenance', params: { maintenanceId: item.id } }} asChild>
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
                  Serial Number: {item.serialNumber}
                </Text>
                </ListItemWithImage>
              </ListItemBackground>
              )}
          </Pressable>
  </Link>
);

export default function ViewPendingMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  useEffect(() => {
    setMaintenances([
      {
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        lab: 'Network Lab',
        serialNumber: 'FOC1234X56Y',
      },
      {
        id: 2,
        name: '8-Port Ethernet Switch',
        model: 'Cisco SG300-10',
        lab: 'Network Lab',
        serialNumber: 'FOC1234X56Z',
      },
      {
        id: 3,
        name: '16-Port Ethernet Switch',
        model: 'Cisco SG300-20',
        lab: 'Network Lab',
        serialNumber: 'FOC1234X56W',
      },
      {
        id: 4,
        name: '24-Port Ethernet Switch',
        model: 'Cisco SG300-30',
        lab: 'Network Lab',
        serialNumber: 'FOC1234X56V',
      },
    ]);
  }, []);
  return (
    <BackgroundLayout>
      <MainHeader title="Maintenances" />
      <ClerkMaintenancesHorizontalBar selectedIndex = {0} />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="Pending Maintenances" />
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

