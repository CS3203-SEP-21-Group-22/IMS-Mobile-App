import {
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
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
import { Maintenance } from '@/interfaces/maintenance.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
  <Link
    href={{
      pathname: '/(technician)/(maintenances)/update-maintenance',
      params: { maintenanceId: item.maintenanceId },
    }}
    asChild
  >
    <Pressable>
      {({ pressed }) => (
        <ListItemBackground>
          <ListItemWithImage link={item.imageUrl ?? 'equipment'}>
            <Text style={styles.titleText}>
              {item.itemName ? item.itemName + ' (' + item.itemModel + ')' : ''}
            </Text>
            <Text style={styles.text}>
              Serial Number: {item.itemSerialNumber}
            </Text>
            <Text style={styles.text}>Lab: {item.labName}</Text>
            <Text style={styles.text}>
              Due Date: {item.endDate.split('T')[0]}
            </Text>
            <Text style={styles.text}>Status: {item.status}</Text>
          </ListItemWithImage>
        </ListItemBackground>
      )}
    </Pressable>
  </Link>
);

export default function AssignedMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(
        `/technician/maintenance?completed=false`,
      );
      setMaintenances(response.data);
    } catch (err: any) {
      setError('Failed to fetch data');
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Axios and fetch data on component mount
  useEffect(() => {
    const initializeAndFetch = async () => {
      await initializeAxiosApi(); // Initialize Axios instance
      fetchData(); // Fetch data from the API
    };

    initializeAndFetch();
  }, []);

  return (
    <BackgroundLayout>
      <MainHeader title='Maintenances' />
      <TechnicianMaintHorizontalBar selectedIndex={0} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Assigned Maintenances' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : maintenances ? (
            maintenances.length > 0 ? (
              <FlatList
                data={maintenances}
                renderItem={({ item }) => <ItemComponent item={item} />}
                keyExtractor={(item) => item.maintenanceId.toString()}
                style={styles.flatList}
                contentContainerStyle={{
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <Text style={styles.text}>No maintenances found</Text>
            )
          ) : null}
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
});
