import { StyleSheet, Pressable, TextInput, Image, Button, ImageBackground } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';
import { Link, router, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

interface Equipment {
  id: number;
  name: string;
  model: string;
  lab: string;
  maintenanceInterval: number;
  imageURL?: string | null;
}

export default function UpdateEquipmentScreen() {
  const { equipmentId, labId } = useLocalSearchParams<{ equipmentId: string, labId: string }>();
  if (!equipmentId) throw new Error('Missing equipmentId');
  if (!labId) throw new Error('Missing labId');
  const [equipment, setEquipment] = useState<Equipment>({
    id: parseInt(equipmentId),
    name: '4-Port WiFi Router',
    model: 'Cisco SRP541W',
    lab: 'Network Lab',
    maintenanceInterval: 120,
  });
  const handleUpdateEquipment = () => {
    router.replace({ pathname: '/(clerk)/(equipments)/view-equipment', params: { equipmentId, labId } });
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setEquipment({ ...equipment, imageURL: result.assets[0].uri });
    }
  };
  return (
    <BackgroundLayout>
    <MainHeader title="Equipments" />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="Update Equipment" />
      <EditSingleItemBackground>
        <Text style={styles.title}>Equipment Details</Text>
        <Text style={styles.text}>Name</Text>
        <TextInput style={styles.textInput} placeholder='Enter Equipment Name' value={equipment.name} onChangeText={(text) => setEquipment({ ...equipment, name: text })} />
        <Text style={styles.text}>Model</Text>
        <TextInput style={styles.textInput} placeholder='Enter Equipment Model' value={equipment.model} onChangeText={(text) => setEquipment({ ...equipment, model: text })} />
        <Text style={styles.text}>Maintenance Interval (Days)</Text>
        <TextInput style={styles.textInput} placeholder='Enter Maintenance Interval' value={equipment.maintenanceInterval.toString()} onChangeText={(text) => setEquipment({ ...equipment, maintenanceInterval: parseInt(text) })} />
        <Image source={equipment.imageURL ? { uri: equipment.imageURL } : require('@/assets/images/equipmentSample.png')} style={styles.image} />
        <Button title="Pick an Image" onPress={pickImage} />
        <View style={styles.separator} />
      </EditSingleItemBackground>
      <View style={styles.button}>
          <ImageBackground
            source={require('@/assets/images/blueBtn.webp')}
            style={styles.buttonBackground}
            borderRadius={10}
          >
          <Pressable onPress={handleUpdateEquipment} style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.buttonText}>
              Update Equipment
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
