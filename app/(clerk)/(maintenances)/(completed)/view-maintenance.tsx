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
import SingleItemWithImage from '@/components/SingleItemWithImage';
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
            <SingleItemBackground>
              <ScrollView style={{ width: '100%' }}>
                <SingleItemWithImage
                  title={
                    maintenance.itemName
                      ? maintenance.itemName +
                        ' (' +
                        maintenance.itemModel +
                        ')'
                      : ''
                  }
                  link={maintenance.imageUrl ?? 'equipment'}
                >
                  <View style={styles.separator} />

                  <View style={styles.row}>
                    <Text style={styles.columnField}>Laboratory:</Text>
                    <Text style={styles.columnValue}>
                      {maintenance.labName}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Serial Number:</Text>
                    <Text style={styles.columnValue}>
                      {maintenance.itemSerialNumber}
                    </Text>
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
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Assigned At:</Text>
                    <Text style={styles.columnValue}>
                      {maintenance.createdAt.split('T')[0]}{' '}
                      {maintenance.createdAt
                        .split('T')[1]
                        .split('.')[0]
                        .slice(0, 5)}
                    </Text>
                  </View>

                  <View style={styles.textSeparator} />

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

                  {maintenance.cost && <View style={styles.separator} />}
                  {maintenance.cost && (
                    <View style={styles.row}>
                      <Text style={styles.columnField}>Cost:</Text>
                      <Text style={styles.columnValue}>{maintenance.cost}</Text>
                    </View>
                  )}

                  <View style={styles.separator} />
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Status:</Text>
                    <Text style={styles.columnValue}>{maintenance.status}</Text>
                  </View>

                  <View style={styles.textSeparator} />

                  <View style={styles.descriptionContainer}>
                    <Text style={styles.cHeader}>Task Description</Text>
                    <Text style={styles.descriptionValue}>
                      {maintenance.taskDescription}
                    </Text>
                  </View>

                  {maintenance.submitNote && (
                    <View style={styles.textSeparator} />
                  )}
                  {maintenance.submitNote && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.cHeader}>Submit Note</Text>
                      <Text style={styles.descriptionValue}>
                        {maintenance.submitNote}
                      </Text>
                    </View>
                  )}

                  {maintenance.reviewNote && (
                    <View style={styles.textSeparator} />
                  )}
                  {maintenance.reviewNote && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.cHeader}>Review Note</Text>
                      <Text style={styles.descriptionValue}>
                        {maintenance.reviewNote}
                      </Text>
                    </View>
                  )}
                </SingleItemWithImage>
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
    justifyContent: 'flex-start',
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
  },
  descriptionValue: {
    color: 'white',
    fontSize: 13,
  },
});
