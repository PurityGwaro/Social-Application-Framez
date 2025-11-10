import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';

const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL

const convex = new ConvexReactClient(CONVEX_URL);

export default function App() {

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
        <Toast />
      </AuthProvider>
    </ConvexProvider>
  );
}
