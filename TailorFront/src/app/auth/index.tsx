import React, { useRef, useState } from 'react'
import { Logo, Button, ButtonContainer, Content } from '@/styles/auth'

import {
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native'

import { CustomText, GradientText, InputTextGradient } from '@/components'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'
import { useLocale } from '@/context/LocaleContext'
import { useAuth } from '@/context/AuthContext'

const AuthenticationPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { i18n } = useLocale()
  const { onLogin } = useAuth()
  const handleSignIn = async () => {
    try {
      const result = await onLogin(email, password)

      // Handle successful authentication
      if (result.error)
        throw new Error('Authentication failed: ' + result.error)

      // Show success message or navigate to the next screen
      Toast.show({
        type: 'success',
        text1: 'Authentication successful!',
      })

      router.replace('/')
    } catch (error) {
      // Handle authentication error
      console.error('Authentication error: ', error)

      // Show error message to the user
      Toast.show({
        type: 'error',
        text1: 'Authentication failed.',
        text2: 'Please check your email and password.',
      })
    }
  }

  const handleRegister = () => {
    router.replace('/auth/register')
  }

  const passwordInputRef = useRef(null)

  const focusPasswordInput = () => {
    passwordInputRef.current?.focus()
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#0D1D25',
        flex: 1,
        width: '100%',
        alignItems: 'center',
      }}
    >
      <KeyboardAvoidingView behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{
              height: '100%',
              alignSelf: 'center',
              alignContent: 'center',
            }}
          >
            <Content>
              <Logo
                source={require('@/assets/icons/logo.png')}
                style={{ marginTop: '40%' }}
              />
              <GradientText
                colors={['#FF0000', '#FFFF00']}
                size={28}
                style={{
                  marginBottom: 50,
                }}
              >
                {i18n.t('login.title')}
              </GradientText>
              <InputTextGradient
                colors={['#FF0000', '#FFFF00']}
                value={email}
                onChangeText={setEmail}
                placeholder={i18n.t('login.email')}
                secureTextEntry={false}
                returnKeyType="next"
                onSubmitEditing={focusPasswordInput}
              />
              <InputTextGradient
                ref={passwordInputRef}
                colors={['#FF0000', '#FFFF00']}
                value={password}
                onChangeText={setPassword}
                placeholder={i18n.t('login.password')}
                secureTextEntry={true}
                returnKeyType="go"
              />
              <ButtonContainer
                colors={['#FF0000', '#FFFF00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ marginTop: 25 }}
              >
                <Button onPress={handleSignIn}>
                  <CustomText
                    weight="bold"
                    style={{ fontSize: 16, color: 'white' }}
                  >
                    {i18n.t('login.login')}
                  </CustomText>
                </Button>
              </ButtonContainer>
              <TouchableOpacity onPress={handleRegister}>
                <GradientText size={15} colors={['#FF0000', '#FFFF00']}>
                  {i18n.t('login.noAccount')}
                </GradientText>
              </TouchableOpacity>
            </Content>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AuthenticationPage
