import { StyleSheet, Pressable, ScrollView, ImageBackground } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import SingleItemBackground from '@/components/SingleItemBackground';
import SingleItemWithImage from '@/components/SingleItemWithImage';
import { useState, useEffect } from 'react';

interface Item {
  id: number | null;
  name: string | null;
  model: string | null;
  lab: string | null;
  maintenanceInterval: number | null;
  serialNumber: string | null;
  lastMaintenanceOn: string | null;
  lastMaintenanceBy: string | null;
  status: string | null;
  imageURL?: string | null;
}

export default function ViewItemScreen() {
  const { itemId, equipmentId, labId } = useLocalSearchParams<{ itemId: string, equipmentId: string, labId: string }>();
  if (!equipmentId) throw new Error('Missing equipmentId');
  if (!labId) throw new Error('Missing labId');
  const [item, setItem] = useState<Item>({
    id: null,
    name: null,
    model: null,
    lab: null,
    maintenanceInterval: null,
    serialNumber: null,
    lastMaintenanceOn: null,
    lastMaintenanceBy: null,
    status: null,
    imageURL: null,
  });
  useEffect(() => {
    if (itemId) {
      setItem({
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        lab: 'Network Lab',
        maintenanceInterval: 120,
        serialNumber: 'FOC1234X56Y',
        lastMaintenanceOn: '2021-09-01',
        lastMaintenanceBy: 'John Doe',
        status: 'Available',
      });
    } else {
      throw new Error('Missing itemId');
    }
  }, [itemId]);
  const handleViewReservHistory = ({ item }: { item: Item }) => {
    router.push({ pathname: '/(admin)/(explore-equipments)/reservations', params: { itemId: item.id } });
  }
  const handleViewMaintHistory = ({ item }: { item: Item }) => {
    router.push({ pathname: '/(admin)/(explore-equipments)/maintenances', params: { itemId: item.id } });
  }
  return (
    <BackgroundLayout>
    <MainHeader title="Explore Equipments" />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="View Item" />
      <SingleItemBackground>
        <ScrollView style={{ width: '100%' }}>
        <SingleItemWithImage title={item.name ?? ''} link={item.imageURL ?? 'equipment'}>
          <Text style={styles.text}>
            Model: {item.model}
          </Text>
          <Text style={styles.text}>
            Lab: {item.lab}
          </Text>
          <Text style={styles.text}>
            Maintenance Interval: {item.maintenanceInterval} days
          </Text>
          <View style={styles.textSeparator} />
          <Text style={styles.text}>
            Serial Number: {item.serialNumber}
          </Text>
          <Text style={styles.text}>
            Last Maintenance On: {item.lastMaintenanceOn}
          </Text>
          <Text style={styles.text}>
            Last Maintenance By: {item.lastMaintenanceBy}
          </Text>
          <Text style={styles.text}>
            Status: {item.status}
          </Text>
          <View style={styles.textSeparator} />
        </SingleItemWithImage>
        <View style={styles.button}>
              <ImageBackground
                source={require('@/assets/images/blueBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={10}
              >
                <Pressable onPress={() => handleViewReservHistory({ item: item })} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.buttonText}>
                    View Reservations History
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
                <Pressable onPress={() => handleViewMaintHistory({ item: item })} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.buttonText}>
                    View Maintenance History
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

