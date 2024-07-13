import { StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';

export default function ViewItemsScreen() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Items</Text>
      <Link href="/(technician)/(explore-equipments)/view-item" asChild>
          <Pressable>
            {({ pressed }) => (
              <Text style={{ color: Colors[colorScheme ?? 'light'].text, opacity: pressed ? 0.5 : 1 }}>
                Item 1
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
