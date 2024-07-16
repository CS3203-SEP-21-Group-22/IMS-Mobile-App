import { StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import SingleItemWithImage from '@/components/SingleItemWithImage';

interface Equipment {
  id: number;
  name: string;
  model: string;
  lab: string;
  maintenanceInterval: number;
  totalItems: number;
  reservedItems: number;
  availableItems: number;
  imageURL?: string | null;
}

export default function ViewEquipmentScreen() {
  const { equipmentId, labId } = useLocalSearchParams<{ equipmentId: string, labId: string }>();
  if (!equipmentId) throw new Error('Missing equipmentId');
  if (!labId) throw new Error('Missing labId');
  const equipment: Equipment = {
    id: parseInt(equipmentId),
    name: '4-Port WiFi Router',
    model: 'Cisco SRP541W',
    lab: 'Network Lab',
    maintenanceInterval: 120,
    totalItems: 10,
    reservedItems: 2,
    availableItems: 8,
  };
  const handleViewItems = ({ item }: { item: Equipment }) => {
    router.push({ pathname: '/(clerk)/(equipments)/view-items', params: { equipmentId: item.id, labId } });
  }
  const handleUpdateEquipment = ({ item }: { item: Equipment }) => {
    router.replace({ pathname: '/(clerk)/(equipments)/update-equipment', params: { equipmentId: item.id, labId } });
  }
  const handleDeleteEquipment = ({ item }: { item: Equipment }) => {
    router.back();
  }
  return (
    <BackgroundLayout>
    <MainHeader title="Equipments" />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="View Equipment" />
      <SingleItemBackground>
        <ScrollView style={{ width: '100%' }}>
        <SingleItemWithImage title={equipment.name} link={equipment.imageURL ?? 'equipment'}>
          <Text style={styles.text}>
            Model: {equipment.model}
          </Text>
          <Text style={styles.text}>
            Lab: {equipment.lab}
          </Text>
          <Text style={styles.text}>
            Maintenance Interval: {equipment.maintenanceInterval} days
          </Text>
          <View style={styles.textSeparator} />
          <Text style={styles.text}>
            Total Items: {equipment.totalItems}
          </Text>
          <Text style={styles.text}>
            Reserved Items: {equipment.reservedItems}
          </Text>
          <Text style={styles.text}>
            Available Items: {equipment.availableItems}
          </Text>
          <View style={styles.textSeparator} />
        </SingleItemWithImage>
        <View style={styles.button}>
              <ImageBackground
                source={require('@/assets/images/blueBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={10}
              >
                <Pressable onPress={() => handleViewItems({ item: equipment })} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.buttonText}>
                    View Items
                  </Text>
                </Pressable>
              </ImageBackground>
          </View>
          <View style={styles.button}>
              <ImageBackground
                source={require('@/assets/images/blueBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={10}
              >
                <Pressable onPress={() => handleUpdateEquipment({ item: equipment })} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.buttonText}>
                    Update Equipment
                  </Text>
                </Pressable>
              </ImageBackground>
          </View>
          <View style={styles.button}>
              <ImageBackground
                source={require('@/assets/images/redBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={10}
              >
                <Pressable onPress={() => handleDeleteEquipment({ item: equipment })} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.buttonText}>
                    Delete Equipment
                  </Text>
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
    color:'white',
    fontSize: 13,
    fontWeight: 'bold',
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

