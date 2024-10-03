import {
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
  ScrollView,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import TechnicianMaintHorizontalBar from '@/components/TechnicianMaintHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';
import { MaintenanceDetailed } from '@/interfaces/maintenance.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function UpdateMaintenanceScreen() {
  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();
  if (!maintenanceId) throw new Error('Missing maintenanceId');
  const [maintenance, setMaintenance] = useState<MaintenanceDetailed | null>(
    null,
  );
  const [updateData, setUpdateData] = useState<{
    submitNote: string | null;
    cost: Number | null;
  }>({ submitNote: null, cost: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);

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

  const handleSubmit = async () => {
    setUpdateLoading(true);
    try {
      const response = await axiosApi.patch(
        `/technician/maintenance/${maintenanceId}`,
        updateData,
      );
      Alert.alert('Success', 'Maintenance updated successfully');
      router.back();
    } catch (err: any) {
      if (err.response.status === 400) {
        if (err.response.data.errors == null) {
          setErrors([['', err.response.data]]);
        } else {
          setErrors(Object.entries(err.response.data.errors));
        }
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBorrow = async () => {
    setUpdateLoading(true);
    try {
      const response = await axiosApi.patch(
        `/technician/maintenance/${maintenanceId}/borrow`,
        {},
      );
      Alert.alert('Success', 'Item borrowed successfully');
      router.back();
    } catch (err: any) {
      if (err.response.status === 400) {
        if (err.response.data.errors == null) {
          setErrors([['', err.response.data]]);
        } else {
          setErrors(Object.entries(err.response.data.errors));
        }
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Maintenances' />
      <TechnicianMaintHorizontalBar selectedIndex={0} />
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
                <Text style={[styles.descriptionText, { width: '95%' }]}>
                  Task Description: {maintenance.taskDescription}
                </Text>
                <View style={styles.separator} />
                <Text style={styles.text}>
                  Assigned By: {maintenance.createdClerkName}
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
                {maintenance.status === 'Ongoing' && (
                  <View>
                    <Text style={styles.text}>Submit Note</Text>
                    <TextInput
                      style={styles.textInput}
                      multiline
                      numberOfLines={3}
                      value={updateData.submitNote ?? ''}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          submitNote: e.nativeEvent.text,
                        })
                      }
                      placeholder='Enter Submit Note'
                    />
                    {errors
                      .filter(([key, value]) => key === 'submitNote')
                      .map(([key, value]) => (
                        <Text key={key} style={styles.errorText}>
                          {value}
                        </Text>
                      ))}
                    <Text style={styles.text}>Cost</Text>
                    <TextInput
                      style={styles.costInput}
                      value={updateData.cost?.toString() ?? ''}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          cost: Number(e.nativeEvent.text),
                        })
                      }
                      placeholder='Enter Cost'
                    />
                    {errors
                      .filter(([key, value]) => key === 'cost')
                      .map(([key, value]) => (
                        <Text key={key} style={styles.errorText}>
                          {value}
                        </Text>
                      ))}
                  </View>
                )}
                {errors
                  .filter(
                    ([key, value]) => key !== 'submitNote' && key !== 'cost',
                  )
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
              </ScrollView>
            </EditSingleItemBackground>
          ) : null}
          {updateLoading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : maintenance?.status === 'Ongoing' ? (
            <WideButton
              text='Submit for Review'
              buttonClickHandler={handleSubmit}
            />
          ) : maintenance?.status === 'Scheduled' ? (
            <WideButton text='Borrow Item' buttonClickHandler={handleBorrow} />
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
    fontSize: 14,
    // fontWeight: 'bold',
    marginTop: '0.1%',
  },
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 14,
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
