import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { GradientBackground } from '@/styles/edit'
import { ButtonGradientProps } from '@/types'

const GradientButton = ({ colors, text, onPress }: ButtonGradientProps) => {
  return (
    <GradientBackground
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        height: 52,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 30,
          height: 45,
          width: '105%',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </GradientBackground>
  )
}

export default GradientButton
