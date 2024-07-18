import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import { useState, useEffect } from 'react';

interface Item {
  id: number;
  serialNumber: string;
  status: string;
  imageURL?: string | null;
}

export default function ViewItemsScreen() {
  const { labId, equipmentId } = useLocalSearchParams<{ labId: string, equipmentId: string }>();
  if (!labId) throw new Error('Missing labId');
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    if (equipmentId) {
      setItems([
        {
          id: 1,
          serialNumber: 'FOC1234X56Y',
          status: 'Available',
        },
        {
          id: 2,
          serialNumber: 'FOC1234X56Z',
          status: 'Available',
        },
        {
          id: 3,
          serialNumber: 'FOC1234X56A',
          status: 'Available',
        },
        {
          id: 4,
          serialNumber: 'FOC1234X56B',
          status: 'Available',
        },
        {
          id: 5,
          serialNumber: 'HOC1234X56B',
          status: 'Available',
        },
        {
          id: 6,
          serialNumber: 'HOC1234X56C',
          status: 'Available',
        },
      ]);
    } else {
      throw new Error('Missing equipmentId');
    }
  }, []);
  const ItemComponent: React.FC<{ item: Item }> = ({ item }) => (
    <Link href={{ pathname: `/(admin)/(explore-equipments)/view-item`, params: { equipmentId: item.id, labId: labId, itemId: item.id } }} asChild>
            <Pressable>
              {({ pressed }) => (
                <ListItemBackground>
                  <ListItemWithImage link={item.imageURL ?? 'equipment'}>
                  <Text style={styles.text}>
                    Serial Number: {item.serialNumber}
                  </Text>
                  <Text style={styles.text}>
                    Status: {item.status}
                  </Text>
                  </ListItemWithImage>
                </ListItemBackground>
                )}
            </Pressable>
    </Link>
  );
  return (
    <BackgroundLayout>
      <MainHeader title="Explore Equipments" />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="View Items" />
        <FlatList
            data={items}
            renderItem={({ item }) => <ItemComponent item={item} />}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
            contentContainerStyle={{ alignItems: 'stretch', justifyContent: 'center', width: '100%', backgroundColor: 'transparent' }}
          />
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
