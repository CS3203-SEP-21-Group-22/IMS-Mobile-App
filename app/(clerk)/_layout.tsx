import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome6>['name'];
  color: string;
}) {
  return <FontAwesome6 size={27} style={{ marginBottom: -3 }} {...props} />;
}

export const unstable_settings = {
  initialRouteName: '(reservations)',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="(reservations)"        
        options={{
          title: 'Reservations',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar-check" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(equipments)"
        options={{
          title: 'Equipments',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="computer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(maintenances)"
        options={{
          title: 'Maintenances',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="screwdriver-wrench" color={color} />,
        }}
      />
    </Tabs>
  );
}
