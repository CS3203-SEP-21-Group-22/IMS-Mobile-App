import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { getLoginStatus } from '@/utils/AsyncStorage';
import { useRouter } from 'expo-router';
import { UserProfile } from '@/interfaces/userProfile.interface';
import { getUserProfile } from '@/utils/AsyncStorage';

const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const status = await getLoginStatus();
        const userProfile: UserProfile = await getUserProfile();
        if (status === 'loggedIn' && userProfile) {
          if (userProfile.role === 'SystemAdmin') {
            router.replace('/(admin)/(user-management)/view-users');
          } else if (userProfile.role === 'Clerk') {
            router.replace('/(clerk)/(reservations)/(requested)/items');
          } else if (userProfile.role === 'Student') {
            router.replace('/(student)/(explore-equipments)/view-labs');
          } else if (userProfile.role === 'AcademicStaff') {
            router.replace('/(student)/(explore-equipments)/view-labs');
          } else if (userProfile.role === 'Technician') {
            router.replace(
              '/(technician)/(maintenances)/(assigned)/maintenances',
            );
          } else {
            router.replace('/login');
          }
        } else if (status === 'loggedOut') {
          router.replace('/login');
        } else if (status === 'loading') {
          console.log('Loading...');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error fetching login status:', error);
      }
    };
    checkLoginStatus();
  }, [router]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors.dark.primary.background },
      ]}
    >
      <ActivityIndicator size='large' color='#00ff00' />
      <Text style={[styles.loadingText, { color: Colors.dark.primary.text }]}>
        Loading, please wait...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  loadedText: {
    fontSize: 22,
    color: '#00ff00',
    fontWeight: 'bold',
  },
});

export default LoadingScreen;
