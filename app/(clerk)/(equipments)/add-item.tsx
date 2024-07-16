import { StyleSheet, Pressable, TextInput, ImageBackground, Image } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import React, { useState } from 'react';

interface Equipment {
  name: string;
  model: string;
  lab: string;
  maintenanceInterval: number;
  imageURL?: string | null;
}

export default function AddItemScreen() {
  const { equipmentId } = useLocalSearchParams<{ equipmentId: string }>();
  if (!equipmentId) throw new Error('Missing equipmentId');
  const equipment: Equipment = {
    name: '4-Port WiFi Router',
    model: 'Cisco SRP541W',
    lab: 'Network Lab',
    maintenanceInterval: 120,
  };
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const handleButtonPress = () => {
    router.back();
  }
  return (
    <BackgroundLayout>
    <MainHeader title="Equipments" />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="Add New Item" />
      <EditSingleItemBackground>
        <Text style={styles.title}>Item Details</Text>
        <Text style={styles.text}>{equipment.name}</Text>
        <Image source={equipment.imageURL ? { uri: equipment.imageURL } : require('@/assets/images/equipmentSample.png')} style={styles.image} />
        <Text style={styles.text}>Model: {equipment.model}</Text>
        <Text style={styles.text}>Maintenance Interval: {equipment.maintenanceInterval} days</Text>
        <View style={styles.separator} />
        <Text style={styles.text}>Serial Number</Text>
        <TextInput style={styles.textInput} placeholder='Enter Serial Number' value={serialNumber ?? ''} onChangeText={(text) => setSerialNumber(text)} />
      </EditSingleItemBackground>
      <View style={styles.button}>
          <ImageBackground
            source={require('@/assets/images/blueBtn.webp')}
            style={styles.buttonBackground}
            borderRadius={10}
          >
          <Pressable onPress={handleButtonPress} style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.buttonText}>
              Add Item
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
