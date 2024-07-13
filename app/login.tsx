import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { View } from '@/components/Themed';


export default function LoginLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: 20 }}>
        Login Page
      </Text>
        <Link href="/(admin)/(user-management)/view-users" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={{ color: Colors[colorScheme ?? 'light'].text, opacity: pressed ? 0.5 : 1 }}>
                Admin
              </Text>
              )}
          </Pressable>
        </Link>
        <Link href="/(clerk)/(reservations)/(requested)/items" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={{ color: Colors[colorScheme ?? 'light'].text, opacity: pressed ? 0.5 : 1 }}>
                Office Clerk
              </Text>
              )}
          </Pressable>
        </Link>
        <Link href="/(student)/(reservations)/reserved-items" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={{ color: Colors[colorScheme ?? 'light'].text, opacity: pressed ? 0.5 : 1 }}>
                Student
              </Text>
              )}
          </Pressable>
        </Link>
        <Link href="/(technician)/(maintenances)/(assigned)/assigned-maintenances" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={{ color: Colors[colorScheme ?? 'light'].text, opacity: pressed ? 0.5 : 1 }}>
                Technician
              </Text>
              )}
          </Pressable>
        </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
