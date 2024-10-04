import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import ListItemWithImage from '@/components/ListItemWithImage';
import { useState, useEffect } from 'react';
import { Equipment } from '@/interfaces/equipment.interface';
import { initializeAxiosApi, axiosApi } from '@/utils/AxiosApi';
import { Alert, Button } from 'react-native';
import Colors from '@/constants/Colors';

export default function ViewEquipmentsScreen() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { labId, labName } = useLocalSearchParams<{
    labId: string;
    labName: string;
  }>();
  if (!labId || !labName) throw new Error('Missing labId or labName');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get(`/user/equipments?labId=${labId}`);
      setEquipments(response.data);
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

  const ItemComponent: React.FC<{ item: Equipment }> = ({ item }) => (
    <Link
      href={{
        pathname: `/(student)/(explore-equipments)/reserve-equipment`,
        params: {
          equipmentId: item.equipmentId,
          labId: labId,
          name: item.name,
          model: item.model,
          labName: item.labName,
          imageURL: item.imageUrl,
        },
      }}
      asChild
    >
      <Pressable>
        {({ pressed }) => (
          <ListItemBackground>
            <ListItemWithImage link={item.imageUrl ?? 'equipment'}>
              <Text style={styles.titleText}>{item.name}</Text>
              <Text style={styles.text}>Model: {item.model}</Text>
              <Text style={styles.text}>Lab: {item.labName}</Text>
            </ListItemWithImage>
          </ListItemBackground>
        )}
      </Pressable>
    </Link>
  );
  return (
    <BackgroundLayout>
      <MainHeader title='Explore Equipments' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title={`${labName} - Equipments`} />
          {loading ? (
            <ActivityIndicator
              size='large'
              color='#ffffff'
              style={{ marginTop: '50%' }}
            />
          ) : error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button title='Retry' onPress={fetchData} />
            </View>
          ) : equipments ? (
            equipments.length > 0 ? (
              <FlatList
                data={equipments}
                renderItem={({ item }) => <ItemComponent item={item} />}
                keyExtractor={(item) => item.equipmentId.toString()}
                style={styles.flatList}
                contentContainerStyle={{
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchData}
                    tintColor={Colors.light.primary.button}
                  />
                }
              />
            ) : (
              <Text style={styles.text}>No equipments found</Text>
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
