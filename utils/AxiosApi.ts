// axiosSetup.js
import axios, { Axios } from 'axios';
import {
  getAccessToken,
  storeAccessToken,
  removeTokens,
  clearUserProfile,
  setLoginStatusLoggedOut,
  getRefreshToken,
} from '@/utils/AsyncStorage';
import { router } from 'expo-router';
import Constants from 'expo-constants';

// @ts-ignore
const { backendAPIUrl, authServerUrl } = Constants.expoConfig || {};
if (!backendAPIUrl || !authServerUrl)
  throw new Error(
    'Please configure backendAPIUrl and authServerUrl in app.json',
  );

let axiosApi: Axios;

// Async function to initialize Axios with the access token
export const initializeAxiosApi = async () => {
  try {
    const accessToken = await getAccessToken();

    // Create an Axios instance
    axiosApi = axios.create({
      baseURL: backendAPIUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Add a response interceptor
    axiosApi.interceptors.response.use(
      (response) => response, // Pass the response if it's successful
      async (error) => {
        const status = error.response?.status;

        if (status === 401) {
          try {
            // If a 401 status is received, attempt to refresh the token
            const refreshToken = await getRefreshToken();
            const refreshTokenResponse = await axios.post(
              `${authServerUrl}/refresh`,
              {
                refresh_token: refreshToken,
              },
            );

            // Save the new token to AsyncStorage
            await storeAccessToken(refreshTokenResponse.data.access_token);
            // Retry the original request with the new token
            error.config.headers['Authorization'] =
              `Bearer ${refreshTokenResponse.data.access_token}`;
            return axiosApi.request(error.config);
          } catch (refreshError) {
            // If the refresh token request fails, log out the user
            await removeTokens();
            await clearUserProfile();
            await setLoginStatusLoggedOut();
            router.push('/login');
            return Promise.reject(refreshError);
          }
        }
        console.log(error.response.data);
        // Reject the error if it's not a 401 or token refresh fails
        return Promise.reject(error);
      },
    );
  } catch (err) {
    console.error('Error initializing Axios instance:', err);
  }
};

export { axiosApi };
