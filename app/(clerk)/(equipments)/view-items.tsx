import {
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';
import { Item } from '@/interfaces/item.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';

export default function ViewItemsScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { labId, equipmentId, name, model, imageUrl, maintenanceIntervalDays } =
    useLocalSearchParams<{
      labId: string;
      equipmentId: string;
      name: string;
      model: string;
      imageUrl: string;
      maintenanceIntervalDays: string;
    }>();
  if (!labId || !equipmentId || !name || !model)
    throw new Error('Missing labId, equipmentId, name or model');

  const fetchData = async () => {
    try {
      const response = await axiosApi.get(
        `/user/items?equipmentId=${equipmentId}`,
      );
      setItems(response.data);
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

  const handleButtonClick = () => {
    router.push({
      pathname: '/(clerk)/(equipments)/add-item',
      params: {
        labId: labId,
        equipmentId: equipmentId,
        name: name,
        model: model,
        imageUrl: imageUrl,
        maintenanceIntervalDays: maintenanceIntervalDays,
      },
    });
  };

  const ItemComponent: React.FC<{ item: Item }> = ({ item }) => (
    <Link
      href={{
        pathname: `/(clerk)/(equipments)/view-item`,
        params: {
          equipmentId: item.equipmentId,
          labId: labId,
          itemId: item.itemId,
        },
      }}
      asChild
    >
      <Pressable>
        {({ pressed }) => (
          <ListItemBackground>
            <ListItemWithImage link={item.imageUrl ?? 'equipment'}>
              <Text style={styles.text}>
                Serial Number: {item.serialNumber}
              </Text>
              <Text style={styles.text}>Status: {item.status}</Text>
            </ListItemWithImage>
          </ListItemBackground>
        )}
      </Pressable>
    </Link>
  );

  return (
    <BackgroundLayout>
      <MainHeader title='Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Items' />
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : items ? (
            items.length > 0 ? (
              <FlatList
                data={items}
                renderItem={({ item }) => <ItemComponent item={item} />}
                keyExtractor={(item) => item.itemId.toString()}
                style={styles.flatList}
                contentContainerStyle={{
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <Text>No items found</Text>
            )
          ) : null}
          <WideButton
            text='Add New Item'
            buttonClickHandler={handleButtonClick}
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
    color: 'white',
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
