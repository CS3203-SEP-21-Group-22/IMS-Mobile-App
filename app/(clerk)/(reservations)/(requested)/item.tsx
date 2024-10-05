import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Button,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import SingleItemWithImage from '@/components/SingleItemWithImage';
import { useState, useEffect } from 'react';
import { ReservationDetailed } from '@/interfaces/reservation.interface';
import { initializeAxiosApi, axiosApi } from '@/utils/AxiosApi';
import { Item } from '@/interfaces/item.interface';
import { Dropdown } from 'react-native-element-dropdown';
import ShortButtonsBar from '@/components/ShortButtonsBar';

export default function ViewRequestedItemScreen() {
  const { reservationId } = useLocalSearchParams<{ reservationId: string }>();
  if (!reservationId) throw new Error('Missing reservationId');
  const [reservation, setReservation] = useState<ReservationDetailed | null>(
    null,
  );
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [resposeLoading, setResponseLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseErrors, setResponseErrors] = useState<[string, string][]>([]);

  const fetchData = async () => {
    try {
      const resvResponse = await axiosApi.get(
        `/user/reservations/${reservationId}`,
      );
      setReservation(resvResponse.data);
      const itemsResponse = await axiosApi.get(
        `/user/items?equipmentId=${resvResponse.data.equipmentId}`,
      );
      setItemsList(itemsResponse.data);
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
  }, [reservationId]);

  const handleAccept = async () => {
    setResponseLoading(true);
    try {
      await axiosApi.patch(`/clerk/reservations/${reservationId}`, {
        itemId: selectedItem?.itemId,
        accepted: true,
      });
      router.replace('/(clerk)/(reservations)/(requested)/items');
    } catch (err: any) {
      if (err.response.status === 400) {
        if (err.response.data.errors == null) {
          setResponseErrors([['', err.response.data]]);
        } else {
          setResponseErrors(Object.entries(err.response.data.errors));
        }
      }
      Alert.alert('Error', 'Failed to assign item');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleReject = async () => {
    setResponseLoading(true);
    try {
      await axiosApi.patch(`/clerk/reservations/${reservationId}`, {
        rejectNote: note && note.length > 0 ? note : null,
        accepted: false,
      });
      router.replace('/(clerk)/(reservations)/(requested)/items');
    } catch (err: any) {
      if (err.response.status === 400) {
        if (err.response.data.errors == null) {
          setResponseErrors([['', err.response.data]]);
        } else {
          setResponseErrors(Object.entries(err.response.data.errors));
        }
      }
      Alert.alert('Error', 'Failed to reject item');
    } finally {
      setResponseLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <MainHeader title='Reservations' />
      <ClerkReservationsHorizontalBar selectedIndex={0} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Item Request' />
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
          ) : reservation ? (
            <SingleItemBackground>
              <ScrollView>
                <SingleItemWithImage
                  title={
                    reservation.itemName
                      ? reservation.itemName +
                        ' (' +
                        reservation.itemModel +
                        ')'
                      : ''
                  }
                  link={reservation.imageUrl ?? 'equipment'}
                >
                  <View style={styles.textSeparator} />
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Laboratory :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.labName}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Requested User :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.reservedUserName}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Start Date :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.startDate.split('T')[0]}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.columnField}>End Date :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.endDate.split('T')[0]}
                    </Text>
                  </View>
                  <View style={styles.textSeparator} />
                  <View style={styles.row}>
                    <Text style={styles.columnField}>Requested At :</Text>
                    <Text style={styles.columnValue}>
                      {reservation.createdAt.split('T')[0]}{' '}
                      {reservation.createdAt
                        .split('T')[1]
                        .split('.')[0]
                        .slice(0, 5)}
                    </Text>
                  </View>
                  <View style={styles.textSeparator} />
                  <View style={styles.selectBoxRow}>
                    <View style={styles.rowField}>
                      <Text>Assigned Item :</Text>
                    </View>
                    <Dropdown
                      data={itemsList}
                      mode='modal'
                      search
                      searchPlaceholder='Search Item'
                      labelField='serialNumber'
                      valueField='itemId'
                      onChange={(item) => setSelectedItem(item)}
                      style={styles.dropdown}
                      placeholder={
                        selectedItem ? selectedItem.serialNumber : 'Select Item'
                      }
                      placeholderStyle={styles.dropdownText}
                      selectedTextStyle={styles.dropdownText}
                    />
                    {responseErrors
                      .filter(([key, value]) => key === 'itemId')
                      .map(([key, value]) => (
                        <View key={key}>
                          <Text key={key} style={styles.errorText}>
                            {value}
                          </Text>
                          <View style={styles.textSeparator} />
                        </View>
                      ))}
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.columnField}>Reject Note :</Text>
                  </View>
                  <TextInput
                    style={styles.multilineInput}
                    placeholder='Enter Reason for Rejection'
                    value={note ? note.toString() : ''}
                    onChangeText={(text) => setNote(text)}
                    multiline
                  />
                  {responseErrors
                    .filter(([key, value]) => key === 'rejectNote')
                    .map(([key, value]) => (
                      <Text key={key} style={styles.errorText}>
                        {value}
                      </Text>
                    ))}
                  {responseErrors
                    .filter(
                      ([key, value]) =>
                        key !== 'itemId' && key !== 'rejectNote',
                    )
                    .map(([key, value]) => (
                      <View key={key}>
                        <View style={styles.textSeparator} />
                        <Text key={key} style={styles.errorText}>
                          {value}
                        </Text>
                      </View>
                    ))}
                  <View style={styles.textSeparator} />
                  {resposeLoading ? (
                    <ActivityIndicator size='large' color='#ffffff' />
                  ) : (
                    <ShortButtonsBar
                      primaryButtonText='Assign'
                      secondaryButtonText='Reject'
                      primaryButtonClickHandler={handleAccept}
                      secondaryButtonClickHandler={handleReject}
                    />
                  )}
                  <View style={styles.textSeparator} />
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
    fontSize: 13,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
  dropdown: {
    marginTop: '2%',
    marginBottom: '4%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    width: '50%',
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
    width: 220,
    height: 40,
    borderRadius: 8,
    paddingLeft: '3%',
    marginTop: '2%',
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
    marginHorizontal: '1%',
  },
  rowField: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingLeft: '4%',
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
});
