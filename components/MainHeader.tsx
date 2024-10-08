import { StyleSheet, Pressable } from 'react-native';
import { Link, router, useSegments } from 'expo-router';
import { Text, View } from '@/components/Themed';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useEffect, useState } from 'react';

const MainHeader: React.FC<{ title: string }> = ({ title }) => {
  const [backBtnVisible, setBackBtnVisible] = useState(false);
  const rootPathParams = [
    '(admin)/(user-management)/view-users',
    '(clerk)/(reservations)/(requested)/items',
    '(student)/(explore-equipments)/view-labs',
    '(technician)/(maintenances)/(assigned)/maintenances',
  ];
  const params = useSegments();
  const path = params.join('/');

  useEffect(() => {
    setBackBtnVisible(!rootPathParams.includes(path));
  }, [params]);

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <View style={styles.separator}></View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          width: '90%',
        }}
      >
        {backBtnVisible && (
          <Pressable
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 0 }}
          >
            {({ pressed }) => (
              <FontAwesome6
                name='arrow-left'
                size={26}
                color='white'
                style={{ opacity: pressed ? 0.5 : 1 }}
                testID='back-button'
              />
            )}
          </Pressable>
        )}
        <Text style={styles.headerText} testID='header-title'>
          {title}
        </Text>
        <Link
          href='/profile'
          asChild
          style={{ position: 'absolute', right: 0 }}
        >
          <Pressable>
            {({ pressed }) => (
              <FontAwesome6
                name='user-circle'
                size={28}
                color='white'
                style={{ opacity: pressed ? 0.5 : 1 }}
                testID='profile-icon'
              />
            )}
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    backgroundColor: 'transparent',
    marginTop: '8%',
    marginBottom: '5%',
    width: '80%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
  },
});

export default MainHeader;
