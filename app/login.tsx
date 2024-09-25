import React, { useEffect, useCallback } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { View } from '@/components/Themed';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import WideButton from '@/components/WideButton';
import axios from 'axios';
import {
  storeTokens,
  removeTokens,
  storeUserProfile,
  setLoginStatusLoading,
  setLoginStatusLoggedIn,
  setLoginStatusLoggedOut,
} from '@/utils/AsyncStorage';
import { UserProfile } from '@/interfaces/userProfile.interface';
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';

// @ts-ignore
const { authServerUrl, authClientId, backendAPIUrl } =
  Constants.expoConfig || {};

if (!authServerUrl || !authClientId || !backendAPIUrl) {
  throw new Error(
    'Please configure authServerUrl, authClientId, and backendAPIUrl in app.json',
  );
}

// @ts-ignore
const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
const authUrl = `${authServerUrl}/login?redirectUri=${encodeURIComponent(redirectUri)}&clientId=${authClientId}`;

const getRoleFromServer = async (
  router: any,
  access_token: string,
  refresh_token: string,
  token: string,
) => {
  try {
    const { data } = await axios.get('/user/role', {
      baseURL: backendAPIUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const { role } = data;
    const roleRoutes: { [key: string]: string } = {
      SystemAdmin: '/(admin)/(user-management)/view-users',
      Clerk: '/(clerk)/(reservations)/(requested)/items',
      Student: '/(student)/(explore-equipments)/view-labs',
      AcademicStaff: '/(student)/(explore-equipments)/view-labs',
      Technician: '/(technician)/(maintenances)/(assigned)/maintenances',
    };

    if (roleRoutes[role]) {
      const decodedToken = jwtDecode(token);
      const userProfile: UserProfile = {
        id: 0,
        // @ts-ignore
        firstName: decodedToken.firstName,
        // @ts-ignore
        lastName: decodedToken.lastName,
        // @ts-ignore
        email: decodedToken.email,
        role: role,
        // @ts-ignore
        contactNumber: decodedToken.contactNumber,
      };
      await storeUserProfile(userProfile);
      await storeTokens(access_token, refresh_token, token);
      await setLoginStatusLoggedIn();
      router.push(roleRoutes[role]);
    } else {
      console.error('Unknown role');
    }
  } catch (error) {
    console.error(error);
    router.push('/login');
  }
};

const handleAuthResponse = async (
  response: AuthSession.AuthSessionResult,
  router: any,
) => {
  if (response.type === 'success' && response.params?.id_token) {
    const { access_token, id_token, refresh_token } = response.params;
    await setLoginStatusLoading();
    await getRoleFromServer(router, access_token, refresh_token, id_token);
  } else if (response.type === 'error') {
    if (response.params && response.params['id_token'] !== undefined) {
      const { access_token, id_token, refresh_token } = response.params;
      await setLoginStatusLoading();
      await getRoleFromServer(router, access_token, refresh_token, id_token);
    } else {
      await setLoginStatusLoggedOut();
      Alert.alert(response?.error?.code || 'Unable to Handle Error');
    }
  }
};

const LoginLayout = () => {
  const router = useRouter();
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: authClientId,
      redirectUri,
    },
    { authorizationEndpoint: authUrl },
  );

  useEffect(() => {
    if (response) {
      handleAuthResponse(response, router);
    }
  }, [response]);

  return (
    <BackgroundLayout>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <ContentContainer>
        <View style={styles.container}>
          <Text style={styles.title}>
            Welcome to Lab Inventory Management System
          </Text>
          <Image
            source={require('../assets/images/loginPageImg.png')}
            style={styles.image}
          />
          <View style={styles.separator}></View>
          <Text style={styles.text}>
            Streamline your computer lab inventory with ease. Exclusive to our
            university, ensuring efficient and organized management.
          </Text>
          <WideButton
            text='Sign In with Institution Account'
            buttonClickHandler={() => {
              promptAsync();
            }}
          />
        </View>
      </ContentContainer>
    </BackgroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: '1%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
  },
  logo: {
    width: 130,
    height: 100,
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 5,
  },
  image: {
    width: 240,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default LoginLayout;
