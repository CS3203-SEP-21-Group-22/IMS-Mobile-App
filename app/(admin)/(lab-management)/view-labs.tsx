import { StyleSheet, Pressable, FlatList, ImageBackground } from 'react-native';
import { Link, router } from 'expo-router';
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
  imageURL?: string | null;
}

const ItemComponent: React.FC<{ item: Lab }> = ({ item }) => (
  <Link href={{ pathname: `/(admin)/(lab-management)/update-lab`, params: { labId: item.id } }} asChild>
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
                </ListItemWithImage>
              </ListItemBackground>
              )}
          </Pressable>
  </Link>
);

const handleButtonClick = () => {
  router.push({ pathname: '/(admin)/(lab-management)/add-lab' });
}

export default function ViewLabsScreen() {
  const [labs, setLabs] = useState<Lab[]>([]);
  useEffect(() => {
    setLabs([
      {
        id: 1,
        name: 'Network Lab',
        code: 'NET',
      },
      {
        id: 2,
        name: 'Computer Lab',
        code: 'CSE',
      },
      {
        id: 3,
        name: 'Physics Lab',
        code: 'PHY',
      },
      {
        id: 4,
        name: 'Chemistry Lab',
        code: 'CHE',
      },
      {
        id: 5,
        name: 'Biology Lab',
        code: 'BIO',
      },
    ]);
  }, []);
  return (
    <BackgroundLayout>
      <MainHeader title="Lab Management" />
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
      <View style={styles.button}>
          <ImageBackground
                source={require('@/assets/images/blueBtn.webp')}
                style={styles.buttonBackground}
                borderRadius={10}
              >
                <Pressable onPress={handleButtonClick} style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.buttonText}>
                    Add New Lab
                  </Text>
                </Pressable>
          </ImageBackground>
      </View>
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
