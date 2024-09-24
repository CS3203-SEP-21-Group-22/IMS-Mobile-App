import Constants from 'expo-constants';
import axios from 'axios';
import {
  storeAccessToken,
  removeTokens,
  clearUserProfile,
  setLoginStatusLoggedOut,
  getRefreshToken,
} from '@/utils/AsyncStorage';
import { useRouter, router } from 'expo-router';

// @ts-ignore
const { authServerUrl } = Constants.expoConfig || {};

if (!authServerUrl) {
  throw new Error('Please configure authServerUrl in app.json');
}

export default async function AttemptToRefreshToken() {
  // const router = useRouter();
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token found');
      return;
    }
    const { data } = await axios.post('/refresh', {
      refresh_token: refreshToken,
    });
    const { access_token } = data;
    await storeAccessToken(access_token);
    return true;
  } catch (error: any) {
    console.log('err', typeof error);
    if (error.response.status === 401) {
      console.error('Refresh token expired');
      await removeTokens();
      await setLoginStatusLoggedOut();
      await clearUserProfile();
      router.push('/login');
    }
  }
}
