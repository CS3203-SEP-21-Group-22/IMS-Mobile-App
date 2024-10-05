import {
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
  RefreshControl,
} from 'react-native';
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
import { PendingMaintenance } from '@/interfaces/maintenance.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';
import Colors from '@/constants/Colors';

const ItemComponent: React.FC<{ item: PendingMaintenance }> = ({ item }) => (
  <Link
    href={{
      pathname: '/(clerk)/(maintenances)/(ongoing)/add-maintenance',
      params: {
        itemId: item.itemId,
        itemSerialNumber: item.itemSerialNumber,
        itemName: item.itemName,
        labName: item.labName,
      },
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
              Last Repair On: {item.lastMaintenanceEndDate.split('T')[0]}
            </Text>
          </ListItemWithImage>
        </ListItemBackground>
      )}
    </Pressable>
  </Link>
);

export default function ViewPendingMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<PendingMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get(`/clerk/maintenance/pending`);
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
      <ClerkMaintenancesHorizontalBar selectedIndex={0} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Pending Maintenances' />
          {loading ? (
            <ActivityIndicator
              size='large'
              color='#ffffff'
              style={{ marginTop: '50%' }}
            />
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
                keyExtractor={(item) => item.itemId.toString()}
                style={styles.flatList}
                contentContainerStyle={{
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchData}
                    tintColor={Colors.light.primary.button}
                  />
                }
              />
            ) : (
              <View
                style={{
                  height: '83%',
                  backgroundColor: 'transparent',
                }}
              >
                <Pressable onPress={fetchData} style={{ marginTop: '70%' }}>
                  <Text style={styles.notFoundText}>
                    No Pending Maintenances
                  </Text>
                </Pressable>
              </View>
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
    justifyContent: 'flex-start',
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
  notFoundText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'semibold',
    marginTop: '50%',
  },
});
