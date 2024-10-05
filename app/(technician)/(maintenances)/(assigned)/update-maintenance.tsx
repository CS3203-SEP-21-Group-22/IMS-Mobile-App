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

                <View style={styles.separator} />

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

                {maintenance.reviewNote && <View style={styles.separator} />}
                {maintenance.reviewNote && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.cHeader}>Review Note</Text>
                    <Text style={styles.descriptionValue}>
                      {maintenance.reviewNote}
                    </Text>
                  </View>
                )}

                {maintenance.status === 'Ongoing' && (
                  <View style={styles.separator} />
                )}
                {maintenance.status === 'Ongoing' && (
                  <View style={styles.descriptionContainer}>
                    <View style={styles.row}>
                      <Text style={styles.columnField}>Submit Note :</Text>
                    </View>
                    <TextInput
                      style={styles.multilineInput}
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

                    <View style={styles.FieldLine}>
                      <View style={styles.selectBoxRow}>
                        <View style={styles.rowField}>
                          <Text>Cost :</Text>
                        </View>
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
                      </View>
                      {errors
                        .filter(([key, value]) => key === 'cost')
                        .map(([key, value]) => (
                          <Text key={key} style={styles.errorText}>
                            {value}
                          </Text>
                        ))}
                    </View>
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
        </View>
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
    padding: '0.5%',
    marginTop: '2%',
    marginBottom: '2%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 15,
    height: 60,
  },
  costInput: {
    width: '70%',
    padding: '0.5%',
    marginTop: '3%',
    marginBottom: '2%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 15,
    marginLeft: '5%',
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
  singleItemRow: {
    alignSelf: 'flex-start',
    marginHorizontal: '6%',
    backgroundColor: 'transparent',
  },
  multilineInput: {
    backgroundColor: 'white',
    width: 220,
    height: 40,
    borderRadius: 5,
    paddingLeft: 15,
    marginTop: '2%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 5,
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
