import {
  StyleSheet,
  TextInput,
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
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import WideButton from '@/components/WideButton';
import { MaintenanceCreate } from '@/interfaces/maintenance.interface';
import { Equipment } from '@/interfaces/equipment.interface';
import { Item } from '@/interfaces/item.interface';
import { User } from '@/interfaces/userProfile.interface';
import { Lab } from '@/interfaces/lab.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function AddMaintenanceScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );
  const [items, setItems] = useState<Item[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceCreate>({
    itemId: null,
    startDate: null,
    endDate: null,
    technicianId: null,
    taskDescription: null,
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<[string, string][]>([]);

  const initialFetchData = async () => {
    try {
      const response = await axiosApi.get(`/user/labs`);
      setLabs(response.data);
      const response1 = await axiosApi.get(`/clerk/technicians`);
      setTechnicians(response1.data);
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
      initialFetchData(); // Fetch data from the API
    };

    initializeAndFetch();
  }, []);

  const fetchEquipments = async (labId: number) => {
    try {
      const response = await axiosApi.get(`/user/equipments?labId=${labId}`);
      setEquipments(response.data);
    } catch (err: any) {
      setError('Failed to fetch data');
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    if (selectedLab) {
      fetchEquipments(selectedLab.labId);
    }
  }, [selectedLab]);

  const fetchItems = async (equipmentId: number) => {
    try {
      const response = await axiosApi.get(
        `/user/items?equipmentId=${equipmentId}`,
      );
      setItems(response.data);
    } catch (err: any) {
      setError('Failed to fetch data');
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    if (selectedEquipment) {
      fetchItems(selectedEquipment.equipmentId);
    }
  }, [selectedEquipment]);

  useEffect(() => {
    const fetchData = async (itemId: number) => {
      try {
        const response = await axiosApi.get(`/user/items/${itemId}`);
        setMaintenance(response.data);
      } catch (err: any) {
        setError('Failed to fetch data');
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };
    if (itemId) {
      fetchData(parseInt(itemId));
      setMaintenance({
        itemId: parseInt(itemId),
        startDate: null,
        endDate: null,
        technicianId: null,
        taskDescription: null,
      });
    }
  }, [itemId]);

  const handleButtonPress = async () => {
    const errorsList: [string, string][] = [];
    if (!maintenance.itemId) errorsList.push(['$.itemId', 'Item is required']);
    if (!maintenance.startDate)
      errorsList.push(['startDate', 'Start Date is required']);
    if (!maintenance.endDate)
      errorsList.push(['endDate', 'End Date is required']);
    if (!maintenance.technicianId)
      errorsList.push(['technicianId', 'Technician is required']);
    if (!maintenance.taskDescription)
      errorsList.push(['taskDescription', 'Task Description is required']);
    if (
      !maintenance.itemId ||
      !maintenance.startDate ||
      !maintenance.endDate ||
      !maintenance.technicianId ||
      !maintenance.taskDescription
    ) {
      setErrors(errorsList);
      return;
    }
    try {
      setUpdateLoading(true);
      await axiosApi.post(`/clerk/maintenance`, maintenance);
      Alert.alert('Success', 'Maintenance created successfully');
      router.back();
    } catch (err: any) {
      if (err.response.status === 400) {
        if (err.response.data.errors == null) {
          setErrors([['', err.response.data]]);
        } else {
          setErrors(Object.entries(err.response.data.errors));
        }
      }
      Alert.alert('Error', err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSelectLab = (item: Lab) => {
    setSelectedLab(item);
  };

  const handleSelectEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Maintenances' />
      <ClerkMaintenancesHorizontalBar selectedIndex={1} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Create Maintenance' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={initialFetchData} />
            </View>
          ) : labs && technicians ? (
            <EditSingleItemBackground>
              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                <Text style={styles.title}>Maintenance Details</Text>
                <Text style={styles.text}>Lab :</Text>
                <Dropdown
                  data={labs}
                  mode='modal'
                  search
                  searchPlaceholder='Search Lab'
                  labelField='labName'
                  valueField='labId'
                  onChange={(item) => handleSelectLab(item)}
                  style={styles.dropdown}
                  placeholder={selectedLab ? selectedLab.labName : 'Select Lab'}
                  placeholderStyle={styles.dropdownText}
                  selectedTextStyle={styles.dropdownText}
                />
                <Text style={styles.text}>Equipment :</Text>
                <Dropdown
                  data={equipments}
                  mode='modal'
                  search
                  searchPlaceholder='Search Item'
                  labelField='name'
                  valueField='equipmentId'
                  onChange={(item) => handleSelectEquipment(item)}
                  style={styles.dropdown}
                  placeholder={
                    selectedEquipment
                      ? equipments.find(
                          (equipment) =>
                            equipment.equipmentId ===
                            selectedEquipment.equipmentId,
                        )?.name
                      : 'Select Equipment'
                  }
                  placeholderStyle={styles.dropdownText}
                  selectedTextStyle={styles.dropdownText}
                />
                <Text style={styles.text}>Serial Number :</Text>
                <Dropdown
                  data={items}
                  mode='modal'
                  search
                  searchPlaceholder='Search Item'
                  labelField='serialNumber'
                  valueField='itemId'
                  onChange={(item) =>
                    setMaintenance({ ...maintenance, itemId: item.itemId })
                  }
                  style={styles.dropdown}
                  placeholder={
                    maintenance.itemId
                      ? items.find((item) => item.itemId === maintenance.itemId)
                          ?.serialNumber
                      : 'Select Item'
                  }
                  placeholderStyle={styles.dropdownText}
                  selectedTextStyle={styles.dropdownText}
                />
                {errors
                  .filter(([key, value]) => key === '$.itemId')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}
                >
                  <View
                    style={{
                      width: '50%',
                      backgroundColor: 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={[styles.text, { marginBottom: '1%' }]}>
                      Start Date :
                    </Text>
                    <Button
                      title={
                        maintenance.startDate
                          ? maintenance.startDate
                          : 'Start Date'
                      }
                      onPress={() =>
                        setStartDatePickerVisible(!startDatePickerVisible)
                      }
                    />
                    {startDatePickerVisible && (
                      <DateTimePicker
                        value={
                          maintenance.startDate
                            ? new Date(maintenance.startDate)
                            : new Date()
                        }
                        maximumDate={
                          new Date(
                            new Date().getFullYear() + 1,
                            new Date().getMonth(),
                            new Date().getDate(),
                          )
                        }
                        mode='date'
                        display='calendar'
                        // hide datetime picker before setting the date/time
                        onChange={(event, date) => {
                          setStartDatePickerVisible(false);
                          if (
                            date &&
                            date.toISOString().split('T')[0] !==
                              maintenance.startDate
                          ) {
                            setMaintenance({
                              ...maintenance,
                              startDate: date.toISOString().split('T')[0],
                            });
                          }
                        }}
                      />
                    )}
                    {errors
                      .filter(([key, value]) => key === 'startDate')
                      .map(([key, value]) => (
                        <Text key={key} style={styles.errorText}>
                          {value}
                        </Text>
                      ))}
                  </View>

                  <View
                    style={{
                      width: '50%',
                      backgroundColor: 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={[styles.text, { marginBottom: '1%' }]}>
                      End Date :
                    </Text>
                    <Button
                      title={
                        maintenance.endDate ? maintenance.endDate : 'End Date'
                      }
                      onPress={() =>
                        setEndDatePickerVisible(!endDatePickerVisible)
                      }
                    />
                    {endDatePickerVisible && (
                      <DateTimePicker
                        value={
                          maintenance.endDate
                            ? new Date(maintenance.endDate)
                            : new Date()
                        }
                        maximumDate={
                          new Date(
                            new Date().getFullYear() + 1,
                            new Date().getMonth(),
                            new Date().getDate(),
                          )
                        }
                        mode='date'
                        display='calendar'
                        onChange={(event, date) => {
                          setEndDatePickerVisible(false);
                          if (
                            date &&
                            date.toISOString().split('T')[0] !==
                              maintenance.endDate
                          ) {
                            setMaintenance({
                              ...maintenance,
                              endDate: date.toISOString().split('T')[0],
                            });
                          }
                        }}
                      />
                    )}
                    {errors
                      .filter(([key, value]) => key === 'endDate')
                      .map(([key, value]) => (
                        <Text key={key} style={styles.errorText}>
                          {value}
                        </Text>
                      ))}
                  </View>
                </View>
                <View style={styles.separator} />
                <Text style={styles.text}>Assigned Technician :</Text>
                <Dropdown
                  data={technicians}
                  mode='modal'
                  search
                  searchPlaceholder='Search Item'
                  labelField='firstName'
                  valueField='userId'
                  onChange={(item) =>
                    setMaintenance({
                      ...maintenance,
                      technicianId: item.userId,
                    })
                  }
                  style={styles.dropdown}
                  placeholder={
                    maintenance.technicianId
                      ? (technicians.find(
                          (technician) =>
                            technician.userId === maintenance.technicianId,
                        )?.firstName ?? 'Select Technician')
                      : 'Select Technician'
                  }
                  placeholderStyle={styles.dropdownText}
                  selectedTextStyle={styles.dropdownText}
                />
                {errors
                  .filter(([key, value]) => key === 'technicianId')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
                <Text style={styles.text}>Task Description :</Text>
                <TextInput
                  style={styles.multilineInput}
                  placeholder='Enter Task Description'
                  multiline
                  value={
                    maintenance.taskDescription
                      ? maintenance.taskDescription
                      : ''
                  }
                  onChangeText={(text) =>
                    setMaintenance({ ...maintenance, taskDescription: text })
                  }
                />
                {errors
                  .filter(([key, value]) => key === 'taskDescription')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
                <View style={styles.separator} />
              </ScrollView>
            </EditSingleItemBackground>
          ) : null}
          {updateLoading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : (
            <WideButton
              text='Create Maintenance'
              buttonClickHandler={handleButtonPress}
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
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: '1%',
  },
  textInput: {
    width: '80%',
    padding: '1%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
  },
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
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
