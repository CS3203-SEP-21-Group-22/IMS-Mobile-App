import {
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
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

  const handleButtonClick = () => {
    router.push({
      pathname: '/(clerk)/(equipments)/add-equipment',
      params: { labId: labId },
    });
  };

  const ItemComponent: React.FC<{ item: Equipment }> = ({ item }) => (
    <Link
      href={{
        pathname: `/(clerk)/(equipments)/view-equipment`,
        params: { equipmentId: item.equipmentId, labId: labId },
      }}
      asChild
    >
      <Pressable>
        {({ pressed }) => (
          <ListItemBackground>
            <ListItemWithImage link={item.imageUrl ?? 'equipment'}>
              <Text style={styles.titleText}>{item.name}</Text>
              <Text style={styles.text}>Model : {item.model}</Text>
              <Text style={styles.text}>Lab : {item.labName}</Text>
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
              <View
                style={{
                  height: '83%',
                  backgroundColor: 'transparent',
                }}
              >
                <Pressable onPress={fetchData} style={{ marginTop: '60%' }}>
                  <Text style={styles.notFoundText}>No equipments found</Text>
                </Pressable>
              </View>
            )
          ) : null}
          {!loading ? (
            <WideButton
              text='Add New Equipment'
              buttonClickHandler={handleButtonClick}
            />
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
    justifyContent: 'flex-start',
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
    fontSize: 11,
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
  notFoundText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'semibold',
  },
});
