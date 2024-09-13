import { StyleSheet, ImageBackground, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const ClerkMaintenancesHorizontalBar: React.FC<{ selectedIndex: number }> = ({
  selectedIndex,
}) => {
  const items: string[] = ['pending', 'ongoing', 'completed'];
  return (
    <View style={styles.rowContainer}>
      {items.map((item, index) => (
        <View key={index} style={styles.rowComponent}>
          <View
            testID={item}
            style={[
              styles.rowComponentBackground,
              {
                backgroundColor:
                  useColorScheme() === 'light'
                    ? index === selectedIndex
                      ? Colors.light.primary.button
                      : Colors.light.secondary.background
                    : index === selectedIndex
                      ? Colors.dark.primary.button
                      : Colors.dark.secondary.background,
              },
            ]}
          >
            <Link
              href={`/(clerk)/(maintenances)/(${item})/maintenances`}
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
          </View>
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
    borderRadius: 10,
  },
  rowText: {
    color: 'white',
    fontSize: 15,
    paddingHorizontal: '3%',
    paddingRight: '4%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default ClerkMaintenancesHorizontalBar;
