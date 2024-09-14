import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';

const ListItemWithImage: React.FC<{
  link: string;
  children: React.ReactNode;
}> = ({ link, children }) => {
  const imageSrc =
    link === 'lab'
      ? require('@/assets/images/labSample.png')
      : link === 'equipment'
        ? require('@/assets/images/equipmentSample.png')
        : { uri: link };
  return (
    <View style={styles.container}>
      <Image
        testID='list-item-image'
        style={{ width: 70, height: 70, borderRadius: 5, marginRight: 10 }}
        source={imageSrc}
      />
      <View style={styles.textsContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: '5%',
  },
  textsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
});

export default ListItemWithImage;
