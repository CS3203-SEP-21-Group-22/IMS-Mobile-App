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

export default function viewOngoingMaintenancesScreen() {
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

  const handleUpdateButtonPress = ({ item }: { item: MaintenanceDetailed }) => {
    router.replace({
      pathname: '/(clerk)/(maintenances)/(ongoing)/update-maintenance',
      params: { maintenanceId: item.maintenanceId },
    });
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Maintenances' />
      <ClerkMaintenancesHorizontalBar selectedIndex={1} />
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
                <Text style={styles.titleText}>Maintenance Details</Text>
                <Text style={styles.text}>Name: {maintenance.itemName}</Text>
                <Text style={styles.text}>Model: {maintenance.itemModel}</Text>
                <Text style={styles.text}>
                  Serial Number: {maintenance.itemSerialNumber}
                </Text>
                <Text style={styles.text}>Lab: {maintenance.labName}</Text>
                <View style={styles.textSeparator} />
                <Text style={styles.text}>
                  Task Description: {maintenance.taskDescription}
                </Text>
                <Text style={styles.text}>
                  Assigned To: {maintenance.technicianName}
                </Text>
                <Text style={styles.text}>
                  Start Date: {maintenance.startDate.split('T')[0]}
                </Text>
                <Text style={styles.text}>
                  End Date: {maintenance.endDate.split('T')[0]}
                </Text>
                <View style={styles.textSeparator} />
                <Text style={styles.text}>Status: {maintenance.status}</Text>
                {maintenance.submitNote && (
                  <Text style={styles.text}>
                    Submit Note: {maintenance.submitNote}
                  </Text>
                )}
                <View style={styles.textSeparator} />
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
                {maintenance && maintenance.status === 'UnderReview' && (
                  <WideButton
                    text='Review Maintenance'
                    buttonClickHandler={() =>
                      handleUpdateButtonPress({ item: maintenance })
                    }
                  />
                )}
                <View style={styles.textSeparator} />
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
  text: {
    color: 'white',
    fontSize: 12,
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
});
