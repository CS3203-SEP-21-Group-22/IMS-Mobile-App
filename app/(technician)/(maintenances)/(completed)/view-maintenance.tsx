import {
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import TechnicianMaintHorizontalBar from '@/components/TechnicianMaintHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import { useState, useEffect } from 'react';
import { MaintenanceDetailed } from '@/interfaces/maintenance.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function ViewMaintenanceScreen() {
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
      setError(err.message);
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
      <TechnicianMaintHorizontalBar selectedIndex={1} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Update Maintenance' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : maintenance ? (
            <EditSingleItemBackground>
              <ScrollView
                style={{ width: '95%' }}
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
                <Text style={[styles.descriptionText, { width: '80%' }]}>
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
                  <View>
                    <View style={styles.separator} />
                    <Text style={styles.descriptionText}>
                      Review Note: {maintenance.reviewNote}
                    </Text>
                  </View>
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
            </EditSingleItemBackground>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
  },
  text: {
    fontSize: 12,
    // fontWeight: 'bold',
    marginTop: '0.1%',
  },
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 12,
    // fontWeight: 'bold',
  },
  textInput: {
    width: '80%',
    padding: '1%',
    marginTop: '2%',
    marginBottom: '2%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
    height: 60,
  },
  costInput: {
    width: '80%',
    padding: '1%',
    marginTop: '2%',
    marginBottom: '2%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
  },
  image: {
    marginTop: '4%',
    marginBottom: '3%',
    width: 100,
    height: 100,
  },
  button: {
    width: '100%',
    marginTop: '1%',
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
