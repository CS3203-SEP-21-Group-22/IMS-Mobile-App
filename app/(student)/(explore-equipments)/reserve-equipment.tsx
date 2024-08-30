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
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import WideButton from '@/components/WideButton';

interface Reservation {
  equipmentId: number | null;
  startDate: string | null;
  endDate: string | null;
}

interface Equipment {
  id: number | null;
  name: string | null;
  model: string | null;
  lab: string | null;
  imageURL?: string | null;
}

export default function ReserveEquipmentScreen() {
  const { equipmentId, labId } = useLocalSearchParams<{
    equipmentId: string;
    labId: string;
  }>();
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [reservation, setReservation] = useState<Reservation>({
    equipmentId: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [equipment, setEquipment] = useState<Equipment>({
    id: null,
    name: null,
    model: null,
    lab: null,
    imageURL: null,
  });
  useEffect(() => {
    if (equipmentId) {
      setReservation({ ...reservation, equipmentId: parseInt(equipmentId) });
      setEquipment({
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        lab: 'Network Lab',
      });
    } else {
      throw new Error('Equipment ID is required');
    }
  }, [equipmentId]);
  const handleButtonPress = () => {
    router.back();
  };
  return (
    <BackgroundLayout>
      <MainHeader title='Explore Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Reserve Equipment' />
          <EditSingleItemBackground>
            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <Text style={styles.title}>Reservation Details</Text>
              <Text style={styles.text}>Equipment</Text>
              {equipment.imageURL ? (
                <Image
                  source={{ uri: equipment.imageURL }}
                  style={styles.image}
                />
              ) : (
                <Image
                  source={require('@/assets/images/equipmentSample.png')}
                  style={styles.image}
                />
              )}
              <Text style={styles.text}>Name: {equipment.name}</Text>
              <Text style={styles.text}>Model: {equipment.model}</Text>
              <Text style={styles.text}>Lab: {equipment.lab}</Text>
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
                      reservation.startDate
                        ? reservation.startDate
                        : 'Start Date'
                    }
                    onPress={() =>
                      setStartDatePickerVisible(!startDatePickerVisible)
                    }
                  />
                  {startDatePickerVisible && (
                    <DateTimePicker
                      value={
                        reservation.startDate
                          ? new Date(reservation.startDate)
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
                            reservation.startDate
                        ) {
                          setReservation({
                            ...reservation,
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
                      reservation.endDate ? reservation.endDate : 'End Date'
                    }
                    onPress={() =>
                      setEndDatePickerVisible(!endDatePickerVisible)
                    }
                  />
                  {endDatePickerVisible && (
                    <DateTimePicker
                      value={
                        reservation.endDate
                          ? new Date(reservation.endDate)
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
                            reservation.endDate
                        ) {
                          setReservation({
                            ...reservation,
                            endDate: date.toISOString().split('T')[0],
                          });
                        }
                      }}
                    />
                  )}
                </View>
              </View>
              <View style={styles.separator} />
            </ScrollView>
          </EditSingleItemBackground>
          <WideButton text='Request' buttonClickHandler={handleButtonPress} />
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
