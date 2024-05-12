import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { LocaleProvider } from '@/context/LocaleContext'
import * as SplashScreen from 'expo-splash-screen'
import Toast from 'react-native-toast-message'
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito'

SplashScreen.preventAutoHideAsync()

export default function AppLayout() {
  const { authState } = useAuth()
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  })

  useEffect(() => {
    if (authState?.authenticated !== null && (fontsLoaded || fontError))
      SplashScreen.hideAsync()
  }, [authState?.authenticated, fontsLoaded])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <>
      <LocaleProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="tailor"
              options={{
                animation: 'slide_from_bottom',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen name="auth" />
          </Stack>
        </AuthProvider>
      </LocaleProvider>
      <Toast />
    </>
  )
}
