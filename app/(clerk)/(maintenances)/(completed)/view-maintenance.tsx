import {
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import ClerkMaintenancesHorizontalBar from '@/components/ClerkMaintHorizontalBar';
import React, { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';
import { MaintenanceDetailed } from '@/interfaces/maintenance.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function viewCompletedMaintenanceScreen() {
  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();
  if (!maintenanceId) throw new Error('Missing maintenanceId');
  const [maintenance, setMaintenance] = useState<MaintenanceDetailed | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(`/user/maintenance/${maintenanceId}`);
      setMaintenance(response.data);
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
          <ContentContainerHeader title='View Maintenance' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : maintenance ? (
            <SingleItemBackground>
              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                <Text style={styles.title}>
                  {maintenance.itemName} ({maintenance.itemModel})
                </Text>
                <View style={styles.separator} />
                <Text style={styles.text}>
                  Serial Number: {maintenance.itemSerialNumber}
                </Text>
                <Text style={styles.text}>Lab: {maintenance.labName}</Text>
                <View style={styles.separator} />
                <Text style={styles.text}>
                  From: {maintenance.startDate.split('T')[0]} To:{' '}
                  {maintenance.endDate.split('T')[0]}
                </Text>
                <View style={styles.separator} />
                <Text style={[styles.descriptionText, { width: '95%' }]}>
                  Task Description: {maintenance.taskDescription}
                </Text>
                <View style={styles.separator} />
                <Text style={styles.text}>
                  Assigned By: {maintenance.createdClerkName}
                </Text>
                <Text style={styles.text}>
                  Assigned At: {maintenance.createdAt.split('T')[0]}{' '}
                  {maintenance.createdAt
                    .split('T')[1]
                    .split('.')[0]
                    .slice(0, 5)}
                </Text>
                <View style={styles.separator} />
                {maintenance.reviewNote && (
                  <Text style={styles.text}>
                    Review Note: {maintenance.reviewNote}
                  </Text>
                )}
                {maintenance.reviewedClerkName && (
                  <Text style={styles.text}>
                    Reviewed By: {maintenance.reviewedClerkName}
                  </Text>
                )}
                {maintenance.reviewedAt && (
                  <Text style={styles.text}>
                    Reviewed At: {maintenance.reviewedAt.split('T')[0]}{' '}
                    {maintenance.reviewedAt
                      .split('T')[1]
                      .split('.')[0]
                      .slice(0, 5)}
                  </Text>
                )}
                <View style={styles.separator} />
                <Text style={styles.text}>Status: {maintenance.status}</Text>
                {maintenance.reviewNote && (
                  <>
                    <View style={styles.separator} />
                    <Text style={styles.descriptionText}>
                      Review Note: {maintenance.reviewNote}
                    </Text>
                  </>
                )}
                <View style={styles.separator} />
                {maintenance.cost && (
                  <Text style={styles.text}>Cost: {maintenance.cost}</Text>
                )}
                {maintenance.submitNote && (
                  <Text style={styles.text}>
                    Submit Note: {maintenance.submitNote}
                  </Text>
                )}
              </ScrollView>
            </SingleItemBackground>
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
  titleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '2%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
  },
  text: {
    color: 'white',
    fontSize: 11,
    marginBottom: '0.2%',
  },
  textSeparator: {
    marginVertical: '2%',
    height: 0.1,
    width: '80%',
    backgroundColor: 'transparent',
  },
  dropdown: {
    marginTop: '2%',
    marginBottom: '4%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    width: 200,
  },
  dropdownText: {
    color: 'black',
    fontSize: 13,
    alignSelf: 'center',
    paddingLeft: '3%',
    paddingVertical: '1%',
  },
  multilineInput: {
    backgroundColor: 'white',
    width: 200,
    height: 60,
    borderRadius: 8,
    paddingLeft: '3%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '3%',
    backgroundColor: 'transparent',
  },
  button: {
    width: '90%',
    marginHorizontal: '5%',
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
  descriptionText: {
    fontSize: 14,
    // fontWeight: 'bold',
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
  },
});
