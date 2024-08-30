import React from 'react';
import { Text, StyleSheet, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { View } from '@/components/Themed';
import * as AuthSession from 'expo-auth-session';
import { jwtDecode } from 'jwt-decode';
import Constants from 'expo-constants';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import WideButton from '@/components/WideButton';

// @ts-ignore
const authServerUrl = Constants.expoConfig?.authServerUrl?.toString();
// @ts-ignore
const authClientId = Constants.expoConfig?.authClientId?.toString();
if (!authServerUrl || !authClientId) {
  throw new Error(
    'Please configure the authServerUrl and authClientId in app.json',
  );
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
      <Image
        source={require('../assets/images/logo.png')}
        style={{
          width: 130,
          height: 100,
          alignSelf: 'center',
          marginTop: 70,
          marginBottom: 5,
        }}
      />
      <ContentContainer>
        <View style={styles.container}>
          <Text style={styles.title}>
            Welcome to Lab Inventory Management System
          </Text>
          <Image
            source={require('../assets/images/loginPageImg.png')}
            style={{
              width: 240,
              height: 120,
              alignSelf: 'center',
              marginBottom: 20,
            }}
          />
          <Text style={styles.text}>
            Streamline your computer lab inventory with ease. Exclusive to our
            university, ensuring efficient and organized management.
          </Text>
          <View style={styles.separator} />
          <View style={styles.separator} />
          <Text style={styles.text}>Dive in and simplify your workflow!</Text>
          <View style={styles.separator} />
          <WideButton
            text='   Sign In with Institution Account   '
            buttonClickHandler={() => {
              promptAsync();
            }}
          />

          <View style={styles.row}>
            <Link href='/(admin)/(user-management)/view-users' asChild>
              <Pressable>
                {({ pressed }) => <Text style={styles.miniText}>Admin</Text>}
              </Pressable>
            </Link>
            <Link href='/(clerk)/(reservations)/(requested)/items' asChild>
              <Pressable>
                {({ pressed }) => (
                  <Text style={styles.miniText}>Office Clerk</Text>
                )}
              </Pressable>
            </Link>
            <Link href='/(student)/(explore-equipments)/view-labs' asChild>
              <Pressable>
                {({ pressed }) => <Text style={styles.miniText}>Student</Text>}
              </Pressable>
            </Link>
            <Link
              href='/(technician)/(maintenances)/(assigned)/maintenances'
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <Text style={styles.miniText}>Technician</Text>
                )}
              </Pressable>
            </Link>
          </View>
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
    // fontWeight: 'bold',
    marginBottom: '1%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 5,
    height: 5,
    width: '80%',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  miniText: {
    color: 'white',
    fontSize: 15,
    marginHorizontal: 5,
  },
});
