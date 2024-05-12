import React, { useRef, useState } from 'react'
import { Logo, Button, ButtonContainer, Content } from '@/styles/auth'

import {
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  SafeAreaView,
} from 'react-native'

import { CustomText, GradientText, InputTextGradient } from '@/components'
import { router } from 'expo-router'
import { useLocale } from '@/context/LocaleContext'
import validator from 'validator'

interface Errors {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  username?: string
  missingFields?: string
  errorsFields?: string
}

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const { i18n } = useLocale()

  const validateInput = () => {
    let isValid = true
    let errors: Errors = {}
    let missingFields: string[] = []
    let errorsFields: string[] = []

    if (!validator.isEmail(email)) {
      isValid = false
      errorsFields.push(i18n.t('signup.invalidEmail'))
    }
    if (validator.isEmpty(email)) {
      missingFields.push(i18n.t('signup.email'))
    }

    if (validator.isEmpty(confirmPassword)) {
      isValid = false
      missingFields.push(i18n.t('signup.confirmPassword'))
    }
    if (password !== confirmPassword) {
      isValid = false
      errorsFields.push(i18n.t('signup.invalidPasswordMatch'))
    }
    if (validator.isEmpty(password)) {
      missingFields.push(i18n.t('signup.password'))
    }

    if (validator.isEmpty(firstName)) {
      isValid = false
      missingFields.push(i18n.t('signup.firstName'))
    }

    if (validator.isEmpty(lastName)) {
      isValid = false
      missingFields.push(i18n.t('signup.lastName'))
    }

    if (validator.isEmpty(username)) {
      isValid = false
      missingFields.push(i18n.t('signup.username'))
    }

    if (missingFields.length > 0) {
      errors.missingFields = `${i18n.t('signup.missingFields')}: ${missingFields.join(', ')}`
    }

    if (errorsFields.length > 0) {
      errors.errorsFields = `${errorsFields.join(', ')}`
    }

    setErrors(errors)
    return isValid
  }

  const handleSignUp = async () => {
    if (validateInput()) {
      router.replace({
        pathname: '/auth/tagPage',
        params: {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          firstName: firstName,
          lastName: lastName,
          username: username,
        },
      })
    }
  }

  const handleSignIn = async () => {
    router.replace('/auth')
  }

  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const usernameRef = useRef(null)

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
                style={{ marginTop: '20%' }}
              />
              <GradientText colors={['#FF0000', '#FFFF00']} size={28}>
                {i18n.t('signup.title')}
              </GradientText>
              <InputTextGradient
                colors={['#FF0000', '#FFFF00']}
                value={email}
                onChangeText={setEmail}
                placeholder={i18n.t('signup.email')}
                secureTextEntry={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <InputTextGradient
                ref={passwordRef}
                colors={['#FF0000', '#FFFF00']}
                value={password}
                onChangeText={setPassword}
                placeholder={i18n.t('signup.password')}
                secureTextEntry={true}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              />
              <InputTextGradient
                ref={confirmPasswordRef}
                colors={['#FF0000', '#FFFF00']}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={i18n.t('signup.confirmPassword')}
                secureTextEntry={true}
                returnKeyType="next"
                onSubmitEditing={() => firstNameRef.current?.focus()}
              />
              <InputTextGradient
                ref={firstNameRef}
                colors={['#FF0000', '#FFFF00']}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={i18n.t('signup.firstName')}
                secureTextEntry={false}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
              />
              <InputTextGradient
                ref={lastNameRef}
                colors={['#FF0000', '#FFFF00']}
                value={lastName}
                onChangeText={setLastName}
                placeholder={i18n.t('signup.lastName')}
                secureTextEntry={false}
                returnKeyType="next"
                onSubmitEditing={() => usernameRef.current?.focus()}
              />
              <InputTextGradient
                ref={usernameRef}
                colors={['#FF0000', '#FFFF00']}
                value={username}
                onChangeText={setUsername}
                placeholder={i18n.t('signup.username')}
                icon="at"
                secureTextEntry={false}
                returnKeyType="done"
              />
              <View
                style={{
                  width: '100%',
                  marginTop: 20,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {errors.missingFields && (
                  <CustomText
                    style={{
                      color: 'red',
                      margin: 0,
                      width: '100%',
                    }}
                  >
                    {errors.missingFields}
                  </CustomText>
                )}
                {errors.errorsFields && (
                  <CustomText
                    style={{
                      color: 'red',
                      margin: 0,
                    }}
                  >
                    {errors.errorsFields}
                  </CustomText>
                )}
              </View>
              <ButtonContainer
                colors={['#FF0000', '#FFFF00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Button onPress={handleSignUp}>
                  <CustomText
                    weight="bold"
                    style={{ fontSize: 16, color: 'white' }}
                  >
                    {i18n.t('signup.signup')}
                  </CustomText>
                </Button>
              </ButtonContainer>
              <TouchableOpacity onPress={handleSignIn}>
                <GradientText size={15} colors={['#FF0000', '#FFFF00']}>
                  {i18n.t('signup.alreadyAccount')}
                </GradientText>
              </TouchableOpacity>
            </Content>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RegisterPage
