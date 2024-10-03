import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';
import { Lab } from '@/interfaces/lab.interface';
import { initializeAxiosApi, axiosApi } from '@/utils/AxiosApi';
import { Alert, Button } from 'react-native';

const ItemComponent: React.FC<{ item: Lab }> = ({ item }) => {
  return (
    <Link
      href={{
        pathname: `/(admin)/(lab-management)/update-lab`,
        params: {
          labId: item.labId,
          labName: item.labName,
          labCode: item.labCode,
          imageURLProp: item.imageUrl,
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
};

const handleButtonClick = () => {
  router.push({ pathname: '/(admin)/(lab-management)/add-lab' });
};

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
      <MainHeader title='Lab Management' />
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
        <WideButton text='Add New Lab' buttonClickHandler={handleButtonClick} />
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
