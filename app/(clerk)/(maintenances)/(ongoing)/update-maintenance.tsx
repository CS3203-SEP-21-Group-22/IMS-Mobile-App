import { StyleSheet, Pressable, TextInput, ImageBackground, Image, Button, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, router, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import ClerkMaintenancesHorizontalBar from '@/components/ClerkMaintHorizontalBar';
import React, { useState, useEffect } from 'react';

interface Maintenance {
  name: string | null;
  model: string | null;
  serialNumber: string | null;
  lab: string | null;
  startDate: string | null;
  endDate: string | null;
  assignedTechnician: string | null;
  taskDescription: string | null;
  status: string | null;
  submitNote?: string | null;
  reviewNote?: string | null;
  reviewedBy?: string | null;
}

export default function UpdateMaintenanceScreen() {
  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();
  const [maintenance, setMaintenance] = useState<Maintenance>({
    name: null,
    model: null,
    serialNumber: null,
    lab: null,
    startDate: null,
    endDate: null,
    assignedTechnician: null,
    taskDescription: null,
    status: null,
    submitNote: null,
    reviewNote: null,
    reviewedBy: null,
  });
  useEffect(() => {
    if (maintenanceId) {
      setMaintenance({
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        serialNumber: 'FOC1234X56Y',
        lab: 'Network Lab',
        startDate: '2021-09-01',
        endDate: '2021-09-02',
        assignedTechnician: 'John Doe',
        taskDescription: 'Check the network connection',
        status: 'Under Review',
        submitNote: 'The router was repaired',
        reviewNote: 'The router was repaired',
        reviewedBy: 'Jane Doe',
      });
    } else {
      throw new Error('Maintenance ID not found');
    }
  }, [maintenanceId]);
  const updateMaintenance = ({ completed } : { completed: boolean }) => {
    router.replace({ pathname: '/(clerk)/(maintenances)/(ongoing)/view-maintenance', params: { maintenanceId: '1' } });
  };
  return (
    <BackgroundLayout>
    <MainHeader title="Maintenances" />
    <ClerkMaintenancesHorizontalBar selectedIndex={1} />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="Review Maintenance" />
      <EditSingleItemBackground>
      <ScrollView style={{ width: '95%' }} contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={styles.title}>
          Maintenance Details
        </Text>
        <Text style={styles.text}>
          Name: {maintenance.name}
        </Text>
        <Text style={styles.text}>
          Model: {maintenance.model}
        </Text>
        <Text style={styles.text}>
          Lab: {maintenance.lab}
        </Text>
        <Text style={styles.text}>
          Serial Number: {maintenance.serialNumber}
        </Text>
        <View style={styles.separator} />
        <Text style={styles.text}>
          Task Description: {maintenance.taskDescription}
        </Text>
        <Text style={styles.text}>
          Assigned To: {maintenance.assignedTechnician}
        </Text>
        <Text style={styles.text}>
          Start Date: {maintenance.startDate}
        </Text>
        <Text style={styles.text}>
          End Date: {maintenance.endDate}
        </Text>
        <View style={styles.separator} />
        <Text style={styles.text}>
          Status: {maintenance.status}
        </Text>
        <Text style={styles.text}>
          Submit Note: {maintenance.submitNote}
        </Text>
        <View style={styles.separator} />
        <TextInput
            style={styles.textInput}
            multiline
            placeholder={maintenance.reviewNote ? maintenance.reviewNote : 'Review Note'}
            value={maintenance.reviewNote ? maintenance.reviewNote : 'Review Note'}
            onChangeText={(text) => setMaintenance({ ...maintenance, reviewNote: text })}
        />
        {maintenance.reviewedBy && (
          <Text style={styles.text}>
            Reviewed By: {maintenance.reviewedBy}
          </Text>
        )}
        <View style={styles.separator} />
      </ScrollView>
      </EditSingleItemBackground>
      <View style={styles.button}>
          <ImageBackground
            source={require('@/assets/images/blueBtn.webp')}
            style={styles.buttonBackground}
            borderRadius={10}
          >
          <Pressable onPress={() => updateMaintenance({ completed: false })} style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.buttonText}>
              Update Review
            </Text>
          </Pressable>
          </ImageBackground>
      </View>
      <View style={styles.separator} />
      <View style={styles.button}>
          <ImageBackground
            source={require('@/assets/images/blueBtn.webp')}
            style={styles.buttonBackground}
            borderRadius={10}
          >
          <Pressable onPress={() => updateMaintenance({ completed: true })} style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.buttonText}>
              Mark as Completed
            </Text>
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
    color: '#202652'
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
    height: 100
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
