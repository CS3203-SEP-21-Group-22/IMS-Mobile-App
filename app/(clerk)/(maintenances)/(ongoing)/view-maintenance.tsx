import {
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import ClerkMaintenancesHorizontalBar from '@/components/ClerkMaintHorizontalBar';
import React, { useState, useEffect } from 'react';

interface Maintenance {
  id: number | null;
  name: string | null;
  model: string | null;
  serialNumber: string | null;
  lab: string | null;
  startDate: string | null;
  endDate: string | null;
  taskDescription: string | null;
  assignedTo: string | null;
  status: string | null;
  submitNote?: string | null;
  reviewNote?: string | null;
  reviewedBy?: string | null;
}

export default function viewOngoingMaintenancesScreen() {
  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();
  const [maintenance, setMaintenance] = useState<Maintenance>({
    id: null,
    name: null,
    model: null,
    serialNumber: null,
    lab: null,
    startDate: null,
    endDate: null,
    taskDescription: null,
    assignedTo: null,
    status: null,
    submitNote: null,
    reviewNote: null,
    reviewedBy: null,
  });
  useEffect(() => {
    if (maintenanceId) {
      setMaintenance({
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        serialNumber: 'FOC1234X56Y',
        lab: 'Network Lab',
        startDate: '2022-01-01',
        endDate: '2022-01-31',
        assignedTo: 'John Doe',
        taskDescription: 'Router is not working properly',
        status: 'Under Review',
        submitNote: 'Router was repaired',
        reviewNote: 'Router was repaired',
        reviewedBy: 'Jane Doe',
      });
    } else {
      throw new Error('Maintenance ID not found');
    }
  }, [maintenanceId]);
  const handleUpdateButtonPress = ({ item }: { item: Maintenance }) => {
    router.replace({
      pathname: '/(clerk)/(maintenances)/(ongoing)/update-maintenance',
      params: { maintenanceId: item.id },
    });
  };
  return (
    <BackgroundLayout>
      <MainHeader title='Maintenances' />
      <ClerkMaintenancesHorizontalBar selectedIndex={1} />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Maintenance' />
          <SingleItemBackground>
            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <Text style={styles.titleText}>Maintenance Details</Text>
              <Text style={styles.text}>Name: {maintenance.name}</Text>
              <Text style={styles.text}>Model: {maintenance.model}</Text>
              <Text style={styles.text}>
                Serial Number: {maintenance.serialNumber}
              </Text>
              <Text style={styles.text}>Lab: {maintenance.lab}</Text>
              <View style={styles.textSeparator} />
              <Text style={styles.text}>
                Task Description: {maintenance.taskDescription}
              </Text>
              <Text style={styles.text}>
                Assigned To: {maintenance.assignedTo}
              </Text>
              <Text style={styles.text}>
                Start Date: {maintenance.startDate}
              </Text>
              <Text style={styles.text}>End Date: {maintenance.endDate}</Text>
              <View style={styles.textSeparator} />
              <Text style={styles.text}>Status: {maintenance.status}</Text>
              {maintenance.submitNote && (
                <Text style={styles.text}>
                  Submit Note: {maintenance.submitNote}
                </Text>
              )}
              <View style={styles.textSeparator} />
              {maintenance.reviewNote && (
                <Text style={styles.text}>
                  Review Note: {maintenance.reviewNote}
                </Text>
              )}
              {maintenance.reviewedBy && (
                <Text style={styles.text}>
                  Reviewed By: {maintenance.reviewedBy}
                </Text>
              )}
              <View style={styles.button}>
                <ImageBackground
                  source={require('@/assets/images/blueBtn.webp')}
                  style={styles.buttonBackground}
                  borderRadius={10}
                >
                  <Pressable
                    onPress={() =>
                      handleUpdateButtonPress({ item: maintenance })
                    }
                    style={{ width: '100%', alignItems: 'center' }}
                  >
                    <Text style={styles.buttonText}>Review Maintenance</Text>
                  </Pressable>
                </ImageBackground>
              </View>
              <View style={styles.textSeparator} />
            </ScrollView>
          </SingleItemBackground>
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
  titleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '2%',
  },
  text: {
    color: 'white',
    fontSize: 12,
    marginBottom: '0.2%',
  },
  textSeparator: {
    marginVertical: '2%',
    height: 0.1,
    width: '80%',
    backgroundColor: 'transparent',
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
});
