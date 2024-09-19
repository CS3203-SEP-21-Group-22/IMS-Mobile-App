import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/interfaces/userProfile.interface';

// To store User Profile
export const storeUserProfile = async (user: UserProfile) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('userProfile', jsonValue);
  } catch (e) {
    console.error(e);
  }
};

// To get User Profile
export const getUserProfile = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userProfile');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

// Clear User Profile
export const clearUserProfile = async () => {
  try {
    await AsyncStorage.removeItem('userProfile');
  } catch (e) {
    console.error(e);
  }
};

// --------------------------------------------------------------------------------------------

// To store all Tokens
export const storeTokens = async (
  accessToken: string,
  refreshToken: string,
  idToken: string,
) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('idToken', idToken);
  } catch (e) {
    console.error(e);
  }
};

// To store AccessToken
export const storeAccessToken = async (accessToken: string) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
  } catch (e) {
    console.error(e);
  }
};

// To get all Tokens
export const getTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const idToken = await AsyncStorage.getItem('idToken');
    return { accessToken, refreshToken, idToken };
  } catch (e) {
    console.error(e);
  }
};

// To get AccessToken
export const getAccessToken = async () => {
  try {
    const at = await AsyncStorage.getItem('accessToken');
    console.log('retrieved access token : ', at);
    return at;
  } catch (e) {
    console.error(e);
  }
};

// To get RefreshToken
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem('refreshToken');
  } catch (e) {
    console.error(e);
  }
};

// To get IdToken
export const getIdToken = async () => {
  try {
    return await AsyncStorage.getItem('idToken');
  } catch (e) {
    console.error(e);
  }
};

// To remove AccessToken, RefreshToken and IdToken
export const removeTokens = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('idToken');
  } catch (e) {
    console.error(e);
  }
};

// To check if Tokens are present
export const hasTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const idToken = await AsyncStorage.getItem('idToken');
    return accessToken !== null && refreshToken !== null && idToken !== null;
  } catch (e) {
    console.error(e);
  }
};

// --------------------------------------------------------------------------------------------

// set login status - logged out
export const setLoginStatusLoggedOut = async () => {
  try {
    await AsyncStorage.setItem('loginStatus', 'loggedOut');
  } catch (e) {
    console.error(e);
  }
};

// set login status - loading
export const setLoginStatusLoading = async () => {
  try {
    await AsyncStorage.setItem('loginStatus', 'loading');
  } catch (e) {
    console.error(e);
  }
};

// set login status - logged in
export const setLoginStatusLoggedIn = async () => {
  try {
    await AsyncStorage.setItem('loginStatus', 'loggedIn');
  } catch (e) {
    console.error(e);
  }
};

// get login status
export const getLoginStatus = async () => {
  try {
    return await AsyncStorage.getItem('loginStatus');
  } catch (e) {
    console.error(e);
  }
};
