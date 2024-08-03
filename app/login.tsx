import React from 'react';
import { Pressable, Text, StyleSheet,ImageBackground, Dimensions, Button } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import * as AuthSession from 'expo-auth-session';
import { jwtDecode } from "jwt-decode";

const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
const authUrl = `http://192.168.1.3:3000/login?redirectUri=${encodeURIComponent(redirectUri)}&clientId=group22-client-id`;


export default function LoginLayout() {
  const colorScheme = useColorScheme();
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'group22-client-id',
      redirectUri,
    },
    {
      authorizationEndpoint: authUrl,
    },
  );
  // React.useEffect(() => {
  //   console.log('response', response);
  //   if (response?.type === 'success') {
  //     console.log('response', response);
  //   }
  // }, [response]);

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
          onPress={async () => {
            const result = await promptAsync();
            if (result.type === 'success') {
              if (result.params && result.params['id_token'] !== undefined) {
                const decoded = jwtDecode(result.params['id_token']);
                console.log(decoded);
              }
              else {
                console.log('Authentication failed or was cancelled');
              }
            } else if (result.type === 'error') {
              if (result.params && result.params['id_token'] !== undefined) {
                const decoded = jwtDecode(result.params['id_token']);
                console.log(decoded);
              }
              else {
                console.log('Authentication failed or was cancelled');
              }
            }
            else {
              console.log('Authentication failed or was cancelled');
            }
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
