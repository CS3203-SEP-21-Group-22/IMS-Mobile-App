import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';

const SingleItemWithImage: React.FC<{ title: string, link: string, children: React.ReactNode; }> = ({ title, link, children }) => {
  const imageSrc = link === 'lab' ? require('@/assets/images/labSample.png') : link === 'equipment' ? require('@/assets/images/equipmentSample.png') : { uri: link };
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {title}
      </Text>
      <Image
        style={{ width: 100, height: 100, borderRadius: 5, marginBottom: '4%' }}
        source={imageSrc}
      />
      <View style={styles.textsContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleText: {
    color:'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '3%',
  },
  textsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default SingleItemWithImage;
