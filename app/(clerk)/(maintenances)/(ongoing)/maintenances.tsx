import {
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
  Pressable,
  RefreshControl,
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
import WideButton from '@/components/WideButton';
import { Maintenance } from '@/interfaces/maintenance.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';
import Colors from '@/constants/Colors';

const handleButtonPress = () => {
  router.push('/(clerk)/(maintenances)/(ongoing)/add-maintenance');
};

const ItemComponent: React.FC<{ item: Maintenance }> = ({ item }) => (
  <Link
    href={{
      pathname: '/(clerk)/(maintenances)/(ongoing)/view-maintenance',
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
            {item.status === 'Scheduled' ? (
              <Text style={styles.text}>
                Start Date: {item.startDate.split('T')[0]}
              </Text>
            ) : (
              <Text style={styles.text}>
                End Date: {item.endDate.split('T')[0]}
              </Text>
            )}
            <Text style={styles.text}>Status: {item.status}</Text>
          </ListItemWithImage>
        </ListItemBackground>
      )}
    </Pressable>
  </Link>
);

export default function viewOngoingMaintenancesScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get(`/clerk/maintenance?completed=false`);
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
      <ClerkMaintenancesHorizontalBar selectedIndex={1} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Ongoing Maintenances' />
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
                keyExtractor={(item) => item.maintenanceId.toString()}
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
              <Text style={styles.notFoundText}>No maintenances found</Text>
            )
          ) : null}
        </View>
        <WideButton
          text='Create New Maintenance'
          buttonClickHandler={handleButtonPress}
        />
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
  notFoundText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'semibold',
    marginTop: '50%',
  },
});
