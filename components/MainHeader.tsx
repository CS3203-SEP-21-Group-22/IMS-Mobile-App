import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';

const MainHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <View style={{ 'backgroundColor': 'transparent' }}>
      <View style={styles.separator}></View>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: 'transparent',
    marginTop: '8%',
    marginBottom: '5%',
    width: '80%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
  },
});

export default MainHeader;