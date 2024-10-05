import {
  StyleSheet,
  Image,
  Button,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import WideButton from '@/components/WideButton';
import { CreateReservation } from '@/interfaces/reservation.interface';
import { initializeAxiosApi, axiosApi } from '@/utils/AxiosApi';
import Colors from '@/constants/Colors';

export default function ReserveEquipmentScreen() {
  const { equipmentId, labId, name, model, labName, imageURL } =
    useLocalSearchParams<{
      equipmentId: string;
      labId: string;
      name: string;
      model: string;
      labName: string;
      imageURL: string;
    }>();
  if (!equipmentId || !labId || !name || !model || !labName) {
    throw new Error('Missing equipmentId, labId, name, model or labName');
  }
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [reservation, setReservation] = useState<CreateReservation>({
    equipmentId: parseInt(equipmentId),
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);

  const handleButtonPress = async () => {
    try {
      setLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.post(
        '/student/reservations',
        reservation,
      );
      if (response.status === 201) {
        Alert.alert('Success', 'Equipment requested successfully');
        router.back();
      } else Alert.alert('Error', 'Failed to request equipment');
    } catch (err: any) {
      if (err.response.status === 400) {
        if (err.response.data.errors == null) {
          setErrors([['', err.response.data]]);
        } else {
          setErrors(Object.entries(err.response.data.errors));
        }
      }
      Alert.alert('Error', 'Failed to request equipment');
    } finally {
      setLoading(false);
    }
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
              <View style={styles.separator} />
              <Text style={styles.title}>Reservation Details</Text>
              {imageURL ? (
                <Image source={{ uri: imageURL }} style={styles.image} />
              ) : (
                <Image
                  source={require('@/assets/images/equipmentSample.png')}
                  style={styles.image}
                />
              )}
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text style={styles.columnField}>Equipment:</Text>
                <Text style={styles.columnValue}>{name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.columnField}>Model:</Text>
                <Text style={styles.columnValue}>{model}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.columnField}>Laboratory:</Text>
                <Text style={styles.columnValue}>{labName}</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.FieldLine}>
                <View style={styles.selectBoxRow}>
                  <View style={styles.dateRowField}>
                    <Text>Start Date: </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      setStartDatePickerVisible(!startDatePickerVisible)
                    }
                    style={styles.datePickerButton}
                  >
                    <Text>
                      {reservation.startDate
                        ? reservation.startDate !==
                          new Date().toISOString().split('T')[0]
                          ? reservation.startDate
                          : 'Select Start Date'
                        : 'Select Start Date'}
                    </Text>
                  </Pressable>
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
                {errors
                  .filter(([key, value]) => key === 'startDate')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
              </View>
              <View style={styles.FieldLine}>
                <View style={styles.selectBoxRow}>
                  <View style={styles.dateRowField}>
                    <Text>End Date: </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      setEndDatePickerVisible(!endDatePickerVisible)
                    }
                    style={styles.datePickerButton}
                  >
                    <Text>
                      {reservation.endDate
                        ? reservation.endDate !==
                          new Date().toISOString().split('T')[0]
                          ? reservation.endDate
                          : 'Select End Date'
                        : 'Select End Date'}
                    </Text>
                  </Pressable>
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
                {errors
                  .filter(([key, value]) => key === 'endDate')
                  .map(([key, value]) => (
                    <Text key={key} style={styles.errorText}>
                      {value}
                    </Text>
                  ))}
              </View>
              {errors
                .filter(
                  ([key, value]) =>
                    key !== 'startDate' &&
                    key !== 'endDate' &&
                    key !== 'equipmentId',
                )
                .map(([key, value]) => (
                  <Text key={key} style={styles.errorText}>
                    {value}
                  </Text>
                ))}
              <View style={styles.separator} />
            </ScrollView>
          </EditSingleItemBackground>
        </View>
        {loading ? (
          <ActivityIndicator size='large' color='#ffffff' />
        ) : errors.length > 0 ? (
          <WideButton text='Retry' buttonClickHandler={handleButtonPress} />
        ) : (
          <WideButton
            text='Reserve Equipment'
            buttonClickHandler={handleButtonPress}
          />
        )}
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
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
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
  selectBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginHorizontal: 5,
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
  FieldLine: {
    backgroundColor: 'transparent',
    width: '100%',
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
    fontSize: 14,
  },
  columnValue: {
    flex: 0.8,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'semibold',
  },
  textSeparator: {
    marginVertical: '1%',
    height: 0.1,
    width: '80%',
    backgroundColor: 'transparent',
  },
  datePickerButton: {
    backgroundColor: Colors.dark.secondary.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '2%',
    width: '60%',
    marginTop: '2%',
    marginBottom: '1%',
  },
});
