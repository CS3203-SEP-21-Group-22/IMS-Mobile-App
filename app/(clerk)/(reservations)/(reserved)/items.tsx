import { StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';

export default function ViewReservedItemsScreen() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Reserved Items</Text>
      <Link href="/(clerk)/(reservations)/(reserved)/item" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={{ color: Colors[colorScheme ?? 'light'].text, opacity: pressed ? 0.5 : 1 }}>
                Reserved Item 1
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
