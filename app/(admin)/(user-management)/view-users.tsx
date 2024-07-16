import { StyleSheet, Pressable, ScrollView, FlatList, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { Text, View } from '@/components/Themed';

export default function ViewUsersScreen() {
  return (
        <Text style={styles.title}>View Users</Text>   
  );
}

const styles = StyleSheet.create({
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
