import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import { ImageBackground } from 'react-native';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import { useState, useEffect } from 'react';

interface Equipment {
  id: number;
  name: string;
  model: string;
  lab: string;
  imageURL?: string | null;
}

export default function ViewEquipmentsScreen() {
  const { labId, labName } = useLocalSearchParams<{ labId: string, labName: string }>();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  useEffect(() => {
    if (!labId || !labName) throw new Error('Lab parameters are required');
    setEquipments([
      {
        id: 1,
        name: '4-Port WiFi Router',
        model: 'Cisco SRP541W',
        lab: 'Network Lab',
      },
      {
        id: 2,
        name: '8-Port Ethernet Switch',
        model: 'Cisco SG350-10P',
        lab: 'Network Lab',
      },
      {
        id: 3,
        name: '24-Port Ethernet Switch',
        model: 'Cisco SG350-28P',
        lab: 'Network Lab',
      },
      {
        id: 4,
        name: '16-Port Ethernet Switch',
        model: 'Cisco SG350-16P',
        lab: 'Network Lab',
      },
      {
        id: 5,
        name: '24-Port PoE Switch',
        model: 'Cisco SG350-28P',
        lab: 'Network Lab',
      },
      {
        id: 6,
        name: '8-Port PoE Switch',
        model: 'Cisco SG350-10P',
        lab: 'Network Lab',
      },
    ]);
  }, []);
  const handleButtonClick = () => {
    router.push({ pathname: '/(clerk)/(equipments)/add-equipment', params: { labId: labId } });
  }
  const ItemComponent: React.FC<{ item: Equipment }> = ({ item }) => (
    <Link href={{ pathname: `/(clerk)/(equipments)/view-equipment`, params: { equipmentId: item.id, labId: labId } }} asChild>
            <Pressable>
              {({ pressed }) => (
                <ListItemBackground>
                  <ListItemWithImage link={item.imageURL ?? 'equipment'}>
                  <Text style={styles.titleText}>
                    {item.name}
                  </Text>
                  <Text style={styles.text}>
                    Model: {item.model}
                  </Text>
                  <Text style={styles.text}>
                    Lab: {item.lab}
                  </Text>
                  </ListItemWithImage>
                </ListItemBackground>
                )}
            </Pressable>
    </Link>
  );
  return (
    <BackgroundLayout>
      <MainHeader title="Equipments" />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title={`${labName} - Equipments`} />
        <FlatList
            data={equipments}
            renderItem={({ item }) => <ItemComponent item={item} />}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
            contentContainerStyle={{ alignItems: 'stretch', justifyContent: 'center', width: '100%', backgroundColor: 'transparent' }}
            
          />
          <View style={styles.button}>
              <ImageBackground
                source={require('@/assets/images/blueBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={10}
              >
                <Pressable onPress={handleButtonClick} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.buttonText}>
                    Add New Equipment
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
  flatList: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  titleText: {
    color:'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 10,
  },
  button: {
    width: '100%',
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
