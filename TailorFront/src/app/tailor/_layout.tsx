import React from 'react'
import { StatusBar, Platform, Dimensions } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Redirect, Tabs } from 'expo-router'

import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

import { HomeButtonMT, CustomTabBarIcon } from '@/components'

export default function TabLayout() {
  const theme = useTheme()
  const { authState } = useAuth()
  const { i18n } = useLocale()

  theme.colors.secondaryContainer = 'transparent'

  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor('transparent', true)
    StatusBar.setTranslucent(true)
  }
  StatusBar.setBarStyle('dark-content')

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
        tabBarInactiveTintColor: '#0D1D25',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          position: 'absolute',
          overflow: 'hidden',
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
        name="(collection)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon
              Icon={() => (
                <MaterialCommunityIcons
                  name="image-multiple"
                  size={24}
                  color="black"
                />
              )}
              color={color}
              isFocused={focused}
              routeName={i18n.t('collectionTab.title')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(community)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon
              Icon={() => <AntDesign name="earth" size={24} color="black" />}
              color={color}
              isFocused={focused}
              routeName={i18n.t('communityTab.title')}
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

          tabBarIcon: () => <HomeButtonMT />,
        }}
      />
      <Tabs.Screen
        name="(more)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon
              Icon={() => (
                <MaterialCommunityIcons
                  name="dots-horizontal-circle-outline"
                  size={24}
                  color="black"
                />
              )}
              color={color}
              isFocused={focused}
              routeName={i18n.t('moreTab.title')}
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
