import { StyleSheet, ImageBackground, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const TechnicianMaintHorizontalBar: React.FC<{ selectedIndex: number }> = ({
  selectedIndex,
}) => {
  const items: string[] = ['assigned', 'completed'];
  return (
    <View style={styles.rowContainer}>
      {items.map((item, index) => (
        <View key={index} style={styles.rowComponent}>
          <ImageBackground
            source={
              index === selectedIndex
                ? require('@/assets/images/blueBtn.webp')
                : require('@/assets/images/grayBtn.webp')
            }
            style={styles.rowComponentBackground}
            imageStyle={{ borderRadius: 10 }}
          >
            <Link
              href={`/(technician)/(maintenances)/(${item})/maintenances`}
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <Text style={styles.rowText}>
                    {capitalizeFirstLetter(item)}
                  </Text>
                )}
              </Pressable>
            </Link>
          </ImageBackground>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: '5%',
  },
  rowComponent: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '2%',
  },
  rowComponentBackground: {
    paddingHorizontal: '2%',
    paddingVertical: '5%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    color: 'white',
    fontSize: 15,
    paddingHorizontal: '8%',
    paddingRight: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default TechnicianMaintHorizontalBar;
