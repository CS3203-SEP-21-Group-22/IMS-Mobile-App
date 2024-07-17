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
  description: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  submitNote: string;
  cost: number;
  returnedAt: string;
  reviewNote: string;
  reviewedBy: string;
  reviewedAt: string;
  startDate: string;
  endDate: string;
  status: string;
}

const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
  <ListItemBackground>
    <Text style={styles.titleText}>
      {item.name}
    </Text>
    <View style={styles.separator} />
    <Text style={styles.text}>
      Model: {item.model}
    </Text>
    <Text style={styles.text}>
      Serial Number: {item.serialNumber}
    </Text>
    <Text style={styles.text}>
      Lab: {item.lab}
    </Text>
    <View style={styles.separator} />
    <Text style={styles.text}>
      Description: {item.description}
    </Text>
    <Text style={styles.text}>
      Assigned To: {item.assignedTo}
    </Text>
    <Text style={styles.text}>
      Created By: {item.createdBy}
    </Text>
    <Text style={styles.text}>
      Created At: {item.createdAt}
    </Text>
    <View style={styles.separator} />
    <Text style={styles.text}>
      Submit Note: {item.submitNote}
    </Text>
    <Text style={styles.text}>
      Cost: {item.cost}
    </Text>
    <Text style={styles.text}>
      Returned At: {item.returnedAt}
    </Text>
    <View style={styles.separator} />
    <Text style={styles.text}>
      Review Note: {item.reviewNote}
    </Text>
    <Text style={styles.text}>
      Reviewed By: {item.reviewedBy}
    </Text>
    <Text style={styles.text}>
      Reviewed At: {item.reviewedAt}
    </Text>
    <View style={styles.separator} />
    <Text style={styles.text}>
      Start Date: {item.startDate}
    </Text>
    <Text style={styles.text}>
      End Date: {item.endDate}
    </Text>
    <View style={styles.separator} />
    <Text style={styles.text}>
      Status: {item.status}
    </Text>
  </ListItemBackground>
);

export default function ViewCompletedMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  useEffect(() => {
    setMaintenances([
      {
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        serialNumber: 'FOC1234X56Y',
        lab: 'Network Lab',
        description: 'Replace broken parts',
        assignedTo: 'John Doe',
        createdBy: 'Jane Doe',
        createdAt: '2021-09-01 10:00',
        submitNote: 'Replaced the broken parts with new ones',
        cost: 100,
        returnedAt: '2021-09-02 10:00',
        reviewNote: 'The maintenance was done perfectly',
        reviewedBy: 'John Doe',
        reviewedAt: '2021-09-03 10:00',
        startDate: '2021-09-01',
        endDate: '2021-09-02',
        status: 'Completed',
      },
      {
        id: 2,
        name: '8-Port Ethernet Switch',
        model: 'Cisco SG300-10',
        serialNumber: 'FOC1234X56Z',
        lab: 'Network Lab',
        description: 'Replace broken parts',
        assignedTo: 'John Doe',
        createdBy: 'Jane Doe',
        createdAt: '2021-09-01 10:00',
        submitNote: 'Replaced the broken parts with new ones',
        cost: 100,
        returnedAt: '2021-09-02 10:00',
        reviewNote: 'The maintenance was done perfectly',
        reviewedBy: 'John Doe',
        reviewedAt: '2021-09-03 10:00',
        startDate: '2021-09-01',
        endDate: '2021-09-02',
        status: 'Completed',
      },
      {
        id: 3,
        name: '16-Port Ethernet Switch',
        model: 'Cisco SG300-20',
        serialNumber: 'FOC1234X56A',
        lab: 'Network Lab',
        description: 'Replace broken parts',
        assignedTo: 'John Doe',
        createdBy: 'Jane Doe',
        createdAt: '2021-09-01 10:00',
        submitNote: 'Replaced the broken parts with new ones',
        cost: 100,
        returnedAt: '2021-09-02 10:00',
        reviewNote: 'The maintenance was done perfectly',
        reviewedBy: 'John Doe',
        reviewedAt: '2021-09-03 10:00',
        startDate: '2021-09-01',
        endDate: '2021-09-02',
        status: 'Completed',
      },
      {
        id: 4,
        name: '24-Port Ethernet Switch',
        model: 'Cisco SG300-28',
        serialNumber: 'FOC1234X56B',
        lab: 'Network Lab',
        description: 'Replace broken parts',
        assignedTo: 'John Doe',
        createdBy: 'Jane Doe',
        createdAt: '2021-09-01 10:00',
        submitNote: 'Replaced the broken parts with new ones',
        cost: 100,
        returnedAt: '2021-09-02 10:00',
        reviewNote: 'The maintenance was done perfectly',
        reviewedBy: 'John Doe',
        reviewedAt: '2021-09-03 10:00',
        startDate: '2021-09-01',
        endDate: '2021-09-02',
        status: 'Completed',
      },
    ]);
  }, []);
  return (
    <BackgroundLayout>
      <MainHeader title="Maintenances" />
      <ClerkMaintenancesHorizontalBar selectedIndex = {2} />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="Completed Maintenances" />
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
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

