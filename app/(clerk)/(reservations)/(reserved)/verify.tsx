import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ClerkReservationsHorizontalBar from '@/components/ClerkReservHorizontalBar';
import ContentContainerHeader from '@/components/ContentContainerHeader';

export default function VerifyBorrowingItemScreen() {
  return (
    <BackgroundLayout>
    <MainHeader title="Reservations" />
    <ClerkReservationsHorizontalBar selectedIndex = {1} />
    <ContentContainer>
    <View style={styles.container}>
      <ContentContainerHeader title="Verify Borrowing Item" />
    </View>
    </ContentContainer>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
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
