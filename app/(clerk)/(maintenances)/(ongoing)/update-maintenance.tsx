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
          ) : maintenance ? (
            <EditSingleItemBackground>
              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                <View style={styles.row}>
                  <Text style={styles.title}>
                    {maintenance.itemName} ({maintenance.itemModel})
                  </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.row}>
                  <Text style={styles.columnField}>Serial Number:</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.itemSerialNumber}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>Lab:</Text>
                  <Text style={styles.columnValue}>{maintenance.labName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>Start Date:</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.startDate.split('T')[0]}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>End Date:</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.endDate.split('T')[0]}
                  </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.row}>
                  <Text style={styles.columnField}>Assigned By:</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.createdClerkName}
                  </Text>
                </View>
                {maintenance.reviewedClerkName && (
                  <View style={styles.separator} />
                )}
                {maintenance.reviewedClerkName && (
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Reviewed By:</Text>
                    <Text style={styles.columnValue}>
                      {maintenance.reviewedClerkName}
                    </Text>
                  </View>
                )}
                {maintenance.reviewedAt && (
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Reviewed At:</Text>
                    <Text style={styles.columnValue}>
                      {maintenance.reviewedAt.split('T')[0]}{' '}
                      {maintenance.reviewedAt
                        .split('T')[1]
                        .split('.')[0]
                        .slice(0, 5)}
                    </Text>
                  </View>
                )}

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.columnField}>Status:</Text>
                  <Text style={styles.columnValue}>{maintenance.status}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.descriptionContainer}>
                  <Text style={styles.cHeader}>Task Description</Text>
                  <Text style={styles.descriptionValue}>
                    {maintenance.taskDescription}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.descriptionContainer}>
                  <Text style={styles.cHeader}>Submit Note</Text>
                  <Text style={styles.descriptionValue}>
                    {maintenance.submitNote}
                  </Text>
                </View>

                <View style={styles.separator} />

                {maintenance.reviewNote && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.cHeader}>Review Note</Text>
                    <Text style={styles.descriptionValue}>
                      {maintenance.reviewNote}
                    </Text>
                  </View>
                )}
                {maintenance.reviewNote && <View style={styles.separator} />}

                <View style={styles.separator} />

                <TextInput
                  style={styles.multilineInput}
                  multiline
                  placeholder={
                    updateData.reviewNote
                      ? updateData.reviewNote
                      : 'Review with a Note'
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
                <View style={styles.separator} />
              </ScrollView>
            </EditSingleItemBackground>
          ) : null}
        </View>
        {updateLoading ? (
          <ActivityIndicator size='large' color='#ffffff' />
        ) : !loading && maintenance ? (
          <WideButton
            text='Update Review'
            buttonClickHandler={() => updateMaintenance({ accepted: false })}
          />
        ) : null}
        {updateLoading ? (
          <ActivityIndicator size='large' color='#ffffff' />
        ) : !loading && maintenance ? (
          <WideButton
            text='Mark as Completed'
            buttonClickHandler={() => updateMaintenance({ accepted: true })}
          />
        ) : null}
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
  title: {
    fontSize: 18,
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
    width: 230,
    height: 40,
    borderRadius: 8,
    paddingLeft: '6%',
    marginTop: '2%',
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
  singleItemRow: {
    alignSelf: 'flex-start',
    marginHorizontal: '6%',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 5,
  },
  rowField: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingLeft: '5%',
    fontSize: 13,
    alignSelf: 'center',
    paddingBottom: '2%',
  },
  columnField: {
    flex: 1,
    paddingLeft: '5%',
    fontSize: 13,
  },
  columnValue: {
    flex: 0.8,
    textAlign: 'left',
    fontSize: 13,
    fontWeight: 'semibold',
  },
  textSeparator: {
    marginVertical: '1%',
    height: 0.1,
    width: '80%',
    backgroundColor: 'transparent',
  },
  descriptionContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: '5%',
    marginTop: '2%',
  },
  cHeader: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  descriptionValue: {
    color: 'white',
    fontSize: 13,
  },
});
