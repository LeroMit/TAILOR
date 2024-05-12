import React from 'react'
import { StatusBar, Platform, Dimensions } from 'react-native'
import { useTheme } from 'react-native-paper'

import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'

import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { Redirect, Tabs } from 'expo-router'

import { HomeButton, CustomTabBarIcon } from '@/components'

export default function TabLayout() {
  const theme = useTheme()
  const { authState } = useAuth()
  const { i18n } = useLocale()

  theme.colors.secondaryContainer = 'transparent'

  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor('transparent', true)
    StatusBar.setTranslucent(true)
  }
  StatusBar.setBarStyle('light-content')

  if (Platform.OS === 'android') StatusBar.setBackgroundColor('#fff')

  if (authState?.authenticated === null) {
    return null
  }

  if (!authState?.authenticated) {
    return <Redirect href="/auth" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStatusBarHeight: 0,
        headerTransparent: true,
        headerTitle: '',
        tabBarActiveTintColor: 'rgba(255, 0, 0, 0.65)',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#0D1D25',
          overflow: 'hidden',
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBlockColor: 'transparent',
          left: 0,
          bottom: 0,
          height: Dimensions.get('window').height * 0.095,
          zIndex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon
              Icon={() => (
                <MaterialCommunityIcons name="home" size={24} color="black" />
              )}
              color={color}
              isFocused={focused}
              routeName={i18n.t('homeTab.title')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(discover)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon
              Icon={() => <AntDesign name="search1" size={24} color="black" />}
              color={color}
              isFocused={focused}
              routeName={i18n.t('discoverTab.title')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(live)"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
          },
        })}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => <HomeButton />,
        }}
      />
      <Tabs.Screen
        name="(inbox)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon
              Icon={() => (
                <MaterialCommunityIcons
                  name="message-minus"
                  size={24}
                  color="black"
                />
              )}
              color={color}
              isFocused={focused}
              routeName={i18n.t('inboxTab.title')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(me)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon
              Icon={() => <AntDesign name="user" size={24} color="black" />}
              color={color}
              isFocused={focused}
              routeName={i18n.t('meTab.title')}
            />
          ),
        }}
      />
    </Tabs>
  )
}
