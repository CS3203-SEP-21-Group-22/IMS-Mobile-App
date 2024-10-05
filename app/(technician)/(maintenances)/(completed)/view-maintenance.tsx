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
                style={{ width: '95%' }}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                <View style={styles.separator} />
                <View style={styles.row}>
                  <Text style={styles.title}>
                    {maintenance.itemName} ({maintenance.itemModel})
                  </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.separator} />
                <View style={styles.row}>
                  <Text style={styles.columnField}>Serial Number :</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.itemSerialNumber}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>Lab :</Text>
                  <Text style={styles.columnValue}>{maintenance.labName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>Start Date :</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.startDate.split('T')[0]}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>End Date :</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.endDate.split('T')[0]}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.columnField}>Assigned By :</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.createdClerkName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>Assigned At :</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.createdAt.split('T')[0]}{' '}
                    {maintenance.createdAt
                      .split('T')[1]
                      .split('.')[0]
                      .slice(0, 5)}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.columnField}>Reviewed By :</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.reviewedClerkName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.columnField}>Reviewed At :</Text>
                  <Text style={styles.columnValue}>
                    {maintenance.reviewedAt?.split('T')[0]}{' '}
                    {maintenance.reviewedAt
                      ?.split('T')[1]
                      .split('.')[0]
                      .slice(0, 5)}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Text style={styles.columnField}>Status :</Text>
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

                {maintenance.cost && (
                  <Text style={styles.text}>Cost: {maintenance.cost}</Text>
                )}
                {maintenance.submitNote && (
                  <Text style={styles.text}>
                    Submit Note: {maintenance.submitNote}
                  </Text>
                )}

                <View style={styles.separator} />

                {maintenance.reviewNote && <View style={styles.separator} />}
                {maintenance.reviewNote && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.cHeader}>Review Note</Text>
                    <Text style={styles.descriptionValue}>
                      {maintenance.reviewNote}
                    </Text>
                  </View>
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
    justifyContent: 'flex-start',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 5,
  },
  dateRowField: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingLeft: '5%',
    fontSize: 13,
    alignSelf: 'center',
    paddingBottom: '2%',
    paddingTop: '3%',
  },
  columnField: {
    flex: 1,
    paddingLeft: '5%',
    fontSize: 13,
  },
  columnValue: {
    flex: 1,
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
  FieldLine: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  selectBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginTop: '1%',
    // marginHorizontal: 5,
  },
  rowField: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingLeft: '5%',
    fontSize: 13,
    alignSelf: 'center',
    paddingBottom: '2%',
    // paddingTop: '3%',
  },
});
