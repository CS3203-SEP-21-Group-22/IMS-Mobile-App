import { StyleSheet, Pressable, FlatList, ImageBackground } from 'react-native';
import { Link, router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import ListItemBackground from '@/components/ListItemBackground';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const ItemComponent: React.FC<{ item: User }> = ({ item }) => (
  <Link
    href={{
      pathname: `/(admin)/(user-management)/update-user`,
      params: { userId: item.id },
    }}
    asChild
  >
    <Pressable>
      {({ pressed }) => (
        <ListItemBackground>
          <Text style={styles.titleText}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.text}>{item.email}</Text>
          <Text style={styles.text}>{item.role}</Text>
        </ListItemBackground>
      )}
    </Pressable>
  </Link>
);

export default function ViewUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    setUsers([
      {
        id: 1,
        email: 'JohnDoe@uok.uk',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Student/Academic Staff',
      },
      {
        id: 2,
        email: 'JaneDoe@uok.uk',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Student/Academic Staff',
      },
      {
        id: 3,
        email: 'CarlDoe@uok.uk',
        firstName: 'Carl',
        lastName: 'Doe',
        role: 'Office Clerk',
      },
      {
        id: 4,
        email: 'RayDoe@uok.uk',
        firstName: 'Ray',
        lastName: 'Doe',
        role: 'Technician',
      },
      {
        id: 5,
        email: 'EarlDoe@uok.uk',
        firstName: 'Earl',
        lastName: 'Doe',
        role: 'Technician',
      },
    ]);
  }, []);
  return (
    <BackgroundLayout>
      <MainHeader title='User Management' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='View Users' />
          <FlatList
            data={users}
            renderItem={({ item }) => <ItemComponent item={item} />}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
            contentContainerStyle={{
              alignItems: 'stretch',
              justifyContent: 'center',
              width: '100%',
              backgroundColor: 'transparent',
            }}
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
