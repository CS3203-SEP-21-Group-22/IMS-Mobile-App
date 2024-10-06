import {
  StyleSheet,
  Pressable,
  FlatList,
  ImageBackground,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Button,
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
import { User } from '@/interfaces/userProfile.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';
import Colors from '@/constants/Colors';

const ItemComponent: React.FC<{ item: User }> = ({ item }) => (
  <Link
    href={{
      pathname: `/(admin)/(user-management)/update-user`,
      params: {
        userId: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        role: item.role,
        contactNumber: item.contactNumber,
      },
    }}
    asChild
  >
    <Pressable>
      {({ pressed }) => (
        <ListItemBackground>
          <ListItemWithImage link={'user'}>
            <Text style={styles.titleText}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.text}>{item.email}</Text>
            <Text style={styles.text}>{item.role}</Text>
          </ListItemWithImage>
        </ListItemBackground>
      )}
    </Pressable>
  </Link>
);

export default function ViewUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get(`/admin/users`);
      setUsers(response.data);
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
      <MainHeader title='User Management' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Users' />
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
          ) : users ? (
            users.length > 0 ? (
              <FlatList
                data={users}
                renderItem={({ item }) => <ItemComponent item={item} />}
                keyExtractor={(item) => item.userId.toString()}
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
                <Pressable onPress={fetchData} style={{ marginTop: '70%' }}>
                  <Text style={styles.notFoundText}>No users found</Text>
                </Pressable>
              </View>
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
  notFoundText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'semibold',
  },
});
