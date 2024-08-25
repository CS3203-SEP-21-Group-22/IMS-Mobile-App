import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import { useState, useEffect } from 'react';

interface Maintenance {
  id: number;
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

export default function ViewMaintenancesScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  useEffect(() => {
    if (itemId) {
      setMaintenances([
        {
          id: 1,
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
    } else {
      throw new Error('Missing itemId');
    }
  }, []);
  const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
    <ListItemBackground>
      <Text style={styles.titleText}>Description: {item.description}</Text>
      <Text style={styles.text}>Assigned To: {item.assignedTo}</Text>
      <Text style={styles.text}>Created By: {item.createdBy}</Text>
      <Text style={styles.text}>Created At: {item.createdAt}</Text>
      <Text style={styles.text}>Submit Note: {item.submitNote}</Text>
      <Text style={styles.text}>Cost: {item.cost}</Text>
      <Text style={styles.text}>Returned At: {item.returnedAt}</Text>
      <Text style={styles.text}>Review Note: {item.reviewNote}</Text>
      <Text style={styles.text}>Reviewed By: {item.reviewedBy}</Text>
      <Text style={styles.text}>Reviewed At: {item.reviewedAt}</Text>
      <Text style={styles.text}>Start Date: {item.startDate}</Text>
      <Text style={styles.text}>End Date: {item.endDate}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>
    </ListItemBackground>
  );
  return (
    <BackgroundLayout>
      <MainHeader title='Explore Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Maintenances History' />
          <FlatList
            data={maintenances}
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
