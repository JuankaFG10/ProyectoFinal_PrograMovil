import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabsNavigator from './TabsNavigator';
import RegisterVisitScreen from '../screens/RegisterVisitScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import VisitDetailScreen from '../screens/VisitDetailScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  RegisterVisit: undefined;
  ScanQR: undefined;
  VisitDetail: { visitId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={TabsNavigator} />
          <Stack.Screen
            name="RegisterVisit"
            component={RegisterVisitScreen}
            options={{ headerShown: true, title: 'Registrar Visita' }}
          />
          <Stack.Screen
            name="ScanQR"
            component={ScanQRScreen}
            options={{ headerShown: true, title: 'Escanear QR' }}
          />
          <Stack.Screen
            name="VisitDetail"
            component={VisitDetailScreen}
            options={{ headerShown: true, title: 'Detalle de Visita' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
