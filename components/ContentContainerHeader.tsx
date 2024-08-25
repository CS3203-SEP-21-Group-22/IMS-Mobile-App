import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

const ContentContainerHeader: React.FC<{ title: string }> = ({ title }) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '4%',
    backgroundColor: 'transparent',
  },
});

export default ContentContainerHeader;
