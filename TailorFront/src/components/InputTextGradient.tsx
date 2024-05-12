import React, { forwardRef } from 'react'
import { ReturnKeyTypeOptions, TextInput } from 'react-native'
import { GradientBackground } from '@/styles/me'

interface InputTextGradientProps {
  colors: string[]
  value: string
  placeholder: string
  onChangeText: (text: string) => void
  secureTextEntry: boolean
  icon?: string
  onSubmitEditing?: () => void
  returnKeyType?: ReturnKeyTypeOptions
}

const InputTextGradient = forwardRef<TextInput, InputTextGradientProps>(
  (
    {
      colors,
      value,
      placeholder,
      onChangeText,
      secureTextEntry,
      icon,
      onSubmitEditing,
      returnKeyType,
    },
    ref
  ) => {
    return (
      <GradientBackground
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          alignContent: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          width: '100%',
          height: 45,
          padding: 4,
        }}
      >
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={'#ffffff50'}
          secureTextEntry={secureTextEntry}
          textContentType={secureTextEntry ? 'password' : 'emailAddress'}
          autoCapitalize="none"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={{
            height: '100%',
            width: '100%',
            padding: 10,
            borderRadius: 15,
            textDecorationColor: 'white',
            shadowColor: 'white',
            color: 'white',
            backgroundColor: '#25333a',
          }}
        />
      </GradientBackground>
    )
  }
)

export default InputTextGradient
