import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import { useState, useEffect } from 'react';
import { Lab } from '@/interfaces/lab.interface';
import { initializeAxiosApi, axiosApi } from '@/utils/AxiosApi';
import { Alert, Button } from 'react-native';

const ItemComponent: React.FC<{ item: Lab }> = ({ item }) => (
  <Link
    href={{
      pathname: `/(clerk)/(equipments)/view-equipments`,
      params: {
        labId: item.labId,
        labName: item.labName,
        labCode: item.labCode,
        imageURL: item.imageUrl,
      },
    }}
    asChild
  >
    <Pressable>
      {({ pressed }) => (
        <ListItemBackground>
          <ListItemWithImage link={item.imageUrl ?? 'lab'}>
            <Text style={styles.titleText}>{item.labName}</Text>
            <Text style={styles.text}>Code: {item.labCode}</Text>
          </ListItemWithImage>
        </ListItemBackground>
      )}
    </Pressable>
  </Link>
);

export default function ViewLabsScreen() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axiosApi.get('/user/labs');
      setLabs(response.data);
    } catch (err: any) {
      setError('Failed to fetch data');
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Axios and fetch data on component mount
  useEffect(() => {
    const initializeAndFetch = async () => {
      await initializeAxiosApi(); // Initialize Axios instance
      fetchData(); // Fetch data from the API
    };

    initializeAndFetch();
  }, []);

  return (
    <BackgroundLayout>
      <MainHeader title='Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Labs' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : labs ? (
            labs.length > 0 ? (
              <FlatList
                data={labs}
                renderItem={({ item }) => <ItemComponent item={item} />}
                keyExtractor={(item) => item.labId.toString()}
                style={styles.flatList}
                contentContainerStyle={{
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <Text style={styles.text}>No labs found</Text>
            )
          ) : null}
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
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 10,
  },
});
