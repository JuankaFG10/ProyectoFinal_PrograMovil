import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

import HomeScreen from '../screens/HomeScreen';
import VisitorsScreen from '../screens/VisitorsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabParamList = {
  Home: undefined;
  Visitors: undefined;
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabsNavigator = () => {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            Home: '🏠',
            Visitors: '👤',
            History: '📋',
            Profile: '⚙️',
          };
          return <Text style={{ fontSize: size - 4 }}>{icons[route.name]}</Text>;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          paddingBottom: 6,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('welcome') }} />
      <Tab.Screen name="Visitors" component={VisitorsScreen} options={{ title: t('visitors') }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: t('visitHistory') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile') }} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;