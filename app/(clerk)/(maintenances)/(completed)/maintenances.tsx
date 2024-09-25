import {
  StyleSheet,
  Pressable,
  FlatList,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
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
import { Maintenance } from '@/interfaces/maintenance.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
  <Link
    href={{
      pathname: '/(clerk)/(maintenances)/(completed)/view-maintenance',
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
            <Text style={styles.text}>Lab: {item.labName}</Text>
            <Text style={styles.text}>
              Serial Number: {item.itemSerialNumber}
            </Text>
            <Text style={styles.text}>
              From: {item.startDate.split('T')[0]} To:{' '}
              {item.endDate.split('T')[0]}
            </Text>
          </ListItemWithImage>
        </ListItemBackground>
      )}
    </Pressable>
  </Link>
);

export default function ViewCompletedMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(`/clerk/maintenance?completed=true`);
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
      <ClerkMaintenancesHorizontalBar selectedIndex={2} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Completed Maintenances' />
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 10,
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
  },
  button: {
    width: '100%',
    marginTop: '4%',
  },
  buttonBackground: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2.5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
