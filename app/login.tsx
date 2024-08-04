import React from 'react';
import { Pressable, Text, StyleSheet,ImageBackground, Dimensions, Button } from 'react-native';
import { Link } from 'expo-router';
import { View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import * as AuthSession from 'expo-auth-session';
import { jwtDecode } from "jwt-decode";
import Constants from 'expo-constants';

// @ts-ignore
const authServerUrl = Constants.expoConfig?.authServerUrl?.toString();
// @ts-ignore
const authClientId = Constants.expoConfig?.authClientId?.toString();
if (!authServerUrl || !authClientId) {
  throw new Error('Please configure the authServerUrl and authClientId in app.json');
}

// @ts-ignore
const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
const authUrl = `${authServerUrl}/login?redirectUri=${encodeURIComponent(redirectUri)}&clientId=${authClientId}`;
console.log('authUrl', authUrl);

export default function LoginLayout() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'group22-client-id',
      redirectUri,
    },
    {
      authorizationEndpoint: authUrl,
    },
  );
  React.useEffect(() => {
    if (response) {
      if (response.type === 'success') {
        const { access_token, id_token, refresh_token } = response.params;
        const decoded = jwtDecode(id_token);
        console.log(decoded);
      } else if (response.type === 'error') {
        if (response.params && response.params['id_token'] !== undefined) {
          const { access_token, id_token, refresh_token } = response.params;
          const decoded = jwtDecode(id_token);
          console.log(decoded);
        }
      }
    }
  }, [response]);

  return (
    <BackgroundLayout>
    <View style={styles.container}>
      <Text style={styles.title}>
        Login Page
      </Text>
        <Link href="/(admin)/(user-management)/view-users" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={styles.text}>
                Admin
              </Text>
              )}
          </Pressable>
        </Link>
        <Link href="/(clerk)/(reservations)/(requested)/items" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={styles.text}>
                Office Clerk
              </Text>
              )}
          </Pressable>
        </Link>
        <Link href="/(student)/(explore-equipments)/view-labs" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={styles.text}>
                Student
              </Text>
              )}
          </Pressable>
        </Link>
        <Link href="/(technician)/(maintenances)/(assigned)/maintenances" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={styles.text}>
                Technician
              </Text>
              )}
          </Pressable>
        </Link>
        <Button
          disabled={!request}
          title="Login"
          onPress={() => {
            promptAsync();
          }}
        />
    </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height / 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '1%',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
