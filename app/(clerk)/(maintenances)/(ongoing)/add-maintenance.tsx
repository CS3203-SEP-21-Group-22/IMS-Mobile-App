import {
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
  Image,
  Button,
  ScrollView,
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

interface Maintenance {
  equipmentId: number | null;
  item: number | null;
  startDate: string | null;
  endDate: string | null;
  assignedTechnician: string | null;
  taskDescription: string | null;
}

interface Equipment {
  id: number;
  name: string;
  model: string;
  lab: string;
}

interface Technician {
  id: number;
  name: string;
  email: string;
}

interface Item {
  id: number;
  serialNumber: string;
}

export default function AddMaintenanceScreen() {
  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: 1,
      name: '4-Port WiFi Router',
      model: 'Cisco SRP541W',
      lab: 'Network Lab',
    },
    {
      id: 2,
      name: '8-Port Ethernet Switch',
      model: 'Cisco SG300-10',
      lab: 'Network Lab',
    },
    {
      id: 3,
      name: '16-Port Ethernet Switch',
      model: 'Cisco SG300-20',
      lab: 'Network Lab',
    },
    {
      id: 4,
      name: '24-Port Ethernet Switch',
      model: 'Cisco SG300-28',
      lab: 'Network Lab',
    },
  ]);
  const [items, setItems] = useState<Item[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'John@gmail.com',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'Jane@gmail.com',
    },
  ]);
  const [maintenance, setMaintenance] = useState<Maintenance>({
    equipmentId: null,
    item: null,
    startDate: null,
    endDate: null,
    assignedTechnician: null,
    taskDescription: null,
  });

  useEffect(() => {
    if (maintenanceId) {
      setMaintenance({
        equipmentId: 1,
        item: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        assignedTechnician: 'John Doe',
        taskDescription: 'Sample Task Description',
      });
      setItems([
        { id: 1, serialNumber: 'FOC1234X56Y' },
        { id: 2, serialNumber: 'FOC1234X56Z' },
        { id: 3, serialNumber: 'FOC1234X56A' },
      ]);
    }
  }, [maintenanceId]);
  const handleButtonPress = () => {
    router.back();
  };
  const handleSelectEquipment = (item: Equipment) => {
    setMaintenance({ ...maintenance, equipmentId: item.id });
    setItems([
      { id: 1, serialNumber: 'FOC1234X56Y' },
      { id: 2, serialNumber: 'FOC1234X56Z' },
      { id: 3, serialNumber: 'FOC1234X56A' },
    ]);
  };
  return (
    <BackgroundLayout>
      <MainHeader title='Maintenances' />
      <ClerkMaintenancesHorizontalBar selectedIndex={1} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Create Maintenance' />
          <EditSingleItemBackground>
            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <Text style={styles.title}>Maintenance Details</Text>
              <Text style={styles.text}>Equipment :</Text>
              <Dropdown
                data={equipments}
                mode='modal'
                search
                searchPlaceholder='Search Item'
                labelField='name'
                valueField='id'
                onChange={(item) => handleSelectEquipment(item)}
                style={styles.dropdown}
                placeholder={
                  maintenance.equipmentId
                    ? equipments.find(
                        (equipment) => equipment.id === maintenance.equipmentId,
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
                valueField='id'
                onChange={(item) =>
                  setMaintenance({ ...maintenance, item: item.id })
                }
                style={styles.dropdown}
                placeholder={
                  maintenance.item
                    ? items.find((item) => item.id === maintenance.item)
                        ?.serialNumber
                    : 'Select Item'
                }
                placeholderStyle={styles.dropdownText}
                selectedTextStyle={styles.dropdownText}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '80%',
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
                </View>
              </View>
              <View style={styles.separator} />
              <Text style={styles.text}>Assigned Technician :</Text>
              <Dropdown
                data={technicians}
                mode='modal'
                search
                searchPlaceholder='Search Item'
                labelField='name'
                valueField='id'
                onChange={(item) =>
                  setMaintenance({
                    ...maintenance,
                    assignedTechnician: item.name,
                  })
                }
                style={styles.dropdown}
                placeholder={
                  maintenance.assignedTechnician
                    ? technicians.find(
                        (technician) =>
                          technician.name === maintenance.assignedTechnician,
                      )?.name
                    : 'Select Technician'
                }
                placeholderStyle={styles.dropdownText}
                selectedTextStyle={styles.dropdownText}
              />
              <Text style={styles.text}>Task Description :</Text>
              <TextInput
                style={styles.multilineInput}
                placeholder='Enter Task Description'
                multiline
                value={
                  maintenance.taskDescription ? maintenance.taskDescription : ''
                }
                onChangeText={(text) =>
                  setMaintenance({ ...maintenance, taskDescription: text })
                }
              />
              <View style={styles.separator} />
            </ScrollView>
          </EditSingleItemBackground>
          <View style={styles.button}>
            <ImageBackground
              source={require('@/assets/images/blueBtn.webp')}
              style={styles.buttonBackground}
              borderRadius={10}
            >
              <Pressable
                onPress={handleButtonPress}
                style={{ width: '100%', alignItems: 'center' }}
              >
                <Text style={styles.buttonText}>Create Maintenance</Text>
              </Pressable>
            </ImageBackground>
          </View>
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
    color: '#202652',
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#202652',
    marginTop: '1%',
  },
  textInput: {
    width: '80%',
    padding: '1%',
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
