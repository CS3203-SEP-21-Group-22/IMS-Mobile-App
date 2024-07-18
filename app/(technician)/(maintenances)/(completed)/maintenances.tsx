import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import TechnicianMaintHorizontalBar from '@/components/TechnicianMaintHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import { useState, useEffect } from 'react';

interface Maintenance {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  lab: string;
  taskDescription: string;
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
}

const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
          <Pressable>
            {({ pressed }) => (
              <ListItemBackground>
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
                  Task Description: {item.taskDescription}
                </Text>
                <Text style={styles.text}>
                  Created By: {item.createdBy}
                </Text>
                <Text style={styles.text}>
                  Created At: {item.createdAt}
                </Text>
                <Text style={styles.text}>
                  Submit Note: {item.submitNote}
                </Text>
                <Text style={styles.text}>
                  Cost: {item.cost}
                </Text>
                <Text style={styles.text}>
                  Returned At: {item.returnedAt}
                </Text>
                <Text style={styles.text}>
                  Review Note: {item.reviewNote}
                </Text>
                <Text style={styles.text}>
                  Reviewed By: {item.reviewedBy}
                </Text>
                <Text style={styles.text}>
                  Reviewed At: {item.reviewedAt}
                </Text>
                <Text style={styles.text}>
                  Start Date: {item.startDate}
                </Text>
                <Text style={styles.text}>
                  Due Date: {item.endDate}
                </Text>
              </ListItemBackground>
              )}
          </Pressable>
);

export default function ApprovedMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  useEffect(() => {
    setMaintenances([
      {
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        serialNumber: '123456',
        lab: 'Network Lab',
        taskDescription: 'The router is not working properly.',
        createdBy: 'Jane Doe',
        createdAt: '2024-08-02 12:00',
        submitNote: 'The router was repaired',
        cost: 100,
        returnedAt: '2024-08-02 12:00',
        reviewNote: 'The router was repaired',
        reviewedBy: 'Jane Doe',
        reviewedAt: '2024-08-02 12:00',
        startDate: '2024-08-02',
        endDate: '2024-08-02',
      },
      {
        id: 2,
        name: '8-Port Ethernet Switch',
        model: 'Cisco SG350-10P',
        serialNumber: '123456',
        lab: 'Network Lab',
        taskDescription: 'The switch is not working properly.',
        createdBy: 'Jane Doe',
        createdAt: '2024-08-02 12:00',
        submitNote: 'The switch was repaired',
        cost: 100,
        returnedAt: '2024-08-02 12:00',
        reviewNote: 'The switch was repaired',
        reviewedBy: 'Jane Doe',
        reviewedAt: '2024-08-02 12:00',
        startDate: '2024-08-02',
        endDate: '2024-08-02',
      },
    ]);
  }, []);

  return (
    <BackgroundLayout>
      <MainHeader title="Maintenances" />
      <TechnicianMaintHorizontalBar selectedIndex={1} />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="Approved Maintenances" />
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

