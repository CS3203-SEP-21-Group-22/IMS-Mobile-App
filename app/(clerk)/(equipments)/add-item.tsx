import {
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';

interface Equipment {
  name: string | null;
  model: string | null;
  lab: string | null;
  maintenanceInterval: number | null;
  imageURL?: string | null;
}

export default function AddItemScreen() {
  const { equipmentId } = useLocalSearchParams<{ equipmentId: string }>();
  const [equipment, setEquipment] = useState<Equipment>({
    name: null,
    model: null,
    lab: null,
    maintenanceInterval: null,
    imageURL: null,
  });
  useEffect(() => {
    if (equipmentId) {
      setEquipment({
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        lab: 'Network Lab',
        maintenanceInterval: 120,
      });
    } else {
      throw new Error('Missing equipmentId');
    }
  }, [equipmentId]);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const handleButtonPress = () => {
    router.back();
  };
  return (
    <BackgroundLayout>
      <MainHeader title='Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Add New Item' />
          <EditSingleItemBackground>
            <Text style={styles.title}>Item Details</Text>
            <Text style={styles.text}>{equipment.name}</Text>
            <Image
              source={
                equipment.imageURL
                  ? { uri: equipment.imageURL }
                  : require('@/assets/images/equipmentSample.png')
              }
              style={styles.image}
            />
            <Text style={styles.text}>Model: {equipment.model}</Text>
            <Text style={styles.text}>
              Maintenance Interval: {equipment.maintenanceInterval} days
            </Text>
            <View style={styles.separator} />
            <Text style={styles.text}>Serial Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter Serial Number'
              value={serialNumber ?? ''}
              onChangeText={(text) => setSerialNumber(text)}
            />
          </EditSingleItemBackground>
          <WideButton text='Add Item' buttonClickHandler={handleButtonPress} />
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
    fontSize: 15,
    fontWeight: 'bold',
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
});
