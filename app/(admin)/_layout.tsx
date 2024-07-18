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
  initialRouteName: '(user-management)',
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
        name="(user-management)"
        options={{
          title: 'User Management',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="users-gear" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(lab-management)"
        options={{
          title: 'Lab Management',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="city" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(explore-equipments)"
        options={{
          title: 'Explore Equipments',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="computer" color={color} />,
        }}
      />
    </Tabs>
  );
}
