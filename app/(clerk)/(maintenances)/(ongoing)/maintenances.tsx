import { StyleSheet, Pressable, FlatList, ImageBackground } from 'react-native';
import { Link, router } from 'expo-router';
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
  serialNumber: string;
  lab: string;
  endDate: string;
  status: string;
  imageURL?: string | null;
}

const handleButtonPress = () => {
  router.push('/(clerk)/(maintenances)/(ongoing)/add-maintenance');
}

const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
  <Link href={{ pathname: '/(clerk)/(maintenances)/(ongoing)/view-maintenance', params: { maintenanceId: item.id } }} asChild>
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
                  End Date: {item.endDate}
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

export default function viewOngoingMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  useEffect(() => {
    setMaintenances([
      {
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        serialNumber: 'FOC1234X56Y',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'Under Review',
      },
      {
        id: 2,
        name: '8-Port Ethernet Switch',
        model: 'Cisco SG300-10',
        serialNumber: 'FOC1234X56Z',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'Under Review',
      },
      {
        id: 3,
        name: '16-Port Ethernet Switch',
        model: 'Cisco SG300-20',
        serialNumber: 'FOC1234X56A',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'Under Review',
      },
      {
        id: 4,
        name: '24-Port Ethernet Switch',
        model: 'Cisco SG300-28',
        serialNumber: 'FOC1234X56B',
        lab: 'Network Lab',
        endDate: '2024-08-02',
        status: 'Under Review',
      },
    ]);
  }, []);
  return (
    <BackgroundLayout>
      <MainHeader title="Maintenances" />
      <ClerkMaintenancesHorizontalBar selectedIndex = {1} />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="Ongoing Maintenances" />
        <FlatList
            data={maintenances}
            renderItem={({ item }) => <ItemComponent item={item} />}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
            contentContainerStyle={{ alignItems: 'stretch', justifyContent: 'center', width: '100%', backgroundColor: 'transparent' }}
          />
      </View>
      <View style={styles.button}>
          <ImageBackground
            source={require('@/assets/images/blueBtn.webp')}
            style={styles.buttonBackground}
            borderRadius={10}
          >
          <Pressable onPress={handleButtonPress} style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.buttonText}>
              Create New Maintenance
            </Text>
          </Pressable>
          </ImageBackground>
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
  button: {
    width: '100%',
    marginTop: '4%'
  },
  buttonBackground: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2.5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18
  },
});

