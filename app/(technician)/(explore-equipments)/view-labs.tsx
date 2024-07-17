import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import { useState, useEffect } from 'react';

interface Lab {
  id: number;
  name: string;
  code: string;
  equipmentCount: number;
  imageURL?: string | null;
}

const ItemComponent: React.FC<{ item: Lab }> = ({ item }) => (
  <Link href={{ pathname: `/(technician)/(explore-equipments)/view-equipments`, params: { labId: item.id, labName: item.name } }} asChild>
          <Pressable>
            {({ pressed }) => (
              <ListItemBackground>
                <ListItemWithImage link={item.imageURL ?? 'lab'}>
                <Text style={styles.titleText}>
                  {item.name}
                </Text>
                <Text style={styles.text}>
                  Code: {item.code}
                </Text>
                <Text style={styles.text}>
                  Equipment Count: {item.equipmentCount}
                </Text>
                </ListItemWithImage>
              </ListItemBackground>
              )}
          </Pressable>
  </Link>
);


export default function ViewLabsScreen() {
  const [labs, setLabs] = useState<Lab[]>([]);
  useEffect(() => {
    setLabs([
      {
        id: 1,
        name: 'Network Lab',
        code: 'NET',
        equipmentCount: 12,
      },
      {
        id: 2,
        name: 'Computer Lab',
        code: 'CSE',
        equipmentCount: 15,
      },
      {
        id: 3,
        name: 'Physics Lab',
        code: 'PHY',
        equipmentCount: 9,
      },
      {
        id: 4,
        name: 'Chemistry Lab',
        code: 'CHE',
        equipmentCount: 7,
      },
      {
        id: 5,
        name: 'Biology Lab',
        code: 'BIO',
        equipmentCount: 5,
      },
    ]);
  }, []);
  return (
    <BackgroundLayout>
      <MainHeader title="Explore Equipments" />
      <ContentContainer>
      <View style={styles.container}>
        <ContentContainerHeader title="View Labs" />
        <FlatList
            data={labs}
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
});
