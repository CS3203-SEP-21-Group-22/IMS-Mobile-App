import { StyleSheet, Pressable, TextInput, ImageBackground, Image } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import TechnicianMaintHorizontalBar from '@/components/TechnicianMaintHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import { useState, useEffect } from 'react';

interface Maintenance {
  id: number | null;
  name: string | null;
  model: string | null;
  serialNumber: string | null;
  lab: string | null;
  startDate: string | null;
  endDate: string | null;
  taskDescription: string | null;
  status: string | null;
  submitNote?: string | null;
  reviewNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
}

export default function UpdateMaintenanceScreen() {
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
    status: null,
    submitNote: null,
    reviewNote: null,
    reviewedBy: null,
    reviewedAt: null
  });
  useEffect(() => {
    if (maintenanceId) {
      setMaintenance({
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        serialNumber: '123456',
        lab: 'Network Lab',
        startDate: '2021-09-01',
        endDate: '2021-09-30',
        taskDescription: 'Check the router for any issues',
        status: 'Ongoing',
      });
    } else {
      throw new Error('Missing maintenanceId');
    }
  }, [maintenanceId]);
  const handleButtonPress = () => {
    router.back();
  }
  return (
    <BackgroundLayout>
    <MainHeader title="Maintenances" />
    <TechnicianMaintHorizontalBar selectedIndex={0} />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="Update Maintenance" />
      <EditSingleItemBackground>
        <Text style={styles.title}>Maintenance Details</Text>
        <Text style={styles.text}>{maintenance.name}</Text>
        <Text style={styles.text}>Model: {maintenance.model}</Text>
        <View style={styles.separator} />
        <Text style={styles.text}>Serial Number: {maintenance.serialNumber}</Text>
        <Text style={styles.text}>Lab: {maintenance.lab}</Text>
        <View style={styles.separator} />
        <Text style={styles.text}>Start Date: {maintenance.startDate}</Text>
        <Text style={styles.text}>End Date: {maintenance.endDate}</Text>
        <View style={styles.separator} />
        <Text style={styles.text}>Task Description: {maintenance.taskDescription}</Text>
        <View style={styles.separator} />
        <Text style={styles.text}>Status: {maintenance.status}</Text>
        <View style={styles.separator} />
        {maintenance.reviewNote && (
          <Text style={styles.text}>Review Note: {maintenance.reviewNote}</Text>
        )}
        {maintenance.reviewedBy && (
          <Text style={styles.text}>Reviewed By: {maintenance.reviewedBy}</Text>
        )}
        {maintenance.reviewedAt && (
          <Text style={styles.text}>Reviewed At: {maintenance.reviewedAt}</Text>
        )}
        {maintenance.reviewNote && (<View style={styles.separator} />)}
        <Text style={styles.title}>Submit Note</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={2}
          value={maintenance.submitNote ?? ''}
          onChange={e => setMaintenance({ ...maintenance, submitNote: e.nativeEvent.text })}
          placeholder="Enter Submit Note"
        />
      </EditSingleItemBackground>
      <View style={styles.button}>
          <ImageBackground
            source={require('@/assets/images/blueBtn.webp')}
            style={styles.buttonBackground}
            borderRadius={10}
          >
          <Pressable onPress={handleButtonPress} style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.buttonText}>
              Submit for Review
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#202652',
    marginTop: '2%',
    marginBottom: '1%',
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
    height: 100
  },
  button: {
    width: '100%',
    marginTop: '1%'
  },
  buttonBackground: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2.5%'
  },
  buttonText: {
    color: 'white',
    fontSize: 18
  },
});
