import React, { useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot } from 'expo-router';
import { ThemeProvider } from '../app/ThemeContext';


SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <ThemeProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Slot /> {/* Renders the current screen */}
      </View>
    </ThemeProvider>
  );
}