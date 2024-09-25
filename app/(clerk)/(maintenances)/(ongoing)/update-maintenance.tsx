import {
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
  Image,
  Button,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, router, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import ClerkMaintenancesHorizontalBar from '@/components/ClerkMaintHorizontalBar';
import React, { useState, useEffect } from 'react';
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
    reviewNote: string | null;
    accepted: boolean;
  }>({ reviewNote: null, accepted: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(`/user/maintenance/${maintenanceId}`);
      setMaintenance(response.data);
      if (response.data.reviewNote) {
        setUpdateData({
          reviewNote: response.data.reviewNote,
          accepted: updateData.accepted,
        });
      }
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

  const updateMaintenance = async ({ accepted }: { accepted: boolean }) => {
    setUpdateLoading(true);
    try {
      const response = await axiosApi.patch(
        `/clerk/maintenance/${maintenanceId}`,
        { ...updateData, accepted },
      );
      Alert.alert('Success', 'Maintenance updated successfully');
      router.replace({
        pathname: '/(clerk)/(maintenances)/(ongoing)/view-maintenance',
        params: { maintenanceId: maintenanceId },
      });
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
      <ClerkMaintenancesHorizontalBar selectedIndex={1} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Review Maintenance' />
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
                <Text style={[styles.descriptionText, { width: '90%' }]}>
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
                  <>
                    <View style={styles.separator} />
                    <Text style={styles.descriptionText}>
                      Review: {maintenance.reviewNote}
                    </Text>
                  </>
                )}
                <Text style={styles.descriptionText}>
                  Submit Note: {maintenance.submitNote}
                </Text>
                <View style={styles.separator} />
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder={
                    updateData.reviewNote
                      ? updateData.reviewNote
                      : 'Review Note'
                  }
                  value={updateData.reviewNote ? updateData.reviewNote : ''}
                  onChangeText={(text) =>
                    setUpdateData({ ...updateData, reviewNote: text })
                  }
                />
                {errors
                  .filter(([key, value]) => key === 'reviewNote')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
                {maintenance.reviewedClerkName && (
                  <Text style={styles.text}>
                    Reviewed By: {maintenance.reviewedClerkName}
                  </Text>
                )}
                <View style={styles.separator} />
                {errors
                  .filter(([key, value]) => key !== 'reviewNote')
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
          ) : (
            <WideButton
              text='Update Review'
              buttonClickHandler={() => updateMaintenance({ accepted: false })}
            />
          )}
          {updateLoading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : (
            <WideButton
              text='Mark as Completed'
              buttonClickHandler={() => updateMaintenance({ accepted: true })}
            />
          )}
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
  descriptionText: {
    fontSize: 13,
    marginTop: '2%',
    // fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
  },
  text: {
    fontSize: 13,
    // fontWeight: 'bold',
    marginTop: '1%',
  },
  textInput: {
    width: '90%',
    padding: '1%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
    height: 50,
    marginBottom: '1%',
  },
  image: {
    marginTop: '4%',
    marginBottom: '3%',
    width: 100,
    height: 100,
  },
  dropdown: {
    marginTop: '1%',
    marginBottom: '2%',
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
    // paddingVertical: '1%',
  },
  multilineInput: {
    backgroundColor: 'white',
    width: 200,
    height: 60,
    borderRadius: 8,
    paddingLeft: '3%',
    marginTop: '1%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '3%',
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  buttonBackground: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
