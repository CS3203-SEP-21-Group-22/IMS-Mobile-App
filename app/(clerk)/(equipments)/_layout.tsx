import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'view-equipments',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function EquipmentsLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <EquipmentsLayoutNav />;
}

function EquipmentsLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="view-labs" options={{ title: 'View Labs' }} />
        <Stack.Screen name="view-equipments" options={{ title: 'View Equipments' }} />
        <Stack.Screen name="add-equipment" options={{ title: 'Add New Equipment' }} />
        <Stack.Screen name="view-equipment" options={{ title: 'View Equipments' }} />
        <Stack.Screen name="update-equipment" options={{ title: 'Update Equipment' }} />
        <Stack.Screen name="view-items" options={{ title: 'View Items' }} />
        <Stack.Screen name="add-item" options={{ title: 'Add New Item' }} />
        <Stack.Screen name="view-item" options={{ title: 'View Items' }} />
        <Stack.Screen name="reservations" options={{ title: 'Reservations' }} />
        <Stack.Screen name="maintenances" options={{ title: 'Maintenances' }} />
      </Stack>
    </ThemeProvider>
  );
}

